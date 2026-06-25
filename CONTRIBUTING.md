# Contributing to Clampbox & Graphxy Labs

Thank you for your interest in contributing to Clampbox! This guide explains how to contribute code, report bugs, and propose improvements.

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Development Workflow](#2-development-workflow)
3. [Code Standards](#3-code-standards)
4. [Commit Messages](#4-commit-messages)
5. [Pull Request Process](#5-pull-request-process)
6. [Reporting Issues](#6-reporting-issues)

---

## 1. Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/Graphxy.git
   ```
3. Set up your local environment following [docs/development/SETUP.md](./docs/development/SETUP.md)
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 2. Development Workflow

```bash
# Start the full dev stack
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Or run bare metal
npm run dev:backend   # Backend on :5000
npm run dev:frontend  # Frontend on :5173
```

See [docs/development/SETUP.md](./docs/development/SETUP.md) for complete setup instructions.

---

## 3. Code Standards

- **Frontend:** Follow React best practices, use functional components and hooks
- **Backend:** All database operations must be wrapped in `try/catch` blocks
- **Database:** Always use `resolveOrganizationId` for UUID resolution — never pass static string literals to UUID columns
- **Security:** Never log or return raw secrets, provider keys, or PII from API responses
- **Styles:** Use Tailwind CSS utility classes; custom tokens are defined in `frontend/tailwind.config.js`

---

## 4. Commit Messages

Use conventional commit format:

```
type(scope): short description

Examples:
feat(dashboard): add getting started checklist card
fix(vault): handle encryption key rotation edge case
docs(api): update gateway key endpoint examples
chore(deps): bump express from 4.18 to 4.21
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 5. Pull Request Process

1. Ensure your code runs without errors locally
2. Run lint checks: `npm run lint`
3. Write clear PR descriptions explaining what changed and why
4. Link any related issues
5. Wait for review — maintainers will provide feedback within 48 hours

---

## 6. Reporting Issues

Open a GitHub Issue with:
- **Title:** Clear, specific description of the problem
- **Environment:** OS, Node version, Docker version
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Relevant logs** (sanitized — remove any secrets or credentials)
