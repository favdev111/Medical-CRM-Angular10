import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { GuidelineStatusChangePayload } from 'src/app/store/guideline-store/guideline.types';
import { GuidelineStatusChange } from 'src/app/models/dto/guideline-status-change';
import { MailChip } from 'src/app/models/dto/mail-chip';
import { ReviewUser } from 'src/app/models/dto/review-user';
import { GuidelineStatus } from 'src/app/models/enums/guideline-status';

export interface SendToReviewDialogData {
  guidelineVersionId: number;
  guidelineTypeId: number;
}

@Component({
  selector: 'app-send-to-review-dialog',
  templateUrl: './send-to-review-dialog.component.html',
  styleUrls: ['./send-to-review-dialog.component.scss']
})
export class SendToReviewDialogComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  notesValue: string = '';
  notesCharCount = 600;

  private readonly HEIGHT_LIMIT = 300;
  readonly MAX_CHAR = 600;
  readonly SEPARATOR_KEY_CODES: number[] = [ENTER, COMMA];

  @ViewChild('notes') notes: ElementRef<HTMLElement>;
  mailChips: MailChip[] = [];

  ngOnInit(): void {}

  add(event: MatChipInputEvent): void {
    const { input, value } = event;

    // Add email
    if ((value || '').trim()) {
      this.mailChips.push({mailId: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(mailId: MailChip): void {
    const index = this.mailChips.indexOf(mailId);

    if (index >= 0) {
      this.mailChips.splice(index, 1);
    }
  }  

  constructor(
    private dialogRef: MatDialogRef<SendToReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendToReviewDialogData
  ) { }

  submit(): void {
    const payload = this.generateReviewPayload(); 
    this.dialogRef.close(payload);
  } 

  notesExpand(e): void {
    this.notes.nativeElement.style.height = ""; /* Reset the height*/
    this.notes.nativeElement.style.height = Math.min(this.notes.nativeElement.scrollHeight, this.HEIGHT_LIMIT) + "px";
    this.notesValue = e.target.value;
    
    // char count
    const len = e.target.value.length;
    if (len === this.MAX_CHAR) {
      this.notesCharCount = 0;
    } else {
      this.notesCharCount = this.MAX_CHAR - len;
    }
  }

  generateReviewPayload(): GuidelineStatusChangePayload {
    const changeDto = new GuidelineStatusChange();
    changeDto.notes = this.notesValue;
    changeDto.status = GuidelineStatus.REVIEW;
    changeDto.reviewUsers = this.mailChips.map((chip) => {
      const reviewUser: ReviewUser = new ReviewUser();
      reviewUser.email = chip.mailId;
      return reviewUser;
    })

    return { guidelineVersionId: this.data.guidelineVersionId, guidelineTypeId: this.data.guidelineTypeId, changeDto };
  }

}


