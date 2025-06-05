# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Salesforce MCP (Model Context Protocol) server that enables AI agents to interact with Salesforce CRM data. The server provides tools for searching, creating, updating, and managing Salesforce records including Accounts, Contacts, Leads, Opportunities, and Cases.

## Common Development Commands

### Building and Running
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Start development server with hot reload using tsx
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Testing
- `npm test` - Run Jest tests (when implemented)

## Architecture

### Core Components

**Authentication (`src/auth/`)**
- `SalesforceAuth` class handles OAuth 2.0 connection management
- Uses jsforce library for Salesforce API integration
- Supports automatic token refresh and session management

**Tools (`src/tools/`)**
- `SearchTools` - SOQL queries, record search, global search
- `CrudTools` - Create, read, update, delete operations
- `RelationshipTools` - Related record navigation and field history

**Server (`src/index.ts`)**
- Main MCP server implementation using `@modelcontextprotocol/sdk`
- Registers all tools and handles MCP protocol communication
- Runs on stdio transport for MCP client integration

### Key Libraries
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `jsforce` - Salesforce API client library
- `dotenv` - Environment variable management

### Configuration
- Environment variables managed through `.env` file
- Configuration helper in `src/utils/config.ts`
- Supports both production and sandbox Salesforce environments

### Error Handling
- Comprehensive error handling with `src/utils/error-handler.ts`
- Structured logging with `src/utils/logger.ts`
- SOQL injection prevention and input sanitization

## Environment Setup

Copy `.env.example` to `.env` and configure:
- Salesforce Connected App credentials
- User authentication details
- Optional sandbox configuration

## Important Notes

- Always run `npm run build` after TypeScript changes
- Server connects to Salesforce on first tool request
- All operations respect Salesforce user permissions and field-level security
- Uses MCP stdio transport - designed to be called by MCP clients, not directly accessed via HTTP