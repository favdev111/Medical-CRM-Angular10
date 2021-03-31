import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { NodeComment } from 'src/app/models/dto/node-comment';
import * as NodeCommentActions from './node-comment.actions';

export interface State extends EntityState<NodeComment> {
  errors: string | string[];
  nodeCommentMap: Map<number, number[]>;
  expandedNodeComments: NodeComment[];
}

export const adapter: EntityAdapter<NodeComment> = createEntityAdapter<NodeComment>({
  selectId: (nodeComment: NodeComment) => nodeComment.nodeCommentId
});
const initialState: State = {
  ...adapter.getInitialState(),
  errors: [],
  nodeCommentMap: new Map<number, number[]>(),
  expandedNodeComments: []
};

export const nodeCommentFeatureKey = 'nodeComment';

const nodeCommentReducer = createReducer(
  initialState,
  on(NodeCommentActions.loadSucceeded, (state, { reviewDetails }) => {
    state = { ...state, nodeCommentMap: reviewDetails.nodeCommentMap };
    return adapter.setAll(reviewDetails.nodeComments, state)
  }),
  on(NodeCommentActions.updateStatusSucceeded, (state, { nodeCommentId, changes }) => adapter.updateOne({id: nodeCommentId, changes}, state)),
  on(
    NodeCommentActions.loadFailed,
    NodeCommentActions.updateStatusFailed,
    (state, { errors }) => ({ ...state, errors })
  ),
  on(NodeCommentActions.resetNodeComments, () => ({ ...initialState })),
  on(NodeCommentActions.setExpandedComments, (state, { expandedNodeComments }) => ({ ...state, expandedNodeComments }))
);

export const reducer = (state: State | undefined, action: Action) => nodeCommentReducer(state, action);