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
  constructor(private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.loadAvailableCourses();
  }
  loadAvailableCourses(): void {
    this.sharedDataService.degreeData$.subscribe(data => {
      if (data && data.length > 0 && data[0].AvailableCoursesData) {
        this.availableCourses = data[0].AvailableCoursesData;
      }
    });
  }
}