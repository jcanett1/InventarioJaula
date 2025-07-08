```markdown
# Backend Documentation

This directory contains server-side code and database schema for the Inventory Management System.

## Setup Instructions

### Configuring Supabase

1. Log in to the Supabase dashboard at https://app.supabase.io/
2. Navigate to your project: https://lwdapqzcrezgfkhgftac.supabase.co
3. Find your anon key in Project Settings > API

### Database Setup

1. Go to the SQL Editor in your Supabase dashboard
2. Open the `schema.sql` file from this directory
3. Copy the contents into the SQL Editor
4. Click "Run" to execute the SQL commands and create the necessary tables

### JavaScript Integration

1. Open `supabase.js`
2. Replace 'YOUR_ANON_KEY' with your actual anon key from your Supabase project
3. Import this file in your frontend code to use the Supabase client

## Database Schema

The database consists of two main tables:
- `inventory_entries`: Records items entering inventory
- `stock_exits`: Records items leaving inventory

See `schema.sql` for complete table definitions.
```
