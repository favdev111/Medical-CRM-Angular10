import { GuidelineVersion } from './guideline-version';

export class Review {
  reviewId: number;
  notes: string;
  guidelineVersion: GuidelineVersion;
  hash: number;
}