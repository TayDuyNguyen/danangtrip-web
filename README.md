# DaNangTrip - Tour Booking Platform

A modern Next.js web application for booking tours in Da Nang with TypeScript, Tailwind CSS, and best practices.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd danangtrip-web
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory (routes and layouts)
├── components/          # Reusable React components
│   └── ui/             # UI components (Button, Input, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Library utilities and helpers
├── services/           # API services and external integrations
├── types/              # TypeScript type definitions
├── utils/              # General utility functions
├── middleware/         # Next.js middleware
└── config/             # Configuration files

public/                 # Static files (images, icons, etc.)
```

## 📝 Available Scripts

```bash
# Development
npm run dev             # Start development server

# Production
npm run build           # Build for production
npm start              # Start production server

# Code Quality
npm run lint           # Run ESLint
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **React**: 19.2.4
- **Linting**: ESLint 9

## 📚 Usage Examples

### Using Components
```tsx
import { Button, Input } from "@/components/ui";

export default function Page() {
  return (
    <div>
      <Input label="Email" type="email" placeholder="Enter your email" />
      <Button variant="primary">Submit</Button>
    </div>
  );
}
```

### Using API Utilities
```tsx
import { get, post } from "@/utils/api";

// GET request
const { data, success } = await get("/tours");

// POST request with body
const { data, success } = await post("/tours", { name: "Beach Tour" });
```

### Using Config
```tsx
import { config, isDevelopment } from "@/config";

console.log(config.app.name);
console.log(config.api.url);
```

### Using String Utilities
```tsx
import { cn, capitalize, truncate } from "@/utils/string";

// Combine class names
const className = cn("px-4", "py-2", isActive && "bg-blue-600");

// Capitalize string
const title = capitalize("hello"); // "Hello"

// Truncate string
const shortText = truncate("This is a long text", 10); // "This is a..."
```

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Application
NEXT_PUBLIC_APP_NAME=DaNangTrip
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_BASE_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## 📖 Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```tsx
// Instead of:
import { Button } from "../../../components/ui/Button";

// Use:
import { Button } from "@/components/ui";
```

Available aliases:
- `@/*` - src directory
- `@/app/*` - app directory
- `@/components/*` - components directory
- `@/hooks/*` - hooks directory
- `@/lib/*` - lib directory
- `@/services/*` - services directory
- `@/types/*` - types directory
- `@/utils/*` - utils directory
- `@/middleware/*` - middleware directory
- `@/config/*` - config directory
- `@/public/*` - public directory

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
Create a `Dockerfile` and follow Next.js Docker deployment guide.

### Manual
```bash
npm run build
npm start
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Open a pull request

## 📄 License

This project is licensed under the MIT License.
