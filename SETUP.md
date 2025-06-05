# Complete Setup Guide

This guide will walk you through setting up the Salesforce MCP server from scratch, including Salesforce configuration and Claude Desktop integration.

## Prerequisites

- Node.js 18 or higher
- A Salesforce org (Developer Edition, Sandbox, or Production)
- Claude Desktop application
- Basic familiarity with Salesforce administration

## Part 1: Salesforce Configuration

### Step 1: Create a Connected App

1. **Log into your Salesforce org** as an administrator

2. **Navigate to Setup**
   - Click the gear icon in the top right
   - Select "Setup"

3. **Go to App Manager**
   - In the Quick Find box, search for "App Manager"
   - Click "App Manager" under Apps

4. **Create New Connected App**
   - Click "New Connected App" button
   - Fill in the basic information:
     - **Connected App Name**: `MCP Salesforce Server`
     - **API Name**: `MCP_Salesforce_Server` (auto-populated)
     - **Contact Email**: Your email address
     - **Description**: `MCP server for AI agent integration`

5. **Configure OAuth Settings**
   - Check "Enable OAuth Settings"
   - **Callback URL**: `https://localhost:3000/oauth/callback` (placeholder)
   - **Selected OAuth Scopes**: Choose based on your usage:

   **For Read-Only Mode (Recommended to start):**
   - `Manage user data via APls (api) ` - Required for read operations
   - `Perform requests at any time (refresh_token, offline_access)` - For session management

   **For Full Access (When ready for write operations):**
   - `Full access (full)` - Required for create/update/delete operations
   - `Perform requests at any time (refresh_token, offline_access)` - For session management

   > 🔒 **Security Best Practice**: Start with read-only scopes and upgrade to full access only when needed.

   - **Require Secret for Web Server Flow**: Check this box

6. **Save the Connected App**
   - Click "Save"
   - Click "Continue"

### Step 2: Get Connected App Credentials

1. **View the Connected App**
   - From App Manager, find your new app
   - Click the dropdown arrow and select "View"

2. **Note the Consumer Key and Secret**
   - **Consumer Key** = This is your `SALESFORCE_CLIENT_ID`
   - Click "Click to reveal" next to Consumer Secret
   - **Consumer Secret** = This is your `SALESFORCE_CLIENT_SECRET`

3. **Configure IP Restrictions (Optional but Recommended)**
   - Click "Edit Policies"
   - Set "IP Relaxation" to "Relax IP restrictions"
   - Or add your server's IP address to "IP Ranges"

### Step 3: Get User Security Token

1. **Go to Personal Settings**
   - Click your profile picture → Settings
   - Or search "My Personal Information" in Setup

2. **Reset Security Token**
   - In the left sidebar, click "Personal" → "Reset My Security Token"
   - Click "Reset Security Token"
   - Check your email for the new security token

3. **Save Your Credentials**
   - **Username**: Your Salesforce username
   - **Password**: Your Salesforce password
   - **Security Token**: From the email you just received

### Step 4: Test API Access (Optional)

1. **Enable API Access for Your User**
   - In Setup, search for "Permission Sets" or "Profiles"
   - Find your user's profile
   - Ensure "API Enabled" permission is checked

2. **Verify Object Permissions**
   - Check that your user has read/write access to:
     - Accounts, Contacts, Leads, Opportunities, Cases
     - Any custom objects you want to access

## Part 2: Server Setup

### Step 1: Install the MCP Server

**Option A: NPX Installation (Recommended)**

No installation required! NPX will download and run the server automatically from GitHub when configured in Claude Desktop.

```bash
npx github:tomnagengast/mcp-server-salesforce
```

**Option B: Local Development Installation**

1. **Clone and Setup Project**
   ```bash
   git clone https://github.com/tomnagengast/mcp-server-salesforce.git
   cd mcp-server-salesforce
   npm install
   npm run build
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```

3. **Edit .env File**
   ```env
   # Salesforce Configuration
   SALESFORCE_LOGIN_URL=https://login.salesforce.com
   SALESFORCE_CLIENT_ID=your_consumer_key_from_connected_app
   SALESFORCE_CLIENT_SECRET=your_consumer_secret_from_connected_app
   SALESFORCE_USERNAME=your_salesforce_username
   SALESFORCE_PASSWORD=your_salesforce_password
   SALESFORCE_SECURITY_TOKEN=your_security_token_from_email

   # For Sandbox, use:
   # SALESFORCE_LOGIN_URL=https://test.salesforce.com

   # Server Configuration
   PORT=3000
   LOG_LEVEL=info

   # Security - Server starts in READ-ONLY mode by default for safety
   SALESFORCE_READ_ONLY_MODE=true
   ```

   > 🔒 **Important**: The server starts in read-only mode by default. This allows you to safely test queries and searches without risk of modifying your Salesforce data.

### Step 2: Build and Test

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Test the Server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🔒 Salesforce MCP Server starting in READ-ONLY mode for safety
      Set SALESFORCE_READ_ONLY_MODE=false to enable write operations
   Salesforce MCP server running on stdio
   Connected to Salesforce: { id: '...', organizationId: '...', url: '...' }
   ```

## Part 3: Claude Desktop Integration

### Step 1: Locate Claude Desktop Config

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```bash
%APPDATA%/Claude/claude_desktop_config.json
```

**Linux:**
```bash
~/.config/Claude/claude_desktop_config.json
```

### Step 2: Configure MCP Server

1. **Open/Create the config file**
   ```bash
   # macOS
   nano ~/Library/Application\ Support/Claude/claude_desktop_config.json

   # Or create if it doesn't exist
   mkdir -p ~/Library/Application\ Support/Claude
   touch ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. **Add MCP Server Configuration**

   **For NPX Installation (Recommended):**
   ```json
   {
     "mcpServers": {
       "salesforce": {
         "command": "npx",
         "args": ["github:tomnagengast/mcp-server-salesforce"],
         "env": {
           "SALESFORCE_LOGIN_URL": "https://login.salesforce.com",
           "SALESFORCE_CLIENT_ID": "your_consumer_key",
           "SALESFORCE_CLIENT_SECRET": "your_consumer_secret",
           "SALESFORCE_USERNAME": "your_username",
           "SALESFORCE_PASSWORD": "your_password",
           "SALESFORCE_SECURITY_TOKEN": "your_token",
           "SALESFORCE_READ_ONLY_MODE": "true",
           "LOG_LEVEL": "info"
         }
       }
     }
   }
   ```

   **For Local Installation:**
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

   > **Note**: For NPX installation, no local path is needed. For local installation, replace `/path/to/your/mcp-server-salesforce` with the actual path to your project.

### Step 3: Alternative: Using .env File

If you prefer to keep credentials in your `.env` file:

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

This approach uses your existing `.env` file for configuration.

### Step 4: Restart Claude Desktop

1. **Quit Claude Desktop completely**
2. **Restart Claude Desktop**
3. **Verify the connection**

In a new conversation, you should be able to use Salesforce tools:

```
Can you search for accounts named "Acme"?
```

Claude should respond with Salesforce data using the MCP server.

## Part 4: Verification and Testing

### Step 1: Test Basic Functionality

Try these commands in Claude Desktop:

1. **Search for records:**
   ```
   Search for contacts with the last name "Smith"
   ```

2. **Get account details:**
   ```
   Show me details for account ID 001XXXXXXXXXX
   ```

3. **Test read operations (available in read-only mode):**
   ```
   Find all opportunities closing this quarter
   ```

4. **Test write operations (only if SALESFORCE_READ_ONLY_MODE=false):**
   ```
   Create a new contact with name "Test User" and email "test@example.com"
   ```

### Step 2: Verify Permissions

Test that the server respects your Salesforce permissions:

1. **Try accessing restricted objects** (should fail gracefully)
2. **Test field-level security** (restricted fields should be excluded)
3. **Verify CRUD permissions** (create/update/delete based on your profile)

## Security Best Practices

### 1. Scope Management

- **Start with minimal scopes** - Use `api` scope for read-only access
- **Upgrade only when needed** - Add `full` scope only for write operations
- **Regular scope audits** - Review and remove unnecessary permissions
- **Environment-specific scopes** - Use different scopes for dev vs production

### 2. Credential Management

- **Never commit credentials** to version control
- **Use environment variables** for all sensitive data
- **Regularly rotate** your security token
- **Use sandbox** for development and testing

### 3. IP Security

- **Configure IP ranges** in your Connected App for production
- **Use VPN** or fixed IP addresses when possible
- **Monitor login history** in Salesforce

### 4. Permission Management

- **Use least privilege** principle for API user
- **Create dedicated API user** for production use
- **Regular audit** of permissions and access logs

## Troubleshooting

### Common Issues

**"Authentication Failed"**
- Check username/password/security token
- Verify Connected App consumer key/secret
- Check if IP is allowlisted
- Try resetting security token

**"Permission Denied"**
- Verify user has "API Enabled" permission
- Check object-level permissions
- Verify field-level security settings
- Ensure OAuth scopes match your intended operations (api vs full)

**"Claude Desktop doesn't see the server"**
- Check file path in config is correct
- Verify JSON syntax in config file
- Restart Claude Desktop completely
- Check logs with `LOG_LEVEL=debug`

**"Module not found errors"**
- Run `npm run build` after any changes
- Verify Node.js version (18+)
- Check all dependencies installed with `npm install`

### Getting Help

1. **Check server logs** with `LOG_LEVEL=debug`
2. **Test connection directly** with `npm run dev`
3. **Verify Salesforce setup** with Workbench or API Explorer
4. **Review Claude Desktop logs** for MCP connection issues

## Enabling Write Operations

The server starts in read-only mode for safety. When you're ready to enable write operations:

### Prerequisites: Update OAuth Scopes

**Important**: If you initially set up your Connected App with read-only scopes, you'll need to update it first:

1. **Go back to your Connected App in Salesforce Setup**
2. **Click "Edit Policies"**
3. **Update Selected OAuth Scopes to include:**
   - `Full access (full)` - Required for create/update/delete operations
   - `Perform requests on your behalf at any time (refresh_token, offline_access)` - Keep this one
4. **Save the changes**
5. **Wait 2-10 minutes** for the scope changes to take effect

### Enable Write Mode

#### Option 1: Environment Variable
1. **Edit your .env file:**
   ```env
   SALESFORCE_READ_ONLY_MODE=false
   ```

2. **Restart the server:**
   ```bash
   npm run dev
   ```

#### Option 2: Claude Desktop Config
1. **Add to your config:**
   ```json
   {
     "mcpServers": {
       "salesforce": {
         "command": "node",
         "args": ["/path/to/your/mcp-server-salesforce/dist/index.js"],
         "env": {
           "SALESFORCE_READ_ONLY_MODE": "false",
           "SALESFORCE_CLIENT_ID": "your_client_id",
           // ... other credentials
         }
       }
     }
   }
   ```

2. **Restart Claude Desktop**

You'll now have access to:
- ✅ `create_record` - Create new records
- ✅ `update_record` - Update existing records
- ✅ `delete_record` - Delete records

> ⚠️ **Warning**: These operations modify your Salesforce data. Test in a sandbox first!

## Next Steps

Once setup is complete:

1. **Start with read-only operations** to explore your data
2. **Test in sandbox** before enabling write operations in production
3. **Create shortcuts** for common queries
4. **Train your team** on natural language commands
5. **Monitor usage** and API limits in Salesforce
6. **Consider custom objects** and additional integrations

Your Salesforce MCP server is now ready for safe exploration!
