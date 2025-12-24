# Overview

Foundry Online is an AI-first online micro-school platform designed for teacher-operators to launch and manage virtual educational experiences. The platform provides a complete SaaS solution featuring Stripe Connect for payment processing, virtual classrooms, instructor management tools, parent portals, and AI-powered learning experiences. The system emphasizes Stripe-grade minimalism with a calm, professional design aesthetic focused on educational institutions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client application is built with React and Vite, using a modern component-based architecture with TypeScript. The UI follows a design system based on shadcn/ui components with custom Tailwind CSS theming. The application uses Wouter for client-side routing and TanStack Query for state management and API communication.

**Key Design Decisions:**
- **Component Library**: Custom implementation of shadcn/ui components for consistency
- **Styling**: Tailwind CSS with custom design tokens for calm minimalism
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider supporting light/dark/system themes

## Backend Architecture
The server uses a hybrid approach combining Express.js for the main application server and NestJS for the API layer. The system is designed as a monorepo using Turborepo for build orchestration and PNPM for package management.

**Key Architectural Components:**
- **API Layer**: NestJS with TypeScript providing REST endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Clerk integration for passwordless authentication with parent-learner linkage
- **Payment Processing**: Stripe Connect for operator onboarding and payment routing
- **File Storage**: S3/MinIO integration for recordings and document storage

**API Design Patterns:**
- RESTful endpoints with consistent error handling
- Controller-based routing with dependency injection
- Service layer separation for business logic
- Middleware for authentication and request logging

## Data Layer
The system uses PostgreSQL as the primary database with Drizzle ORM providing type-safe database operations and migrations. The schema supports multi-tenancy through organization-based data isolation.

**Core Entity Relationships:**
- Organizations contain courses, cohorts, and sessions
- Users have roles (operator, instructor, parent, learner) with appropriate permissions
- Payment data is linked to organizations via Stripe Connect accounts
- Session data includes attendance tracking and recording management

## Authentication & Authorization
Authentication is handled through Clerk with a custom auth guard that supports both JWT verification and header-based role assignment for development. The system implements role-based access control with distinct user types.

**User Roles:**
- **Operators**: Full administrative access, financial management
- **Instructors**: Session management, student interaction, content delivery
- **Parents**: Child monitoring, payment management, communication
- **Learners**: Content access, assignment submission, progress tracking

# External Dependencies

## Payment Processing
- **Stripe Connect**: Express accounts for operator onboarding and payment routing
- **Stripe Billing**: Subscription management for platform fees ($199/month floor)
- **Stripe Checkout**: Payment session creation for tuition and fees

## Communication & Video
- **Daily.co**: Video conferencing and virtual classroom functionality
- **Clerk**: Authentication and user management service
- **SendGrid**: Email delivery for notifications and weekly recaps

## Storage & Infrastructure
- **S3/MinIO**: Object storage for recordings, PDFs, and user uploads
- **PostgreSQL**: Primary database with connection pooling via Neon
- **Redis**: Session storage and caching (configured but not actively used)

## Development Tools
- **Turborepo**: Monorepo build system and task runner
- **Drizzle**: Type-safe ORM with migration support
- **Vite**: Frontend build tool with React support
- **PNPM**: Package manager with workspace support

## AI Integration
The system includes a modular AI router interface supporting multiple providers:
- **Anthropic Claude**: Primary tutoring and explanation generation
- **OpenAI**: Reasoning and grading capabilities
- **Google Gemini**: Slides and forms generation when workspace integration is enabled
- **Together/Groq**: Open-source model fallback options

The AI system is designed with confidence scoring and human-in-the-loop workflows where AI provides first-pass results that educators can approve, modify, or override.