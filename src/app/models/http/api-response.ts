import { Resource } from '../dto/resource';

export interface APIResponse {
  status: string;
  timestamp: Date;
  message?: string;
  debugMessage?: string;
  apiErrors: string[];
  apiWarnings: string[];
  version: string;
  object: Resource | Resource[];
}
