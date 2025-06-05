import { config } from 'dotenv';
import { SalesforceConfig } from '../types/index.js';

config();

export function getSalesforceConfig(): SalesforceConfig & { readOnlyMode: boolean } {
  const requiredEnvVars = [
    'SALESFORCE_CLIENT_ID',
    'SALESFORCE_CLIENT_SECRET',
    'SALESFORCE_USERNAME',
    'SALESFORCE_PASSWORD',
    'SALESFORCE_SECURITY_TOKEN'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
    clientId: process.env.SALESFORCE_CLIENT_ID!,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET!,
    username: process.env.SALESFORCE_USERNAME!,
    password: process.env.SALESFORCE_PASSWORD!,
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN!,
    readOnlyMode: process.env.SALESFORCE_READ_ONLY_MODE !== 'false', // Default to true for safety
  };
}