# Usage Examples

This document provides practical examples of how to use the Salesforce MCP server with Claude Desktop.

## Sales Team Examples

### Pipeline Management

**Find opportunities closing this quarter:**
```
Show me all opportunities with close dates in Q1 2024 and amounts over $50,000
```

**Account research:**
```
Get details for account "Acme Corporation" including all contacts and recent opportunities
```

**Lead follow-up:**
```
Find all leads created in the last 7 days that haven't been contacted yet
```

**Create follow-up tasks:**
```
Create a task to call John Smith about the Q1 proposal, due tomorrow
```

### Account Management

**Territory analysis:**
```
Show me all accounts in California with annual revenue over $1M
```

**Contact discovery:**
```
Find all decision makers (VP or C-level titles) at our top 20 accounts
```

**Activity tracking:**
```
Show me all activities completed this week for my assigned accounts
```

## Marketing Team Examples

### Campaign Analysis

**Campaign performance:**
```
Show me ROI and conversion rates for all campaigns launched in the last quarter
```

**Lead source analysis:**
```
What's our best performing lead source by conversion rate and revenue?
```

**Lead scoring:**
```
Find all leads with scores above 80 that haven't been assigned to a sales rep
```

### Content Performance

**Campaign member engagement:**
```
Show me engagement stats for our "Digital Transformation" campaign
```

**Lead progression:**
```
Track the progression of leads from our recent webinar to opportunities
```

### Marketing Qualified Leads

**MQL handoff:**
```
Find all marketing qualified leads ready for sales handoff
```

**Nurture campaigns:**
```
Show me leads in our nurture campaigns that have engaged in the last 30 days
```

## Executive/C-Suite Examples

### Revenue Forecasting

**Pipeline analysis:**
```
What's our total pipeline value for next quarter, broken down by region?
```

**Forecast accuracy:**
```
Compare our closed won revenue this quarter vs our forecast
```

**Win rate analysis:**
```
What's our win rate by product line for the last 6 months?
```

### Performance Metrics

**Team performance:**
```
Show me top 10 sales reps by closed revenue this quarter
```

**Customer metrics:**
```
List our top 20 customers by lifetime value and their health scores
```

**Growth tracking:**
```
Compare this quarter's new customer acquisition vs last quarter
```

### Strategic Insights

**Market analysis:**
```
Show me our win/loss ratio by industry and average deal size
```

**Product performance:**
```
Which products have the highest revenue and shortest sales cycles?
```

**Geographic analysis:**
```
What's our revenue growth by region year-over-year?
```

## Technical Examples

### Advanced SOQL Queries

**Complex relationship queries:**
```
Execute this SOQL: SELECT Account.Name, (SELECT Name, Email FROM Contacts) FROM Account WHERE Industry = 'Technology' LIMIT 10
```

**Aggregate queries:**
```
Show me the average opportunity amount by stage for this year
```

**Date-based filtering:**
```
Find all cases created in the last 30 days with priority 'High' or 'Critical'
```

### Bulk Operations

**Mass updates:**
```
Update all leads from the "Trade Show 2024" campaign to status "Working"
```

**Data cleanup:**
```
Find all contacts without phone numbers in our enterprise accounts
```

### Relationship Navigation

**Account hierarchy:**
```
Show me the complete account hierarchy for "Global Corp" including all child accounts
```

**Contact roles:**
```
Find all opportunity contact roles for contacts at "Tech Solutions Inc"
```

**Activity history:**
```
Show me the complete activity history for opportunity "Enterprise Deal - Q1"
```

## Common Workflows

### New Lead Processing

1. **Lead qualification:**
   ```
   Get details for lead ID 00Q000000123456 including company info and scoring
   ```

2. **Duplicate checking:**
   ```
   Search for existing contacts or leads with email "prospect@company.com"
   ```

3. **Lead conversion:**
   ```
   Convert lead ID 00Q000000123456 to create account, contact, and opportunity
   ```

### Opportunity Management

1. **Opportunity research:**
   ```
   Get all details for opportunity "Enterprise Software Deal" including contacts and activities
   ```

2. **Competitor analysis:**
   ```
   Find all opportunities where we're competing against "Competitor X"
   ```

3. **Stage progression:**
   ```
   Update opportunity ID 006000000123456 to stage "Proposal/Price Quote"
   ```

### Customer Support

1. **Case investigation:**
   ```
   Show me all cases for account "Important Customer" in the last 6 months
   ```

2. **Escalation tracking:**
   ```
   Find all high priority cases that have been open for more than 48 hours
   ```

3. **Knowledge base:**
   ```
   Search for solutions related to "login issues" across all cases
   ```

## Data Analysis Examples

### Trend Analysis

**Monthly trends:**
```
Show me opportunity creation trends by month for the last year
```

**Seasonal patterns:**
```
Compare our Q4 performance over the last 3 years
```

### Conversion Funnels

**Lead to opportunity:**
```
Calculate our lead to opportunity conversion rate by source
```

**Opportunity to close:**
```
Show me average sales cycle length by product category
```

### Performance Dashboards

**Sales dashboard:**
```
Create a summary of key sales metrics: pipeline, closed won, win rate, average deal size
```

**Marketing dashboard:**
```
Show me campaign performance metrics: leads generated, cost per lead, conversion rates
```

## Integration Examples

### Cross-Object Analysis

**Account 360 view:**
```
Give me a complete view of "Strategic Account Inc": account details, all contacts, opportunities, cases, and recent activities
```

**Contact influence:**
```
Show me all opportunities where "John Decision Maker" is involved and their stages
```

### Activity Correlation

**Email engagement:**
```
Find accounts with high email engagement but no recent opportunities
```

**Meeting frequency:**
```
Correlate meeting frequency with opportunity close rates
```

## Tips for Effective Usage

### Best Practices

1. **Be specific with dates:**
   - "last 30 days" instead of "recently"
   - "Q1 2024" instead of "this quarter"

2. **Use proper field names:**
   - "Annual Revenue" for account revenue
   - "Close Date" for opportunity dates

3. **Specify object types:**
   - "opportunities" vs "leads" vs "contacts"
   - Include record types when relevant

4. **Combine criteria:**
   - Multiple filters for precise results
   - Use AND/OR logic clearly

### Performance Tips

1. **Limit result sets:**
   - Add "limit 20" for large queries
   - Use date ranges to narrow results

2. **Field selection:**
   - Specify needed fields for custom queries
   - Avoid retrieving unnecessary data

3. **Relationship efficiency:**
   - Be specific about relationship names
   - Use appropriate object hierarchies

### Troubleshooting

1. **Permission issues:**
   - Check if you have access to requested objects
   - Verify field-level security permissions

2. **Data not found:**
   - Confirm record IDs are correct
   - Check spelling of field and object names

3. **Query errors:**
   - Review SOQL syntax for custom queries
   - Ensure relationship names are correct

This guide helps you make the most of your Salesforce MCP server integration with Claude Desktop!