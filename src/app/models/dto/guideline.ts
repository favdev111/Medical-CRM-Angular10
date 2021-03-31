import { Resource } from './resource';
import { GuidelineVersion } from './guideline-version';
import { TableItem } from './table-item';
import { NodeMap } from './node';
import { GuidelineStatus } from '../enums/guideline-status';

export class Guideline implements Resource {
  id: number;
  createdDate: Date;
  guidelineVersion: GuidelineVersion;
  tableItems: TableItem[];
  status: GuidelineStatus;
  removed: boolean;
  nodeMap?: NodeMap;
}
