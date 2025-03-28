import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  updateDegreeData(data: any) {
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
        this.selectedTrackSubject.next(data[0].Tracks[0]);
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
  }
  getCurrentTrack(): string {
    return this.selectedTrackSubject.getValue();
  }
  moveToPassed(course: any, courseRef: string) {
    // Prevent duplicate entries
    const currentPassedCourses = this.passedCoursesSubject.getValue();
    const currentPassedRefs = this.passedCoursesRefsSubject.getValue();
    // Only add if not already passed
    if (!currentPassedCourses.some(c => c.Number === course.Number)) {
      // Remove from available courses
      const availableCourses = this.availableCoursesSubject.getValue();
      const updatedAvailableCourses = availableCourses.filter(c => c.Number !== course.Number);
      this.availableCoursesSubject.next(updatedAvailableCourses);
      // Remove from future courses (in case it's still there)
      const futureCourses = this.futureCoursesSubject.getValue();
      const updatedFutureCourses = futureCourses.filter(c => c.Number !== course.Number);
      this.futureCoursesSubject.next(updatedFutureCourses);
      // Add to passed courses
      const updatedPassedCourses = [...currentPassedCourses, course];
      this.passedCoursesSubject.next(updatedPassedCourses);
      // Update references
      const updatedAvailableRefs = this.availableCoursesRefsSubject.getValue().filter(ref => ref !== courseRef);
      const updatedFutureRefs = this.futureCoursesRefsSubject.getValue().filter(ref => ref !== courseRef);
      const updatedPassedRefs = [...currentPassedRefs, courseRef];
      this.availableCoursesRefsSubject.next(updatedAvailableRefs);
      this.futureCoursesRefsSubject.next(updatedFutureRefs);
      this.passedCoursesRefsSubject.next(updatedPassedRefs);
    }
  }
  moveToAvailable(course: any, courseRef: string) {
    // Prevent duplicate entries
    const currentAvailableCourses = this.availableCoursesSubject.getValue();
    const currentAvailableRefs = this.availableCoursesRefsSubject.getValue();
    // Only add if not already available
    if (!currentAvailableCourses.some(c => c.Number === course.Number)) {
      // Remove from passed or future courses
      const passedCourses = this.passedCoursesSubject.getValue();
      const updatedPassedCourses = passedCourses.filter(c => c.Number !== course.Number);
      this.passedCoursesSubject.next(updatedPassedCourses);
      // Remove from future courses if present
      const futureCourses = this.futureCoursesSubject.getValue();
      const updatedFutureCourses = futureCourses.filter(c => c.Number !== course.Number);
      this.futureCoursesSubject.next(updatedFutureCourses);
      // Add to available courses
      const updatedAvailableCourses = [...currentAvailableCourses, course];
      this.availableCoursesSubject.next(updatedAvailableCourses);
      // Update references
      const updatedPassedRefs = this.passedCoursesRefsSubject.getValue().filter(ref => ref !== courseRef);
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
    // Remove the course from future courses
    const updatedFuture = futureCourses.filter(c => c.Number !== course.Number);
    this.futureCoursesSubject.next(updatedFuture);
    // Add to available courses only if not already present
    const courseExists = availableCourses.some(c => c.Number === course.Number);
    const updatedAvailable = courseExists ? availableCourses : [...availableCourses, course];
    this.availableCoursesSubject.next(updatedAvailable);
    // Update references
    const futureRefs = this.futureCoursesRefsSubject.getValue();
    const availableRefs = this.availableCoursesRefsSubject.getValue();
    const updatedFutureRefs = futureRefs.filter(ref => ref !== courseRef);
    const updatedAvailableRefs = courseRef && !availableRefs.includes(courseRef) ? [...availableRefs, courseRef] : availableRefs;
    this.futureCoursesRefsSubject.next(updatedFutureRefs);
    this.availableCoursesRefsSubject.next(updatedAvailableRefs);
  }
  private checkPrerequisitesForFutureCourses() { // Check prerequisites for all future courses
    const passedCourses = this.passedCoursesSubject.getValue();
    const futureCourses = this.futureCoursesSubject.getValue();
    const futureRefs = this.futureCoursesRefsSubject.getValue();
    const passedCourseNumbers = new Set(passedCourses.map(course => course.Number)); // Get all passed course numbers as a set for quick lookup
    const coursesToMove: { course: Course, ref: string }[] = []; // Track courses to move
    futureCourses.forEach((course, index) => { // Check each future course
      const prerequisites = this.prerequisiteMap.get(course.Number) || [];
      if (prerequisites.length > 0) { // If the course has prerequisites, check if they're all passed
        const allPrerequisitesMet = prerequisites.every(prereq => 
          passedCourseNumbers.has(prereq)
        );
        if (allPrerequisitesMet && index < futureRefs.length) {
          coursesToMove.push({ 
            course, 
            ref: futureRefs[index] || this.findCourseRef(course.Number)
          });
        }
      } else {
        if (index < futureRefs.length) { // If there are no prerequisites, the course can be moved to available.  Only if it's not there already
          coursesToMove.push({ 
            course, 
            ref: futureRefs[index] || this.findCourseRef(course.Number)
          });
        }
      }
    });
    coursesToMove.forEach(item => { // Move eligible courses to available
      this.moveFromFutureToAvailable(item.course, item.ref);
    });
  }
  private findCourseRef(courseNumber: string): string { // Helper method to generate a reference pattern if one isn't available
    return `courses/${courseNumber.toLowerCase().replace('-', '')}`;
  }
}