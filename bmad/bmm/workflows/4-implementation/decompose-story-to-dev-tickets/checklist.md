# Decompose Story to Dev Tickets - Validation Checklist

## Story Analysis

- [ ] Story file loaded and understood
- [ ] Story ticket loaded from Vibe Kanban
- [ ] Story key extracted correctly
- [ ] Epic number and story number extracted
- [ ] Acceptance criteria identified
- [ ] Technical context reviewed

## Work Breakdown and Task Decomposition

- [ ] Agent type determined correctly
- [ ] Agent-specific work identified comprehensively
- [ ] Work decomposed into detailed tasks
- [ ] Each task estimated at ~500 lines of code or less
- [ ] Tasks are non-overlapping and well-scoped
- [ ] All story requirements covered by tasks

## Priority Assignment

- [ ] Priorities assigned based on dependency order
- [ ] Backend priorities follow correct order:
  - [ ] Priority 1: API Interface Definition
  - [ ] Priority 2: Domain Model and Database Schema
  - [ ] Priority 3: Domain Logic and Collaborations
  - [ ] Priority 4: Integration Interfaces
  - [ ] Priority 5+: Additional Implementation
- [ ] Mobile priorities follow correct order:
  - [ ] Priority 1: Storage/Server Communication + Core Entities/Interfaces
  - [ ] Priority 2: State Management
  - [ ] Priority 3: UI Implementation
  - [ ] Priority 4+: Additional Features
- [ ] Task dependencies correctly identified
- [ ] Priority numbers are sequential (1, 2, 3, ...)

## Task Implementation Plans

- [ ] Each task has detailed implementation plan
- [ ] **Implementation plan is standalone** - someone with no prior context can implement from ticket alone
- [ ] Implementation plan includes:
  - [ ] Clear objective
  - [ ] **Comprehensive Context section (CRITICAL)** with:
    - [ ] Why This Task Exists (business need, story role, problem solved)
    - [ ] Story Context (parent story, story problem, task's role)
    - [ ] Technical Context (architecture patterns, constraints, requirements)
    - [ ] Dependency Context (what depends on this, what this depends on, data flow)
    - [ ] Domain Context (ubiquitous language, domain entities, business rules) with examples
    - [ ] Code Context (existing patterns, file structure, similar implementations) with examples
    - [ ] Integration Context (how it integrates, integration points, data flow) with examples
  - [ ] Estimated code changes (?500 lines)
  - [ ] Files to create (with paths and purposes)
  - [ ] Files to modify (with changes needed)
  - [ ] Code-level implementation steps
  - [ ] **Code Examples section with concrete code examples** (CRITICAL)
  - [ ] Test implementation plan (unit, integration, API/widget tests)
  - [ ] Dependencies on other tasks
  - [ ] Acceptance criteria
  - [ ] Definition of Done
- [ ] Backend plans include specific classes, methods, migrations
- [ ] Backend context includes:
  - [ ] Story context explaining backend's role in the story
  - [ ] Technical context (Spring Boot, Kotlin, DDD patterns)
  - [ ] Domain context with ubiquitous language examples
  - [ ] Code context with file structure and existing pattern references
  - [ ] Integration context with API contracts and database schema
  - [ ] Dependency context explaining task relationships
- [ ] Backend code examples include:
  - [ ] Actual controller classes with method signatures
  - [ ] Actual DTO classes with properties
  - [ ] Actual entity/aggregate classes
  - [ ] Actual repository interfaces
  - [ ] Actual service classes
  - [ ] Actual test class structures
  - [ ] Database migration examples (if applicable)
- [ ] Mobile plans include specific screens, widgets, state management, API clients
- [ ] Mobile context includes:
  - [ ] Story context explaining mobile's role in the story
  - [ ] Technical context (Flutter, state management, Dart patterns)
  - [ ] Domain context matching backend ubiquitous language
  - [ ] Design context with Figma references and design system
  - [ ] Code context with file structure and existing pattern references
  - [ ] Integration context with API endpoints and navigation flow
  - [ ] Dependency context explaining task relationships
- [ ] Mobile code examples include:
  - [ ] Actual screen class structures
  - [ ] Actual state management classes (Riverpod/Provider)
  - [ ] Actual API client classes
  - [ ] Actual storage classes
  - [ ] Actual entity/model classes
  - [ ] Actual widget test examples
- [ ] All context sections include concrete examples (not just abstract descriptions)
- [ ] Context examples are task-specific and story-specific
- [ ] Code examples are task-specific (not generic templates)
- [ ] Code examples show real class/function names for the actual task
- [ ] Test plans are comprehensive and specific
- [ ] Ticket is completely standalone - no external knowledge required to implement

## Ticket Creation

- [ ] Project ID verified
- [ ] All task tickets created in Vibe Kanban
- [ ] Ticket titles follow format: "{{epic_num}}.{{story_num}}-{{priority}} BE/MB/FE: {{story_title}}"
- [ ] Ticket descriptions contain full implementation plan
- [ ] All ticket IDs stored with priorities
- [ ] Ticket dependencies recorded
- [ ] Story file updated with ticket references in priority order
- [ ] Development workflow guidance added to story file

## Validation

- [ ] All tickets exist in Vibe Kanban
- [ ] Ticket titles are correct and follow naming convention
- [ ] Ticket descriptions are complete with implementation plans
- [ ] Priorities are correctly numbered and ordered
- [ ] No task exceeds 500 lines estimate
- [ ] Story file has dev ticket references with priority order
- [ ] Development workflow guidance is clear
