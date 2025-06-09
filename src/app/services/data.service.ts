import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSubject = new BehaviorSubject<any>(null);

  // Set data
  setData(data: any): void {
    this.dataSubject.next(data);
  }

  // Get data as observable
  getData(): Observable<any> {
    return this.dataSubject.asObservable();
  }

  // Optionally, get current value (without subscribing)
  getCurrentValue(): any {
    return this.dataSubject.getValue();
  }
}
