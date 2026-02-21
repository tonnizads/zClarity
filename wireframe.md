Wireframe (Low Fidelity) – zClarity v0

Single-page layout with two main areas:
1) History Panel (left sidebar)
2) Working Canvas (main area)

-------------------------------------
Layout Structure
-------------------------------------
Top Bar:
- Session Title (optional)
- Auto-generated Date/Time
- State Badge (Draft | Active | Pending | Closed)
- Button: New Session

Left Sidebar – History Panel:
- List of previous sessions (stored in LocalStorage)
- Each item displays:
  - Date
  - Title (or Objective preview if title empty)
  - State badge
- Click item → Load session into Working Canvas
- No search/filter in v0

-------------------------------------
Working Canvas
-------------------------------------
Section 1 – Intent
Fields:
- Objective (required, textarea)
- Expected Output Type (dropdown: Decision | Clarification | Feasibility | RiskMap)

Button:
- Start Session (enabled only when Objective is not empty)

Validation:
- Cannot move from Draft → Active if Objective is empty

-------------------------------------
Section 2 – Discussion
Topics List:
Each Topic contains:
- Topic Title (input)
- Notes (textarea)
- Open Questions (list of strings)
  - Input field + Add button

Controls:
- Add Topic
- Remove Topic (optional for v0)

-------------------------------------
Section 3 – Outcome & Close
Outcome Object (required before Close):
- Outcome Type (Decision | NextStep | Pending)
- Summary (required)
- Owner (required)
- Next Step (required)
- Due Date (optional)
- Impact Area (optional)

Closing Summary:
- Single sentence summary (required before Close)

Buttons:
- Mark Pending (requires Outcome fields completed)
- Close Session (disabled until:
  - Outcome Type selected
  - Summary filled
  - Owner filled
  - Next Step filled
  - Closing Summary filled
)

-------------------------------------
State Rules
-------------------------------------
Draft → Active (when Start Session clicked)
Active → OutcomeDefined (when Outcome fields completed)
OutcomeDefined → Pending (if Mark Pending clicked)
OutcomeDefined → Closed (if Close Session clicked and validation passed)

-------------------------------------
Persistence (v0)
-------------------------------------
- All sessions stored in LocalStorage as array: sessions[]
- activeSessionId stored separately
- Autosave on every state change
- No backend / No authentication

End of Wireframe v0 specification.