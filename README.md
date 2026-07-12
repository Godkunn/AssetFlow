# AssetFlow ERP

Welcome to the AssetFlow monorepo!

## Viewing the Live Prototype

The beautifully animated Vanilla JavaScript prototype has been moved to the `apps/web-prototype` folder so we can preserve it while building out the production Next.js/NestJS architecture.

**How to run it:**
Simply open the `index.html` file at the root of the repository in your browser, or run a Live Server at the root. It will automatically redirect you to `apps/web-prototype/index.html` where the live UI is fully functional!

## Monorepo Architecture

This repository is transitioning to an enterprise-grade Turborepo architecture:
- `apps/web`: The production Next.js frontend (in progress)
- `apps/api`: The secure NestJS + PostgreSQL backend (in progress)
- `apps/web-prototype`: The original, high-fidelity Vanilla JS UI prototype
- `packages/*`: Shared configurations and types