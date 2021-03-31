import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';
import { TableItemEffects } from './table-item.effects';
import { TableItemService } from 'src/app/services/table-item.service';
import { createStartingPoint } from 'src/app/test-utils/dto-factory';
import * as TableItemActions from 'src/app/store/table-item-store/table-item.actions';
import { UpdatedTableItemPayload } from './table-item.types';

describe('TableItemEffects', () => {
  let actions$: Observable<any>;

  let effects$: TableItemEffects;
  let tableItemService: jasmine.SpyObj<TableItemService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TableItemEffects,
        provideMockActions(() => actions$),
        {
          provide: TableItemService,
          useValue: {
            createStartingPoint: jasmine.createSpy(),
            updateStartingPoint: jasmine.createSpy(),
            removeStartingPoint: jasmine.createSpy(),
            addNodeToStartingPoint: jasmine.createSpy(),
            reoderStartingPoint: jasmine.createSpy()
          }
        }
      ]
    });

    effects$ = TestBed.inject(TableItemEffects);
    tableItemService = TestBed.get(TableItemService);
  });

  it('should create starting point', () => {
    const tableItem = createStartingPoint();
    const action = TableItemActions.create({ tableItem });
    const outcome = TableItemActions.createSucceeded({ tableItems: [tableItem] });
    const createResponse: UpdatedTableItemPayload = { updatedTableItems: [tableItem], updatedNodes: [] };

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: createResponse});
    tableItemService.createStartingPoint.and.returnValue(response);

    const expected = cold('--b', { b: outcome });
    expect(effects$.createStartingPoint$).toBeObservable(expected);
  });

  it('should update starting point', () => {
    const tableItem = createStartingPoint();
    const updatedTableItem = createStartingPoint();
    updatedTableItem.name = 'Updated';

    const action = TableItemActions.update({ id: updatedTableItem.id, changes: tableItem });
    const outcome = TableItemActions.updateSucceeded({ tableItems: [{ id: updatedTableItem.id, changes: updatedTableItem }] });
    const updateResponse: UpdatedTableItemPayload = { updatedTableItems: [tableItem], updatedNodes: [] };

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: updateResponse });
    tableItemService.updateStartingPoint.and.returnValue(response);

    const expected = cold('--b', { b: outcome });
    expect(effects$.createStartingPoint$).toBeObservable(expected);
  });
})