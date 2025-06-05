# Salesforce MCP Server

A Model Context Protocol (MCP) server that provides AI agents with secure access to Salesforce data and operations. Built for sales, marketing, and executive teams to interact with their Salesforce CRM through natural language.

## Features

### Core Capabilities
- **Search & Query**: Search records across multiple objects, execute SOQL queries, and perform global searches
- **CRUD Operations**: Create, read, update, and delete records with proper validation
- **Relationship Navigation**: Access related records and view field history
- **Secure Authentication**: OAuth 2.0 integration with proper token management
- **Error Handling**: Comprehensive error handling with detailed feedback

### Supported Salesforce Objects
- **Accounts**: Company and organization records
- **Contacts**: Individual contact information
- **Leads**: Prospective customer records
- **Opportunities**: Sales pipeline and deals
- **Cases**: Customer service and support tickets
- **Activities**: Tasks and events

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mcp-server-salesforce
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Salesforce credentials
```

4. Build the project:
```bash
npm run build
```

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
```

### Salesforce Setup

1. **Create a Connected App** in Salesforce:
   - Go to Setup → App Manager → New Connected App
   - Enable OAuth Settings
   - Add required OAuth scopes: `full`, `refresh_token`
   - Note the Client ID and Client Secret

2. **Get Security Token**:
   - Go to Personal Settings → Reset My Security Token
   - Check your email for the security token

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

#### CRUD Tools

**get_record** - Retrieve a specific record
```json
{
  "objectType": "Account",
  "recordId": "001XXXXXXXXXX",
  "fields": ["Name", "Type", "Industry"]
}
```

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

#### Relationship Tools

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

## Use Cases

### Sales Team
- **Pipeline Management**: "Show me all opportunities closing this quarter"
- **Account Research**: "Find all contacts at Acme Corp with their recent activities"
- **Lead Follow-up**: "Create tasks for all leads from yesterday's trade show"

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