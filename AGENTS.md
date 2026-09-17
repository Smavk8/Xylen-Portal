# Xylen Management — System Architecture & Antigravity Agent Guidelines

This repository hosts **Xylen Management** (`https://portal.xylen.net`), an enterprise-grade Telecom Testing, Roaming Data QA, and Global SIM Fleet Management Platform.

---

## 1. Executive Summary & Purpose

The platform coordinates real-world mobile network operator (MNO) roaming testing across international telecommunications partners (e.g., **Uz Mobile**, **Ucell**, **Tim Italia**, **Vodafone**, **Telus**, **Free Mobile**, **Celcom Digi**, **Mobitel**, etc.). 

Key responsibilities:
1. **SIM Fleet Lifecycle**: Provisioning, procuring (eSIM & physical), assigning, and tracking physical/eSIM cards.
2. **Field Tester Operations**: Managing local testers, assigning device inventory, configuring daily data transfer quotas (in MB), and monitoring schedules (Test Days vs. Break Days).
3. **Data Usage Telemetry**: Recording and auditing field test submissions (MB used, LTE radio bands, RSRP, SINR, PDP context activation, APN).
4. **Target Forecasting**: Tracking monthly MB targets per operator rate contract and projecting achievement rates.
5. **NOC & SIM Issue Ticketing**: Resolving LPA download timeouts, data stalls, and roaming steering anomalies.

---

## 2. Core Domain Model & Entity Schemas

### A. SimItem (SIM Card Fleet)
- `id`: Unique identifier (`number`)
- `supplier`: Identity of the provider/vendor who acquired the SIM (e.g. `"Lucilla Antonacci"`, `"Davi Francheschi"`, `"Sharon Fraser"`)
- `project`: Target operator project (`'Uz Mobile'` | `'Ucell'`)
- `mno`: Mobile Network Operator name (e.g. `'Tim Italia'`, `'Vodafone Australia'`, `'Telus Canada'`)
- `simNumber`: 19-20 digit ICCID identifier
- `mobileNumber`: E.164 MSISDN phone number
- `isEsim`: Boolean flag (`true` for eSIM profiles, `false` for physical plastic SIMs)
- `tester`: Assigned field tester name or `"-"` if unassigned
- `status`: Fleet status (`'Active'` | `'In Transit'` | `'Active (with issue)'' | `'Steered'` | `'Dormant'` | `'Sim Issue'` | `'Disconnection'`)
- `missing`: Array of pending requirements flags (`'Tester'`, `'Roaming Dates'`)
- `roamingDates`: Active testing validity window (e.g. `"2026-09-10 - 2026-09-24"`)
- `tariff`: Associated cellular package (e.g. `"TIM in Viaggio Pass XL"`, `"Free Max plan"`)

### B. AssignmentItem (Testing Assignments)
- `id`: Assignment ID
- `testerName`: Name of assigned tester
- `mno`: MNO carrier under test
- `simNumber`: Target ICCID
- `mobileNumber`: MSISDN
- `testDays`: Number of active testing days per cycle
- `breakDays`: Number of cooling/idle days per cycle
- `startDate` / `endDate`: Testing calendar window
- `dailyTargetMB`: Daily data transfer quota in Megabytes (e.g. 3,072 MB, 10,240 MB)
- `submittedMB`: Actual accumulated Megabytes submitted by tester
- `monthlyTargetMB`: `testDays * dailyTargetMB`
- `status`: `'Active'` | `'Completed'` | `'Pending'`

### C. SubmissionItem (Test Execution Telemetry)
- `id`: Submission ID
- `testerName`: Tester reporting the run
- `projectName`: `'Ucell'` | `'Uz Mobile'`
- `mno`: Carrier under test
- `mobileNumber`: MSISDN
- `date`: Timestamp / date of session
- `mbUsed`: Volume transferred in Megabytes
- `comments`: Diagnostic comments or test plan references
- `testComplete`: Verification status
- `dataSession`: Radio telemetry (LTE band, RSRP/RSRQ, PDP context status)

### D. DeviceItem (Hardware Inventory)
- `id`: Device ID
- `deviceType`: `'Mobile'` | `'Tablet'` | `'Modem/Router'`
- `make` & `model`: Device specifications (e.g. Xiaomi Redmi Note 10S, Samsung Galaxy A54)
- `imei`: 15-digit hardware IMEI identifier
- `simSlots`: Number of physical/eSIM slots (typically 1 or 2)
- `ownership`: `'Personal'` | `'Company'`
- `testerName`: Assigned personnel
- `country`: Operational territory (e.g. `'Uzbekistan'`)

### E. SimRequiredItem (Procurement Pipeline)
- Tracks SIM deficit against contractual testing targets.
- Attributes: `mno`, `assignedTo` (Procurement lead: Amaan Hussain, Xylen, Ibad), `simType` (eSIM/Physical), `contractPrepaid`, `tariff`, `roamingBundle`, `project`, `target`, `inStock`, `acquiredInTr`, `pending`, `notes`.

### F. ForecastRateItem (Forecast Performance)
- Aggregates rate agreement achievement: `project`, `mno`, `activeSims`, `targetPerSimMB`, `monthlyTargetMB`, `actualSubmissionsMB`, `differenceMB`, `achievedPercent`.

### G. TicketItem (SIM / Roaming Faults)
- `id`: e.g. `'TICK-101'`
- `title`, `mno`, `tester`, `priority` (`'Low'` | `'Medium'` | `'High'` | `'Critical'`), `status` (`'Open'` | `'In Progress'` | `'Resolved'`), `createdAt`, `description`.

---

## 3. Navigation & Views Structure

- `dashboard` (`DashboardView`): High-level KPI metrics, project performance stacked bars, SIM readiness donut chart, status badges cloud.
- `users` (`UsersView`): Tester directory, role management, contact details, project tags.
- `projects` (`ProjectsView`): Project list (`Uz Mobile`, `Ucell`) with rate sheet and settlement modal (`$`).
- `inventory` (`InventoryView`): Device IMEI inventory, hardware allocation, tester mapping.
- `sim_list` (`SimsListView`): Primary SIM fleet data grid with multi-column sorting, search, assign tester action, and detail view/edit.
- `sim_assignments` (`SimAssignmentsView`): Tester quota progress, daily/monthly target tracking with colored progress bars.
- `sim_submissions` (`SimSubmissionsView`): Date-filtered telemetry logs and PDP context audit.
- `sim_required` (`SimsRequiredView`): Procurement pipeline, supplier negotiations, Upwork acquisition notes.
- `report_forecast` (`ForecastReportView`): Project and operator level monthly forecast variance reporting.
- `tickets` (`TicketsView`): Operational fault resolution and troubleshooting tickets.

---

## 4. Design & UI Specifications

- **Theme**: Enterprise high-contrast light mode (`#f8fafc` canvas, `#ffffff` containers, `#15437a` deep navy brand accents).
- **Typography**: `Plus Jakarta Sans` for labels/UI, `JetBrains Mono` for ICCID/IMEI/MSISDN values.
- **Brand Elements**: Circular globe ring icon with mobile silhouette, `"Xylen"` bold logo text, `"MANAGEMENT"` subtitle.
- **Components**: Strict separation of concerns across `/src/components/` and modals under `/src/components/modals/`.
