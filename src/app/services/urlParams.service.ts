import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UrlParamsService implements OnDestroy {
    public entityId: any;
    public entityName: any;
    public observationId: any;
    public submissionId: any;
    public allowMultipleAssessemts: any;
    public reports: any;
    public id: any;
    public name: any;
    public entityType: any;
    public submissionNumber: any;
    public evidenceCode: any;
    public index: any;
    public type: any;
    private routerSubscription: Subscription;
    public isMultiple: any;
    public scores: any;
    public solutionType:any;


  constructor(private router: Router, private route: ActivatedRoute,private apiService:ApiService) {}

  parseRouteParams(route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      this.solutionType = params.get('solutionType');
      if (this.solutionType === 'observation' || this.solutionType === 'survey') {
        localStorage.setItem('solutionType',this.solutionType);
      }
      this.apiService.solutionType=params.get('solutionType')
      this.entityId = params.get('entityId');
      this.entityName = params.get('name');
      this.observationId = params.get('observationId');
      this.submissionId = params.get('submissionId');
      this.allowMultipleAssessemts = params.get('allowMultipleAssessemts');
      this.reports = params.get('reports');
      this.id = params.get('id');
      this.name = params.get('name');
      this.entityType = params.get('entityType');
      this.submissionNumber = params.get('submissionNumber');
      this.evidenceCode = params.get('evidenceCode');
      this.index = params.get('index');
      this.type = params.get('type');
      this.isMultiple = params.get('isMultiple');
      this.scores = params.get('scores');
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
