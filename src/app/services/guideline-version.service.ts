import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResourceBaseService } from './resource-base.service';
import { GuidelineVersion } from '../models/dto/guideline-version';
import { HttpClient } from '@angular/common/http';
import { BASE_GUIDELINE_URL } from '../constants';
import { APIResponse } from '../models/http/api-response';

@Injectable({
  providedIn: 'root'
})
export class GuidelineVersionService extends ResourceBaseService<GuidelineVersion> {

  constructor(httpClient: HttpClient) {
    super(httpClient, BASE_GUIDELINE_URL);
  }

  // Custom API's for specific entity API's that don't fit ResourceBaseService class


  loadGuidelineVersionsByGuidelineType(guidelineTypeId: number): Observable<GuidelineVersion[]> {
    return this.httpClient
      .get<APIResponse>(`${this.basePath}/version/${guidelineTypeId}`)
      .pipe(map((res: APIResponse) => this.toDtos(res)));
  }

  loadGuidelineAppVersion(): Observable<string> {
    return this.httpClient
      .get<APIResponse>(`${this.basePath}/list`)
      .pipe(map((res: APIResponse) => {
        const version = res.version.replace('(@git.commit.id.abbrev@)', '');
        return version;
      }));
  }
}
