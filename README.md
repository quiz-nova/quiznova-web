# QuizNova Web

[![Live Demo](https://img.shields.io/badge/Live_Demo-quiznova.dev-00b4d8?style=for-the-badge&logo=googlechrome&logoColor=white)](https://quiznova.dev)

> **Live Application:** [https://quiznova.dev](https://quiznova.dev) *(GitHub Pages: [https://moamenelbarqy.github.io/quiz-nova/](https://moamenelbarqy.github.io/quiz-nova/))*

The modern, responsive web application for the **QuizNova** platform, built with **Angular 21**, **PrimeNG**, and **Vite**.

---

## Tech Stack

* **Framework:** Angular 21 (Standalone Components, Signals, Reactive Forms, Control Flow)
* **State Management:** `@ngrx/signals`
* **UI Components & Styling:** PrimeNG 21, PrimeIcons, CSS Logical Properties (LTR / RTL support)
* **Real-time Communication:** `@microsoft/signalr`
* **Internationalization:** `@ngx-translate/core`
* **Unit Testing:** Vitest & `@testing-library/angular` with V8 Code Coverage
* **E2E & Accessibility Testing:** Playwright & `@axe-core/playwright`
* **Linting & Formatting:** ESLint (angular-eslint), Stylelint, Prettier, Husky + lint-staged
* **Containerization & Hosting:** Docker, Nginx, GitHub Pages

---

## Project Structure

```text
quiznova-web/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Build, Lint, Test & Coverage Quality Gates
│       └── deploy-gh-pages.yml    # Continuous Deployment to GitHub Pages
├── e2e/                           # Playwright E2E and Accessibility tests
├── nginx/                         # Nginx production configuration
├── public/                        # Static public assets
├── src/
│   ├── app/                       # Angular components, services, and state
│   ├── assets/                    # Application icons, images, translations
│   ├── environments/              # Environment configurations (dev/prod)
│   ├── main.ts                    # Application bootstrap
│   └── styles.css                 # Global styles and theme overrides
├── angular.json                   # Angular workspace configuration
├── Dockerfile                     # Multi-stage production build (Node -> Nginx)
├── Dockerfile.dev                 # Local containerized development
├── compose.yaml                   # Docker Compose setup
├── package.json                   # Dependencies and scripts
├── proxy.conf.json                # API proxy for local development
└── vitest.config.ts               # Vitest test runner configuration
```

---

## Getting Started

### Prerequisites

* **Node.js**: `v22.x` or later
* **npm**: `v10.x` or later

### Installation

```bash
npm install
```

### Local Development Server

Run the development server with proxying enabled:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload when you modify any source files.
API requests to `/api/*` and WebSocket connections to `/chat` will be proxied to the backend at `http://localhost:8080` (configured in `proxy.conf.json`).

---

## Scripts & Quality Checks

| Command | Description |
| :--- | :--- |
| `npm start` | Runs the Angular development server on `http://localhost:4200` |
| `npm run build` | Compiles the production build into `dist/quiz-nova-client/browser` |
| `npm run test` | Runs unit tests using Vitest |
| `npm run test:coverage` | Runs unit tests and outputs code coverage report |
| `npm run test:e2e` | Runs end-to-end tests with Playwright (Chromium) |
| `npm run test:a11y` | Runs automated accessibility audits with Playwright & Axe-Core |
| `npm run lint` | Runs ESLint on TypeScript and HTML templates |
| `npm run lint:fix` | Automatically fixes autofixable ESLint errors |
| `npm run lint:css` | Lints stylesheets with Stylelint |
| `npm run format:check` | Checks code formatting with Prettier |
| `npm run format` | Formats all files with Prettier |

---

## Docker Support

### Run with Docker Compose

```bash
docker compose up --build
```

Access the app at `http://localhost:4200`.

### Production Image Build

```bash
docker build -t quiznova-web:latest .
docker run -d -p 4200:4200 quiznova-web:latest
```

---

## Infrastructure as Code (Terraform)

The `terraform/` directory manages GitHub Pages and domain binding (`quiznova.dev`):

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Provide your github_token in terraform.tfvars
terraform init
terraform plan
terraform apply
```

---

## Related Repositories

* **Backend API:** [quiznova-api](https://github.com/quiz-nova/quiznova-api) (.NET 10 Clean Architecture API)

