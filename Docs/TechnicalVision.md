# Technical Vision & System Philosophy

Our architectural choices are driven by reliability, performance, data security, and maintainability. We build modular, well-tested workspaces that scale with zero infrastructure debt.

## Core Technical Stack

| Area | Technologies | Rationale |
|---|---|---|
| **Frontend** | React (Vite), Next.js, Framer Motion | Fast rendering, modular UI compilation, robust animations |
| **State** | Zustand (Zustand Store) | Lightweight store management with minimal boilerplate |
| **Backend** | Node.js, Express, Python | Fast REST API routing and mature math parsing ecosystems |
| **Database** | Supabase (PostgreSQL + Auth) | Cryptographically secure auth, robust JSON indexing |
| **Compute** | AWS Nitro Enclaves, Intel SGX | Hardware-enforced isolation of memory |

## Development Guidelines
- **Strict Coordinate Validation:** All SVG visualization files must check coordinates (`!== undefined` and `!isNaN(...)`) before rendering, preventing console rendering errors.
- **Self-Documenting Schema:** Backend models enforce strict Zod validations.
