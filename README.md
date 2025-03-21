# LifeLegacy.me - Multi-Tenant Digital Estate Planning Platform

LifeLegacy.me is a conversational-first multi-tenant SaaS application for digital estate planning. The platform is designed to be white-labeled for professionals such as estate attorneys, insurance agents, and financial planners who can offer it to their clients as a value-added service.

## Key Features

- **Multi-Tenant Architecture**: Schema-based multi-tenancy with complete data isolation
- **White-Labeling Capabilities**: Custom branding, domain support, and UI customization
- **Conversational AI Interface**: AI-driven assistant guides users through the estate planning process
- **Secure Document Storage**: End-to-end encryption for sensitive documents
- **Digital Legacy Management**: Comprehensive tools for digital asset management
- **Beneficiary Management**: Tools for designating contacts and permissions
- **Client Dashboard**: Progress tracking and reporting for professionals

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React 19
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **AI Integration**: Anthropic Claude API for conversational interface

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- OpenAI API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/lifelegacy-multi-tenant.git
   cd lifelegacy-multi-tenant
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Copy `.env.example` to `.env.local` and fill in your environment variables:
   ```
   cp .env.example .env.local
   ```

4. Set up the database
   ```
   npx prisma migrate dev
   ```

5. Run the development server
   ```
   npm run dev
   ```

## Project Structure

```
lifelegacy-multi-tenant/
├── src/                        # Source files
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── auth/               # Authentication pages
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── conversation/       # Conversation interface
│   │   ├── components/         # React components
│   │   │   ├── conversation/   # Conversation components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── ui/             # UI components
│   │   ├── lib/                # Utility libraries
│   │   │   ├── ai/             # AI integration
│   │   │   ├── supabase/       # Supabase client
│   │   │   ├── store/          # State management
│   │   │   ├── utils/          # Utility functions
├── prisma/                     # Prisma schema and migrations
│   ├── schema.prisma           # Database schema
├── public/                     # Static assets
```

## Multi-Tenant Architecture

The application uses a schema-based multi-tenancy approach with these key components:

1. **Tenant Identification**: Subdomain detection via middleware
2. **Data Isolation**: Organization ID on all tables, with Row Level Security
3. **White-Labeling**: Custom CSS, branding assets, and theme settings
4. **Authentication**: Tenant-specific auth flows and permissions

## Conversational Interface

The conversational interface is the heart of the application, providing:

- Natural language onboarding
- Context-aware assistance for estate planning
- Educational guidance on legal concepts
- Progress tracking and completion suggestions

## Development Guidelines

- Follow TypeScript best practices and ensure proper typing
- Use CSS modules or Tailwind for styling
- Write unit tests for critical functionality
- Follow the conventional commits specification

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
