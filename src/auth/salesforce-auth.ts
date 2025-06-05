import jsforce from 'jsforce';
import { SalesforceConfig, SalesforceConnection } from '../types/index.js';
import { getSalesforceConfig } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import { handleSalesforceError } from '../utils/error-handler.js';

export class SalesforceAuth {
  private connection: jsforce.Connection | null = null;
  private config: SalesforceConfig;

  constructor() {
    this.config = getSalesforceConfig();
  }

  async connect(): Promise<SalesforceConnection> {
    try {
      this.connection = new jsforce.Connection({
        loginUrl: this.config.loginUrl,
        version: '59.0' // Latest API version
      });

      const userInfo = await this.connection.login(
        this.config.username,
        this.config.password + this.config.securityToken
      );

      logger.info('Connected to Salesforce:', {
        id: userInfo.id,
        organizationId: userInfo.organizationId,
        url: userInfo.url
      });

      return {
        accessToken: this.connection.accessToken!,
        instanceUrl: this.connection.instanceUrl!,
        isConnected: true
      };
    } catch (error) {
      logger.error('Salesforce authentication failed:', error);
      const errorResult = handleSalesforceError(error, 'authentication');
      throw new Error(errorResult.error);
    }
  }

  getConnection(): jsforce.Connection {
    if (!this.connection) {
      throw new Error('Not connected to Salesforce. Call connect() first.');
    }
    return this.connection;
  }

  isConnected(): boolean {
    return this.connection !== null && this.connection.accessToken !== undefined;
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.logout();
      } catch (error) {
        logger.warn('Error during logout:', error);
      } finally {
        this.connection = null;
      }
    }
  }
}