import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../courses.service';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../shared-data.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-major-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './major-details.component.html',
  styleUrl: './major-details.component.css'
})
export class MajorDetailsComponent implements OnInit {
  degreeTitle: string = '';
  tracks: string[] = [];
  selectedTrack: string = '';
  constructor(private coursesService: CoursesService, private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.loadDegreeData();
  }
  loadDegreeData(): void {
    this.sharedDataService.degreeData$.subscribe(data => {
      if (data && data.length > 0) {
        this.degreeTitle = data[0].Title || '';
        this.tracks = data[0].Tracks || [];
        if (this.tracks.length > 0) {
          this.selectedTrack = this.tracks[0];
        }
      }
    });
  }
  onTrackChange(): void { // Notify other components about track change if needed
    this.sharedDataService.updateSelectedTrack(this.selectedTrack);
    console.log('Selected track:', this.selectedTrack);
  }
}