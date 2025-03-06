import { Component } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { MajorDetailsComponent } from './major-details/major-details.component';
import { AvailableCoursesComponent } from './available-courses/available-courses.component';
import { FutureCoursesComponent } from './future-courses/future-courses.component';
import { PassedCoursesComponent } from './passed-courses/passed-courses.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { PlansComponent } from './plans/plans.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [LoginFormComponent, RegistrationFormComponent, MajorDetailsComponent, AvailableCoursesComponent, FutureCoursesComponent, PassedCoursesComponent, AppHeaderComponent, PlansComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'course-tracker';
  authenticated: boolean = false;
}