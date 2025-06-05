# Salesforce MCP Server

A Model Context Protocol (MCP) server that provides AI agents with secure access to Salesforce data and operations. Built for sales, marketing, and executive teams to interact with their Salesforce CRM through natural language.

## Features

### Core Capabilities
- **🔍 Search & Query**: Search records across multiple objects, execute SOQL queries, and perform global searches
- **📖 Read Operations**: Retrieve specific records and navigate relationships 
- **🔒 Security-First**: Starts in read-only mode by default for safe testing
- **🔐 Secure Authentication**: OAuth 2.0 integration with proper token management
- **⚡ Error Handling**: Comprehensive error handling with detailed feedback

### Safety Features
- **Read-Only by Default**: Server starts in safe read-only mode
- **Configurable Write Access**: Enable write operations only when ready with `SALESFORCE_READ_ONLY_MODE=false`
- **Clear Operation Indicators**: Write tools clearly marked in descriptions

### Supported Salesforce Objects
- **Accounts**: Company and organization records
- **Contacts**: Individual contact information
- **Leads**: Prospective customer records
- **Opportunities**: Sales pipeline and deals
- **Cases**: Customer service and support tickets
- **Activities**: Tasks and events

## Quick Start

**🚀 For complete setup instructions, see [SETUP.md](./SETUP.md)**

This includes:
- Salesforce Connected App configuration
- Claude Desktop integration
- Step-by-step screenshots and troubleshooting

### Installation Options

**Option 1: NPX from GitHub**
```bash
npx github:tomnagengast/mcp-server-salesforce
```

**Option 2: Clone and Build**
```bash
git clone https://github.com/tomnagengast/mcp-server-salesforce.git
cd mcp-server-salesforce
npm install
npm run build
```

**Configuration:** See [SETUP.md](./SETUP.md) for complete setup instructions including Salesforce Connected App configuration.

## Configuration

### Environment Variables

Create a `.env` file with the following configuration:

```env
# Salesforce Configuration
SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=your_connected_app_client_id
SALESFORCE_CLIENT_SECRET=your_connected_app_client_secret
SALESFORCE_USERNAME=your_salesforce_username
SALESFORCE_PASSWORD=your_salesforce_password
SALESFORCE_SECURITY_TOKEN=your_security_token

# For Sandbox (optional)
# SALESFORCE_LOGIN_URL=https://test.salesforce.com

# Server Configuration
PORT=3000
LOG_LEVEL=info

# Security - Server starts in READ-ONLY mode by default
SALESFORCE_READ_ONLY_MODE=true
```

> 🔒 **Security Note**: The server starts in read-only mode by default. Set `SALESFORCE_READ_ONLY_MODE=false` only when you're comfortable with write operations.

## Claude Desktop Integration

Add this to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

**For NPX installation:**
```json
{
  "mcpServers": {
    "salesforce": {
      "command": "npx",
      "args": ["github:tomnagengast/mcp-server-salesforce"],
      "env": {
        "SALESFORCE_CLIENT_ID": "your_client_id",
        "SALESFORCE_CLIENT_SECRET": "your_client_secret",
        "SALESFORCE_USERNAME": "your_username", 
        "SALESFORCE_PASSWORD": "your_password",
        "SALESFORCE_SECURITY_TOKEN": "your_token",
        "SALESFORCE_READ_ONLY_MODE": "true"
      }
    }
  }
}
```

**For local installation:**
```json
{
  "mcpServers": {
    "salesforce": {
      "command": "node",
      "args": ["/path/to/your/mcp-server-salesforce/dist/index.js"],
      "cwd": "/path/to/your/mcp-server-salesforce"
    }
  }
}
```

**See [SETUP.md](./SETUP.md) for complete integration instructions.**

## Usage

### Running the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run start
```

### Available Tools

#### Search Tools

**search_records** - Search across multiple Salesforce objects
```json
{
  "query": "Acme Corp",
  "objects": ["Account", "Contact", "Lead"],
  "limit": 20
}
```

**soql_query** - Execute custom SOQL queries
```json
{
  "query": "SELECT Id, Name, Email FROM Contact WHERE Account.Name = 'Acme Corp'"
}
```

**global_search** - Global search across all objects
```json
{
  "searchTerm": "john@example.com",
  "limit": 20
}
```

#### Read Operations (Always Available)

**get_record** - Retrieve a specific record
```json
{
  "objectType": "Account",
  "recordId": "001XXXXXXXXXX",
  "fields": ["Name", "Type", "Industry"]
}
```

**get_related_records** - Get related records
```json
{
  "objectType": "Account",
  "recordId": "001XXXXXXXXXX",
  "relationship": "Contacts",
  "limit": 20
}
```

**get_record_history** - View field history
```json
{
  "objectType": "Opportunity",
  "recordId": "006XXXXXXXXXX",
  "limit": 20
}
```

#### Write Operations (Requires SALESFORCE_READ_ONLY_MODE=false)

> ⚠️ **These operations modify your Salesforce data. Only enable when you're comfortable with the server's behavior.**

**create_record** - Create a new record
```json
{
  "objectType": "Contact",
  "data": {
    "FirstName": "John",
    "LastName": "Doe",
    "Email": "john@example.com"
  }
}
```

**update_record** - Update an existing record
```json
{
  "objectType": "Account",
  "recordId": "001XXXXXXXXXX",
  "data": {
    "Phone": "+1-555-0123"
  }
}
```

**delete_record** - Delete a record
```json
{
  "objectType": "Lead",
  "recordId": "00QXXXXXXXXXX"
}
```

## Enabling Write Operations

When you're ready to enable write operations:

1. **Update environment:**
   ```bash
   # In your .env file
   SALESFORCE_READ_ONLY_MODE=false
   ```

2. **Or in Claude Desktop config:**
   ```json
   {
     "mcpServers": {
       "salesforce": {
         "command": "node",
         "args": ["/path/to/your/mcp-server-salesforce/dist/index.js"],
         "env": {
           "SALESFORCE_READ_ONLY_MODE": "false",
           // ... other env vars
         }
       }
     }
   }
   ```

3. **Restart the server** and Claude Desktop

## Use Cases

### Sales Team
- **Pipeline Management**: "Show me all opportunities closing this quarter"
- **Account Research**: "Find all contacts at Acme Corp with their recent activities"
- **Lead Follow-up**: "Find all leads from yesterday's trade show" (read-only) or "Create tasks for all leads from yesterday's trade show" (write mode)

### Marketing Team
- **Campaign Analysis**: "Show ROI for Q4 digital campaigns"
- **Lead Scoring**: "Find high-score leads that haven't been contacted"
- **Content Performance**: "Which campaigns generated the most qualified leads?"

### Executive Team
- **Revenue Forecasting**: "What's our pipeline by region for next quarter?"
- **Performance Metrics**: "Show top performers by closed revenue this month"
- **Customer Health**: "List top 20 accounts and their recent engagement"

## Development

### Scripts

```bash
npm run build      # Build TypeScript
npm run dev        # Development with hot reload
npm run start      # Start production server
npm run lint       # Run ESLint
npm run test       # Run tests (when implemented)
```

### Project Structure

```
src/
├── auth/              # Salesforce authentication
├── tools/             # MCP tool implementations
│   ├── search-tools.ts    # Search and query tools
│   ├── crud-tools.ts      # CRUD operations
│   └── relationship-tools.ts # Relationship navigation
├── types/             # TypeScript type definitions
├── utils/             # Utilities and helpers
│   ├── config.ts          # Configuration management
│   ├── logger.ts          # Logging utilities
│   └── error-handler.ts   # Error handling
└── index.ts           # Main server entry point
```

## Security

- **OAuth 2.0**: Secure authentication with Salesforce
- **Permission Respect**: All operations respect Salesforce user permissions
- **Input Validation**: SOQL injection prevention and input sanitization
- **Error Handling**: Secure error messages without sensitive data exposure

## Troubleshooting

### Common Issues

**Authentication Failed**
- Verify your Salesforce credentials
- Check if your IP is allowlisted in Salesforce
- Ensure the security token is current

**Permission Denied**
- Verify user has appropriate object permissions
- Check field-level security settings
- Ensure profile has API access enabled

**API Limits**
- Monitor API usage in Salesforce Setup
- Implement rate limiting if needed
- Consider using bulk operations for large datasets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.