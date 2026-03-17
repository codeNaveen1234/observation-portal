import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { ApiService } from '../services/api.service';
import { UrlParamsService } from '../services/urlParams.service';
import { listingConfig, statusMappings} from '../constants/actionContants';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { UtilsService } from '../services/utils.service';
import { DownloadService } from '../services/download.service';
import { MatDialog } from '@angular/material/dialog';
import { GenericPopupComponent } from '../shared/generic-popup/generic-popup.component';
import { offlineSaveObservation } from '../services/offlineSaveObservation.service';
import { DownloadDataPayloadCreationService } from '../services/download-data-payload-creation.service';
import { RouterService } from '../services/router.service';
import { EntityFilterPopupComponent } from '../shared/entity-filter-popup/entity-filter-popup.component';

@Component({
  selector: 'app-listing',
  standalone: false,
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.css'
})
export class ListingComponent implements OnInit {
  solutionList = signal<any[]>([]);
  page = signal(1);
  limit = 10;
  entityType = signal<any[]>([]);
  initialSolutionData = signal<any[]>([]);
  selectedEntityType = signal('');
  loaded = signal(false);
  headerConfig = signal<any>(null);
  observationDownloaded = false;
  isDataInDownloadsIndexDb: any[] = [];

  constructor(
    private toaster: ToastService,
    private apiService: ApiService,
    private urlParamService:UrlParamsService,
    private route:ActivatedRoute,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private utils:UtilsService,
    private downloadService: DownloadService,
    private dialog: MatDialog,
    private offlineData:offlineSaveObservation,
    private downloadDataPayloadCreationService:DownloadDataPayloadCreationService,
    private navigate:RouterService

  ) {
  }
 
  ngOnInit(): void {
    this.setProfile();
    this.urlParamService.parseRouteParams(this.route)
    this.headerConfig.set(listingConfig[this.urlParamService.solutionType])
    this.loadInitialData();
  }

  onSearchChange(value?: any): void {
    this.headerConfig.update((config: any) => ({
      ...config,
      searchTerm: value || ''
    }));
    this.page.set(1);
    this.solutionList.set([]);
    this.getListData();
  }

  loadInitialData(): void {
    this.page.set(1);
    this.solutionList.set([]);
    this.getListData();
  }

  async getListData(): Promise<void> {
    const headerConfig = this.headerConfig();
    
    if (!headerConfig) return;

    if (!this.apiService?.profileData){
      await this.utils.getProfileDetails();
    }

    let queryParams=(headerConfig.showSearch?`${this.selectedEntityType()}` :`${headerConfig.searchTerm || ''}`)+`&page=${this.page()}&limit=${this.limit}`
    this.apiService.post(
      headerConfig.urlPath + queryParams,
      this.apiService?.profileData
    ).pipe(
      finalize(() => this.loaded.set(true)),
      catchError((err: any) => {
        this.toaster.showToast(err?.error?.message, 'Close');
        return throwError(() => err);
      })
    )
      .subscribe((res: any) => {
        if (res?.status === 200) {
          headerConfig.showSearch && this.entityType.set(res?.result?.entityType || []);
          let list:any[] = res?.result?.data || [];
          list.forEach((element: any) => {
            element.status = new Date().setHours(0, 0, 0, 0) > new Date(element.endDate).setHours(0, 0, 0, 0)? 'expired': element.status;
            element.endDate = element.endDate ? new Date(element.endDate).toDateString() : '';
            Object.assign(element, statusMappings[element.status] ?? { tagClass: '', statusLabel: '' });
            if(headerConfig.surveyPage){
              const diffDays = element.endDate ? this.getDateDiff(element.endDate) : 0;
              element.daysUntilExpiry = Math.max(diffDays, 0);
              element.isExpiringSoon = diffDays > 0 && diffDays <= 2;
              element.surveyExpiry = this.solutionExpiryStatus(element);
            }
          });
          const updatedList = [...this.solutionList(), ...list];
          this.solutionList.set(updatedList);
          this.initialSolutionData.set(updatedList);
          this.checkDataInDB()
        } else {
          this.toaster.showToast(res?.message, 'Close');
        }
      });
  }

  loadData(): void {
    this.page.update((value) => value + 1);
    this.solutionList.set(this.initialSolutionData());
    this.getListData();
  }

  navigateTo(data?: any) {
    const { solutionId,name,entityType,observationId,entities,allowMultipleAssessemts,isRubricDriven,entityId,submissionNumber,submissionId,status} = data
    const headerConfig = this.headerConfig();
    if (!headerConfig) return;
    if(headerConfig.isObservation){
        if(headerConfig.title === 'Observation') return this.navigate?.navigation(['entityList',solutionId,name,entityType])
      entities?.length > 1 ? 
         this.dialog.open(EntityFilterPopupComponent,
          { 
            width: '400px', 
            data:{
              ...data,
              entities:data.entities.map((entity: any,index: number) => ({...entity,selected:index===0}))
            }
          }
        ):
        this.navigate?.navigation(['reports',observationId,entities[0]?._id,entityType,allowMultipleAssessemts,isRubricDriven])
    }else{
      if(headerConfig.surveyReports) return this.navigate?.navigation(['surveyReports',submissionId])
      if(status === 'expired') return this.toaster.showToast('FORM_EXPIRED','danger')
      this.navigate?.navigation(['/questionnaire'],{observationId,entityId,submissionNumber,submissionId,solutionId,solutionType:headerConfig.solutionType})

    }
  }

  changeEntityType(selectedType: any) {
    this.selectedEntityType.set(selectedType);
    this.solutionList.set( this.initialSolutionData().filter((solution: any) => solution?.entityType === selectedType));
  }

  solutionExpiryStatus(element: any) {
    const format = (date: any) => this.datePipe.transform(date, 'mediumDate');
    const t = this.translate.instant.bind(this.translate);
    if (element.status === 'expired') return `${t('EXPIRED_ON')} ${format(element.endDate)}`;
    if (element.endDate && element.isExpiringSoon) return `${t('EXPIRED_IN')} ${element.daysUntilExpiry} days`;
    if (element.completedDate) return `${t('COMPLETED_ON')} ${format(element.completedDate)}`;
    if (element.endDate) return `${t('VALID_TILL')} ${format(element.endDate)}`
    return ''
  }

  getDateDiff(endDateStr: string): number {
    const endDate = new Date(endDateStr);
    const today = new Date();
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };


  downloadPop(solution: any, index: number) {
    if(solution?.downloaded) return
    const dialogRef = this.dialog.open(GenericPopupComponent, {
      width: '400px',
      data: {
        message: 'DOWNLOAD_MSG',
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.downloadSurvey(solution, index);
      }
    });
  }
  

  async downloadSurvey(solution: any, index: number) {
    try {
      const newItem = this.downloadDataPayloadCreationService.buildSurveyItem(solution);
  
      const check = await this.offlineData.checkAndMapIndexDbDataToVariables(solution?.submissionId);
      if (!check?.data) {
        await this.offlineData.getFullQuestionerData(
          "survey", "", "", solution?.submissionId, 0, solution?.solutionId
        );
      }
  
      await this.downloadService.downloadData("survey", newItem);
      this.markSolutionDownloaded(index, true);
    } catch (e) {
      this.markSolutionDownloaded(index, false);
    }
  }

  async checkDataInDB() {
    const storedSurveys =(await this.downloadService.checkAndFetchDownloadsDatas("survey")) || [];
    this.solutionList.update((solutions) =>solutions.map((solution: any) => {
      const isDownloaded = storedSurveys.some((item: any) => {
        const entries = Array.isArray(item?.data) ? item.data : [item?.data].filter(Boolean);
        return entries.some(
          (d: any) =>
            d?.metaData?.solutionId === solution?._id &&
            d?.metaData?.submissionId === solution?.submissionId
        );
      });
  
      return { ...solution, downloaded: isDownloaded };
    }));
  }

  private markSolutionDownloaded(index: number, downloaded: boolean): void {
    this.solutionList.update((solutions) =>
      solutions.map((item, idx) => (idx === index ? { ...item, downloaded } : item))
    );
    this.initialSolutionData.update((solutions) =>
      solutions.map((item, idx) => (idx === index ? { ...item, downloaded } : item))
    );
  }

  setProfile() {
    const refToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjozNjczLCJuYW1lIjoiZmRmIiwic2Vzc2lvbl9pZCI6MzM1OTQsIm9yZ2FuaXphdGlvbl9pZHMiOlsiMzMiXSwib3JnYW5pemF0aW9uX2NvZGVzIjpbInRhbjkwIl0sInRlbmFudF9jb2RlIjoic2hpa3NoYWxva2FtIiwib3JnYW5pemF0aW9ucyI6W3siaWQiOjMzLCJuYW1lIjoidGFuOTAiLCJjb2RlIjoidGFuOTAiLCJkZXNjcmlwdGlvbiI6IlRhbjkwIHNwZWNpYWxpemVzIGluIHByb3ZpZGluZyBlZHVjYXRpb25hbCBTVEVBTSIsInN0YXR1cyI6IkFDVElWRSIsInJlbGF0ZWRfb3JncyI6W10sInRlbmFudF9jb2RlIjoic2hpa3NoYWxva2FtIiwibWV0YSI6bnVsbCwiY3JlYXRlZF9ieSI6MSwidXBkYXRlZF9ieSI6MTcwOSwicm9sZXMiOlt7ImlkIjoyMywidGl0bGUiOiJtZW50ZWUiLCJsYWJlbCI6Im1lbnRlZSIsInVzZXJfdHlwZSI6MCwic3RhdHVzIjoiQUNUSVZFIiwib3JnYW5pemF0aW9uX2lkIjoxMCwidmlzaWJpbGl0eSI6IlBVQkxJQyIsInRlbmFudF9jb2RlIjoic2hpa3NoYWxva2FtIiwidHJhbnNsYXRpb25zIjpudWxsfV19XX0sImlhdCI6MTc3MzY0ODU1NSwiZXhwIjoxNzc0MjUzMzU1fQ.8gFUjLzAll5__zbE1MITWqMtqwbaDddQ0plfLG4JO9E';
    const accToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjozNjczLCJuYW1lIjoiZmRmIiwic2Vzc2lvbl9pZCI6MzM1OTQsIm9yZ2FuaXphdGlvbl9pZHMiOlsiMzMiXSwib3JnYW5pemF0aW9uX2NvZGVzIjpbInRhbjkwIl0sInRlbmFudF9jb2RlIjoic2hpa3NoYWxva2FtIiwib3JnYW5pemF0aW9ucyI6W3siaWQiOjMzLCJuYW1lIjoidGFuOTAiLCJjb2RlIjoidGFuOTAiLCJkZXNjcmlwdGlvbiI6IlRhbjkwIHNwZWNpYWxpemVzIGluIHByb3ZpZGluZyBlZHVjYXRpb25hbCBTVEVBTSIsInN0YXR1cyI6IkFDVElWRSIsInJlbGF0ZWRfb3JncyI6W10sInRlbmFudF9jb2RlIjoic2hpa3NoYWxva2FtIiwibWV0YSI6bnVsbCwiY3JlYXRlZF9ieSI6MSwidXBkYXRlZF9ieSI6MTcwOSwicm9sZXMiOlt7ImlkIjoyMywidGl0bGUiOiJtZW50ZWUiLCJsYWJlbCI6Im1lbnRlZSIsInVzZXJfdHlwZSI6MCwic3RhdHVzIjoiQUNUSVZFIiwib3JnYW5pemF0aW9uX2lkIjoxMCwidmlzaWJpbGl0eSI6IlBVQkxJQyIsInRlbmFudF9jb2RlIjoic2hpa3NoYWxva2FtIiwidHJhbnNsYXRpb25zIjpudWxsfV19XX0sImlhdCI6MTc3MzY0ODU1NSwiZXhwIjoxNzczNzM0OTU1fQ.Bi2sIG-Q-pNY3WR0sDvjqV4yn52LEieq2xvEjc2YUxA';
    const profileData = {
      state: '6853e0168500f000144a3ea4',
      district: '6853e0828500f000144a3eba',
      block: '6853e0bb8500f000144a3f48',
      cluster: '6853e0e48500f000144a46e9',
      school: '6853e8628500f000144b0e6b',
      professional_role: '6825950197b5680013e6a17c',
      professional_subroles:
        '6825ad1f97b5680013e8450b,6825ad1f97b5680013e8450c,6825ad1f97b5680013e84519',
      organizations: '[object Object]'
    };

    const data: any = { 'org-id': '9' };
    const theme: any = { primaryColor: '#572E91', secondaryColor: '#FF9911' };
    localStorage.setItem('headers', JSON.stringify(data));
    localStorage.setItem('accToken', accToken);
    localStorage.setItem('refToken', refToken);
    localStorage.setItem('theme', JSON.stringify(theme));
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }
}
