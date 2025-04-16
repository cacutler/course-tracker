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
    combineLatest([this.sharedDataService.degreeData$, this.sharedDataService.passedCoursesRefs$, this.sharedDataService.passedCourses$, this.sharedDataService.availableCourses$, this.sharedDataService.futureCourses$]).subscribe(([degreeData, completedRefs, completedObjects, availableCourses, futureCourses]) => {
      if (futureCourses && futureCourses.length > 0) {// Load future courses
        this.futureCourses = futureCourses;
      }
      this.completedCourses = completedRefs || []; // Track completed course references and objects
      this.completedCourseObjects = completedObjects || [];
      this.availableCourses = availableCourses || [];
      if (this.futureCourses.length > 0) { // Only move eligible courses if not already done
        this.moveEligibleCoursesToAvailable();
      }
    });
  }
  hasCompletedAllPrerequisites(course: Course): boolean { // If there are no prerequisites, return true
    if (!course.Prerequisites || course.Prerequisites.length === 0) {
      return true;
    }
    return course.Prerequisites.every(prereq => this.isPrerequisiteCompleted(prereq)); // Check if ALL prerequisites have been completed
  }
  isPrerequisiteCompleted(prerequisite: string): boolean {
    const refMatch = this.completedCourses.some(completedRef => completedRef.includes(prerequisite) || prerequisite.includes(completedRef)); // Check completed course references
    const objectMatch = this.completedCourseObjects.some(completedCourse => completedCourse.Number.includes(prerequisite) || prerequisite.includes(completedCourse.Number)); // Check completed course objects
    return refMatch || objectMatch;
  }
  moveEligibleCoursesToAvailable(): void {
    const eligibleCourses = this.futureCourses.filter(course => this.hasCompletedAllPrerequisites(course) && !this.availableCourses.some(availableCourse => availableCourse.Number === course.Number));
    for (const course of eligibleCourses) { // Use a simple loop instead of forEach to reduce complexity
      this.sharedDataService.moveFromFutureToAvailable(course, course.Number);
    }
  }
  getPrerequisiteStatus(course: Course): string {
    if (this.hasCompletedAllPrerequisites(course)) {
      return 'Eligible';
    } else {
      const missingPrereqs = course.Prerequisites?.filter(prereq => !this.isPrerequisiteCompleted(prereq)); // Find and return the missing prerequisites
      return `Missing - ${missingPrereqs?.join(', ')}`;
    }
  }
}