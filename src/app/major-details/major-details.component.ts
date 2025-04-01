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
  degreeId: string = '';
  isSaving: boolean = false;
  saveMessage: string = '';
  constructor(private coursesService: CoursesService, private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.loadDegreeData();
  }
  loadDegreeData(): void {
    this.sharedDataService.degreeData$.subscribe(data => {
      if (data && data.length > 0) {
        this.degreeTitle = data[0].Title || '';
        this.tracks = data[0].Tracks || [];
        if (data[0].id) { // Check for degree ID in various possible locations
          this.degreeId = data[0].id;
        } else if (data[0]._id) {
          this.degreeId = data[0]._id;
        } else if (data[0].degreeId) {
          this.degreeId = data[0].degreeId;
        } else {
          console.error('No degree ID found in the loaded data', data[0]); // If no ID found, log error
        }
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
  saveChanges(): void {
    if (!this.degreeId) {
      console.error("Degree ID is missing, cannot save changes");
      this.saveMessage = 'Error: Missing degree ID';
      return
    }
    this.isSaving = true;
    this.saveMessage = 'Saving...';
    this.sharedDataService.saveChangesToFirestore(this.coursesService, this.degreeId).subscribe({
      next: (response) => {
        console.log('Changes saved successfully:', response);
        this.saveMessage = "Changes saved successfully!";
        setTimeout(() => {
          this.saveMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving changes:', error);
        this.saveMessage = `Error: ${error.message || 'Failed to save changes'}`;
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }
}