# GEMINI Context — Xylen Management Portal

## System Persona & Project Identification
- **Project Name**: Xylen Management
- **Domain URL**: `https://portal.xylen.net`
- **Application Category**: Telecom Carrier QA & Roaming SIM Fleet Management System
- **Key Client Telecom Projects**: Ucell, Uz Mobile
- **Primary Technology Stack**: React 19, TypeScript, Vite, Tailwind CSS 4, Lucide Icons, Express / Cloud Run container environment.

## Integration Interfaces & Endpoints Overview
When developing backend API routes or agent tools for integration with Xylen Management, conform to the following schemas:

### 1. SIM Fleet Endpoint (`/api/sims`)
- **GET**: Returns filtered list of SIM cards by project, status, or search query.
- **POST**: Registers newly acquired SIM card (physical ICCID or eSIM QR / activation code).
- **PATCH (`/api/sims/:id`)**: Updates status (`Active`, `In Transit`, `Steered`, `Dormant`, `Disconnection`), assigns tester, or updates roaming validity dates.

### 2. Assignments Endpoint (`/api/assignments`)
- **GET**: Retrieves active testing quotas, test days, break days, and MB progress.
- **POST**: Creates tester assignment and calculates `monthlyTargetMB` based on `dailyTargetMB * testDays`.

### 3. Submissions / Telemetry Endpoint (`/api/submissions`)
- **GET**: Queries submissions filtered by `dateFrom`, `dateTo`, and tester name.
- **POST**: Ingests automated or manual field test submissions with verified MB transferred and radio connection telemetry (LTE Band, RSRP, PDP context).

### 4. Forecast & Analytics (`/api/forecast`)
- **GET**: Delivers calculated forecast achievement percentages, variance (`differenceMB`), and target progress against operator roaming agreements.

### 5. Inventory Endpoint (`/api/inventory`)
- **GET / POST / DELETE**: Device tracking by IMEI, brand, model, SIM slots, ownership (Company / Personal), and tester.

### 6. Tickets & NOC (`/api/tickets`)
- **GET / POST / PATCH**: Roaming data issues, LPA activation failures, and APN errors.

## Antigravity Rules for Code Generation
1. Never use dark mode overrides or purple gradients; adhere strictly to the clean corporate palette (`#15437a` navy, `#059669` emerald, `#f8fafc` background).
2. Format telecom identifiers with monospace styling:
   - ICCID: 19-20 digits
   - MSISDN: International E.164 (`+` country code prefix)
   - IMEI: 15 digits
3. Maintain modularity: keep types in `/src/types.ts`, views in `/src/components/`, and dialogs in `/src/components/modals/`.
