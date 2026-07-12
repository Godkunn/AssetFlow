# AssetFlow Video Explanation Script

**Duration:** ~2 minutes  
**Tone:** Professional, engaging, clear, and modern.  
**Theme:** High-tech, clean, enterprise SaaS.  

---

## Scene 1: Introduction & Login (0:00 - 0:20)
| Visuals | Voiceover / Speech |
| :--- | :--- |
| **[Screen Record]** Start on the beautifully redesigned login- Replaced the 2D Canvas rendering loop with a fully GPU-accelerated **WebGL Torus Knot Wireframe Mesh** and **BufferGeometry Particle System** using Three.js:
  - Includes a glowing cyan wireframe torus knot mesh (`color: 0x00f2fe`, `emissive: 0x051a3a`).
  - Implements a particle field system of 1,000 blue stars rotating in 3D space (`color: 0x3b82f6`).
  - Added Point and Ambient lights, smooth mouse-parallax camera movements, and window resizing listeners.

### 3. Database Seeding & API Startup
- **[`seed-db.ts`](file:///c:/Users/Hp/Desktop/AssetFlow/apps/api/src/seed-db.ts)**:
  - Created a database seeder using `@prisma/client`, `@prisma/adapter-pg`, and `pg` Pool wrapper (matching NestJS driver options) to write mock records.
  - Seeds the Supabase database with Acme Corporation tenant data:
    - **Tenant:** Acme Corporation (`acme.assetflow.io`)
    - **Departments:** Engineering, Operations, Human Resources
    - **Users:** `admin@assetflow.io` (Admin), `sarah@assetflow.io` (Manager), `john@assetflow.io` (Employee)
    - **Categories:** Laptops, Monitors, Conference Rooms, Furniture
    - **Assets:** AST-001 (MacBook Pro 16"), AST-002 (MacBook Pro 14"), Dell 32", Conference Room A, Ergonomic Chair
    - **Allocations, Bookings, Tickets:** Real-life test records for asset allocations, shared room calendar slots, and pending maintenance tickets.
- **Backend API Startup**:
  - Launched NestJS API dev server: `nest start --watch` running in the background on port `4000`.
  - Mapped controllers, routes, and verified successful connection bootstrap to PostgreSQL.

### 4. Collapsible & Draggable Sidebar Layouthe credentials and click the login button. | *"Hi everyone! Meet AssetFlow — a premium, multi-tenant ERP built to help organizations track, allocate, and maintain physical assets in one place.*<br><br>*Right from the start, you are welcomed by our modern landing page, featuring a glowing 3D WebGL backdrop, mouse-parallax mockups, and secure multi-provider OAuth sign-in."* |

---

## Scene 2: Live Dashboard & KPI Overview (0:20 - 0:40)
| Visuals | Voiceover / Speech |
| :--- | :--- |
| **[Screen Record]** Transition smoothly to the Dashboard screen. Highlight the top bar showing the organization logo (Acme Corp / Nexus Health switcher). <br><br>**[Action]** Scroll down to show the KPI cards (Total Assets, Active Allocations, Open Maintenance, Audit Cycles), the interactive doughnut chart, the line charts showing utilization trends, and the real-time system health card showing 99.98% uptime. | *"Once logged in, you land on the Dashboard. This is your real-time command center showing active utilization, asset distribution, open maintenance tickets, and overall system health updating live.*<br><br>*Admins can seamlessly switch between tenant organizations with strict Row-Level Security ensuring absolute data isolation."* |

---

## Scene 3: Organization & Asset Registry (0:40 - 1:00)
| Visuals | Voiceover / Speech |
| :--- | :--- |
| **[Screen Record]** Click on **Organization Setup** in the sidebar. Show the tabs for Departments, Categories, and Employee Directory. <br><br>**[Action]** Navigate to the **Asset Registry**. Search for an asset (e.g., "MacBook"), click on it, and open the "Register Asset" modal form. | *"Behind every strong workflow is a clean setup. Under Organization Setup, admins define departments, categories, and directories.*<br><br>*The Asset Registry acts as your central inventory. Every single asset is tracked with full lifecycle status — from available and allocated, to retired and under maintenance."* |

---

## Scene 4: Allocations, Transfers & Booking (1:00 - 1:20)
| Visuals | Voiceover / Speech |
| :--- | :--- |
| **[Screen Record]** Open the **Allocation** screen. <br><br>**[Action]** Show the "New Allocation Request" panel. Select an asset and employee. Hover over the conflict resolution log. Switch to **Resource Booking** to show the booking schedule calendar interface. | *"Assigning assets is completely conflict-safe. If an asset is already allocated, the system dynamically blocks duplicate assignments at the database layer and routes a transfer request instead.*<br><br>*For shared spaces like conference rooms, the Resource Booking engine prevents overlap with automatic exclusion checks."* |

---

## Scene 5: Maintenance Pipeline & Immutable Audits (1:20 - 1:40)
| Visuals | Voiceover / Speech |
| :--- | :--- |
| **[Screen Record]** Switch to the **Maintenance** page. Show the Kanban-style tracking table. <br><br>**[Action]** Click on the **Audit Ledger** view. Show the audit verification statuses (Verified, Missing, Damaged) and point to the append-only ledger entries. | *"When assets need repair, they enter the Maintenance Kanban pipeline — tracking requests from initial report to assignment and resolution.*<br><br>*For compliance, the Audit Ledger runs structured validation cycles, recording every check into an immutable, append-only activity trail."* |

---

## Scene 6: Insights & Outro (1:40 - 2:00)
| Visuals | Voiceover / Speech |
| :--- | :--- |
| **[Screen Record]** Navigate to the **Reports** view. Show the bar graphs, usage heatmaps, and highlight the PDF/CSV export buttons. <br><br>**[Action]** Return to the main dashboard. Close with a clean zoom-out showing the entire application. | *"Finally, the Reports and Analytics module turns raw logs into actionable intelligence — detailing utilization trends, cost structures, and upcoming retirements.*<br><br>*That’s AssetFlow — the smart, secure, and beautiful way to manage assets for any modern enterprise."* |
