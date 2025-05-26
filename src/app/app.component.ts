import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from 'src/assets/envirnoments/environment';
environment
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  showHeader:any = environment.showHeader;
  constructor(private location: Location) {}
  goBack(): void {
    this.location.back(); 
  }
}