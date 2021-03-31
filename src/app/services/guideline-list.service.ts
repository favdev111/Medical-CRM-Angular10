import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResourceBaseService } from './resource-base.service';
import { HttpClient } from '@angular/common/http';
import { BASE_GUIDELINE_URL } from '../constants';
import { APIResponse } from '../models/http/api-response';
import { GuidelineListData } from '../models/business/guideline-list-data';

@Injectable({
  providedIn: 'root'
})
export class GuidelineListService extends ResourceBaseService<GuidelineListData> {

  constructor(httpClient: HttpClient) {
    super(httpClient, BASE_GUIDELINE_URL);
  }
  // Custom API's for specific entity API's that don't fit ResourceBaseService class
  loadGuidelineTypes(): Observable<APIResponse> {
    return this.httpClient
      .get<APIResponse>(`${this.basePath}/list`)
  }
}
