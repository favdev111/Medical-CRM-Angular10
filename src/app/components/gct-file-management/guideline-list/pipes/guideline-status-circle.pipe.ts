import { Pipe, PipeTransform } from '@angular/core';
import { GuidelineVersion } from 'src/app/models/dto/guideline-version';
import { GuidelineStatus } from 'src/app/models/enums/guideline-status';
import { ReviewStatus } from 'src/app/models/enums/review-status';

@Pipe({
  name: 'guidelineStatusCircle'
})
export class GuidelineStatusCirclePipe implements PipeTransform {
  private readonly WARNING = 'warning';
  private readonly SUCCESS = 'success';
  private readonly BASE_CLASS = 'review-status__circle review-status__circle-';
  transform(guidelineVersion: GuidelineVersion): string {
    let color = this.SUCCESS;
    if (guidelineVersion.status === GuidelineStatus.PUBLISHED) {
      return '';
    }

    for (let reviewUser of guidelineVersion.reviewUsers) {
      if (reviewUser.reviewStatus === ReviewStatus.DECLINED) {
        color = this.WARNING;
        break;
      }

      if (reviewUser.reviewStatus === null) {
        return '';
      }
    }
    return this.BASE_CLASS + color;
  }
}