<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## DaNangTrip Project Configuration

### Project Overview
- **Name**: DaNangTrip - Tour Booking Platform
- **Framework**: Next.js 16.2.3 with TypeScript
- **Styling**: Tailwind CSS 4
- **React Version**: 19.2.4

### Project Structure
- **src/app/** - Next.js app directory (routes and pages)
- **src/components/ui/** - Reusable UI components (Button, Input, etc.)
- **src/config/** - Configuration files (app, API URLs)
- **src/utils/** - Utility functions (string helpers, API calls)
- **src/types/** - TypeScript type definitions
- **src/services/** - API services (to be created)
- **src/hooks/** - Custom React hooks (to be created)
- **src/lib/** - Library helpers (to be created)
- **src/middleware/** - Next.js middleware (to be created)

### Key Utilities
1. **src/utils/string.ts** - String manipulation utilities
   - `cn()` - Combines class names
   - `capitalize()` - Capitalizes first letter
   - `truncate()` - Truncates string with suffix
   - `isEmpty()` - Checks if value is empty

2. **src/utils/api.ts** - API call utilities
   - `apiCall()` - Generic API call function
   - `get()`, `post()`, `put()`, `patch()`, `del()` - HTTP methods
   - Automatic error handling and JSON parsing

3. **src/config/index.ts** - Configuration
   - Centralized config from environment variables
   - `isDevelopment`, `isProduction`, `isTest` helpers

### Path Aliases
- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/utils/*` → `src/utils/*`
- `@/config/*` → `src/config/*`
- And more - see tsconfig.json

### UI Components
- **Button.tsx** - Button component with variants (primary, secondary, danger) and sizes (sm, md, lg)
- **Input.tsx** - Input component with label, error, and helper text support

### Environment Variables
- Located in `.env.local` and `.env.example`
- Key vars: `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_API_URL`, `NODE_ENV`

### Next.js Configuration (next.config.ts)
- React Strict Mode enabled
- Image optimization configured
- Security headers set (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Powered-by header disabled

### Common Tasks
1. Add new page: Create file in `src/app/`
2. Create component: Add to `src/components/`
3. Make API call: Use utilities from `src/utils/api.ts`
4. Add type: Define in `src/types/`
5. Add constant: Add to `src/config/`

