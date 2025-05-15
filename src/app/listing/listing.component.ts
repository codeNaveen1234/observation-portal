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
    this.setProfile()
    this.setHeader()
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
  
  setHeader(){
    let data:any ={
      "authorization":"Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvcmcuc3VuYmlyZHNhYXMuYXBwLTUxYjc4OTdlMjZjZDRmOGQwYzMzZDZhZmVmMGNjMmJlYjBjYTQ2MjkiLCJpYXQiOjE3NDU4MzQzOTJ9.5UcyccSPAbUhXxmURgcL1T51pqGYLuWnnIa1LnVDV4Y",
      "x-channel-id": "0138786843639234561",
      "x-device-id":  "51b7897e26cd4f8d0c33d6afef0cc2beb0ca4629",
      "x-session-id": "49f3a247-d598-445e-92bb-29116f4ddc5e",
      "x-app-id":"shikshalokam",
      "x-app-ver":"5.0-debug",
      "x-authenticated-user-token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImFjY2Vzc3YxX2tleTUifQ.eyJhdWQiOiJodHRwczovL3N1bmJpcmRzYWFzLmNvbS9hdXRoL3JlYWxtcy9zdW5iaXJkIiwic3ViIjoiZjplNGZkMmNmNy0xYjE4LTQ1Y2YtYjBiMy01NWNjM2VkZWE1MzM6MGM1ZGQ4OTgtNTAyMS00NDlhLWE3M2YtMWRjODFiZmZlNmY5Iiwicm9sZXMiOlt7InJvbGUiOiJCT09LX0NSRUFUT1IiLCJzY29wZSI6W3sib3JnYW5pc2F0aW9uSWQiOiIwMTM4Nzg2ODQzNjM5MjM0NTYxIn1dfSx7InJvbGUiOiJDT05URU5UX0NSRUFUT1IiLCJzY29wZSI6W3sib3JnYW5pc2F0aW9uSWQiOiIwMTM4Nzg2ODQzNjM5MjM0NTYxIn1dfSx7InJvbGUiOiJDT1VSU0VfTUVOVE9SIiwic2NvcGUiOlt7Im9yZ2FuaXNhdGlvbklkIjoiMDEzODc4Njg0MzYzOTIzNDU2MSJ9XX0seyJyb2xlIjoiUFJPR1JBTV9ERVNJR05FUiIsInNjb3BlIjpbeyJvcmdhbmlzYXRpb25JZCI6IjAxMzg3ODY4NDM2MzkyMzQ1NjEifV19LHsicm9sZSI6IlBVQkxJQyIsInNjb3BlIjpbXX1dLCJpc3MiOiJodHRwczovL3N1bmJpcmRzYWFzLmNvbS9hdXRoL3JlYWxtcy9zdW5iaXJkIiwibmFtZSI6IlBEIiwidHlwIjoiQmVhcmVyIiwiZXhwIjoxNzQ3MzI0MTA5LCJpYXQiOjE3NDcyODA5MDl9.Zfd7z1cHdXS1bnGqqiML3cH5mjW7Hx5Mc3KqNSbhszNH4ZrZfNp_jd_9IA0FPL8TFAKggi1_VTPhAyBLwBJoINf_7X9kCC0SsLvsWWhsc1Vio_XrpQrg2PBzcwiI-gJ7zgMF2KyQLutLA5RC-LtN2UxBpNFke6AvJYB4VxR1ZmAJfnybax8xwvdidWtoHU9SoShlSzlkcRLAwJiK51bh-rItpxEnv4be0Bjgc5Noo6JQLKg1yLD996CUwwZGhAZic_pd_75C5ccCzn2iDmoIzPTQGy1MVQecMfkDOtruluAYkFGIGBfcmYlF1kci9VxhFwNjf4KEzJabSkO9joySJw",
      "x-auth-token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImFjY2Vzc3YxX2tleTUifQ.eyJhdWQiOiJodHRwczovL3N1bmJpcmRzYWFzLmNvbS9hdXRoL3JlYWxtcy9zdW5iaXJkIiwic3ViIjoiZjplNGZkMmNmNy0xYjE4LTQ1Y2YtYjBiMy01NWNjM2VkZWE1MzM6MGM1ZGQ4OTgtNTAyMS00NDlhLWE3M2YtMWRjODFiZmZlNmY5Iiwicm9sZXMiOlt7InJvbGUiOiJCT09LX0NSRUFUT1IiLCJzY29wZSI6W3sib3JnYW5pc2F0aW9uSWQiOiIwMTM4Nzg2ODQzNjM5MjM0NTYxIn1dfSx7InJvbGUiOiJDT05URU5UX0NSRUFUT1IiLCJzY29wZSI6W3sib3JnYW5pc2F0aW9uSWQiOiIwMTM4Nzg2ODQzNjM5MjM0NTYxIn1dfSx7InJvbGUiOiJDT1VSU0VfTUVOVE9SIiwic2NvcGUiOlt7Im9yZ2FuaXNhdGlvbklkIjoiMDEzODc4Njg0MzYzOTIzNDU2MSJ9XX0seyJyb2xlIjoiUFJPR1JBTV9ERVNJR05FUiIsInNjb3BlIjpbeyJvcmdhbmlzYXRpb25JZCI6IjAxMzg3ODY4NDM2MzkyMzQ1NjEifV19LHsicm9sZSI6IlBVQkxJQyIsInNjb3BlIjpbXX1dLCJpc3MiOiJodHRwczovL3N1bmJpcmRzYWFzLmNvbS9hdXRoL3JlYWxtcy9zdW5iaXJkIiwibmFtZSI6IlBEIiwidHlwIjoiQmVhcmVyIiwiZXhwIjoxNzQ3MzI0MTA5LCJpYXQiOjE3NDcyODA5MDl9.Zfd7z1cHdXS1bnGqqiML3cH5mjW7Hx5Mc3KqNSbhszNH4ZrZfNp_jd_9IA0FPL8TFAKggi1_VTPhAyBLwBJoINf_7X9kCC0SsLvsWWhsc1Vio_XrpQrg2PBzcwiI-gJ7zgMF2KyQLutLA5RC-LtN2UxBpNFke6AvJYB4VxR1ZmAJfnybax8xwvdidWtoHU9SoShlSzlkcRLAwJiK51bh-rItpxEnv4be0Bjgc5Noo6JQLKg1yLD996CUwwZGhAZic_pd_75C5ccCzn2iDmoIzPTQGy1MVQecMfkDOtruluAYkFGIGBfcmYlF1kci9VxhFwNjf4KEzJabSkO9joySJw"
    }
    let token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImFjY2Vzc3YxX2tleTUifQ.eyJhdWQiOiJodHRwczovL3N1bmJpcmRzYWFzLmNvbS9hdXRoL3JlYWxtcy9zdW5iaXJkIiwic3ViIjoiZjplNGZkMmNmNy0xYjE4LTQ1Y2YtYjBiMy01NWNjM2VkZWE1MzM6MGM1ZGQ4OTgtNTAyMS00NDlhLWE3M2YtMWRjODFiZmZlNmY5Iiwicm9sZXMiOlt7InJvbGUiOiJCT09LX0NSRUFUT1IiLCJzY29wZSI6W3sib3JnYW5pc2F0aW9uSWQiOiIwMTM4Nzg2ODQzNjM5MjM0NTYxIn1dfSx7InJvbGUiOiJDT05URU5UX0NSRUFUT1IiLCJzY29wZSI6W3sib3JnYW5pc2F0aW9uSWQiOiIwMTM4Nzg2ODQzNjM5MjM0NTYxIn1dfSx7InJvbGUiOiJDT1VSU0VfTUVOVE9SIiwic2NvcGUiOlt7Im9yZ2FuaXNhdGlvbklkIjoiMDEzODc4Njg0MzYzOTIzNDU2MSJ9XX0seyJyb2xlIjoiUFJPR1JBTV9ERVNJR05FUiIsInNjb3BlIjpbeyJvcmdhbmlzYXRpb25JZCI6IjAxMzg3ODY4NDM2MzkyMzQ1NjEifV19LHsicm9sZSI6IlBVQkxJQyIsInNjb3BlIjpbXX1dLCJpc3MiOiJodHRwczovL3N1bmJpcmRzYWFzLmNvbS9hdXRoL3JlYWxtcy9zdW5iaXJkIiwibmFtZSI6IlBEIiwidHlwIjoiQmVhcmVyIiwiZXhwIjoxNzQ3MzI0MTA5LCJpYXQiOjE3NDcyODA5MDl9.Zfd7z1cHdXS1bnGqqiML3cH5mjW7Hx5Mc3KqNSbhszNH4ZrZfNp_jd_9IA0FPL8TFAKggi1_VTPhAyBLwBJoINf_7X9kCC0SsLvsWWhsc1Vio_XrpQrg2PBzcwiI-gJ7zgMF2KyQLutLA5RC-LtN2UxBpNFke6AvJYB4VxR1ZmAJfnybax8xwvdidWtoHU9SoShlSzlkcRLAwJiK51bh-rItpxEnv4be0Bjgc5Noo6JQLKg1yLD996CUwwZGhAZic_pd_75C5ccCzn2iDmoIzPTQGy1MVQecMfkDOtruluAYkFGIGBfcmYlF1kci9VxhFwNjf4KEzJabSkO9joySJw"
    localStorage.setItem('accToken',token)
    localStorage.setItem("headers",JSON.stringify(data))
  }

  setProfile(){
    let data:any = {
       "state": "0e576f3e-ee8b-49b0-9ce3-a36a4b6c0a7d",
  "cluster": "2d781ed8-23c9-4553-bf1a-c95d017d35fd",
  "district": "6e7e8200-6ed4-4185-8003-c5955539984e",
  "block": "944e7e59-efb8-41ac-b3d9-7119b9b0da1f",
  "school": "28222501308",
  "role": "HM,DEO"
    }
    localStorage.setItem("profileData",JSON.stringify(data))
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
