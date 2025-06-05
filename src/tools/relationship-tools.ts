import { SalesforceAuth } from '../auth/salesforce-auth.js';

export class RelationshipTools {
  constructor(private auth: SalesforceAuth) {}

  async getRelatedRecords(args: {
    objectType: string;
    recordId: string;
    relationship: string;
    limit?: number;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const connection = this.auth.getConnection();
      const { objectType, recordId, relationship, limit = 20 } = args;

      // Common relationship mappings
      const relationshipMappings: Record<string, Record<string, string>> = {
        Account: {
          Contacts: 'SELECT Id, Name, Email, Phone, Title FROM Contact WHERE AccountId = \'{recordId}\' LIMIT {limit}',
          Opportunities: 'SELECT Id, Name, Amount, StageName, CloseDate FROM Opportunity WHERE AccountId = \'{recordId}\' LIMIT {limit}',
          Cases: 'SELECT Id, CaseNumber, Subject, Status, Priority FROM Case WHERE AccountId = \'{recordId}\' LIMIT {limit}',
        },
        Contact: {
          Account: 'SELECT Id, Name, Type, Industry FROM Account WHERE Id IN (SELECT AccountId FROM Contact WHERE Id = \'{recordId}\')',
          Opportunities: 'SELECT Id, Name, Amount, StageName, CloseDate FROM Opportunity WHERE AccountId IN (SELECT AccountId FROM Contact WHERE Id = \'{recordId}\') LIMIT {limit}',
          Cases: 'SELECT Id, CaseNumber, Subject, Status, Priority FROM Case WHERE ContactId = \'{recordId}\' LIMIT {limit}',
        },
        Opportunity: {
          Account: 'SELECT Id, Name, Type, Industry FROM Account WHERE Id IN (SELECT AccountId FROM Opportunity WHERE Id = \'{recordId}\')',
          OpportunityContactRoles: 'SELECT Id, ContactId, Contact.Name, Role FROM OpportunityContactRole WHERE OpportunityId = \'{recordId}\' LIMIT {limit}',
        },
        Lead: {
          CampaignMembers: 'SELECT Id, CampaignId, Campaign.Name, Status FROM CampaignMember WHERE LeadId = \'{recordId}\' LIMIT {limit}',
        },
      };

      const queryTemplate = relationshipMappings[objectType]?.[relationship];
      if (!queryTemplate) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `Relationship '${relationship}' not supported for ${objectType}`,
                supportedRelationships: Object.keys(relationshipMappings[objectType] || {}),
              }, null, 2),
            },
          ],
        };
      }

      const soqlQuery = queryTemplate
        .replace('{recordId}', recordId)
        .replace('{limit}', limit.toString());

      const result = await connection.query(soqlQuery);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Found ${result.totalSize} related ${relationship} records`,
              data: {
                parentRecord: { objectType, recordId },
                relationship,
                totalSize: result.totalSize,
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

  async getRecordHistory(args: {
    objectType: string;
    recordId: string;
    limit?: number;
  }): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const connection = this.auth.getConnection();
      const { objectType, recordId, limit = 20 } = args;

      // Map object types to their history objects
      const historyObjectMappings: Record<string, string> = {
        Account: 'AccountHistory',
        Contact: 'ContactHistory',
        Lead: 'LeadHistory',
        Opportunity: 'OpportunityHistory',
        Case: 'CaseHistory',
      };

      const historyObject = historyObjectMappings[objectType];
      if (!historyObject) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `History tracking not available for ${objectType}`,
                supportedObjects: Object.keys(historyObjectMappings),
              }, null, 2),
            },
          ],
        };
      }

      const soqlQuery = `
        SELECT Id, Field, OldValue, NewValue, CreatedDate, CreatedById, CreatedBy.Name
        FROM ${historyObject}
        WHERE ${objectType}Id = '${recordId}'
        ORDER BY CreatedDate DESC
        LIMIT ${limit}
      `;

      const result = await connection.query(soqlQuery);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Found ${result.totalSize} history records for ${objectType}`,
              data: {
                recordId,
                objectType,
                totalSize: result.totalSize,
                historyRecords: result.records,
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
}