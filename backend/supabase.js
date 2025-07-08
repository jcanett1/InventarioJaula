```javascript
// Supabase client initialization
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase project URL and anon key
const supabaseUrl = 'https://lwdapqzcrezgfkhgftac.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZGFwcXpjcmV6Z2ZraGdmdGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTg0MzYsImV4cCI6MjA2NzQ5NDQzNn0.7X8mYgIVUTvaQXS5UE2gdlogolPQQmcOqzgaVemCI7k' // Replace with actual anon key

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
