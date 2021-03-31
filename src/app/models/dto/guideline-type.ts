import { Resource } from './resource';

export class GuidelineType implements Resource {
  id: number;
  guidelineTypeId: number;
  name: string;
  snomedAssociatedMorphologies: string[];
  snomedFindingSite: string;
  category: string;
  removed: boolean;
  createdDate: Date;
}

