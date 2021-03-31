import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';

import { NodeEffects } from './node.effects';
import { NodeService } from 'src/app/services/node.service';
import { createNodeB, createNodeC, createNodeA } from 'src/app/test-utils/dto-factory';
import { NodeRelationship, Node, OutgoingNode, NodeUpdate } from 'src/app/models/dto/node';
import {
  createRelationship,
  createRelationshipSucceeded,
  create,
  createSucceeded,
  update,
  updateSucceeded,
  removeRelationship,
  removeRelationshipSucceeded
} from './node.actions';
import { NodeDeleteRelationshipUpdate } from './node.types';

describe('NodeEffects', () => {
  let actions$: Observable<any>;

  let effects$: NodeEffects;
  let nodeService: jasmine.SpyObj<NodeService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NodeEffects,
        provideMockActions(() => actions$),
        {
          provide: NodeService,
          useValue: {
            createRelationship: jasmine.createSpy(),
            loadByGuidelineId: jasmine.createSpy(),
            update: jasmine.createSpy(),
            create: jasmine.createSpy(),
            delete: jasmine.createSpy(),
            deleteRelationship: jasmine.createSpy(),
          }
        }
      ]
    });

    effects$ = TestBed.inject(NodeEffects);
    nodeService = TestBed.get(NodeService);
  });

  describe('createRelationship', () => {
    it('should create a relationship successfully', () => {
      const parentNode: Node = createNodeB(false);
      const childNode: Node = createNodeC();
      const relationshipPayload: NodeRelationship = { parentId: parentNode.id, childId: childNode.id, isStep: false };
      const outgoingNode: OutgoingNode = { childNodeId: childNode.id, step: false };
      parentNode.outgoingNodes.push(outgoingNode);

      const expectedNodeUpdates: NodeUpdate = { deletedNodeIds: [], updatedNodes: [parentNode, childNode] };

      const action = createRelationship({ ...relationshipPayload });
      const outcome = createRelationshipSucceeded({ ...expectedNodeUpdates });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: expectedNodeUpdates });
      nodeService.createRelationship.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects$.createRelationship$).toBeObservable(expected);
    });

    it('should delete node relationship successfully', () => {
      const parentNode: Node = createNodeB(false);
      const childNode: Node = createNodeC();
      const relationshipPayload: NodeRelationship = { parentId: parentNode.id, childId: childNode.id, isStep: false };
      const outgoingNode: OutgoingNode = { childNodeId: childNode.id, step: false };
      parentNode.outgoingNodes.push(outgoingNode);

      const updatedNode: Node = { ...parentNode };
      const updatedNodeResponse: NodeUpdate = { deletedNodeIds: [childNode.id], updatedNodes: [updatedNode] };
      const expectedNodeUpdates: NodeDeleteRelationshipUpdate = { deletedNodeIds: [childNode.id], updatedNodes: [{ id: updatedNode.id, changes: updatedNode }] };

      const action = removeRelationship({ ...relationshipPayload });
      const outcome = removeRelationshipSucceeded({ ...expectedNodeUpdates });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: updatedNodeResponse });
      nodeService.deleteRelationship.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects$.deleteRelationship$).toBeObservable(expected);
    });

  });

  describe('creating and editing nodes', () => {
    it('should create node successfully', () => {
      const node: Node = createNodeA();
      const action = create({ node });
      const outcome = createSucceeded({ node });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: node });
      nodeService.create.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects$.createNode$).toBeObservable(expected);
    });

    it('should update node successfully', () => {
      const node: Node = createNodeA();
      const updatedNode: Node = createNodeA();
      updatedNode.content = 'Updated';

      const action = update({ id: node.id, changes: updatedNode });
      const outcome = updateSucceeded({ id: node.id, changes: updatedNode });

      actions$ = hot('-a', { a: action });
      const response = cold('-a|', { a: updatedNode });
      nodeService.update.and.returnValue(response);

      const expected = cold('--b', { b: outcome });
      expect(effects$.updateNode$).toBeObservable(expected);
    });
  });
});
