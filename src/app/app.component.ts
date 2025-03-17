import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { MajorDetailsComponent } from './major-details/major-details.component';
import { AvailableCoursesComponent } from './available-courses/available-courses.component';
import { FutureCoursesComponent } from './future-courses/future-courses.component';
import { PassedCoursesComponent } from './passed-courses/passed-courses.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { PlansComponent } from './plans/plans.component';
import { CommonModule } from '@angular/common';
import { SharedDataService } from './shared-data.service';
import { CoursesService } from './courses.service';
@Component({
  selector: 'app-root',
  imports: [LoginFormComponent, RegistrationFormComponent, MajorDetailsComponent, AvailableCoursesComponent, FutureCoursesComponent, PassedCoursesComponent, AppHeaderComponent, PlansComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title: string = 'course-tracker';
  authenticated: boolean = false;
  loading: boolean = true;
  error: string | null = null;
  constructor(
    private coursesService: CoursesService,
    private sharedDataService: SharedDataService
  ) {}
  ngOnInit(): void {
    this.fetchDegreeData();
  }
  fetchDegreeData(): void {
    this.loading = true;
    this.error = null;
    this.coursesService.getDegreeData().subscribe({
      next: (data) => {
        console.log('Degree data:', data);
        this.sharedDataService.updateDegreeData(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching degree data:', err);
        this.error = 'Failed to load degree data';
        this.loading = false;
      }
    });
  }
}