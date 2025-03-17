import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../shared-data.service';
@Component({
  selector: 'app-plans',
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent implements OnInit {
  defaultPlans: any[] = [];
  constructor(private sharedDataService: SharedDataService) {}
  ngOnInit(): void {
    this.loadPlans();
  }
  loadPlans(): void {
    this.sharedDataService.degreeData$.subscribe(data => {
      if (data && data.length > 0 && data[0].DefaultPlans) {
        // If DefaultPlans contains actual plan data
        this.defaultPlans = data[0].DefaultPlansData;
      }
    });
  }
}