import { Router } from '@angular/router';
import {Component} from '@angular/core';
@Component({
  selector: 'app-observation-led-imp',
  standalone: false,
  templateUrl: './observation-led-imp.component.html',
  styleUrl: './observation-led-imp.component.css'
})
export class ObservationLedImpComponent {
  improvementProjectSuggestions: any[];
  programName:any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || {};
  
    this.improvementProjectSuggestions = state['improvementProjectSuggestions'] || [];
    this.programName = state['programName'] || '';
  }

  navigateToProjectPlayer(externalId:any){
    window.location.href = `/managed-learn/project-details?externalId=${externalId}&referenceFrom=observation`
  }
}
