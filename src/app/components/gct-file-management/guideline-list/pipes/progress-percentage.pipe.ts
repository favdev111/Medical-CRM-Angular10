import { Pipe, PipeTransform } from '@angular/core';
import { ReviewUser } from 'src/app/models/dto/review-user';
import { getApprovedReviewCount } from '../utils';

@Pipe({
  name: 'progressPercentage'
})
export class ProgressPercentage implements PipeTransform {
  transform(reviewUsers: ReviewUser[]): number {
    return (getApprovedReviewCount(reviewUsers) / reviewUsers.length) * 100;
  }
}
