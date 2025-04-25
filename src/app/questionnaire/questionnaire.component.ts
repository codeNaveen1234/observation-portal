import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-questionnaire',
  standalone: false,
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.scss'
})
export class QuestionnaireComponent implements OnInit{
  apiConfig: any = {};
  isDirty: boolean = false;
  saveQuestioner: boolean = false;
  showDetails = false;

  constructor(
     private router: ActivatedRoute,
     private apiService:ApiService,
  ) { }

  ngOnInit() {
    this.router.queryParams.subscribe(param => {
      this.apiConfig['baseURL'] = this.apiService.baseUrl
      this.apiConfig['userAuthToken'] = this.apiService.userAuthToken;
      this.apiConfig['solutionType'] = localStorage.getItem('solutionType')
      this.apiConfig['fileSizeLimit'] = 50;
      this.apiConfig['profileData'] =JSON.parse(localStorage.getItem('profileData'));
      this.apiConfig['observationId']=param['observationId'];
      this.apiConfig['entityId']=param['entityId']
      this.apiConfig['evidenceCode']=param['evidenceCode']
      this.apiConfig['index']=param['index']
      this.apiConfig['submissionNumber']=param['submissionNumber']
      this.apiConfig['solutionId']=this.apiService.solutionId
    })
      this.showDetails = true
  }
}
