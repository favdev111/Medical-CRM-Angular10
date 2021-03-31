import { Resource } from './resource';
import { GuidelineType } from './guideline-type';
import { ReviewUser } from './review-user';
import { GuidelineStatus } from '../enums/guideline-status';
import { Review } from './review';

export class GuidelineVersion implements Resource {
  id: number;
  guidelineTypeId: number;
  guidelineType: GuidelineType;
  providerGuidelineVersion: string;
  creatorName:string;
  lastModifiedName:string;
  createdDate: Date;
  lastModifiedDate: Date;
  status: GuidelineStatus;
  updates: string[];
  removed: boolean;
  reviewUsers: ReviewUser[];
  latestReview: Review;
}
