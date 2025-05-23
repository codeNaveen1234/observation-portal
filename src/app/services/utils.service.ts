import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
 error?(msg);

 getPreSingedUrls?(payload): Observable<any>;

 cloudStorageUpload?(payload): Observable<any>;

  constructor() {}

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
}
