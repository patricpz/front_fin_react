# Task: Analyze the Existing Codebase and Generate Project Documentation

## Objective

Act as a Senior Software Architect, Technical Lead, and Documentation Engineer.

Your task is to thoroughly analyze the **existing project repository** and automatically populate the six Markdown files located in the `docs/` directory.

Use the actual source code, configurations, dependencies, existing documentation, and project structure as the primary sources of truth.

**Do not create a new project, redesign the architecture, or implement new features. Your responsibility is to document the project as it currently exists.**

All generated documentation must be written in **Brazilian Portuguese (pt-BR)**.

## 1. Repository Analysis

Before modifying any documentation, explore the entire repository.

Use the available **Codebase Memory MCP** tools whenever possible to understand the codebase structure, dependencies, relationships, and implementation details.

Inspect:

- Project directory structure.
- Package manifests and dependencies.
- Frameworks, libraries, and runtime versions.
- Frontend and backend architecture.
- Existing modules and features.
- API endpoints and integration layers.
- Database schemas, models, and relationships.
- Authentication and authorization.
- State management and data fetching.
- Components, hooks, services, and utilities.
- Routing and navigation.
- Styling, themes, and design tokens.
- Environment variable names and configurations.
- Tests, linting, formatting, and build scripts.
- Git history and existing project documentation, when available.

Do not rely solely on filenames or folder names. Read relevant implementations to understand their actual responsibilities.

If a Codebase Memory MCP tool is unavailable, continue the analysis using repository navigation and native file inspection tools.

## 2. Populate `docs/prd.md`

Create an accurate Product Requirements Document based on the existing application.

Document:

- Product overview and purpose.
- Problems the application solves.
- Target users and user personas.
- Core business objectives.
- Existing features and capabilities.
- Main user journeys.
- Functional requirements.
- Non-functional requirements.
- Current product scope.
- Features already implemented.
- Features partially implemented.
- Known missing features.
- Features explicitly excluded from the first version, if documented.
- Known limitations and dependencies.

Distinguish clearly between confirmed requirements, inferred behavior, and undocumented decisions.

Do not invent business requirements or assume that an unimplemented feature is planned.

## 3. Populate `docs/arquitetura.md`

Document the actual technical architecture.

Include:

### Technology Stack
- Languages and frameworks.
- Runtime environments.
- Major dependencies.
- Database and ORM.
- Authentication mechanisms.
- State management.
- Networking and API communication.
- Build and deployment technologies.

### Architectural Organization
- Architectural patterns currently used.
- Application layers and responsibilities.
- Module boundaries.
- Feature organization.
- Shared resources.
- Dependency relationships.
- Data flow between layers.
- Error handling strategies.

### Directory Structure
Generate a representative directory tree based on the real repository.

Explain the responsibilities of important directories and files.

### Data and Integrations
Document database relationships, API structure, external services, and communication patterns when identifiable.

Highlight architectural inconsistencies and technical debt separately, without modifying the implementation.

## 4. Populate `docs/regras.md`

Extract and document the existing coding conventions and development standards.

Include:

- Naming conventions.
- File and directory naming.
- TypeScript or JavaScript usage rules.
- Component organization.
- Separation of responsibilities.
- Module boundaries.
- Import and export conventions.
- API integration practices.
- State management patterns.
- Form handling and validation.
- Error handling.
- Security practices.
- Testing conventions.
- Formatting and linting.
- Branch and commit conventions, if documented.

Prioritize explicit repository configurations and established implementation patterns.

Clearly distinguish:

1. Existing enforced rules.
2. Observed conventions.
3. Recommended improvements.

Do not present recommendations as if they were already established project rules.

## 5. Populate `docs/design.md`

Analyze and document the existing design system.

Inspect theme files, style definitions, components, design tokens, and UI implementations.

Document:

### Visual Identity
- Primary colors.
- Secondary colors.
- Background and surface colors.
- Text colors.
- Semantic colors.
- Typography and font families.
- Font sizes and weights.
- Spacing and sizing.
- Borders and border radius.
- Shadows and elevation.

### UI Components
- Buttons.
- Inputs and form controls.
- Cards.
- Modals and dialogs.
- Tables and lists.
- Navigation components.
- Feedback components.
- Loading and empty states.

### Interaction Patterns
- Responsive behavior.
- Layout conventions.
- Navigation patterns.
- Validation feedback.
- Accessibility practices.
- Reusable component guidelines.

Use actual design tokens and existing implementations whenever available.

Do not invent colors, typography, or component specifications.

If design values vary across the application, document the inconsistencies.

## 6. Populate `docs/tarefas.md`

Analyze the current implementation state and create a structured project task overview.

Group tasks into meaningful phases, such as:

- Foundation and infrastructure.
- Core application architecture.
- Authentication and authorization.
- Main application modules.
- Backend and API integrations.
- UI/UX implementation.
- Testing and quality assurance.
- Deployment and maintenance.

For each task, provide:

- Task name.
- Description.
- Related module.
- Priority: High, Medium, or Low.
- Status: Completed, In Progress, Pending, or Blocked.
- Relevant files or implementation evidence.
- Dependencies, when identifiable.

Use a Markdown table or clearly organized task sections.

### Task Status Rules

- Mark a task as Completed only when implementation evidence supports it.
- Mark a task as In Progress only when there is explicit evidence of ongoing work.
- Mark a task as Pending only when it is a documented requirement or accepted task.
- Mark a task as Blocked only when an actual blocker is documented.
- Do not treat TODO comments or missing features as automatically approved tasks.
- Place speculative improvements in a separate Recommendations section.

Prioritize tasks based on their technical impact and verified dependencies.

## 7. Populate `docs/memoria.md`

Generate a technical project memory document that future AI agents can use to resume development efficiently.

Include:

### Current Project State
- Project overview.
- Main technologies.
- Current architecture.
- Existing modules.
- Major implemented features.
- Known incomplete functionality.

### Development History
Summarize significant architectural decisions and implementation milestones supported by repository evidence.

### Current Work
Identify the latest development activity using reliable signals such as Git history, existing task documents, and code changes.

Do not assume the latest commit represents the complete current development state.

### Known Issues
- Confirmed bugs.
- Technical debt.
- Architecture inconsistencies.
- Outstanding integration problems.
- Missing tests, where evidenced.

### Next Steps
Provide a prioritized list of recommended next actions, clearly separated from confirmed pending tasks.

### AI Agent Handoff
Include a dedicated section explaining:

- Where the main source code is located.
- Which architecture rules must be respected.
- Which files should be consulted before changes.
- Which modules are currently important.
- How to validate modifications.
- How future agents should keep the documentation updated.

This document must function as reliable, persistent project context.

## 8. Documentation Update Rules

The following files already exist and must be updated in place:

- `docs/prd.md`
- `docs/arquitetura.md`
- `docs/regras.md`
- `docs/design.md`
- `docs/tarefas.md`
- `docs/memoria.md`

Before editing:

1. Read all six existing files.
2. Preserve accurate and relevant information.
3. Identify outdated or unsupported statements.
4. Verify information against the current codebase.
5. Update sections that need correction.
6. Add missing sections when necessary.
7. Avoid duplicate or contradictory documentation.

Do not overwrite verified historical decisions simply because they are not visible in the current source code.

## 9. Constraints

**MANDATORY:**

- Do not modify application source code.
- Do not refactor modules or directories.
- Do not install or upgrade dependencies.
- Do not create migrations.
- Do not modify environment files.
- Do not modify Git configuration.
- Do not execute destructive commands.
- Do not invent features, requirements, technologies, or design tokens.
- Do not expose secrets, tokens, credentials, or environment variable values.
- Use actual repository evidence.
- Mark uncertain information as "Não confirmado".
- Use Brazilian Portuguese for all documentation.
- Keep the documentation consistent across all six files.
- Update only the specified documentation files.

## 10. Execution Workflow

Follow this process:

**Phase 1 — Discovery**

Explore the repository, inspect configurations, and understand the application.

**Phase 2 — Architecture Mapping**

Identify modules, dependencies, data flow, interfaces, and design conventions.

**Phase 3 — Evidence Collection**

Collect implementation evidence for features, requirements, conventions, and project status.

**Phase 4 — Documentation Review**

Read all existing documentation and identify missing, outdated, or contradictory information.

**Phase 5 — Documentation Generation**

Update all six Markdown files using the collected evidence.

**Phase 6 — Validation**

Verify that:

- All six files contain meaningful documentation.
- Technology names and versions are accurate.
- Directory paths correspond to real repository paths.
- Completed tasks have supporting evidence.
- Design tokens are grounded in existing styles.
- Documents do not contradict one another.
- Unsupported assumptions are clearly identified.
- No application source code was modified.

**Phase 7 — Final Report**

After completing the task, provide a concise report containing:

1. Files updated.
2. Main architectural findings.
3. Features identified.
4. Documentation gaps.
5. Technical debt discovered.
6. Unconfirmed information requiring human review.
7. Recommended next development steps.

## Final Instruction

**Start by analyzing the existing repository and its current documentation. Do not generate generic templates or placeholder content.**

Your primary goal is to transform the six existing Markdown files into an accurate, comprehensive, and maintainable knowledge base that can guide future development and AI coding agents.
