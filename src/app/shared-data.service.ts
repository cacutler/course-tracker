import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CoursesService } from './courses.service';
interface Course {
  Title: string;
  CreditHours: number;
  Number: string;
  Prerequisites?: string[];
  SemesterAvailability: string[];
}
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private degreeDataSubject = new BehaviorSubject<any>(null);
  public degreeData$ = this.degreeDataSubject.asObservable();
  private selectedTrackSubject = new BehaviorSubject<string>('');
  public selectedTrack$ = this.selectedTrackSubject.asObservable();
  private filteredPlansSubject = new BehaviorSubject<any[]>([]);
  public filteredPlans$ = this.filteredPlansSubject.asObservable();
  private passedCoursesSubject = new BehaviorSubject<Course[]>([]); // Keep the original subjects for backward compatibility
  public passedCourses$ = this.passedCoursesSubject.asObservable();
  private availableCoursesSubject = new BehaviorSubject<Course[]>([]);
  public availableCourses$ = this.availableCoursesSubject.asObservable();
  private futureCoursesSubject = new BehaviorSubject<Course[]>([]);
  public futureCourses$ = this.futureCoursesSubject.asObservable();
  private passedCoursesRefsSubject = new BehaviorSubject<string[]>([]); // Add new subjects for references
  public passedCoursesRefs$ = this.passedCoursesRefsSubject.asObservable();
  private availableCoursesRefsSubject = new BehaviorSubject<string[]>([]);
  public availableCoursesRefs$ = this.availableCoursesRefsSubject.asObservable();
  private futureCoursesRefsSubject = new BehaviorSubject<string[]>([]);
  public futureCoursesRefs$ = this.futureCoursesRefsSubject.asObservable();
  private prerequisiteMap = new Map<string, string[]>(); // Prerequisite relationships map
  updateDegreeData(data: any): void {
    this.degreeDataSubject.next(data);
    if (data && data.length > 0) {
      if (data[0].PassedCoursesData) { // Initialize course data using the original subjects
        this.passedCoursesSubject.next([...data[0].PassedCoursesData]);
      }
      if (data[0].AvailableCoursesData) {
        this.availableCoursesSubject.next([...data[0].AvailableCoursesData]);
      }
      if (data[0].FutureCoursesData) { // Use the data directly, not wrapped in an array
        this.futureCoursesSubject.next(data[0].FutureCoursesData);
        this.buildPrerequisiteMap(data[0].FutureCoursesData);
      }
      if (data[0].PassedCourses) { // Initialize course references
        this.passedCoursesRefsSubject.next([...data[0].PassedCourses.filter((ref: any) => ref !== null)]);
      }
      if (data[0].AvailableCourses) {
        this.availableCoursesRefsSubject.next([...data[0].AvailableCourses.filter((ref: any) => ref !== null)]);
      }
      if (data[0].FutureCourses) {
        this.futureCoursesRefsSubject.next([...data[0].FutureCourses.filter((ref: any) => ref !== null)]);
      }
      if (data[0].Tracks && data[0].Tracks.length > 0) { // Initialize track
        this.updateSelectedTrack(data[0].Tracks[0]);
      }
    }
  }
  private buildPrerequisiteMap(courses: Course[]) {
    courses.forEach(course => {
      if (course.Prerequisites && course.Prerequisites.length > 0) {
        this.prerequisiteMap.set(course.Number, course.Prerequisites);
      }
    });
  }
  updateSelectedTrack(track: string) {
    this.selectedTrackSubject.next(track);
    this.updateFilteredPlans();
  }
  private updateFilteredPlans(): void {
    const data = this.degreeDataSubject.getValue();
    const selectedTrack = this.selectedTrackSubject.getValue();
    if (data && data.length > 0 && data[0].DefaultPlansData) {
      const filteredPlans = data[0].DefaultPlansData.filter((plan: any) => plan.Title.includes(selectedTrack) || plan.Title.includes(this.getTrackAbbreviation(selectedTrack))); // Filter plans based on track
      this.filteredPlansSubject.next(filteredPlans);
    }
  }
  private getTrackAbbreviation(track: string): string { // Helper function to convert track names to abbreviations
    if (track === 'Application') return 'App';
    if (track === 'DevOps') return 'DevOps';
    if (track === 'Entrepreneurial and Marketing') return 'E&M';
    if (track === 'Data Science') return 'DS';
    if (track === 'Virtual Reality') return 'VR';
    return track;
  }
  getCurrentTrack(): string {
    return this.selectedTrackSubject.getValue();
  }
  moveToPassed(course: any, courseRef: string) {
    const currentPassedCourses = this.passedCoursesSubject.getValue(); // Prevent duplicate entries
    const currentPassedRefs = this.passedCoursesRefsSubject.getValue();
    if (!currentPassedCourses.some(c => c.Number === course.Number)) { // Only add if not already passed
      const availableCourses = this.availableCoursesSubject.getValue(); // Remove from available courses
      const updatedAvailableCourses = availableCourses.filter(c => c.Number !== course.Number);
      this.availableCoursesSubject.next(updatedAvailableCourses);
      const futureCourses = this.futureCoursesSubject.getValue(); // Remove from future courses (in case it's still there)
      const updatedFutureCourses = futureCourses.filter(c => c.Number !== course.Number);
      this.futureCoursesSubject.next(updatedFutureCourses);
      const updatedPassedCourses = [...currentPassedCourses, course]; // Add to passed courses
      this.passedCoursesSubject.next(updatedPassedCourses);
      const updatedAvailableRefs = this.availableCoursesRefsSubject.getValue().filter(ref => ref !== courseRef); // Update references
      const updatedFutureRefs = this.futureCoursesRefsSubject.getValue().filter(ref => ref !== courseRef);
      const updatedPassedRefs = [...currentPassedRefs, courseRef];
      this.availableCoursesRefsSubject.next(updatedAvailableRefs);
      this.futureCoursesRefsSubject.next(updatedFutureRefs);
      this.passedCoursesRefsSubject.next(updatedPassedRefs);
    }
  }
  moveToAvailable(course: any, courseRef: string) {
    const currentAvailableCourses = this.availableCoursesSubject.getValue(); // Prevent duplicate entries
    const currentAvailableRefs = this.availableCoursesRefsSubject.getValue();
    if (!currentAvailableCourses.some(c => c.Number === course.Number)) { // Only add if not already available
      const passedCourses = this.passedCoursesSubject.getValue(); // Remove from passed or future courses
      const updatedPassedCourses = passedCourses.filter(c => c.Number !== course.Number);
      this.passedCoursesSubject.next(updatedPassedCourses);
      const futureCourses = this.futureCoursesSubject.getValue(); // Remove from future courses if present
      const updatedFutureCourses = futureCourses.filter(c => c.Number !== course.Number);
      this.futureCoursesSubject.next(updatedFutureCourses);
      const updatedAvailableCourses = [...currentAvailableCourses, course]; // Add to available courses
      this.availableCoursesSubject.next(updatedAvailableCourses);
      const updatedPassedRefs = this.passedCoursesRefsSubject.getValue().filter(ref => ref !== courseRef); // Update references
      const updatedFutureRefs = this.futureCoursesRefsSubject.getValue().filter(ref => ref !== courseRef);
      const updatedAvailableRefs = [...currentAvailableRefs, courseRef];
      this.passedCoursesRefsSubject.next(updatedPassedRefs);
      this.futureCoursesRefsSubject.next(updatedFutureRefs);
      this.availableCoursesRefsSubject.next(updatedAvailableRefs);
    }
  }
  moveFromFutureToAvailable(course: Course, courseRef: string) { // Move a course from future to available
    const futureCourses = this.futureCoursesSubject.getValue();
    const availableCourses = this.availableCoursesSubject.getValue();
    const updatedFuture = futureCourses.filter(c => c.Number !== course.Number); // Remove the course from future courses
    this.futureCoursesSubject.next(updatedFuture);
    const courseExists = availableCourses.some(c => c.Number === course.Number); // Add to available courses only if not already present
    const updatedAvailable = courseExists ? availableCourses : [...availableCourses, course];
    this.availableCoursesSubject.next(updatedAvailable);
    const futureRefs = this.futureCoursesRefsSubject.getValue(); // Update references
    const availableRefs = this.availableCoursesRefsSubject.getValue();
    const updatedFutureRefs = futureRefs.filter(ref => ref !== courseRef);
    const updatedAvailableRefs = courseRef && !availableRefs.includes(courseRef) ? [...availableRefs, courseRef] : availableRefs;
    this.futureCoursesRefsSubject.next(updatedFutureRefs);
    this.availableCoursesRefsSubject.next(updatedAvailableRefs);
  }
  saveChangesToFirestore(coursesService: CoursesService, degreeId: string): Observable<any> {
    const updateData = {PassedCourses: this.passedCoursesRefsSubject.getValue(), AvailableCourses: this.availableCoursesRefsSubject.getValue(), FutureCourses: this.futureCoursesRefsSubject.getValue()};
    console.log('Using degree ID for Firestore update:', degreeId);
    console.log('Data being saved to Firestore:', updateData);
    return coursesService.updateDegreeData(degreeId, updateData);
  }
}