import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../shared-data.service';
@Component({
  selector: 'app-future-courses',
  imports: [CommonModule],
  templateUrl: './future-courses.component.html',
  styleUrl: './future-courses.component.css'
})
export class FutureCoursesComponent implements OnInit {
  futureCourses: any[] = [];
  constructor(private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.loadFutureCourses();
  }
  loadFutureCourses(): void {
    this.sharedDataService.degreeData$.subscribe(data => {
      if (data && data.length > 0 && data[0].FutureCoursesData) {
        this.futureCourses = data[0].FutureCoursesData;
      }
    });
  }
}