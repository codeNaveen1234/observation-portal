import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import * as urlConfig from '../constants/url-config.json';
import { environment } from 'src/assets/envirnoments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public baseUrl:string=environment.surveyBaseURL;
  public token:string;
  public profileData:any;
  public solutionId :any; 
  public entityType:any
  public userAuthToken:any=localStorage.getItem('accToken');
  public entityId:any;
  public submissionNumber:any;
  public evidenceCode:any;
  public index:any;
  public fileSizeLimit:any;

  constructor(private http:HttpClient) {}

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.baseUrl+url, { params });
  }

  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(this.baseUrl+url, body, { headers });
  }

  put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(this.baseUrl+url, body, { headers });
  }

  postWithFullURL<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(url, body, { headers });
  }

  putWithFullURL<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(url, body, { headers });
  }
  
  delete<T>(url: string, body: any): Observable<T> {
    return this.http.delete<T>(this.baseUrl + url, {body} );
  }

  async getAccessToken(): Promise<string | null> {

    const options = {
        url: urlConfig['profileListing'].refreshTokenUrl,
        headers: { 'Content-Type': 'application/json' },
        body: { refresh_token: localStorage.getItem('refToken')},
    };
        try {
        const res = await this.http.post<any>(this.baseUrl + options.url, options.body, { headers: options.headers }).toPromise();
        return res.result.access_token;
    } catch (error) {
        console.error('Error retrieving access token:', error);
        return null;
    }
    }

  public get fetchProfileData(){
    let rawProfileData = this.getRawProfileFromStorage();
    return this.profileData = this.normalizeProfileData(rawProfileData);
  }


  public getRawProfileFromStorage(): any {
    const data = localStorage.getItem('profileData');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse profileData from localStorage:', e);
      return null;
    }
  }

  public normalizeProfileData(profileData: any): any {
    if (!profileData) return null;

    const normalized: any = {};

    Object.entries(profileData).forEach(([key, value]: [string, any]) => {
      if (value && typeof value === 'object' && 'id' in value) {
        normalized[key] = value.id;
      } else {
        normalized[key] = value;
      }
    });

    return normalized;
  }
}