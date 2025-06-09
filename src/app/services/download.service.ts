import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import * as urlConfig from '../constants/url-config.json';
import { catchError, finalize } from 'rxjs';
import { DbDownloadService } from './dbDownload.service';
@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(
    private apiService: ApiService,
    private toaster: ToastService,
    private dbDownloads: DbDownloadService
  ) {
  }

  async setDownloadsDataInIndexDb(observationData, submissionId) {
    const data = {
      key: submissionId,
      data: [observationData]
    }
    try {
      await this.dbDownloads.addDownloadsData(data);
    } catch (error) {
      console.error("Failed to store data in IndexedDB", error);
    }
  }

  async checkAndMapIndexDbDataToVariables(submissionId) {
    let indexdbData = await this.dbDownloads.getDownloadsData(submissionId);
    let currentObservation = {
      data: indexdbData?.data

    };
    return currentObservation;
  }


  async checkAndFetchDownloadsData(submissionId, type) {
    let indexdbData = await this.dbDownloads.getDownloadsData(submissionId, type);
    let data= indexdbData?.data
    return data;
  }
}