import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastService } from '../services/toast.service';
import * as urlConfig from '../constants/url-config.json';
import { MatDialog } from '@angular/material/dialog';
import { catchError, finalize } from 'rxjs';
import { UrlParamsService } from '../services/urlParams.service';
import { offlineSaveObservation } from '../services/offlineSaveObservation.service';
@Component({
  selector: 'app-observation-domain',
  standalone: false,
  templateUrl: './observation-domain.component.html',
  styleUrl: './observation-domain.component.css'
})
export class ObservationDomainComponent implements OnInit {
  entityId: any;
  entityName: any;
  entityToAdd: any;
  observations: any = [];
  evidences: any;
  expandedIndex: number | null = null;
  remark: any = "";
  observationId: any = "";
  id: any = "";
  entities:any=[]
  @ViewChild('notApplicableModel') notApplicableModel: TemplateRef<any>;
  loaded = false;
  submissionNumber:any;
  submissionId: any;
  completeObservationData: any;

  constructor(
    private apiService: ApiService, 
    private toaster: ToastService, 
    private router: Router,
    private dialog: MatDialog, 
    private urlParamsService:UrlParamsService,
    private route: ActivatedRoute,
    private offlineData:offlineSaveObservation 
  ) {}

  async ngOnInit(){
    this.urlParamsService.parseRouteParams(this.route)
    this.observationId = this.urlParamsService?.observationId;
    this.entityId = this.urlParamsService?.entityId;
    this.id = this.urlParamsService?.solutionId;
    this.submissionId = this.urlParamsService?.solutionId;
    let isDataInIndexDb = await this.offlineData.checkAndMapIndexDbDataToVariables(this.submissionId);
    if (isDataInIndexDb?.data) {
      this.mapDataToVariables(isDataInIndexDb?.data)
    }else {
      this.getObservationByEntityId();
    }
  }
  mapDataToVariables(observationData) {
    this.entities = observationData?.assessment?.evidences;
    this.evidences = this.entities;
    this.loaded = true
  }
  getObservationByEntityId() {
    this.evidences = [];
    this.apiService.post(urlConfig.observation.observationSubmissions + this.observationId + `?entityId=${this.entityId}`, this.apiService.profileData)
    .pipe(
      finalize(() =>this.loaded = true),
      catchError((err: any) => {
        this.toaster.showToast(err?.error?.message, 'Close');
        throw Error(err);
      })
    )
      .subscribe((res: any) => {
        
        if (res.result) {
          this.entities = res?.result;

        let evidencesStatus = this.entities
          .filter((obj: any) => obj?._id == this.id)
          .map((obj: any) => obj.evidencesStatus);

          this.entities
          .map((obj: any) => {
            if(obj?._id == this.id){
              this.submissionNumber = obj?.submissionNumber;
            }
          }
        )
        this.evidences = evidencesStatus.flat();
        } else {
          this.toaster.showToast(res.message, 'danger');
        }
      })
  }

  getObservationsByStatus(statuses: ('All' | 'draft' | 'completed' | 'started')[]) {
    if (!this.observations) {
      return [];
    }
    return statuses.includes('All')
      ? this.observations
      : this.observations.filter(obs => statuses.includes(obs.status));
  }

  toggleAccordion(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  navigateToDetails(data,index) {
    this.router.navigate(['questionnaire'], {
      queryParams: { observationId:this.observationId, entityId:this.entityId, submissionNumber:this.submissionNumber,evidenceCode:data?.code, index:index,submissionId: this.submissionId }
    });
  }


  notApplicable(entity) {
    this.remark = "";
    const dialogRef = this.dialog.open(this.notApplicableModel);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        const evidence = {
          externalId: entity?.code,
          remarks: this.remark,
          notApplicable: true
        }
        this.updateEntity(evidence)
      }
    });
  }

  updateEntity(evidence) {
    let payload={
        ...evidence,
        ...this.apiService.profileData
    }
    this.apiService.post(urlConfig.observation.update + this.id, payload)

      .subscribe((res: any) => {

        if (res.status == 200) {
          this.getObservationByEntityId();
        } else {
          this.toaster.showToast(res.message, 'Close');
        }
      }, (err: any) => {
        this.toaster.showToast(err.error.message, 'Close');
      })

  }
}
