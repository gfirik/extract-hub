# Extract Hub

Dashboard for Extract Pipeline - Business data extraction from Gmail emails via n8n + Groq AI.

## Features

- Real-time dashboard showing extracted business data
- Sources view for incoming emails and documents
- Live updates via Supabase Realtime subscriptions
- Confidence scoring with color-coded badges

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **State**: React Query

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables in `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run development server:
```bash
bun dev
```

4. Build for production:
```bash
bun run build
```

## Database Schema

### sources
- `id` (uuid, primary key)
- `type` (text) - 'email' or 'meet_summary'
- `subject` (text)
- `raw_body` (text)
- `sender` (text)
- `received_at` (timestamptz)
- `processed_at` (timestamptz, nullable)
- `status` (text) - 'pending' | 'extracted' | 'failed'
- `created_at` (timestamptz)

### extractions
- `id` (uuid, primary key)
- `source_id` (uuid, foreign key → sources.id)
- `company_name` (text, nullable)
- `customer_name` (text, nullable)
- `price` (numeric, nullable)
- `quantity` (numeric, nullable)
- `contact_email` (text, nullable)
- `contact_phone` (text, nullable)
- `payment_method` (text, nullable)
- `delivery_type` (text, nullable)
- `raw_extraction` (jsonb, nullable)
- `confidence_score` (numeric, nullable)
- `created_at` (timestamptz)
