import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResourceBaseService } from './resource-base.service';
import { Node, NodeMap, NodeRelationship, NodeUpdate } from '../models/dto/node';
import { APIResponse } from '../models/http/api-response';
import { BASE_NODE_URL, BASE_GUIDELINE_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class NodeService extends ResourceBaseService<Node> {

  constructor(httpClient: HttpClient) {
    super(httpClient, BASE_NODE_URL);
  }

  // Custom API's for specific entity API's that don't fit ResourceBaseService class

  loadByGuidelineId(guidelineId: number): Observable<NodeMap> {
    return this.httpClient
      .get(`${this.basePath}/${BASE_GUIDELINE_URL}/${guidelineId}`)
      .pipe(map((res: APIResponse) => res.object as unknown as NodeMap));
  }

  createRelationship(relationship: NodeRelationship): Observable<NodeUpdate> {
    return this.httpClient
      .post(`${this.basePath}/relationship`, relationship)
      .pipe(map((res: APIResponse) => res.object as unknown as NodeUpdate));
  }

  deleteRelationship(relationship: NodeRelationship): Observable<NodeUpdate> {
    const options = { body: { ...relationship }};
    return this.httpClient
      .request('DELETE', `${this.basePath}/relationship`, options)
      .pipe(map((res: APIResponse) => res.object as unknown as NodeUpdate));
  }

  delete(id: number): Observable<NodeUpdate> {
    return this.httpClient
      .delete(`${this.basePath}/${id}`)
      .pipe(map((res: APIResponse) => res.object as unknown as NodeUpdate));
  }

}
