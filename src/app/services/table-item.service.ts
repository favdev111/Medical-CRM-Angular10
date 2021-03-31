import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ResourceBaseService } from './resource-base.service';
import { TableItem, TableItemNodeRelationship } from 'src/app/models/dto/table-item';
import { BASE_TABLE_ITEM_URL } from 'src/app/constants';
import { APIResponse } from '../models/http';
import { UpdatedTableItemPayload } from '../store/table-item-store/table-item.types';

@Injectable({
  providedIn: 'root'
})
export class TableItemService extends ResourceBaseService<TableItem> {

  constructor(httpClient: HttpClient) {
    super(httpClient, BASE_TABLE_ITEM_URL);
  }

  // Custom API's for specific entity API's that don't fit ResourceBaseService class

  createStartingPoint(tableItem: TableItem): Observable<UpdatedTableItemPayload> {
    return this.httpClient
      .post(`${this.basePath}`, tableItem)
      .pipe(map((res: APIResponse) => res.object as unknown as UpdatedTableItemPayload));
  }

  updateStartingPoint(tableItem: TableItem): Observable<UpdatedTableItemPayload> {
    return this.httpClient
      .put(`${this.basePath}/${tableItem.id}`, tableItem)
      .pipe(map((res: APIResponse) => res.object as unknown as UpdatedTableItemPayload));
  }

  addNodeToStartingPoint(relationship: TableItemNodeRelationship): Observable<UpdatedTableItemPayload> {
    return this.httpClient
      .put(`${this.basePath}/relationship`, relationship)
      .pipe(map((res: APIResponse) => res.object as unknown as UpdatedTableItemPayload));
  }

  reorder(tableItem: TableItem): Observable<TableItem[]> {
    return this.httpClient
      .put(`${this.basePath}/reorder`, tableItem)
      .pipe(map((res: APIResponse) => res.object as unknown as TableItem[]));
  }

  delete(id: number): Observable<UpdatedTableItemPayload> {
    return this
      .httpClient
      .delete(`${this.basePath}/${id}`)
      .pipe(map((res: APIResponse) => res.object as unknown as UpdatedTableItemPayload));
  }

}
