import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GuidelineType } from '../../../models/dto/guideline-type';
import { GuidelineVersion } from '../../../models/dto/guideline-version';
import { Guideline } from '../../../models/dto/guideline';
import { create } from '../../../store/guideline-store/guideline.actions';
import { UserProfileFacade } from 'src/app/store/user-profile-store/userprofile.facade';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-create-guideline',
  templateUrl: './create-guideline.component.html',
  styleUrls: ['./create-guideline.component.scss']
})
export class CreateGuidelineComponent {

  constructor(public dialog: MatDialog, public _router: Router) { }

  openDialog(): void {
    this.dialog.open(CreateGuidelineDialogComponent, { width: '854px', height: '495px' });
  }

}

@Component({
  selector: 'app-create-guideline-dialog',
  templateUrl: './create-guideline-dialog.component.html',
  styleUrls: ['./create-guideline.component.scss']
})
export class CreateGuidelineDialogComponent implements OnInit {

  public cancerType = '';
  public providerGuidelineVersion = '0';
  public cancerTypeDisabled = false;
  private guidelineType = new GuidelineType();

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<CreateGuidelineDialogComponent>,
    private _userProfileFacade: UserProfileFacade,
    @Inject(MAT_DIALOG_DATA) public data?: GuidelineType) { }

  ngOnInit(): void {
    if (this.data) {
      this.cancerType = this.data.name;
      this.guidelineType = this.data;
      this.cancerTypeDisabled = true;
    }
  }

  submit(): void {
    const guidelineVersion = new GuidelineVersion();
    const guideline = new Guideline();

    if (!this.data) {
      this.guidelineType.name = this.cancerType;
    }

    guidelineVersion.guidelineType = this.guidelineType;
    guidelineVersion.providerGuidelineVersion = this.providerGuidelineVersion;
    guideline.guidelineVersion = guidelineVersion;
    this._userProfileFacade
      .userDisplayName$
      .pipe(take(1))
      .subscribe((displayName) => {
        guidelineVersion.creatorName = displayName;
      });

    this.store.dispatch(create({ guideline }));
    this.dialogRef.close();
  }

}

