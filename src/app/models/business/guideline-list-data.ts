import { Resource } from '../dto/resource';
import { GuidelineType } from '../dto/guideline-type';
import { GuidelineVersion } from '../dto/guideline-version';

export interface GuidelineListData extends Resource {
  id: number;
  guidelineType: GuidelineType;
  latestVersion: GuidelineVersion;
  guidelineVersions: GuidelineVersion[];
}
