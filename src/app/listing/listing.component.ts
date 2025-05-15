import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import * as urlConfig from '../constants/url-config.json';
import { ToastService } from '../services/toast.service';
import { ApiService } from '../services/api.service';
import { UrlParamsService } from '../services/urlParams.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-listing',
  standalone: false,
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.css'
})
export class ListingComponent implements OnInit {
  solutionList: any;
  solutionId!: string;
  listType = 'observation';
  searchTerm: string = "";
  stateData: any;
  page: number = 1;
  limit: number = 10;
  reportPage: any = false;
  pageTitle: string = 'Observations';
  entityType: any;
  initialSolutionData: any = [];
  selectedEntityType: any = '';
  loaded = false;
  entityId: any;
  isEntityFilterModalOpen: boolean = false;
  allEntities: any;
  solutionListCount :any = 0;
  selectedObservation:any;
  isAnyEntitySelected: boolean = false;
  surveyDate:any;
  type:any=localStorage.getItem('solutionType')
  constructor(
    public router: Router,
    private toaster: ToastService,
    private apiService: ApiService,
    private urlParamService:UrlParamsService,
    private route:ActivatedRoute,
    private utils:UtilsService
  ) {
  }
 
  ngOnInit(): void {
    this.urlParamService.parseRouteParams(this.route)
    this.setPageTitle()
    if(this.pageTitle === " Survey" || this.pageTitle === "Observation Reports" || this.pageTitle === "Survey Reports"){
      this.reportPage = false
    }else if(this.pageTitle === "Observations") {
      this.reportPage = true
    }
    this.loadInitialData();
  }
  setPageTitle() {
    const solutionType = this.urlParamService.solutionType;
    const titleMap: { [key: string]: string } = {
      'observationReports': 'Observation Reports',
      'survey': 'Survey',
      'observation': 'Observations',
      'surveyReports':'Survey Reports'
    };
    const typeKey = Object.keys(titleMap).find(key => 
      key.toLowerCase() === solutionType?.toLowerCase()
    );
    this.pageTitle = typeKey ? titleMap[typeKey] : 'Observations';
  }
  
  loadInitialData(): void {
    this.page = 1;
    this.solutionList = [];
    this.getListData();
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.handleInput(event);
    }
  }

  handleInput(event?: any): void {
    this.searchTerm = event ? event?.target?.value : "";
    this.page = 1;
    this.solutionList = [];
    this.solutionListCount = 0;
    this.getListData();
  }



  async getListData(): Promise<void> {
    let urlPath:any;
    let queryItems:any;
    if(this.pageTitle === 'Survey' || this.pageTitle === 'Survey Reports'){
      urlPath= urlConfig[this.listType].listing
      queryItems=`?type=${this.type}&page=${this.page}&limit=${this.limit}&surveyReportPage=${this.pageTitle === 'Survey Reports'}`
    }else if(this.pageTitle === 'Observation Reports'){
       urlPath= urlConfig[this.listType].reportListing
       queryItems=`?page=${this.page}&limit=${this.limit}&entityType=${this.selectedEntityType}`
    }else if(this.pageTitle === 'Observations'){
      urlPath= urlConfig[this.listType].listing
      queryItems=`?type=${this.type}&page=${this.page}&limit=${this.limit}&search=${this.searchTerm}`
    }
    this.apiService.post(
      urlPath + queryItems,
      this.apiService?.profileData
    ).pipe(
      finalize(() => this.loaded = true),
      catchError((err: any) => {
        this.toaster.showToast(err?.error?.message, 'Close');
        throw Error(err);
      })
    )
      .subscribe((res: any) => {
        if (res?.status === 200) {
          this.solutionListCount = res?.result?.count;
          if(this.pageTitle === 'Observation Reports'){
            this.entityType = res?.result?.entityType
          }
          if(this.pageTitle === 'Survey'){
            res?.result?.data?.map((item)=>{
              this.utils.createExpiryMsg(item)}
            )
          }
          if(!this.selectedEntityType){
            this.solutionList = [...this.solutionList, ...res?.result?.data];
            this.initialSolutionData = this.solutionList;
          }else{
            this.solutionList=res?.result?.data
          }
        } else {
          this.toaster.showToast(res?.message, 'Close');
        }
      });
  }

  loadData(): void {
    this.page++;
    this.solutionList = this.initialSolutionData;
    this.getListData();
  }

  navigateTo(data?: any) {
    if(this.pageTitle === 'Survey'){
      this.router.navigate(['/questionnaire'], {
        queryParams: {observationId: data?.observationId, entityId: data?.entityId, submissionNumber: data?.submissionNumber, index: 0, submissionId:data?.submissionId,solutionId:data?.solutionId
        }
      });
    }
    if(this.pageTitle === 'Survey Reports'){
        return;
    }
    if (!this.reportPage) {
      if (data?.entities?.length > 1) {
        this.allEntities = data?.entities;
        this.selectedObservation = data
        this.openFilter();
      }
      else if (data?.entities?.length == 1) {
        this.router.navigate([
          'reports',
          data?.observationId,
          data?.entities[0]?._id,
          data?.entityType,
          false,
          data?.isRubricDriven
        ]);
      } else {
        this.toaster.showToast("NO_SOLUTION_MSG", 'Close');
      }
    } else {
      this.router.navigate([
        'entityList',
        data.solutionId,
        data.name,
        data.entityType,
        data?._id
      ],
      );
    }
  }

  changeEntityType(selectedType: any) {
    this.selectedEntityType = selectedType;
    this.getListData()
  }

  openFilter() {
    this.isEntityFilterModalOpen = true;
  }

  closeFilter() {
    this.isEntityFilterModalOpen = false;
  }

  applyFilter() {
    let selectedEntity = this.allEntities.filter(question => question.selected);
    this.router.navigate([
      'reports',
      this.selectedObservation?.observationId,
      selectedEntity[0]?._id,
      this.selectedObservation?.entityType,
      false,
      this.selectedObservation?.isRubricDriven
    ]);
  }

  onEntityChange(selectedIndex: number): void {
    this.allEntities.forEach((entity, index) => {
      if (index !== selectedIndex) {
        entity.selected = false;
      }
    });
    this.isAnyEntitySelected = this.allEntities.some(entity => entity.selected);
  }
}
