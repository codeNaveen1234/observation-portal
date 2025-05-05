import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import * as urlConfig from '../constants/url-config.json';
import { catchError, finalize } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class offlineSaveObservation {
  constructor(
    private apiService: ApiService,
    private toaster: ToastService,
    private db: DbService
  ) {
  }
  getFullObservationData(observationId, entityId, submissionId) {
    this.apiService.post(urlConfig.observation.details + `${observationId}` + `?entityId=${entityId}`, this.apiService.profileData)
      .pipe(
        catchError((err: any) => {
          this.toaster.showToast(err?.error?.message, 'Close');
          throw Error(err);
        })
      )
      .subscribe((res: any) => {

        if (res?.result) {

          this.setDataInIndexDb(res?.result, submissionId);
        } else {
          this.toaster.showToast(res?.message, 'danger');
        }
      })
  }
  async setDataInIndexDb(observationData, submissionId) {
    const data = {
      key: submissionId,
      data: observationData
    }
    try {
      await this.db.addData(data);
    } catch (error) {
      console.error("Failed to store data in IndexedDB", error);
    }
  }

  async checkAndMapIndexDbDataToVariables(submissionId) {
    let indexdbData = await this.db.getData(submissionId);
    let currentObservation = {
      data: indexdbData?.data

    };
    return currentObservation;
  }
}