import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../shared-data.service';
@Component({
  selector: 'app-available-courses',
  imports: [CommonModule],
  templateUrl: './available-courses.component.html',
  styleUrl: './available-courses.component.css'
})
export class AvailableCoursesComponent implements OnInit {
  availableCourses: any[] = [];
  courseRefs: { [key: string]: string } = {}; // Map course numbers to refs
  constructor(private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.loadAvailableCourses();
  }
  loadAvailableCourses(): void {
    this.sharedDataService.availableCourses$.subscribe(courses => { // Subscribe to course data - use the original subject
      this.availableCourses = courses;
    });
    this.sharedDataService.degreeData$.subscribe(data => { // Create a mapping of course numbers to references
      if (data && data.length > 0) {
        const courseData = data[0].AvailableCoursesData || [];
        const courseRefs = data[0].AvailableCourses || [];
        this.courseRefs = {}; // Create a mapping of course numbers to references
        courseData.forEach((course: any, index: number) => {
          if (course && courseRefs[index]) {
            this.courseRefs[course.Number] = courseRefs[index];
          }
        });
      }
    });
  }
  markAsPassed(course: any): void {
    const courseRef = this.courseRefs[course.Number] || this.findCourseRef(course.Number);
    this.sharedDataService.moveToPassed(course, courseRef);
  }
  private findCourseRef(courseNumber: string): string { // Helper method to find course reference if mapping isn't available
    return `courses/${courseNumber.toLowerCase().replace('-', '')}`; // Default to a pattern based on the course number if we can't find the actual reference
  }
}