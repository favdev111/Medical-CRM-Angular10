import { Node } from '../models/dto/node';
import { Guideline } from '../models/dto/guideline';
import { GuidelineVersion } from '../models/dto/guideline-version';
import { GuidelineType } from '../models/dto/guideline-type';
import { TableItem } from '../models/dto/table-item';
import { GuidelineListData } from '../models/business/guideline-list-data';

// Given
// export const CONTENT_A = 'nodeA content';
// export const CONTENT_B = 'nodeB content';
// export const CONTENT_C = 'nodeC content';
export const CONTENT_A = '<p id="content">See Additional  Treatment (MYEL-7)</p>';
export const CONTENT_B = '<p>Renal biopsy recommended if:</p><ul><li><p>AKI stage 3</p></li><li><p>eGFR &lt;60 mL/min and &gt;2</p></li></ul><ul><li><p>Proteinuria (&gt;1 g/d) Albumin:creatinine &gt;30 mg/mmol</p></li><li><p>Fanconi syndrome</p></li></ul><p>Consider renal biopsy if:</p><ul><li><p>AKI stage 1 or 2</p></li><li><p>eGFR &lt;60 mL/min and &gt;2 mL/min per year decline</p></li><li><p>Proteinuria</p></li><li><p>Albumin:creatinine 3\u201330 mg/mmol or GFR &lt;60 mL/min</p></li><li><p>Evidence of light chain proteinuria</p></li></ul>';
export const CONTENT_C = '<ul><li><p>For IgG- or IgA-associated MGRS, use the response criteria for MM<footnote data-id=\\\"0a7dc7a5-5212-490b-821b-2d5736d0c012\\\" data-reference=\\\"a\\\">a</footnote></p></li><li><p>For IgM-associated MGRS, use the response criteria for WM(See NCCN Guidelines for Waldenstr\u00f6m Macroglobulinemia/Lymphoplasmacytic Lymphoma)</p></li><li><p>For FLC-associated MGRS, use the response criteria for amyloidosis (See NCCN Guidelines for Systemic Light Chain Amyloidosis)</p></li><li><p>For cases in which the causal monoclonal paraprotein is not detectable or is difficult to measure:</p><ul><li><p>evaluate renal function</p></li><li><p>bone marrow involvement or radiologic findings</p></li></ul></li></ul>';
export const CONTENT_D = '<p id="content">See Additional  Treatment (MYEL-7)</p>';
export const UPDATED_CONTENT = 'Updated';
export const ID_1 = 1;
export const ID_2 = 2;
export const ID_3 = 3;
export const ID_4 = 4;
export const INDEX_0 = 0;
export const INDEX_1 = 1;
export const GUIDELINE_TYPE_NAME = 'Test';
export const CATEGORY = 'category';
export const CREATED_DATE_NOW = new Date();
export const CREATED_DATE_PAST = new Date();
export const PROVIDER_GUIDELINE_VERSION_0 = '0';
export const PROVIDER_GUIDELINE_VERSION_1 = '1';
export const CREATED_BY_1 = 'John Snow';
export const CREATED_BY_2 = 'Tyrion Lannister';

// Factory
export const createNodeA = (withChildren = true): Node => {
  return {
    id: ID_1,
    parentId: 0,
    version: 0,
    content: CONTENT_A,
    outgoingNodes: !withChildren ? [] : [{ childNodeId: ID_2, step: false }, { childNodeId: ID_3, step: false }, { childNodeId: ID_3, step: false }],
    footnotes: null,
    section: null,
    index: INDEX_0,
    guidelineId: null
  };
};

export const createNodeB = (withChildren = false): Node => {
  return {
    id: ID_2,
    parentId: 0,
    version: 0,
    content: CONTENT_B,
    outgoingNodes: !withChildren ? [] : [{ childNodeId: ID_3, step: false }],
    footnotes: null,
    section: null,
    index: INDEX_1,
    guidelineId: null
  };
};

export const createNodeC = (): Node => {
  return {
    id: ID_3,
    parentId: 0,
    version: 0,
    content: CONTENT_C,
    outgoingNodes: [],
    footnotes: null,
    section: null,
    index: INDEX_1,
    guidelineId: null
  };
};

export const createNodeD = (): Node => {
  return {
    id: ID_4,
    parentId: 0,
    version: 0,
    content: CONTENT_D,
    outgoingNodes: [],
    footnotes: null,
    section: null,
    index: INDEX_1,
    guidelineId: null
  };
};

export const createGuidelineA = (): Guideline => {
  const guidelineVersion = createGuidelineVersionA();
  return {
    id: ID_1,
    createdDate: CREATED_DATE_PAST,
    guidelineVersion,
    tableItems: null,
    removed: false
  };
};

export const createGuidelineB = (): Guideline => {
  const guidelineVersion = createGuidelineVersionB();
  return {
    id: ID_2,
    createdDate: CREATED_DATE_NOW,
    guidelineVersion,
    tableItems: null,
    removed: false
  };
};

export const createGuidelineVersionA = (): GuidelineVersion => {
  const guidelineType = createGuidelineType();
  return {
    id: ID_1,
    guidelineType,
    guidelineTypeId: ID_1,
    createdDate: CREATED_DATE_PAST,
    lastModifiedDate: CREATED_DATE_PAST,
    providerGuidelineVersion: PROVIDER_GUIDELINE_VERSION_0,
    createdBy: CREATED_BY_1,
    updates: [],
    removed: false
  };
};

export const createGuidelineVersionB = (): GuidelineVersion => {
  const guidelineType = createGuidelineType();
  return {
    id: ID_2,
    guidelineType,
    guidelineTypeId: ID_2,
    createdDate: CREATED_DATE_NOW,
    createdBy: CREATED_BY_2,
    lastModifiedDate: CREATED_DATE_NOW,
    providerGuidelineVersion: PROVIDER_GUIDELINE_VERSION_1,
    updates: [],
    removed: false
  };
};

export const createGuidelineType = (): GuidelineType => {
  return {
    id: ID_1,
    guidelineTypeId: ID_1,
    name: GUIDELINE_TYPE_NAME,
    snomedAssociatedMorphologies: ['12345'],
    snomedFindingSite: 'test',
    category: CATEGORY,
    removed: false,
    createdDate: CREATED_DATE_NOW
  };
};

export const createStartingPoint = (nodeIds: number[] = []): TableItem => {
  return {
    id: ID_2,
    name: 'Starting Point',
    code: '',
    nodeIds,
    guideline: createGuidelineA(),
    startingPoint: true
  };
}

export const createGuidelineListData = (): GuidelineListData[] => {
  return [createGuidelineListItem()];
}

export const createGuidelineListItem = (): GuidelineListData => {
  const latestVersion = createGuidelineVersionB();
  return {
    id: null,
    guidelineType: createGuidelineType(),
    latestVersion,
    guidelineVersions: [latestVersion, createGuidelineVersionA()]
  };
}
