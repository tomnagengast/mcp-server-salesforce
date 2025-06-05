export interface SalesforceConfig {
  loginUrl: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  securityToken: string;
}

export interface SalesforceConnection {
  accessToken: string;
  instanceUrl: string;
  isConnected: boolean;
}

export interface SalesforceRecord {
  Id: string;
  [key: string]: unknown;
}

export interface SearchResult {
  totalSize: number;
  done: boolean;
  records: SalesforceRecord[];
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  fields?: string[];
}

export interface ToolResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  message?: string;
}

export interface SalesforceError {
  message: string;
  errorCode: string;
  fields?: string[];
}