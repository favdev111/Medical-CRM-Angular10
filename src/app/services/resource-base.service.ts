import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import _ from 'lodash';
import { Resource } from '../models/dto/resource';
import { APIResponse } from '../models/http/api-response';
import { BaseService } from './base.service';

export class ResourceBaseService<T extends Resource> extends BaseService<T> {

  protected basePath: string;

  constructor(protected httpClient: HttpClient, endpoint: string) {
    super(endpoint);
    this.basePath = `${this.url}/${endpoint}`;
  }

  get(): Observable<T[]> {
    return this.httpClient
      .get<APIResponse>(this.basePath)
      .pipe(map((res: APIResponse) => this.toDtos(res)));
  }

  getById(id: number): Observable<T> {
    return this.httpClient
      .get<APIResponse>(`${this.basePath}/${id}`)
      .pipe(map((res: APIResponse) => this.toDto(res)));
  }

  query(queryString: string): Observable<T[]> {
    return this.httpClient
      .get<APIResponse>(`${this.basePath}/?${queryString}`)
      .pipe(map((res: any) => this.toDtos(res)));
  }

  create(data: T): Observable<T> {
    return this.httpClient
      .post<APIResponse>(`${this.basePath}`, data)
      .pipe(map((res: APIResponse) => this.toDto(res)));
  }

  update(data: T): Observable<T> {
    return this.httpClient
      .put<APIResponse>(`${this.basePath}/${data.id}`, data)
      .pipe(map((res: APIResponse) => this.toDto(res)));
  }

  delete(id: number): Observable<any> {
    return this.httpClient
      .delete(`${this.basePath}/${id}`);
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
