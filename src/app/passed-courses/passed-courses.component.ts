import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../shared-data.service';
@Component({
  selector: 'app-passed-courses',
  imports: [CommonModule],
  templateUrl: './passed-courses.component.html',
  styleUrl: './passed-courses.component.css'
})
export class PassedCoursesComponent {
  passedCourses: any[] = [];
  constructor(private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.loadPassedCourses();
  }
  loadPassedCourses(): void {
    this.sharedDataService.degreeData$.subscribe(data => {
      if (data && data.length > 0 && data[0].PassedCoursesData) {
        this.passedCourses = data[0].PassedCoursesData;
      }
    });
  }
}