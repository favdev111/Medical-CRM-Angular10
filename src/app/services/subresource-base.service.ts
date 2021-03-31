import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { APIResponse } from '../models/http/api-response';
import { Resource } from '../models/dto/resource';

/**
 * For querying the API for entities with parent -> child relationship (i.e /patient-guidelines/:guidelineId/clinical-path/:clinicalPathId)
 */
export class SubResourceBaseService<T extends Resource> extends BaseService<T> {

  private basePath: string;

  constructor(private httpClient: HttpClient, endpoint: string, parentEndpoint: string) {
    super(endpoint);
    this.basePath = `${this.basePath}/${parentEndpoint}`;
  }

  get(parentId: number): Observable<T[]> {
    return this.httpClient
      .get<APIResponse>(`${this.basePath}/${parentId}/${this.endpoint}`)
      .pipe(map((res: APIResponse) => this.toDtos(res)));
  }

  getById(id: number, parentId?: number): Observable<T> {
    return this.httpClient
      .get<APIResponse>(`${this.basePath}/${parentId}/${this.endpoint}/${id}`)
      .pipe(map((res: APIResponse) => this.toDto(res)));
  }

  query(queryString: string, parentId: number): Observable<T[]> {
    return this.httpClient
      .get<APIResponse>(`${this.basePath}/${parentId}/${this.endpoint}?${queryString}`)
      .pipe(map((res: APIResponse) => this.toDtos(res)));
  }

  create(data: T, parentId: number): Observable<T> {
    return this.httpClient
      .post<APIResponse>(`${this.basePath}/${parentId}/${this.endpoint}`, data)
      .pipe(map((res: APIResponse) => this.toDto(res)));
  }

  update(data: T): Observable<T> {
    return this.httpClient
      .put<APIResponse>(`${this.basePath}/${data.parentId}/${this.endpoint}/${data.id}`, data)
      .pipe(map((res: APIResponse) => this.toDto(res)));
  }

  delete(id: number, parentId: number): Observable<any> {
    return this.httpClient
      .delete(`${this.basePath}/${parentId}/${this.endpoint}/${id}`);
  }

  toDto(res: APIResponse): T {
    if (res.object != null) {
      return res.object as T;
    }
    return null;
  }

  toDtos(res: APIResponse): T[] {
    if (res.object != null) {
      return res.object as T[];
    }
    return null;
  }
}
