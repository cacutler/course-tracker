import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-app-header',
  imports: [CommonModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  authenticated: boolean = false;
}