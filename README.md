# ⚠️ This Repository is Archived

This template has been **deprecated** and is no longer maintained.

## 🎯 Use the New Template Instead

**👉 [Next.js + NestJS Monorepo Template](https://github.com/Shironex/next-js-nest-js-template)**

The new template is a complete rewrite with significantly more features and better architecture:

### Why Migrate?

The new template offers everything this one had, plus:

- ✅ **Full-Stack TypeScript** - Next.js 15 frontend + NestJS 11 backend
- ✅ **615 Tests Passing** - Comprehensive test coverage
- ✅ **Enterprise Authentication** - Complete auth system with email verification, password reset, rate limiting, and bot protection
- ✅ **Stripe Integration** - Full subscription and payment handling
- ✅ **Modern UI** - Built with shadcn/ui and Tailwind CSS v4
- ✅ **Production Ready** - Security headers, CORS, Winston logging, error handling
- ✅ **Monorepo Architecture** - Turborepo with shared packages
- ✅ **Email System** - React Email templates with Nodemailer
- ✅ **Database** - PostgreSQL with Prisma ORM
- ✅ **Redis** - Session management and rate limiting
- ✅ **File Uploads** - AWS S3 integration

### Quick Start with New Template

```bash
# Clone the new template
git clone https://github.com/Shironex/next-js-nest-js-template.git
cd next-js-nest-js-template

# Install dependencies
pnpm install

# Start development services
docker-compose up -d

# Run migrations
pnpm --filter=api db:migrate

# Start development
pnpm dev
```

## 📚 Documentation

Full documentation is available in the new repository:
- **[Main README](https://github.com/Shironex/next-js-nest-js-template#readme)** - Complete setup guide
- **[ROADMAP](https://github.com/Shironex/next-js-nest-js-template/blob/master/ROADMAP.md)** - Future features
- **[CLAUDE](https://github.com/Shironex/next-js-nest-js-template/blob/master/CLAUDE.md)** - Development guidelines

---

**This repository will remain available for reference but will not receive updates.**

For new projects, please use: **[next-js-nest-js-template](https://github.com/Shironex/next-js-nest-js-template)**
