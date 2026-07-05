# AlgoForce Finance AI — Interactive Sales MVP

This is the interactive frontend sales MVP for **AlgoForce Finance AI** (previously conceptualized as TallyGPT). The repository contains a fully working, highly responsive, and iOS-themed client-side simulation app designed to demonstrate high-value AI agent capabilities (AI CFO, AI Auditor, AI GST Expert, and AI Collections Manager) to CA, CFO, and SME stakeholders.

---

## What Actually Works (Interactive Capabilities)

The entire application state is managed locally via **Zustand** (`src/store/useFinanceStore.ts`) and fed by multi-industry mock sets (`src/data/dummyData.ts`). There are **no active backend database connections or real AI models running**. All features are client-side simulations.

Here is exactly what works:

### 1. Multi-Industry Sandbox Swapping
* You can toggle between 6 distinct business sectors (E-commerce, Logistics, SaaS, Retail, Manufacturing, Healthcare).
* **Working Mechanism:** Selecting a sector triggers state switches in the store, instantly updating all charts, KPI cards, outstanding accounts, GST compliance percentages, and pending audit records.

### 2. Autoplay Demo & Sales Stepper Assistant
* A floating controller panel resides in the bottom-right corner. It is **fully draggable** anywhere on the screen (via Framer Motion) and can be collapsed.
* It operates a 6-step demo script that walks a prospect through a realistic morning workflow:
  1. **Morning Brief:** Focuses on high-level cash position.
  2. **Operations Room:** Displays active AI Employee statuses.
  3. **OCR Ingestion:** Simulates importing invoices and scanning documents.
  4. **Collaboration Loop:** Initiates a mock discussion between the CFO, Auditor, and GST expert in the chat area.
  5. **WhatsApp Collections:** Fires simulated vendor text reminders, mock customer payment link replies, and handles a click-to-pay mock UPI settlement.
  6. **Board Report:** Navigates to the printable report summary.

### 3. Role-Based Navigation & UI Switching
* You can switch roles at the top bar between:
  * **Business Owner:** Displays high-level dashboards, cash-flow metrics, and ROI outcomes.
  * **Accountant:** Focuses on OCR Scanning, Bank Reconciliation, and WhatsApp collection simulators.
  * **CA (Chartered Accountant):** Focuses on multi-company management, detailed compliance health tables, and ledger audits.
  * **Admin:** Displays placeholder settings for API Keys and Branding.

### 4. Interactive Bank Reconciliation Engine
* Displays real-time matching status (Matched, Unmatched, Duplicate).
* **Working Mechanism:** Clicking the **"Reconcile"** button on unmatched records moves the status to "Matched", updates the total count widgets, and increments the matching metrics instantly.

### 5. Document Ingestion & OCR Scanner
* Fully interactive drag-and-drop zone.
* **Working Mechanism:** Dragging a file triggers a mock scanning status bar (0% to 100%). Upon completion, it injects simulated parsed line items directly into the store state, showing parsed raw invoice data.

### 6. WhatsApp Collections Simulator
* Displays mock chat logs between AlgoForce Collections and overdue customers.
* **Working Mechanism:** Pressing "Mock Customer UPI Payment" updates the invoice state from outstanding to settled and changes the Tally sync widget status.

### 7. Executive Report & PDF Export
* Renders a multi-section board report summarizing Q2 compliance, audit logs, and compliance.
* **Working Mechanism:** Clicking **"Export PDF"** extracts the inner HTML structure, opens a clean new browser window, builds absolute URL paths for assets, and executes a standalone `window.print()` operation to trigger the browser's native Save-as-PDF dialog.

### 8. Command Palette Search
* Pressing `Ctrl + K` or clicking search opens an interactive search palette overlay.

---

## Tech Stack & Setup

* **Framework:** Next.js 15 (Turbopack, App Router)
* **Styling:** Tailwind CSS (v4), Custom iOS Spring CSS Utilities (`src/app/globals.css`)
* **State Management:** Zustand
* **Animations:** Framer Motion
* **Charts:** Recharts
* **Icons:** Lucide React

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) in your browser.

3. Build production bundle:
   ```bash
   npm run build
   ```
