import { Pipe, PipeTransform } from '@angular/core';
import { GuidelineVersion } from 'src/app/models/dto/guideline-version';
import { guidelineInReviewStatusLookup, GuidelineStatus, guidelineStatusLookup } from 'src/app/models/enums/guideline-status';

@Pipe({
  name: 'guidelineStatus'
})
export class GuidelineStatusPipe implements PipeTransform {
  transform(guidelineVersion: GuidelineVersion, latestVersionId?: number): string {
    if (latestVersionId && latestVersionId !== guidelineVersion.id) {
      return GuidelineStatus.ARCHIVED;
    } else if (guidelineVersion.reviewUsers && guidelineVersion.reviewUsers.length && guidelineVersion.status !== GuidelineStatus.PUBLISHED && guidelineVersion.status !== GuidelineStatus.DRAFT) {
      return guidelineInReviewStatusLookup(guidelineVersion.reviewUsers);
    }
    return guidelineStatusLookup(guidelineVersion.status);
  }
}