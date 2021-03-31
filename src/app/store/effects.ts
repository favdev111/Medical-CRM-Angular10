import { GuidelineEffects } from './guideline-store/guideline.effects';
import { NodeCommentEffects } from './node-comment-store/node-comment.effects';
import { NodeEffects } from './node-store/node.effects';
import { TableItemEffects } from './table-item-store/table-item.effects';

export const effects = [
  GuidelineEffects,
  NodeEffects,
  TableItemEffects,
  NodeCommentEffects
];
