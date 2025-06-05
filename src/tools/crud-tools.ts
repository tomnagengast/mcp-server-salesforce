import { SalesforceAuth } from '../auth/salesforce-auth.js';

export class CrudTools {
  constructor(private auth: SalesforceAuth) {}

  async getRecord(args: {
    objectType: string;
    recordId: string;
    fields?: string[];
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const connection = this.auth.getConnection();
      const { objectType, recordId, fields } = args;

      let fieldsToQuery = fields;
      if (!fieldsToQuery || fieldsToQuery.length === 0) {
        // Default fields based on object type
        const defaultFields: Record<string, string[]> = {
          Account: ['Id', 'Name', 'Type', 'Industry', 'Phone', 'Website', 'BillingCity', 'BillingState'],
          Contact: ['Id', 'Name', 'Email', 'Phone', 'Title', 'AccountId', 'Account.Name'],
          Lead: ['Id', 'Name', 'Email', 'Phone', 'Company', 'Title', 'Status', 'Source'],
          Opportunity: ['Id', 'Name', 'Amount', 'StageName', 'CloseDate', 'AccountId', 'Account.Name'],
          Case: ['Id', 'CaseNumber', 'Subject', 'Status', 'Priority', 'Origin', 'AccountId'],
        };
        fieldsToQuery = defaultFields[objectType] || ['Id', 'Name'];
      }

      const soqlQuery = `SELECT ${fieldsToQuery.join(', ')} FROM ${objectType} WHERE Id = '${recordId}'`;
      const result = await connection.query(soqlQuery);

      if (result.records.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `No ${objectType} record found with ID: ${recordId}`,
              }, null, 2),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Retrieved ${objectType} record`,
              data: result.records[0],
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

  async createRecord(args: {
    objectType: string;
    data: Record<string, unknown>;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const connection = this.auth.getConnection();
      const { objectType, data } = args;

      const result = await connection.sobject(objectType).create(data);

      if (result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Created ${objectType} record successfully`,
                data: {
                  id: result.id,
                  ...data,
                },
              }, null, 2),
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: 'Failed to create record',
                details: result.errors,
              }, null, 2),
            },
          ],
        };
      }
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

  async updateRecord(args: {
    objectType: string;
    recordId: string;
    data: Record<string, unknown>;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const connection = this.auth.getConnection();
      const { objectType, recordId, data } = args;

      const result = await connection.sobject(objectType).update({
        Id: recordId,
        ...data,
      });

      if (result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Updated ${objectType} record successfully`,
                data: {
                  id: recordId,
                  updatedFields: data,
                },
              }, null, 2),
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: 'Failed to update record',
                details: result.errors,
              }, null, 2),
            },
          ],
        };
      }
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

  async deleteRecord(args: {
    objectType: string;
    recordId: string;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const connection = this.auth.getConnection();
      const { objectType, recordId } = args;

      const result = await connection.sobject(objectType).delete(recordId);

      if (result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `Deleted ${objectType} record successfully`,
                data: {
                  id: recordId,
                },
              }, null, 2),
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: 'Failed to delete record',
                details: result.errors,
              }, null, 2),
            },
          ],
        };
      }
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