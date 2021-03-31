import { GuidelineStatus } from "../enums/guideline-status";
import { ReviewUser } from "./review-user";

export class GuidelineStatusChange {
  status: GuidelineStatus;

  // Optional if status === 'PUBLISHED'
  notes?: string;
  reviewUsers?: ReviewUser[];
}

export interface GuidelineStatusChangeSucceeded {
  guidelineId: number;
  changeDto: GuidelineStatusChange,
  type: any;
}