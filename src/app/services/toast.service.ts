import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private snackBar: MatSnackBar,private translate: TranslateService) { }

  showToast(message:string,type?:string,duration?:number,verticalPosition?:any,horizontalPosition?:any){
    let styleClass = type ? type : "default"
    let snackBarConfig = {
      duration: duration ? duration : 3000,
      verticalPosition: verticalPosition ? verticalPosition : 'top',
      horizontalPosition: horizontalPosition ? horizontalPosition : "center",
      panelClass: [styleClass]
    }
    this.translate.get(message).subscribe((translatedMsg: string) => {
      this.snackBar.open(translatedMsg, '',snackBarConfig);
    });
  }
}