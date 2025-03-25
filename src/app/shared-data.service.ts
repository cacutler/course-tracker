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
      if (data[0].FutureCoursesData) {
        this.futureCoursesSubject.next([data[0].FutureCoursesData]);
        this.buildPrerequisiteMap(data[0].FutureCoursesData); // Initialize prerequisite map
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
  moveToPassed(course: Course, courseRef: string) { // Methods to move courses between lists
    const availableCourses = this.availableCoursesSubject.getValue(); // Handle data
    const passedCourses = this.passedCoursesSubject.getValue();
    const updatedAvailable = availableCourses.filter(c => c.Number !== course.Number);
    const courseExists = passedCourses.some(c => c.Number === course.Number);
    const updatedPassed = courseExists ? passedCourses : [...passedCourses, course];
    this.availableCoursesSubject.next(updatedAvailable);
    this.passedCoursesSubject.next(updatedPassed);
    const availableRefs = this.availableCoursesRefsSubject.getValue(); // Handle references
    const passedRefs = this.passedCoursesRefsSubject.getValue();
    const updatedAvailableRefs = availableRefs.filter(ref => ref !== courseRef);
    const refExists = passedRefs.includes(courseRef);
    const updatedPassedRefs = refExists ? passedRefs : [...passedRefs, courseRef];
    this.availableCoursesRefsSubject.next(updatedAvailableRefs);
    this.passedCoursesRefsSubject.next(updatedPassedRefs);
  }
  moveToAvailable(course: Course, courseRef: string) {
    const availableCourses = this.availableCoursesSubject.getValue(); // Handle data
    const passedCourses = this.passedCoursesSubject.getValue();
    const updatedPassed = passedCourses.filter(c => c.Number !== course.Number);
    const courseExists = availableCourses.some(c => c.Number === course.Number);
    const updatedAvailable = courseExists ? availableCourses : [...availableCourses, course];
    this.passedCoursesSubject.next(updatedPassed);
    this.availableCoursesSubject.next(updatedAvailable);
    const availableRefs = this.availableCoursesRefsSubject.getValue(); // Handle references
    const passedRefs = this.passedCoursesRefsSubject.getValue();
    const updatedPassedRefs = passedRefs.filter(ref => ref !== courseRef);
    const refExists = availableRefs.includes(courseRef);
    const updatedAvailableRefs = refExists ? availableRefs : [...availableRefs, courseRef];
    this.passedCoursesRefsSubject.next(updatedPassedRefs);
    this.availableCoursesRefsSubject.next(updatedAvailableRefs);
  }
  moveFromFutureToAvailable(course: Course, courseRef: string) { // Move a course from future to available
    const futureCourses = this.futureCoursesSubject.getValue();
    const availableCourses = this.availableCoursesSubject.getValue();
    const updatedFuture = futureCourses.filter(c => c.Number !== course.Number);
    const courseExists = availableCourses.some(c => c.Number === course.Number);
    const updatedAvailable = courseExists ? availableCourses : [...availableCourses, course];
    this.futureCoursesSubject.next(updatedFuture);
    this.availableCoursesSubject.next(updatedAvailable);
    const futureRefs = this.futureCoursesRefsSubject.getValue();
    const availableRefs = this.availableCoursesRefsSubject.getValue();
    const updatedFutureRefs = futureRefs.filter(ref => ref !== courseRef);
    const refExists = availableRefs.includes(courseRef);
    const updatedAvailableRefs = refExists ? availableRefs : [...availableRefs, courseRef];
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