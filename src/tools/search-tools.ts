import { SalesforceAuth } from '../auth/salesforce-auth.js';
import { ToolResponse } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { handleSalesforceError, sanitizeSOQLInput } from '../utils/error-handler.js';

export class SearchTools {
  constructor(private auth: SalesforceAuth) {}

  async searchRecords(args: {
    query: string;
    objects?: string[];
    limit?: number;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const connection = this.auth.getConnection();
      const { query, objects = ['Account', 'Contact', 'Lead', 'Opportunity'], limit = 20 } = args;

      logger.info(`Searching records with query: "${query}" across objects: ${objects.join(', ')}`);
      const sanitizedQuery = sanitizeSOQLInput(query);

      const results: Record<string, unknown[]> = {};

      for (const objectType of objects) {
        try {
          // Search for records in each object type
          const soqlQuery = `SELECT Id, Name FROM ${objectType} WHERE Name LIKE '%${sanitizedQuery}%' LIMIT ${Math.ceil(limit / objects.length)}`;
          const result = await connection.query(soqlQuery);
          results[objectType] = result.records;
        } catch (error) {
          logger.warn(`Error searching ${objectType}:`, error);
          results[objectType] = [];
        }
      }

      const totalRecords = Object.values(results).reduce((sum, records) => sum + records.length, 0);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Found ${totalRecords} records matching "${query}"`,
              data: results,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorResult = handleSalesforceError(error, 'searchRecords');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(errorResult, null, 2),
          },
        ],
      };
    }
  }

  async soqlQuery(args: { query: string }): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const connection = this.auth.getConnection();
      const { query } = args;

      const result = await connection.query(query);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Query executed successfully. Found ${result.totalSize} records.`,
              data: {
                totalSize: result.totalSize,
                done: result.done,
                records: result.records,
              },
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : String(error),
            }, null, 2),
          },
        ],
      };
    }
  }

  async globalSearch(args: {
    searchTerm: string;
    limit?: number;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const connection = this.auth.getConnection();
      const { searchTerm, limit = 20 } = args;

      // Use SOSL (Salesforce Object Search Language) for global search
      const soslQuery = `FIND {${searchTerm}} IN ALL FIELDS RETURNING Account(Id, Name), Contact(Id, Name, Email), Lead(Id, Name, Email, Company), Opportunity(Id, Name, Amount, StageName) LIMIT ${limit}`;
      
      const result = await connection.search(soslQuery);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Global search completed for "${searchTerm}"`,
              data: result,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : String(error),
            }, null, 2),
          },
        ],
      };
    }
  }
}