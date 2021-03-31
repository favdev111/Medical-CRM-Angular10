import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertComponent } from '../components/alert/alert.component';

@Injectable()
export class AlertService {

  private snackbarConfig: MatSnackBarConfig = {
    verticalPosition: 'top',
    horizontalPosition: 'center',
    duration: 4000
  };

  constructor(public snackbar: MatSnackBar) { }

  open(message: string, panelClass: string, config?: MatSnackBarConfig) {
    let finalConfig = { ...this.snackbarConfig, panelClass, data: { message, type: panelClass }};
    if (config) {
      finalConfig = { ...config, ...finalConfig };
    }
    this.snackbar.openFromComponent(AlertComponent, { ...finalConfig });
  }

}