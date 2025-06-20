import { booleanAttribute, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import * as urlConfig from '../constants/url-config.json';
import { ToastService } from '../services/toast.service';
import { catchError, finalize } from 'rxjs';
import { ApiConfiguration } from '../interfaces/questionnaire.type';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Chart,
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { UrlParamsService } from '../services/urlParams.service';
import { QueryParamsService } from '../services/queryParams.service';
import { SurveyPreviewComponent } from '../shared/survey-preview/survey-preview.component';
import { MatDialog } from '@angular/material/dialog';
Chart.register(PieController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-report',
  standalone: false,
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css','../listing/listing.component.css']
})
export class ReportComponent implements OnInit {

  reportDetails: any[] = [];
  objectURL: any;
  objectType!: string;
  isModalOpen: boolean = false;
  isFilterModalOpen: boolean = false;
  filteredQuestions: any[] = [];
  allQuestions: any[] = [];
  observationDetails: any;
  objectKeys = Object.keys;
  submissionId: any;
  entityType: any;
  @Input() apiConfig: ApiConfiguration;
  @Input({ transform: booleanAttribute }) angular = false;
  resultData:any;
  totalSubmissions: any;
  observationId: any;
  observationType: any = 'questions';
  entityId:any;
  loaded = false;
  filterData:any;
  isMultiple:any;
  scores:any;
  domainView:any;
  initialLoad:boolean = true;

  constructor(
    public router: Router,
    public apiService: ApiService,
    public toaster: ToastService,
    private cdr: ChangeDetectorRef,
    private urlParamsService: UrlParamsService,
    private route:ActivatedRoute,
    private queryParamsService: QueryParamsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.queryParamsService.parseQueryParams()
    this.urlParamsService.parseRouteParams(this.route)
    this.observationId = this.urlParamsService?.observationId;
    this.submissionId = this.queryParamsService?.submissionId;
    this.entityType = this.urlParamsService?.entityType;
    this.entityId = this.urlParamsService?.entityId;
    this.isMultiple = this.urlParamsService?.isMultiple;
    const scoresValue = this.urlParamsService?.scores;
    this.scores = scoresValue === 'true';

    this.loadObservationReport(this.submissionId, false, false);
  }

  loadObservationReport(submissionId: string, criteria: boolean, pdf: boolean) {
    this.resultData = [];
    this.observationDetails = '';
    this.totalSubmissions = [];
    this.allQuestions = [];
    this.reportDetails = [];
    this.loaded = true;

    let payload = this.createPayload(submissionId, criteria, pdf);

    // this.apiService.post(urlConfig.survey.reportUrl, payload)
    //   .pipe(
    //     finalize(() =>this.loaded = true),
    //     catchError((err) => {
    //       this.toaster.showToast(err?.error?.message, 'danger', 5000)
    //       throw new Error('Could not fetch the details');
    //     })
    //   )
    //   .subscribe((res: any) => {
      let res:any={
        "result": true,
        "observationId": "6853b756e8708500083abca6",
        "entityType": "district",
        "districtName": "Gomati",
        "programName": "Test program with observations",
        "solutionName": "Observation Without Rubric",
        "reportSections": [
            {
                "order": "Q1_1748848857674-1748848862508",
                "question": "Enter the date of observation",
                "responseType": "date",
                "answers": [
                    "20-6-2025 4:4:4 PM"
                ],
                "chart": {},
                "instanceQuestions": []
            },
            {
                "order": "Q2_1748848857674-1748848862509",
                "question": "What type of device is available at home?",
                "responseType": "text",
                "answers": [
                    "Simple mobile phone without internet",
                    "TV"
                ],
                "chart": {},
                "instanceQuestions": []
            },
            {
                "order": "Q3_1748848857674-1748848862510",
                "question": "How many courses have you taken?",
                "responseType": "text",
                "answers": [
                    "one"
                ],
                "chart": {},
                "instanceQuestions": [],
                "evidences": [
                    {
                        "url": "https://bmzbbujw9kal.compat.objectstorage.ap-mumbai-1.oraclecloud.com/odev-dev-diksha-manage-learn/survey/6854e2d2e8708500083ad598/398b0898-56ef-48a7-97cc-6cb66c134fd0/bdd90a66-2e7b-41ff-a6bc-5a2188acea93/VID_20250620_002802_990.mp4",
                        "extension": "mp4"
                    },
                    {
                        "url": "https://bmzbbujw9kal.compat.objectstorage.ap-mumbai-1.oraclecloud.com/odev-dev-diksha-manage-learn/survey/6854e2d2e8708500083ad598/398b0898-56ef-48a7-97cc-6cb66c134fd0/e4efe573-cf82-4624-b061-9fadfd4c9e47/VID_20250620_002802_990.mp4",
                        "extension": "mp4"
                    }
                ],
                "evidence_count": 2
            },
            {
                "order": "Q4_1748848857674-1748848862511",
                "question": "Which courses did you go through?",
                "responseType": "text",
                "answers": [
                    "Shhshd"
                ],
                "chart": {},
                "instanceQuestions": []
            }
        ],
        "completedDate": "2025-06-20T10:35:31.650Z",
        "filters": [
            {
                "order": "",
                "filter": {
                    "type": "segment",
                    "title": "",
                    "keyToSend": "criteriaWise",
                    "data": [
                        "questionWise",
                        "criteriaWise"
                    ]
                }
            },
            {
                "order": "",
                "filter": {
                    "type": "modal",
                    "title": "",
                    "keyToSend": "questionId",
                    "data": [
                        {
                            "name": "Enter the date of observation",
                            "_id": "Q1_1748848857674-1748848862508"
                        },
                        {
                            "name": "How many courses have you taken?",
                            "_id": "Q3_1748848857674-1748848862510"
                        },
                        {
                            "name": "What type of device is available at home?",
                            "_id": "Q2_1748848857674-1748848862509"
                        },
                        {
                            "name": "Which courses did you go through?",
                            "_id": "Q4_1748848857674-1748848862511"
                        }
                    ]
                }
            }
        ],
        "entityName": "Gomati",
        "responseCode": "OK"
    }
        this.resultData = res?.result;
        this.observationDetails = res;
        this.filterData = submissionId ? this.filterData : this.observationDetails?.filters[0]?.filter?.data;
        this.totalSubmissions = res?.result?.totalSubmissions;
        let reportSections:any = this.scores ? [res?.reportSections[0]] : res?.reportSections;
        this.domainView = this.scores ? res?.reportSections[1]?.chart: "";
        this.allQuestions = reportSections?.map((question:any) => {
          return { ...question, selected: true };
        });
        this.reportDetails = this.processSurveyData(this.allQuestions);
        console.log("the reportDeta",this.reportDetails)
        this.cdr?.detectChanges();
        this.objectType == 'questions' ? this.renderCharts(this.reportDetails, false) : this.renderCharts(this.reportDetails, true);
        if(this.initialLoad){
          this.initialLoad = false;
          this.filterData = this.observationDetails?.filters[0]?.filter?.data
        }
        console.log("the reportDeta",this.reportDetails)
      // });
  }

  createPayload(submissionId: string, criteria: boolean, pdf: boolean): any {
    let filter;
     if(pdf){
      filter = {
        questionId: this.filteredQuestions.map(item => item?.order)
      };
     }
    return {
      submissionId,
      observation: true,
      entityType: this.entityType,
      pdf,
      filter,
      criteriaWise: criteria,
      entityId:this.entityId,
      observationId:this.observationId,
      scores:this.scores
    };
  }

  processSurveyData(data: any): any[] {
    const mapAnswersToLabels = (answers: any[], options: any[]) => {
      if (!Array.isArray(answers)) {
        return [];
      }
      return answers.map((answer: any) => {
        if (typeof answer === 'string') {
          const trimmedAnswer = answer.trim();
          if (trimmedAnswer === '') {
            return 'No response is available';
          }

          const option = options?.find((opt: { value: any }) => opt?.value === trimmedAnswer);
          return option ? option?.label : trimmedAnswer;
        }
        return answer;
      });
    };

    const processQuestion = (question: any) => {
      if (question?.responseType === 'matrix' && question?.answers) {
        const processedInstanceQuestions = question?.answers.map(processInstanceQuestions);
        return { ...question, answers: processedInstanceQuestions };
      } else {
        const processedQuestion = { ...question };
        processedQuestion.answers = this.scores ? "" :mapAnswersToLabels(question?.answers, question?.options);
        delete processedQuestion?.options;
        processedQuestion.chartData = this.isChartNotEmpty(processedQuestion?.chart)
        return processedQuestion;
      }
    };

    const processInstanceQuestions = (instance: any) => {
      const processedInstance = { ...instance };
      for (const key in processedInstance) {
        if (key !== 'instanceIdentifier') {
          processedInstance[key].answers = mapAnswersToLabels(
            processedInstance[key].answers,
            processedInstance[key].options
          );
          delete processedInstance[key].options;
        }
      }
      return processedInstance;
    };

    if (this.observationType === 'questions') {
      return data.map(processQuestion);
    } else {
      return data.map((criterias) => {
          return criterias?.questionArray.map(processQuestion);
      });
    }
  }


  renderCharts(reportDetails: any[], isCriteria: boolean = false) {
    const flattenedReportDetails = isCriteria ? reportDetails.flat() : reportDetails;
    const canvases = document.querySelectorAll('.chart-canvas');

    canvases.forEach((canvas, index) => {
      if (canvas instanceof HTMLCanvasElement) {
        const question = flattenedReportDetails[index];
        if (question?.chart) {
          const chartType = question?.chart?.type === 'horizontalBar' ? 'bar' : question?.chart?.type;
          const chartOptions = this.getChartOptions(chartType, question?.chart?.type === 'horizontalBar');
          chartOptions.datasets = [{
            barThickness: 15,
            maxBarThickness: 20,
          }];

          new Chart(canvas, {
            type: chartType,
            data: question?.chart?.data,
            options: chartOptions
          });
        }
      } else {
        console.warn(`Element at index ${index} is not a canvas!`);
      }
    });
  }

  private getChartOptions(chartType: string, isHorizontalBar: boolean): any {
    const options: any = {
      maintainAspectRatio: true,
      plugins: {
        datalabels: {
          display: true,
        },
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true
        },
      }
    };

    if (chartType === 'bar') {
      options.scales = {
        x: {
          beginAtZero: true,
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            autoSkip: false
          }
        }
      };

      if (isHorizontalBar) {
        options.indexAxis = 'y';
      }
    }

    return options;
  }

  openDialog(url: any, type: string) {
    this.dialog.open(SurveyPreviewComponent, {
      width: '400px',
      data: {
        objectType:type,
        objectUrl:url
      }
    })
  }

  closeDialog() {
    this.isModalOpen = false;
  }

  openFilter() {
    this.isFilterModalOpen = true;
  }

  closeFilter() {
    this.isFilterModalOpen = false;
  }

  updateFilteredQuestions() {
    this.filteredQuestions = this.allQuestions.filter(question => question.selected);
  }

  checkAnswerValue(answer: any): string | number {
    if (typeof answer === 'string') {
      return answer.trim() === '' ? 'NA' : answer;
    }
    return answer;
  }

  applyFilter(reset: boolean = false) {
    this.updateFilteredQuestions();

    const questionsToProcess = this.filteredQuestions.length > 0 ? this.filteredQuestions : this.allQuestions;
    this.reportDetails = this.processSurveyData(questionsToProcess);
    this.cdr.detectChanges();
    this.objectType == 'questions' ? this.renderCharts(this.reportDetails, false) : this.renderCharts(this.reportDetails, true);
    if (!reset && this.filteredQuestions.length === 0) {
      this.toaster.showToast('SELECT_ATLEAST_ONE_QUESTION', 'danger');
    }

    if (reset || this.filteredQuestions.length > 0) {
      this.closeFilter();
    }
  }

  resetFilter() {
    this.allQuestions.forEach(question => question.selected = false);
    this.filteredQuestions = [];
    this.applyFilter(true);
  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }

  isChartNotEmpty(chart: any, i?:any) {
    return Object.keys(chart).length > 0 ? true : false;
  }

  toggleObservationType(type: any) {
    this.observationType = type;
    type == 'questions' ? this.loadObservationReport(this.submissionId, false, false) : this.loadObservationReport(this.submissionId, true, false);
  }

  downloadPDF(submissionId: string, criteria: boolean, pdf: boolean) {
    this.loaded = false;
    let payload = this.createPayload(submissionId, criteria, pdf);
    this.apiService.post(urlConfig.survey.reportUrl, payload)
      .pipe(
        finalize(() =>this.loaded = true),
        catchError((err) => {
          throw new Error('Could not fetch the details');
        })
      )
      .subscribe(async (res: any) => {
        const shareOptions = {
          type: "download",
          title: "data.name",
          fileType: "pdf",
          isBase64: false,
          url: res?.pdfUrl
        }

        let response = await this.postMessageListener(shareOptions)
        if(!response){
          this.openUrl(res?.pdfUrl)
        }
      });
  }

  onSelectionChange(submissionId: string): void {
    this.submissionId = submissionId;
    this.observationType == 'questions' ? this.loadObservationReport(submissionId, false, false) : this.loadObservationReport(submissionId, true, false);
  }

  navigateToObservationLedImpPage(){
    this.router.navigate(['/observation-led-imp'], { state: { improvementProjectSuggestions: this.observationDetails?.improvementProjectSuggestions, programName : this.observationDetails?.programName } });
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
}
