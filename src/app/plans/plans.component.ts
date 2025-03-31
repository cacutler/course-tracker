import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../shared-data.service';
@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit {
  defaultPlans: any[] = [];
  constructor(private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.loadPlans();
    this.listenForTrackChanges();
  }
  loadPlans(): void {
    this.sharedDataService.degreeData$.subscribe(data => {
      if (data && data.length > 0 && data[0].DefaultPlans) {
        this.defaultPlans = data[0].DefaultPlansData; // If DefaultPlans contains actual plan data
      }
    });
  }
  listenForTrackChanges(): void {
    this.sharedDataService.filteredPlans$.subscribe(plans => {
      if (plans.length > 0) {
        this.defaultPlans = plans;
      } else {
        this.loadPlans(); // If no filtered plans, load all plans
      }
    });
  }
}