import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private degreeDataSubject = new BehaviorSubject<any>(null);
  public degreeData$ = this.degreeDataSubject.asObservable();
  private selectedTrackSubject = new BehaviorSubject<string>('');
  public selectedTrack$ = this.selectedTrackSubject.asObservable();
  private passedCoursesSubject = new BehaviorSubject<any[]>([]); // Keep the original subjects for backward compatibility
  public passedCourses$ = this.passedCoursesSubject.asObservable();
  private availableCoursesSubject = new BehaviorSubject<any[]>([]);
  public availableCourses$ = this.availableCoursesSubject.asObservable();
  private passedCoursesRefsSubject = new BehaviorSubject<string[]>([]); // Add new subjects for references
  public passedCoursesRefs$ = this.passedCoursesRefsSubject.asObservable();
  private availableCoursesRefsSubject = new BehaviorSubject<string[]>([]);
  public availableCoursesRefs$ = this.availableCoursesRefsSubject.asObservable();
  updateDegreeData(data: any) {
    this.degreeDataSubject.next(data);
    if (data && data.length > 0) {
      if (data[0].PassedCoursesData) { // Initialize course data using the original subjects
        this.passedCoursesSubject.next([...data[0].PassedCoursesData]);
      }
      if (data[0].AvailableCoursesData) {
        this.availableCoursesSubject.next([...data[0].AvailableCoursesData]);
      }
      if (data[0].PassedCourses) { // Initialize course references
        this.passedCoursesRefsSubject.next([...data[0].PassedCourses.filter((ref: any) => ref !== null)]);
      }
      if (data[0].AvailableCourses) {
        this.availableCoursesRefsSubject.next([...data[0].AvailableCourses.filter((ref: any) => ref !== null)]);
      }
      if (data[0].Tracks && data[0].Tracks.length > 0) { // Initialize track
        this.selectedTrackSubject.next(data[0].Tracks[0]);
      }
    }
  }
  updateSelectedTrack(track: string) {
    this.selectedTrackSubject.next(track);
  }
  getCurrentTrack(): string {
    return this.selectedTrackSubject.getValue();
  }
  moveToPassed(course: any, courseRef: string) { // Methods to move courses between lists
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
  moveToAvailable(course: any, courseRef: string) {
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
}