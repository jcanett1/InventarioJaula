# Inventory Management System

This project is a web-based inventory management system for tracking accessories and deliveries.

## Project Structure

- `frontend/`: Contains the client-side code (HTML, CSS, JavaScript)
- `backend/`: Contains the server-side code and database schema

## Getting Started

1. Set up the backend by following instructions in `backend/README.md`
2. Deploy the frontend by following instructions in `frontend/README.md`

# Changes to Project Structure

1. Create the root structure and README.md:

```markdown
# Inventory Management System

This project is a web-based inventory management system for tracking accessories and deliveries.

## Project Structure

- `frontend/`: Contains the client-side code (HTML, CSS, JavaScript)
- `backend/`: Contains the server-side code and database schema

## Getting Started

1. Set up the backend by following instructions in `backend/README.md`
2. Deploy the frontend by following instructions in `frontend/README.md`
```

2. Create frontend/README.md:

```markdown
# Frontend Documentation

This directory contains all client-side code for the Inventory Management System.

## Contents
- HTML files for user interface
- CSS stylesheets
- JavaScript for client-side functionality

## Deployment

### Deploying via GitHub Pages

1. Go to your GitHub repository settings
2. Scroll down to the GitHub Pages section
3. Select the branch you want to deploy (usually main or master)
4. Select the `/frontend` folder as the source
5. Click Save

Your site will be published at https://yourusername.github.io/your-repo-name/

## Usage
Open index.html in your browser to access the application after deployment.
```

3. Create backend/supabase.js:

```javascript
// Supabase client initialization
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase project URL and anon key
const supabaseUrl = 'https://lwdapqzcrezgfkhgftac.supabase.co'
const supabaseAnonKey = 'YOUR_ANON_KEY' // Replace with actual anon key

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

4. Create backend/schema.sql:

```sql
-- Create inventory_entries table for tracking items coming into inventory
CREATE TABLE inventory_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_received TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    supplier TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_exits table for tracking items leaving inventory
CREATE TABLE stock_exits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_exited TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    inventory_entry_id UUID REFERENCES inventory_entries(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    recipient TEXT NOT NULL,
    purpose TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. Create backend/README.md:

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
