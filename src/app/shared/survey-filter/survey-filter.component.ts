import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-survey-filter',
  standalone: false,
  templateUrl: './survey-filter.component.html',
  styleUrl: './survey-filter.component.css'
})
export class SurveyFilterComponent {
  allQuestions:any;
  constructor(public dialogRef: MatDialogRef<SurveyFilterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
){
  this.allQuestions = data.allQuestions;
}
  applyFilter(){
    const selectedQuestions = this.allQuestions.filter((q: any) => q.selected);
    this.dialogRef.close(selectedQuestions);
  }
  resetFilter(){
    this.allQuestions.forEach((question: any) => {
      question.selected = false;
    });
  }
  closeFilter(){
    this.dialogRef.close();
  }
}
