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
  getFullObservationData(observationId, entityId, submissionId,submissionNumber): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.post(urlConfig.observation.details + `${observationId}` + `?entityId=${entityId}`+`&submissionNumber=${submissionNumber}`, this.apiService.profileData)
        .pipe(
          catchError((err: any) => {
            this.toaster.showToast(err?.error?.message, 'Close');
            reject(err);
            return [];
          })
        )
        .subscribe(async (res: any) => {
          if (res?.result) {
            await this.setDataInIndexDb(res?.result, submissionId);
            resolve();
          } else {
            this.toaster.showToast(res?.message, 'danger');
            reject(res?.message);
          }
        });
    });
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