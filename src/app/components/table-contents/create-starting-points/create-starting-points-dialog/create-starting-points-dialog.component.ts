import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, take } from 'rxjs/operators';
import { TableItem } from 'src/app/models/dto/table-item';
import { UserProfileFacade } from 'src/app/store/user-profile-store/userprofile.facade';


interface CreateStartingPointDialogData {
  guidelineId: number;
  nodeId?: number;
}


@Component({
  selector: 'app-create-starting-points-dialog',
  templateUrl: './create-starting-points-dialog.component.html',
  styleUrls: ['./create-starting-points-dialog.component.scss']
})
export class CreateStartingPointsDialogComponent implements OnInit {

  public name = '';

  private _loggedinUserDisplayName: any;

  constructor(
    private _userProfileFacade: UserProfileFacade,
    private dialogRef: MatDialogRef<CreateStartingPointsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateStartingPointDialogData
  ) { }

  ngOnInit(): void { }


  private _setUserDisplayName(): void {
    this._userProfileFacade
      .userDisplayName$
      .pipe(take(1))
      .subscribe((displayName) => {
        this._loggedinUserDisplayName = displayName;
      });
  }

  generateNewStartingPoint(): TableItem {
    this._setUserDisplayName();
    return {
      id: null,
      name: this.name,
      createdBy: this._loggedinUserDisplayName,
      lastModifiedBy: null,
      code: '',
      pageNumber: 2, // need to pass non null page number to backend but any number will do, backend handles calc of next page number
      nodeIds: this.data.nodeId ? [this.data.nodeId] : [],
      guideline: { // only id is needed for this call
        id: this.data.guidelineId,
        createdDate: null,
        guidelineVersion: null,
        tableItems: null,
        removed: false,
        status: null
      },
      startingPoint: true
    };
  }

  save(): void {
    this.dialogRef.close(this.generateNewStartingPoint());
  }

}


