import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastService } from '../services/toast.service';
import * as urlConfig from '../constants/url-config.json';
import { MatDialog } from '@angular/material/dialog';
import { catchError, finalize } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UrlParamsService } from '../services/urlParams.service';
import { QueryParamsService } from '../services/queryParams.service';
@Component({
  selector: 'app-observation-details',
  standalone: false,
  templateUrl: './observation-details.component.html',
  styleUrl: './observation-details.component.css'
})
export class ObservationDetailsComponent implements OnInit {
  entityId: any;
  entityName: any;
  observationId: any;
  observations: any = [];
  observationName: any;
  observationInit: boolean = false;
  selectedTabIndex = 0;
  allowMultipleAssessemts: any;
  submissionId: any;
  loaded = false;
  isPendingTabSelected: boolean = true;
  filteredObservations:any =[];
  isRubricDriven:any;

  @ViewChild('confirmDialogModel') confirmDialogModel: TemplateRef<any>;
  @ViewChild('updateDialogModel') updateDialogModel: TemplateRef<any>;


  constructor(
    private apiService: ApiService, 
    private toaster: ToastService, 
    private router: Router,
    private dialog: MatDialog,
    private urlParamsService:UrlParamsService,
    private route: ActivatedRoute,
    private queryParamsService: QueryParamsService, 
  ) {
  }

  ngOnInit(): void {
    this.queryParamsService.parseQueryParams()
    this.urlParamsService.parseRouteParams(this.route)
    this.entityId=this.urlParamsService?.entityId
    this.entityName = decodeURIComponent(decodeURIComponent(this.urlParamsService?.entityName || ''));
    this.observationId = this.urlParamsService?.observationId;
    this.submissionId = this.queryParamsService?.submissionId;
    this.allowMultipleAssessemts = this.urlParamsService?.allowMultipleAssessemts;
    this.observationInit = true;
    this.getObservationByEntityId();
  }

getObservationsByStatus(statuses: ('draft' | 'inprogress' | 'completed' | 'started')[]): void {
  if (!this.observations) {
    this.filteredObservations = [];
    return;
  }

  if (statuses.includes('completed')) {
    this.filteredObservations = this.observations.filter(obs => obs?.status === 'completed');
  } else {
    this.filteredObservations = this.observations.filter(obs => statuses.includes(obs?.status));
  }
}


  getObservationByEntityId() {
    this.apiService.post(urlConfig.observation.observationSubmissions + this.observationId + `?entityId=${this.entityId}`, this.apiService.profileData)
    .pipe(
      finalize(() =>this.loaded = true),
      catchError((err: any) => {
        this.toaster.showToast(err?.error?.message, 'Close');
        throw Error(err);
      })
    )
      .subscribe((res: any) => {
        if (res?.result) {
          if (this.observationInit && !res?.result?.length) {
            this.observationInit = false;
            this.observeAgain();
          } else {
            this.observationInit = false;
            this.observations = res?.result;
            this.isRubricDriven = res?.result[0]?.isRubricDriven; 
            this.getObservationsByStatus(['draft', 'started', 'inprogress']);
          }
        } else {
          this.toaster.showToast(res?.message, 'danger');
        }
      })
  }

  navigateToDetails(data) {

    if (data?.isRubricDriven) {
      this.router.navigate([
        'domain',
        data?.observationId,
        data.entityId,
        data?._id
      ]);
    } else {
      this.router.navigate(['questionnaire'], {
        queryParams: {observationId: data?.observationId, entityId: data?.entityId, submissionNumber: data?.submissionNumber, evidenceCode: data?.evidencesStatus[0]?.code, index: 0
        }
      });
    }
  }

  editEntity(entity: any, id: any) {
    this.observationName = entity;
    const dialogRef = this.dialog.open(this.updateDialogModel);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'update') {
        this.updateEntity(id);
      }
    });
  }


  deleteEntity(id: any) {

    const dialogRef = this.dialog.open(this.confirmDialogModel);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.apiService.delete(urlConfig.observation.update + id, { data: [] })
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
    });
  }

  updateEntity(id: any) {
    const payload = {
      title: this.observationName
    }
    this.apiService.post(urlConfig.observation.update + id, payload)
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

  observeAgain() {
    this.apiService.post(urlConfig.observation.create + this.observationId + `?entityId=${this.entityId}`, {})
      .subscribe((res: any) => {
        if (res.result) {
          this.getObservationByEntityId();
        } else {
          this.toaster.showToast(res.message, 'danger');
        }
      })
  }

  viewReport(entity?) {
    console.log("viewreports",entity,this.observationId,
      this.entityId,
      entity ? entity?.entityType : this.observations[0]?.entityType,
      entity ? false : true,
      this.isRubricDriven ? true : false)
    this.router.navigate([
      'reports',
      this.observationId,
      this.entityId,
      entity ? entity?.entityType : this.observations[0]?.entityType,
      entity ? false : true,
      this.isRubricDriven ? true : false
    ],{
      queryParams:{
        'submissionId': entity?._id,
      }
    });
  }

  toggleTabs(event: MatTabChangeEvent): void {
    const selectedTabLabel = event.tab.textLabel;
    if (selectedTabLabel === 'In progress') {
      this.isPendingTabSelected = true;
      this.getObservationsByStatus(['draft', 'started', 'inprogress']);
    } else if (selectedTabLabel === 'Completed') {
      this.isPendingTabSelected = false;
      this.getObservationsByStatus(['completed']);
    }
}
}
