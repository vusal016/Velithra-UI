# Button → Route Mapping (Initial Audit)

Purpose: map interactive UI elements (buttons / links) to their navigation targets and backend endpoints (where applicable). This is the first-pass automated mapping produced from repository search. I'll verify each mapping against service calls next.

Notes:
- "Has Service?" means the UI action either directly calls a service function (e.g., `userService.create`) or triggers an API call in the same file.
- "Needs Verification" means we need to inspect imported services for the exact endpoint.

---

## Summary (high level)
- Files scanned: app pages under `app/` and key components under `components/`
- Mapped items: Buttons, Links, router.push usages, and functions referenced in onClick handlers.

---

## Mappings (initial)

- `app/dashboard/modules/page.tsx`
  - `Button` (Add) onClick: `handleAddOpen` → Opens Add modal (UI flow). Has Service?: needs verification (create → likely calls moduleService.create)
  - `Button` (Edit) onClick: `handleEditOpen(mod)` → Opens Edit modal. Has Service?: needs verification (update → moduleService.update)
  - `Button` (Delete) onClick: `handleDeleteOpen(mod)` then confirm triggers `handleDeleteConfirm` → Delete module. Has Service?: likely yes (moduleService.delete)
  - `onClick={() => handleStatusToggle(mod)}` → toggles active status. Has Service?: likely yes (moduleService.toggle)
  - Pagination `Prev/Next` → `handlePageChange(page +/- 1)` (UI only)

- `app/dashboard/hr/departments/page.tsx`
  - `Button` (Add) onClick: `handleAddOpen` → Opens Add modal. Has Service?: needs verification (departmentService.create)
  - `Button` (Edit) onClick: `handleEditOpen(dept)` → Opens Edit modal. Has Service?: needs verification
  - `Button` (Delete) onClick: `handleDelete(dept.id)` → Delete department. Has Service?: likely yes (departmentService.delete)

- `app/dashboard/hr/employees/page.tsx`
  - `Button` (Add) onClick: `handleAddOpen` → Add employee modal. Has Service?: needs verification
  - `Button` (Edit) onClick: `handleEditOpen(emp)` → Edit modal. Has Service?: needs verification
  - `Button` (Delete) onClick: `handleDelete(emp.id)` → Delete employee. Has Service?: likely yes (employeeService.delete)

- `app/dashboard/roles/page.tsx`
  - `onClick={handleAddOpen}` → Add role modal. Has Service?: needs verification
  - `onClick={() => handleEditOpen(role)}` → Edit role. Has Service?: needs verification
  - `onClick={handleDelete}` → Delete role. Has Service?: needs verification

- `app/dashboard/users/page.tsx`
  - Uses `useRouter()` and `router.push("/dashboard")` in places (redirects after certain actions).
  - `onClick={() => setShowAddModal(true)}` → Add user modal. Service?: needs verification
  - `Button Search` onClick: `handleSearch` → triggers user fetch (service likely used)
  - Table row actions include create/edit/delete flows which call service functions (verify where they import `userService`)
  - Pagination buttons update `setCurrentPage(...)` (UI only) then call fetch.

- `app/test/page.tsx`
  - `onClick={handleButtonClick}` → Custom test button. Service?: check file
  - `onClick={handleAPITest}` → Triggers `runAllAPITests()` or similar utility — calls `lib/utils/api-test.ts` (service present)

- `components/user/user-header.tsx`
  - `onClick={() => router.push("/user/notifications")}` → navigates to user notifications (route exists)

- `components/user/user-sidebar.tsx`
  - `<Link>` usage and `onClick={handleLogout}` → logout handler (calls `authService.logout`)

- `components/auth/protected-route.tsx`
  - `router.push(fallbackPath)` and `router.push('/unauthorized')` → route guard redirects on unauthenticated or unauthorized

- Misc UI components
  - `components/ui/*` contain `onClick` handlers: carousel prev/next, sidebar toggles, etc. (UI-only; no backend mapping required)

---

## Gaps / Next verification steps
1. For each UI action marked "needs verification" or "likely yes", open the file and search for the corresponding service imports (e.g., `import moduleService from '...';`) and confirm exact method used (`create`, `update`, `delete`, endpoint paths).
2. Produce per-action mapping with exact backend endpoint (e.g., `POST /api/module`, `PUT /api/module/{id}`, `DELETE /api/module/{id}`).
3. Where services are missing, implement small adapters in `lib/services/` following the project's `api` client conventions.
4. Run the endpoint tests for each action using `lib/utils/api-test.ts` or via simulated UI flows (if easier, call the service functions directly in a node script or page test harness).

---

## Proposed immediate actions (I can run now)
- Verify `modules`, `users`, `hr` pages: open each page file, locate service calls, and add exact backend endpoint mapping. (I'll continue scanning these files automatically.)
- After verifying, run API tests for those endpoints and report failures.

---

If you want me to continue, confirm and I'll start verifying actions in `app/dashboard/modules/page.tsx`, `app/dashboard/users/page.tsx`, and `app/dashboard/hr/*` files in that order, replacing the "needs verification" statuses with exact endpoints and test results.
