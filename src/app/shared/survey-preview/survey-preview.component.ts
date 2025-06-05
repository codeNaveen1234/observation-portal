import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-survey-preview',
  standalone: false,
  templateUrl: './survey-preview.component.html',
  styleUrl: './survey-preview.component.css'
})
export class SurveyPreviewComponent {
  objectType:any;
  objectURL:any;
  constructor(public dialogRef: MatDialogRef<SurveyPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
){
  this.objectType=data.objectType
  this.objectURL=data.objectUrl
}
closeDialog(){
  this.dialogRef.close()
}
}
