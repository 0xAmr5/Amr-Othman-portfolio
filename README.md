# Engineering Portfolio — Amr Othman

Personal software engineering portfolio showcasing production web systems, full-stack SaaS architectures, and an interactive REST API & RBAC sandbox.

**Live Production:** [amr-othman-portfolio.vercel.app](https://amr-othman-portfolio.vercel.app/)

## Architectural Highlights

* **Asymmetric Bento Grid Layout:** Responsive structural hierarchy built with pure CSS Grid and fluid `clamp()` typography across mobile, tablet, and desktop viewports.
* **Interactive API & Security Sandbox:** Live simulation of production REST endpoints (`POST`, `GET`, `PATCH`), request headers, JWT authorization payloads, and latency metrics.
* **System Architecture Case Studies:** Modal inspection drawers detailing operational challenges, database schemas, and engineering trade-offs per project.
* **Bilingual & Dual-Theme Engine:** Full `LTR / RTL` (English / Arabic) layout mirroring and persistent `Dark / Light` theme state via `localStorage`.

## Tech Stack

* **Core:** React 18, Vite, JavaScript (ES6+)
* **Styling:** Custom CSS Variables, CSS Grid / Flexbox, JetBrains Mono & Inter Typography
* **Form & Deployment:** Formspree API, Vercel Edge Network

## Local Setup

```bash
git clone [https://github.com/0xAmr5/My-Elite-Portfolio.git](https://github.com/0xAmr5/My-Elite-Portfolio.git)
cd My-Elite-Portfolio
npm install
npm run dev