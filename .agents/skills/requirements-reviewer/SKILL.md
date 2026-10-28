---
name: requirements-reviewer
description: 'Compare a feature specification with its implementation. Use for requirements reviews, acceptance-criteria checks, specification audits, and identifying implementation gaps, unsupported behavior, data or security concerns, and missing tests.'
---

# Requirements Reviewer

Review a feature implementation against its specification and report what is supported by evidence. This is a read-only review: do not create, edit, delete, or format files, and do not implement fixes unless the user separately asks for changes.

## Procedure

1. Identify the specification the user wants reviewed. If they did not name one, locate relevant feature specifications (commonly under `docs/`) and determine which matches the requested feature. If more than one plausible specification exists and the intended one cannot be established from context, ask which to use before reviewing.
2. Read the entire relevant specification, including its acceptance criteria, constraints, and any relevant examples. Treat user-provided attachments as read-only evidence.
3. Trace each acceptance criterion to the implementation. Inspect the relevant source, tests, and existing data/storage behavior; search for callers and related UI or persistence paths when needed. Do not infer behavior from filenames or tests alone.
4. Assess whether implementation behavior is supported by the specification. Identify material behavior the specification does not authorize or describe, without treating ordinary implementation details as unsupported requirements.
5. Check data and security implications relevant to the feature, including compatibility with existing stored data, validation and error handling, and safe handling/rendering of user-controlled values. Report a concern only when there is evidence or clearly label it as a risk that needs verification.
6. Compare tests with the criteria and behavior. Identify missing or insufficient tests and specify the scenario that still needs coverage. Do not run destructive or state-changing validation commands.
7. Return the review using the report format below. Be concise but cover every section. If a section has no findings, say so explicitly.

## Evidence and judgment

- Cite both specification and implementation evidence for each finding. Use repository-relative file paths with line numbers, for example `docs/feature.md:12-16` and `src/app.js:40-48`. For code, cite the most direct implementation and relevant tests when useful.
- When a specification or source has no stable line numbers (such as an attachment), identify it by its supplied filename and quote or describe a distinctive criterion or passage. Never invent line numbers.
- Keep each claim traceable to evidence. Separate what the sources state from interpretation; label uncertain conclusions as risks or questions rather than facts.
- Classify a criterion as satisfied only when the implementation evidence demonstrates it. A test passing is supporting evidence, not proof by itself. Mark partial implementation as a gap and explain what remains.
- “Unsupported behavior” means behavior present in the implementation that is not required or allowed by the specification and could affect users, data, or scope. Do not call an implementation detail unsupported merely because the specification is silent about internal design.
- Do not claim a data or security vulnerability without evidence. Distinguish confirmed concerns from items that need further verification.
- Do not modify files, even to add review notes or tests. Recommend needed tests or fixes in the report only.

## Report format

### Satisfied acceptance criteria
- List each satisfied criterion, with a brief explanation and citations to the specification and implementation.
- If none are demonstrated, say “None demonstrated.”

### Gaps
- List unmet or partially met criteria and what is missing, citing the criterion and relevant implementation evidence.
- If none are found, say “None found.”

### Unsupported behavior
- List material implementation behavior without specification support, citing both the implementation and the relevant specification context (or state that the specification does not address it).
- If none are found, say “None found.”

### Data or security concerns
- List confirmed concerns and risks needing verification separately, with evidence and likely impact.
- If none are found, say “None identified from the reviewed evidence.”

### Tests still needed
- List concrete test scenarios that would verify uncovered criteria, gaps, or relevant data/security behavior. Cite existing test coverage when explaining what is missing.
- If existing tests adequately cover the reviewed behavior, say “None identified.”
