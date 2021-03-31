import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResourceBaseService } from './resource-base.service';
import { Guideline } from '../models/dto/guideline';
import { HttpClient } from '@angular/common/http';
import { BASE_GUIDELINE_URL } from '../constants';
import { GuidelineStatusChange } from '../models/dto/guideline-status-change';
import { ReviewUser } from '../models/dto/review-user';
import { APIResponse } from '../models/http';

@Injectable({
  providedIn: 'root'
})
export class GuidelineService extends ResourceBaseService<Guideline> {

  constructor(httpClient: HttpClient) {
    super(httpClient, BASE_GUIDELINE_URL);
  }

  // Custom API's for specific entity API's that don't fit ResourceBaseService class

  /**
   * Update guideline status
   * Valid options ['REVIEW', 'PUBLISHED']
   * Review status changes should be accompanied by a list of ReviewUsers and email notes
   * @param GuidelineStatusChange
   * @returns
   */
  updateGuidelineStatus(guidelineId: number, changeDto: GuidelineStatusChange): Observable<ReviewUser[]> {
    return this.httpClient
      .put<APIResponse>(`${this.basePath}/status/${guidelineId}`, changeDto)
      .pipe(map((res: APIResponse) => res.object as unknown as ReviewUser[]));
  }
}
