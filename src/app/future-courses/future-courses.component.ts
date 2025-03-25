import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../shared-data.service';
import { combineLatest } from 'rxjs';
interface Course {
  Title: string;
  CreditHours: number;
  Number: string;
  Prerequisites?: string[];
  SemesterAvailability: string[];
}
@Component({
  selector: 'app-future-courses',
  imports: [CommonModule],
  templateUrl: './future-courses.component.html',
  styleUrl: './future-courses.component.css'
})
export class FutureCoursesComponent implements OnInit {
  futureCourses: Course[] = [];
  completedCourses: string[] = [];
  completedCourseObjects: any[] = [];
  availableCourses: any[] = [];
  constructor(private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    combineLatest([
      this.sharedDataService.degreeData$,
      this.sharedDataService.passedCoursesRefs$,
      this.sharedDataService.passedCourses$,
      this.sharedDataService.availableCourses$
    ]).subscribe(([degreeData, completedRefs, completedObjects, availableCourses]) => {
      // Load future courses
      if (degreeData && degreeData.length > 0 && degreeData[0].FutureCoursesData) {
        this.futureCourses = degreeData[0].FutureCoursesData;
      }
      // Track completed course references and objects
      this.completedCourses = completedRefs || [];
      this.completedCourseObjects = completedObjects || [];
      this.availableCourses = availableCourses || [];
      this.moveEligibleCoursesToAvailable(); // Automatically move eligible courses to available
    });
  }
  hasCompletedAllPrerequisites(course: Course): boolean {
    // If there are no prerequisites, return true
    if (!course.Prerequisites || course.Prerequisites.length === 0) {
      return true;
    }
    // Check if ALL prerequisites have been completed
    return course.Prerequisites.every(prereq => 
      this.isPrerequisiteCompleted(prereq)
    );
  }
  isPrerequisiteCompleted(prerequisite: string): boolean {
    // Check completed course references
    const refMatch = this.completedCourses.some(completedRef => 
      completedRef.includes(prerequisite) || 
      prerequisite.includes(completedRef)
    );
    // Check completed course objects
    const objectMatch = this.completedCourseObjects.some(completedCourse => 
      completedCourse.Number.includes(prerequisite) || 
      prerequisite.includes(completedCourse.Number)
    );
    return refMatch || objectMatch;
  }
  moveEligibleCoursesToAvailable(): void {
    const eligibleCourses = this.futureCourses.filter(course => // Find courses that are eligible and not already in available courses
      this.hasCompletedAllPrerequisites(course) &&
      !this.availableCourses.some(availableCourse => 
        availableCourse.Number === course.Number
      )
    );
    eligibleCourses.forEach(course => { // Move each eligible course to available
      this.sharedDataService.moveToAvailable(course, course.Number); // Assuming you want to use the course's number as the reference
    });
  }
  getPrerequisiteStatus(course: Course): string {
    if (this.hasCompletedAllPrerequisites(course)) {
      return 'Eligible';
    } else {
      // Find and return the missing prerequisites
      const missingPrereqs = course.Prerequisites?.filter(
        prereq => !this.isPrerequisiteCompleted(prereq)
      );
      return `Missing: ${missingPrereqs?.join(', ')}`;
    }
  }
}