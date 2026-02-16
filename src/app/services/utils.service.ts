import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericDialogComponent } from '../shared/generic-dialog/generic-dialog.component';
import { Location } from '@angular/common';
import { ApiService } from './api.service';
import * as urlConfig from '../constants/url-config.json';


@Injectable({
  providedIn: 'root',
})
export class UtilsService {
 error?(msg);

 getPreSingedUrls?(payload): Observable<any>;

 cloudStorageUpload?(payload): Observable<any>;

  constructor(private translate: TranslateService, private dialog: MatDialog, private location: Location,
    private apiService: ApiService,
  ) {}

  isEmpty(value: any): boolean {
    if (value == null) {
      return true;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return true;
    }

    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    return false;
  }

  async validateToken(token:any){
    const tokenDecoded: any = await jwtDecode(token);
    const tokenExpiryTime = new Date(tokenDecoded.exp * 1000);
    const currentTime = new Date();
    return currentTime < tokenExpiryTime;
  }
  translateMessage(message: string): Promise<string> {
    return new Promise((resolve) => {
      this.translate.get(message).subscribe((translatedMsg: string) => {
        resolve(translatedMsg);
      });
    });
  }
  async createExpiryMsg(survey) {
    if (!survey?.endDate) return survey;
  
    const today = Date.now();
    const expiryDate = new Date(survey.endDate);
    const diffDays = Math.ceil((expiryDate.getTime() - today) / (1000 * 60 * 60 * 24));
    const formattedDate = this.formatDateWithSuffix(expiryDate);
    let key: any;
    if (expiryDate.getTime() < today) {
      if (survey?.status === 'completed') {
        key = 'COMPLETED_ON';
      } else {
        key = 'EXPIRED_ON';
        survey.status = 'expired';
      }
      const msg = await this.translateMessage(key);
      survey.generatedExpMsg = `${msg} ${formattedDate}`;
    } else {
      switch (diffDays) {
        case 1:
          survey.generatedExpMsg = await this.translateMessage('EXPIRE_IN_ONE_DAY');
          break;
        case 2:
          survey.generatedExpMsg = await this.translateMessage('EXPIRE_IN_TWO_DAY');
          break;
        default:
          key = 'VALID_TILL';
          const msg = await this.translateMessage(key);
          survey.generatedExpMsg = `${msg} ${formattedDate}`;
      }
    }
  
    return survey;
  }
  
  private formatDateWithSuffix(date: Date): string {
    const day = date.getDate();
    const suffix = this.getDaySuffix(day);
    const shortMonth = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
  
    return `${day}${suffix} ${shortMonth} ${year}`;
  }
  
  private getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
  postMessageListener(data:any):Promise<boolean>{
    return new Promise((resolve) => {
      try {
        if ((window as any).FlutterChannel) {
          (window as any).FlutterChannel.postMessage(data);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err: any) {
        console.error('FlutterChannel Error:', err);
        resolve(false);
      }
    });
  }

getProfileData(): Observable<any | null> {

  const dialogData = {
    title: "ALERT",
    message: "UPDATE_PROFILE_MSG",
    actionButtons: [
      {
        label: "UPDATE_PROFILE",
        action: true,
        class: "dialog-primary-button"
      }
    ],
    disableClose: true
  };

  const profileData = {
    state: {
      id: "b7416eb6-56b1-492a-a85f-97988edcd693",
      name: "State Test"
    },
    district: {
      id: "d1f09cff-24d2-4c47-8400-2c59c5253f95",
      name: "District Test"
    },
    block: {
      id: "46917bef-9147-47fd-9a8d-9d6beba26810",
      name: "Block Test"
    },
    cluster: {
      id: "c64b0153-58f3-407c-b349-a339f9e34b7e",
      name: "Cluster Test"
    },
    // cluster:null,
    school: {
      id: "c5447cf5-e32e-4f28-b9a8-2c0ae2fff319",
      name: "School Test"
    },
    role: "DEO,SPD,PRINCIPAL,HM,HT,PT"
  };

  if (!profileData || !profileData.state?.id || !profileData.role) {
    this.showProfileUpdateAlert(dialogData);
    return of(null);
  }

  const stateId = profileData.state.id;
  const role = profileData.role;

  const cachedStateData = JSON.parse(localStorage.getItem(stateId) || '{}');

  if (cachedStateData && cachedStateData[role]) {

    console.log('Using cached required fields');

    const requiredFields: string[] = cachedStateData[role];

    const missingFields = requiredFields.filter(field =>
      this.isInvalidField(profileData?.[field])
    );

    if (missingFields.length > 0) {
      console.log('Missing fields (cache):', missingFields);
      this.showProfileUpdateAlert(dialogData);
      return of(null);
    }

    return of(profileData);
  }

  return this.apiService
    .get(
      urlConfig.entityTypesByLocationAndRole +
      `${stateId}?role=${role}`
    )
    .pipe(

      map((apiResponse: any) => {

        const requiredFields: string[] = apiResponse?.result || [];
        cachedStateData[role] = requiredFields;
        localStorage.setItem(stateId, JSON.stringify(cachedStateData));
        const missingFields = requiredFields.filter(field =>
          this.isInvalidField(profileData?.[field])
        );

        if (missingFields.length > 0) {
          console.log('Missing fields (API):', missingFields);
          this.showProfileUpdateAlert(dialogData);
          return null;
        }

        return profileData;
      }),

      catchError(error => {
        console.error('Profile validation error:', error);
        this.showProfileUpdateAlert(dialogData);
        return of(null);
      })
    );
}


private isInvalidField(value: any): boolean {

  if (value === null || value === undefined) return true;

  if (typeof value !== 'object') return true;

  if (!value.id || value.id === null || value.id === undefined) return true;

  if (typeof value.id === 'string' && value.id.trim() === '') return true;

  return false;
}


  async showProfileUpdateAlert(data: any){
    const popupRef = this.dialog.open(GenericDialogComponent,{
      width: data.width || "400px",
      data: data,
      disableClose: data.disableClose || false
    })
    let response = await firstValueFrom(popupRef.afterClosed())
    let options:any
    if(response){
      options = {
        type: "redirect",
        pathType: "profile"
      }
    }else{
      options = {
        type: "redirect",
        pathType: "home"
      }
    }
    let eventResponse = await this.postMessageListener(options)
    if(!eventResponse) this.location.back()
  }
}
