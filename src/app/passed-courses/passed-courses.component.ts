import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../shared-data.service';
@Component({
  selector: 'app-passed-courses',
  imports: [CommonModule],
  templateUrl: './passed-courses.component.html',
  styleUrl: './passed-courses.component.css'
})
export class PassedCoursesComponent implements OnInit {
  passedCourses: any[] = [];
  courseRefs: { [key: string]: string } = {}; // Map course numbers to refs
  constructor(private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.loadPassedCourses();
  }
  loadPassedCourses(): void {
    this.sharedDataService.passedCourses$.subscribe(courses => { // Subscribe to course data - use the original subject
      this.passedCourses = courses;
    });
    this.sharedDataService.degreeData$.subscribe(data => { // Create a mapping of course numbers to references
      if (data && data.length > 0) {
        const courseData = data[0].PassedCoursesData || [];
        const courseRefs = data[0].PassedCourses || [];
        this.courseRefs = {}; // Create a mapping of course numbers to references
        courseData.forEach((course: any, index: number) => {
          if (course && courseRefs[index]) {
            this.courseRefs[course.Number] = courseRefs[index];
          }
        });
      }
    });
  }
  markAsAvailable(course: any): void {
    const courseRef = this.courseRefs[course.Number] || this.findCourseRef(course.Number);
    this.sharedDataService.moveToAvailable(course, courseRef);
  }
  private findCourseRef(courseNumber: string): string { // Helper method to find course reference if mapping isn't available
    return `courses/${courseNumber.toLowerCase().replace('-', '')}`; // Default to a pattern based on the course number if we can't find the actual reference
  }
}