import { Component } from '@angular/core';
import { DownloadService } from '../services/download.service';
import { DbDownloadService } from '../services/dbDownload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-downloads',
  standalone: false,
  templateUrl: './downloads.component.html',
  styleUrl: './downloads.component.css'
})
export class DownloadsComponent {
  loaded = false;

  filters: any[] = [
    { value: 'observation', label: 'OBSERVATION' },
    { value: 'survey', label: 'SURVEY' },
    { value: 'projects', label: 'PROJECTS' },
  ];
  
  selectedIndex: number = 0;




constructor(
  public router: Router,
  // private toaster: ToastService,
  // private apiService: ApiService,
  // private urlParamService:UrlParamsService,
  // private route:ActivatedRoute,
  // private utils:UtilsService,
  // private translate: TranslateService
  private dbDownloadService: DbDownloadService
) {
}

ngOnInit(): void {
  this.loaded = true;
  this.fetchDownloadedData("observation");
}


onTabChange(index: number) {
  const selectedTab = this.filters[index];
  console.log('Selected Tab:', selectedTab.value);
  // You can use this to fetch/display dynamic data per tab
}

isDataInDownloadsIndexDb:any;

async fetchDownloadedData(type){
  if(type == "observation"){
    this.isDataInDownloadsIndexDb = await this.dbDownloadService.getAllDownloadsData();
    console.log("isDataInDownloadsIndexDb", this.isDataInDownloadsIndexDb);
  }

}

navigateTo(route){
  this.router.navigateByUrl(route);
}

deleteData(){
  
}
}
