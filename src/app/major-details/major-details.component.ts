import { Component } from '@angular/core';
import { CoursesService } from '../courses.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-major-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './major-details.component.html',
  styleUrl: './major-details.component.css'
})
export class MajorDetailsComponent {
  message: String = '';
  loading: boolean = false;
  error: string | null = null;
  constructor(private coursesService: CoursesService) {}
  ngOnInit(): void {
    this.fetchHelloWorld();
  }
  fetchHelloWorld(): void {
    this.loading = true;
    this.error = null;
    this.coursesService.getHelloWorld().subscribe(
      {next: (text) => {
        this.message = text;
        console.log(text);
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }}
    );
  }
  retry(): void {
    this.fetchHelloWorld();
  }
}
