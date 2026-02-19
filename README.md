# Extract Hub

A real-time dashboard for viewing business data extracted from Gmail emails via n8n + Groq AI.

## Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL + Realtime)
- **Automation:** n8n + Groq AI

## Quick Start

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
bun dev
```

## Environment Variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

### sources
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| type | text | 'email' or 'meet_summary' |
| subject | text | Email subject |
| raw_body | text | Full email content |
| sender | text | Sender email address |
| received_at | timestamptz | When email was received |
| processed_at | timestamptz | When extraction completed |
| status | text | 'pending', 'extracted', 'failed' |
| created_at | timestamptz | Record creation time |

### extractions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| source_id | uuid | FK to sources.id |
| company_name | text | Extracted company |
| customer_name | text | Extracted customer |
| price | numeric | Extracted price |
| quantity | numeric | Extracted quantity |
| contact_email | text | Extracted contact |
| contact_phone | text | Extracted phone |
| payment_method | text | Payment type |
| delivery_type | text | Delivery method |
| raw_extraction | jsonb | Full AI response |
| confidence_score | numeric | 0-1 confidence |
| created_at | timestamptz | Record creation time |

## n8n Workflow

The n8n workflow JSON is stored in `/workflows`. To set up:

1. Import `workflows/extract-pipeline.json` into your n8n instance
2. Configure Gmail credentials
3. Configure Supabase credentials
4. Activate the workflow

## Project Structure

```
src/
├── components/     # UI components
├── lib/
│   ├── supabase.ts # Supabase client
│   ├── queries.ts  # Data fetching functions
│   └── types.ts    # TypeScript interfaces
├── pages/
│   ├── Index.tsx   # Dashboard page
│   └── Sources.tsx # Sources page
workflows/
└── extract-pipeline.json  # n8n workflow
```

## Scripts

```bash
bun dev       # Start dev server
bun build     # Production build
bun preview   # Preview production build
bun test      # Run tests
bun lint      # Lint code
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

The `vercel.json` is pre-configured for SPA routing.
