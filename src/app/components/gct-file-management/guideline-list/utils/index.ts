import { ReviewUser } from "src/app/models/dto/review-user";

export const getApprovedReviewCount = (reviewUsers: ReviewUser[]): number => {
  return reviewUsers.filter(reviewUser => reviewUser.reviewStatus !== null).length;
}