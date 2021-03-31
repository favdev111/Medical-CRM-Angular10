import { Pipe, PipeTransform } from '@angular/core';
import { ReviewUser } from 'src/app/models/dto/review-user';
import { getApprovedReviewCount } from '../utils';

@Pipe({
  name: 'approvedReviewCount'
})
export class ApprovedReviewCount implements PipeTransform {
  transform(reviewUsers: ReviewUser[]): string {
    const count = getApprovedReviewCount(reviewUsers);
    return `${count}/${reviewUsers.length}`;
  }
}