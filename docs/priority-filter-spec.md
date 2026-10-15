# Priority Filter

## Goal

Help managers find equipment requests by priority without reviewing the full list.

## User Need

Managers need to focus on requests that need attention. They should be able to filter the existing request list by priority whenever they review it, without signing in.

## Functional Rules

- Provide `All`, `High`, `Normal`, and `Low` as filter options near the request list.
- Select `All` by default.
- Apply a selected priority filter immediately, without reloading the page.
- A priority filter displays only requests whose existing priority exactly matches the selected value.
- `All` displays every request, including requests with missing or unrecognized priority values.
- Filtering must not change or delete request information.
- When a selected priority has no matching requests, display “No requests match this priority.”
- When there are no saved requests, display the existing empty-list message.
- Refreshing the page resets the selected filter to All without changing or deleting saved requests.

## Constraints

- Use the existing `High`, `Normal`, and `Low` priority values.
- Do not require a login, database, or external service.
- Preserve all existing requests and keep request submission and display functional.

## Acceptance Criteria

- On initial display, `All` is selected and every saved request is visible.
- Selecting `High`, `Normal`, or `Low` shows only requests with that exact priority, without a page reload.
- Requests with missing or unrecognized priority values appear under `All` and not under a specific priority filter.
- Selecting `All` after filtering restores the full list.
- A selected priority with no matches shows “No requests match this priority.”
- With no saved requests, the existing empty-list message is shown instead.
- After selecting a priority filter and refreshing the page, the filter resets to All and every previously saved request remains visible with its original information and priority.
- When a user submits a valid new equipment request, the system saves the request with its selected priority. The new request appears under All and under its matching priority filter.

## Out of Scope

- Adding or changing request priorities.
- Adding authentication, a database, or an external service.
- Changing request submission or other request-list behavior beyond what is needed to support filtering and its empty states.

## Verification Results

## Verification Results

1. **Pass** — All is selected by default and displays every saved request.
2. **Pass** — Selecting High, Normal, or Low immediately shows only matching requests.
3. **Pass** — Requests with missing or unrecognized priorities appear under All only.
4. **Pass** — Selecting All after filtering restores the full request list.
5. **Pass** — Selecting a priority with no matches shows the correct message.
6. **Pass** — An empty request list shows the existing empty-list message.
7. **Pass** — Refreshing resets the filter to All without losing requests.
8. **Pass** — Submitting a new request works and shows it under the correct priority.

Automated checks: npm test — 8 tests passed, as reported by Codex.