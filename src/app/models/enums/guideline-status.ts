import { ReviewUser } from "../dto/review-user";
import { ReviewStatus } from "./review-status";

export const guidelineStatusLookup = (status: string): string => {
  switch (status) {
    case GuidelineStatus.READY_TO_BE_PUBLISHED:
      return 'Ready To Publish';
    case GuidelineStatus.PUBLISHED:
      return 'Published';
    case GuidelineStatus.REVIEW:
      return 'Reviewing';
    default:
      return 'Draft';
  }
}

export const isDraftStatus = (status: GuidelineStatus): boolean => status === GuidelineStatus.DRAFT;

export const guidelineInReviewStatusLookup = (reviewUsers: ReviewUser[]): string => {
  let allReviewed = true;
  let allAccepted = true;
  reviewUsers.map(user => {
    if (user.reviewStatus === ReviewStatus.DECLINED) {
      allAccepted = false;
    }

    if (!user.reviewStatus) {
      allAccepted = false;
      allReviewed = false;
    }
  });

  if (allAccepted && allReviewed) {
    return guidelineStatusLookup(GuidelineStatus.READY_TO_BE_PUBLISHED);
  }

  return 'Reviewing';
}

export const enum GuidelineStatus {
  READY_TO_BE_PUBLISHED = 'READY_TO_BE_PUBLISHED',
  PUBLISHED = 'PUBLISHED',
  REVIEW = 'REVIEW',
  DRAFT = 'DRAFT',
  ARCHIVED = 'Archived'
}