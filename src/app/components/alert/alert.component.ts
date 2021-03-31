import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertType } from 'src/app/models/enums/alert-type';

export interface SnackbarData {
  message: string;
  type: AlertType;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData, private snackbarRef: MatSnackBarRef<AlertComponent>) { }

  close(): void {
    this.snackbarRef.dismiss();
  }
}