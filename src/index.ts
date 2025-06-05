#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  CallToolRequest,
  ListToolsRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { SalesforceAuth } from './auth/salesforce-auth.js';
import { SearchTools } from './tools/search-tools.js';
import { CrudTools } from './tools/crud-tools.js';
import { RelationshipTools } from './tools/relationship-tools.js';

class SalesforceServer {
  private server: Server;
  private salesforceAuth: SalesforceAuth;
  private searchTools: SearchTools;
  private crudTools: CrudTools;
  private relationshipTools: RelationshipTools;

  constructor() {
    this.server = new Server(
      {
        name: 'salesforce-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.salesforceAuth = new SalesforceAuth();
    this.searchTools = new SearchTools(this.salesforceAuth);
    this.crudTools = new CrudTools(this.salesforceAuth);
    this.relationshipTools = new RelationshipTools(this.salesforceAuth);

    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Search Tools
          {
            name: 'search_records',
            description: 'Search for Salesforce records across multiple objects',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query string' },
                objects: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Object types to search (e.g., Account, Contact, Lead)',
                },
                limit: { type: 'number', description: 'Maximum number of records to return', default: 20 },
              },
              required: ['query'],
            },
          },
          {
            name: 'soql_query',
            description: 'Execute a SOQL query against Salesforce',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'SOQL query string' },
              },
              required: ['query'],
            },
          },
          {
            name: 'global_search',
            description: 'Perform a global search across all Salesforce objects',
            inputSchema: {
              type: 'object',
              properties: {
                searchTerm: { type: 'string', description: 'Term to search for' },
                limit: { type: 'number', description: 'Maximum number of records to return', default: 20 },
              },
              required: ['searchTerm'],
            },
          },
          // CRUD Tools
          {
            name: 'get_record',
            description: 'Retrieve a specific Salesforce record by ID',
            inputSchema: {
              type: 'object',
              properties: {
                objectType: { type: 'string', description: 'Salesforce object type (e.g., Account, Contact)' },
                recordId: { type: 'string', description: 'Salesforce record ID' },
                fields: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Fields to retrieve (optional, defaults to common fields)',
                },
              },
              required: ['objectType', 'recordId'],
            },
          },
          {
            name: 'create_record',
            description: 'Create a new Salesforce record',
            inputSchema: {
              type: 'object',
              properties: {
                objectType: { type: 'string', description: 'Salesforce object type (e.g., Account, Contact)' },
                data: { type: 'object', description: 'Record data as key-value pairs' },
              },
              required: ['objectType', 'data'],
            },
          },
          {
            name: 'update_record',
            description: 'Update an existing Salesforce record',
            inputSchema: {
              type: 'object',
              properties: {
                objectType: { type: 'string', description: 'Salesforce object type (e.g., Account, Contact)' },
                recordId: { type: 'string', description: 'Salesforce record ID' },
                data: { type: 'object', description: 'Updated record data as key-value pairs' },
              },
              required: ['objectType', 'recordId', 'data'],
            },
          },
          {
            name: 'delete_record',
            description: 'Delete a Salesforce record',
            inputSchema: {
              type: 'object',
              properties: {
                objectType: { type: 'string', description: 'Salesforce object type (e.g., Account, Contact)' },
                recordId: { type: 'string', description: 'Salesforce record ID' },
              },
              required: ['objectType', 'recordId'],
            },
          },
          // Relationship Tools
          {
            name: 'get_related_records',
            description: 'Get records related to a specific record',
            inputSchema: {
              type: 'object',
              properties: {
                objectType: { type: 'string', description: 'Parent object type' },
                recordId: { type: 'string', description: 'Parent record ID' },
                relationship: { type: 'string', description: 'Relationship name (e.g., Contacts, Opportunities)' },
                limit: { type: 'number', description: 'Maximum number of records to return', default: 20 },
              },
              required: ['objectType', 'recordId', 'relationship'],
            },
          },
          {
            name: 'get_record_history',
            description: 'Get the field history for a record',
            inputSchema: {
              type: 'object',
              properties: {
                objectType: { type: 'string', description: 'Object type' },
                recordId: { type: 'string', description: 'Record ID' },
                limit: { type: 'number', description: 'Maximum number of history records', default: 20 },
              },
              required: ['objectType', 'recordId'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      try {
        // Ensure connection before handling any tool requests
        if (!this.salesforceAuth.isConnected()) {
          await this.salesforceAuth.connect();
        }

        const { name, arguments: args } = request.params;

        if (!args) {
          throw new Error('Missing required arguments');
        }

        switch (name) {
          case 'search_records':
            return await this.searchTools.searchRecords(args as any);
          case 'soql_query':
            return await this.searchTools.soqlQuery(args as any);
          case 'global_search':
            return await this.searchTools.globalSearch(args as any);
          case 'get_record':
            return await this.crudTools.getRecord(args as any);
          case 'create_record':
            return await this.crudTools.createRecord(args as any);
          case 'update_record':
            return await this.crudTools.updateRecord(args as any);
          case 'delete_record':
            return await this.crudTools.deleteRecord(args as any);
          case 'get_related_records':
            return await this.relationshipTools.getRelatedRecords(args as any);
          case 'get_record_history':
            return await this.relationshipTools.getRecordHistory(args as any);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Salesforce MCP server running on stdio');
  }
}

const server = new SalesforceServer();
server.run().catch(console.error);