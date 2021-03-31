import { Review } from './review';

export class ReviewUser {
  reviewUserId: number;
  email: string;
  displayName: string;
  reviewStatus: string;
  review: Review;
}