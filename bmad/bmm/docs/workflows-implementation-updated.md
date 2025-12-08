# BMM Implementation Workflows (Phase 4) - Updated

**Reading Time:** ~25 minutes  
**Last Updated:** 2025-11-05  
**Version:** 2.0 (Kanban Ticket-Based Workflow)

## Overview

Phase 4 (Implementation) workflows manage the iterative sprint-based development cycle with a **Kanban ticket-based workflow**. Each story is decomposed into task-level tickets with code-level implementation plans, and work proceeds in priority order with proper branch management and PR automation.

**Key principle:** One story at a time, decomposed into task tickets, worked in priority order, with proper Git workflow and PR automation.

**New in v2.0:**
- Task-level Kanban ticket creation with code-level implementation plans
- Ticket review process before starting work
- Priority-based task execution
- Branch management (previous task branch as base)
- Contextual commits during work
- Automated PR creation from completed tickets

## Quick Reference

| Workflow              | Agent   | Duration       | Purpose                              |
| --------------------- | ------- | -------------- | ------------------------------------ |
| **sprint-planning**   | SM      | 30-60 min      | Initialize sprint tracking file      |
| **epic-tech-context** | SM      | 15-30 min/epic | Epic-specific technical guidance     |
| **create-story**      | SM      | 10-20 min      | Create next story from epics         |
| **story-context**     | PM      | 10-15 min      | Assemble dynamic story context       |
| **create-task-tickets** | DEV  | 15-30 min      | Create task-level Kanban tickets with code plans |
| **review-task-tickets** | DEV | 10-20 min      | Review task tickets for quality and completeness |
| **dev-story**         | DEV     | 2-8 hours      | Implement story using task tickets   |
| **create-pr-from-ticket** | DEV | 5-10 min    | Create PR from completed task ticket |
| **code-review**       | DEV     | 30-60 min      | Senior dev review of completed story |
| **correct-course**    | SM      | 30-90 min      | Handle mid-sprint changes            |
| **retrospective**     | SM      | 60-90 min      | Post-epic review and lessons         |
| **workflow-status**   | All     | 2-5 min        | Check "what should I do now?"        |
| **document-project**  | Analyst | 1-3 hours      | Document brownfield projects         |

---

## Understanding the Implementation Phase

### Story Lifecycle (Updated)

Every story moves through this lifecycle with task-level ticket management:

```
1. TODO (Not Started)
   ? [sprint-planning creates status file]

2. STORY CREATED
   ? [create-story generates story file]
   ? [story-context assembles context]
   ? [create-task-tickets creates task-level tickets]
   ? [review-task-tickets reviews implementation plans]

3. IN PROGRESS (Being Implemented)
   ? [dev-story implements tasks in priority order]
   ? [Each task: todo ? inprogress ? inreview ? done]
   ? [Contextual commits during work]
   ? [PR created for each completed task]

4. READY FOR REVIEW (Implementation Complete)
   ? [code-review validates quality]

5. DONE (Accepted)
   ? [story-done marks complete]
   ? [Repeat for next story]
```

### Kanban Ticket-Based Workflow

**New Workflow Pattern:**

1. **Story ? Task Tickets**: Story is decomposed into task-level tickets
2. **Task Tickets ? Code Plans**: Each ticket has detailed code-level implementation plan
3. **Priority Order**: Tasks worked in priority order with dependency management
4. **Branch Management**: Each task gets its own branch, based on previous task branch
5. **Contextual Commits**: Commits made at meaningful points during implementation
6. **PR Automation**: PR created automatically when task ticket is complete

---

## New Workflows

### create-task-tickets

**Purpose:** Create Kanban tickets for each task in a story, with code-level implementation plans based on architecture and story tasks.

**Agent:** DEV (Spring Backend Dev / Flutter Dev)  
**Phase:** 4 (Implementation)  
**Required:** Yes (before starting implementation)  
**Typical Duration:** 15-30 minutes per story

#### When to Use

Run **after story-context** and **before dev-story** for each story.

**Trigger Points:**
- After story-context.xml is generated
- Before starting implementation work
- When story has tasks that need decomposition

#### Process Overview

**Phase 1: Context Loading (Steps 1-2)**
- Load story file with UTF-8 encoding
- Load architecture document (if available)
- Extract story tasks and acceptance criteria

**Phase 2: Task Analysis (Step 3)**
- Parse all tasks/subtasks from story
- Filter tasks by agent_type (backend/mobile/frontend)
- Identify dependencies between tasks

**Phase 3: Code-Level Decomposition (Step 4)**
- For each task, create detailed implementation plan:
  - **Backend**: Files to create/modify, API endpoints, database changes, dependencies, test plan
  - **Frontend/Mobile**: UI components, screens, API integration, state management, test plan
- Use architecture document to inform patterns
- Determine task dependencies and priority order

**Phase 4: Ticket Creation (Step 5)**
- Create Kanban ticket for each task
- Include code-level implementation plan in ticket description
- Set priority and dependencies
- Store ticket IDs in story file

#### Inputs

Required:
- story-{epic}.{num}-{title}.md
- story-{epic}.{num}-context.xml

Optional:
- architecture.md
- epic-tech-context.md

#### Outputs

- Task-level Kanban tickets (one per task)
- Story file updated with task ticket references
- Priority order and dependencies documented

#### Ticket Description Format

```markdown
**Parent Story:** {story_key} - {story_title}
**Task Number:** {task_number}
**Type:** {task_type} ({agent_type})

**Problem:**
[Task-specific problem/requirement]

**Acceptance Criteria:**
[Task-specific ACs]

**Implementation Plan:**

**Files to Create/Modify:**
- [File 1: path, purpose, key changes]
- [File 2: path, purpose, key changes]

**Code-Level Tasks:**
- [ ] [Specific code task 1]
- [ ] [Specific code task 2]

**API Endpoints (if Backend):**
- [Endpoint 1: method, path, DTOs]

**UI Components (if Frontend/Mobile):**
- [Component 1: name, location, Figma link]

**Database Changes (if Backend):**
- [Change 1: table, columns, migration]

**Dependencies:**
- [Dependency 1: library/package]

**Test Plan:**
- [ ] [Test 1: type, scope]

**Dependencies on Other Tasks:**
- [Task number that must be completed first]
```

#### Related Workflows

- **story-context** - Provides story context
- **review-task-tickets** - Next step after ticket creation
- **dev-story** - Uses tickets for implementation

---

### review-task-tickets

**Purpose:** Review task tickets for implementation plan quality, completeness, and feasibility. Update tickets if needed.

**Agent:** DEV (Spring Backend Dev / Flutter Dev)  
**Phase:** 4 (Implementation)  
**Required:** Recommended (after create-task-tickets)  
**Typical Duration:** 10-20 minutes per story

#### When to Use

Run **after create-task-tickets** and **before dev-story**.

**Trigger Points:**
- After task tickets are created
- Before starting implementation work
- When tickets need quality review

#### Process Overview

**Phase 1: Ticket Loading (Step 1)**
- Load task tickets from Kanban
- Extract ticket IDs from story file

**Phase 2: Review Execution (Step 2)**
- For each ticket, review:
  - **Specificity**: Are code-level tasks specific enough?
  - **Completeness**: Are all necessary files identified?
  - **Feasibility**: Can the task be completed reasonably?
  - **Architecture Alignment**: Does it follow architecture patterns?
  - **Priority and Dependencies**: Are they correct?
  - **Agent Expertise Alignment**: Does it require correct expertise?

**Phase 3: Issue Identification (Step 3)**
- Categorize issues:
  - **Critical**: Must fix before starting work
  - **Important**: Should fix for better quality
  - **Nice to have**: Optional improvements

**Phase 4: Report and Update (Steps 4-5)**
- Generate review report
- Update tickets with improvements (if approved)

#### Review Criteria

**Specificity Check:**
- Code-level tasks specific enough?
- File paths clearly identified?
- Function/method names specified?
- API endpoints fully defined?
- UI components clearly described?

**Completeness Check:**
- All necessary files identified?
- Dependencies listed?
- Test plan included?
- Error handling considered?
- Edge cases addressed?

**Feasibility Check:**
- Can task be completed in reasonable time?
- Technical requirements achievable?
- Dependencies available?
- Task size appropriate?

**Architecture Alignment:**
- Follows architecture patterns?
- Naming conventions followed?
- Component structures aligned?
- Integration patterns correct?

#### Outputs

- Review report: `task-tickets-review-{story_key}-{date}.md`
- Updated tickets (if improvements needed)

#### Related Workflows

- **create-task-tickets** - Creates tickets to review
- **dev-story** - Uses reviewed tickets for implementation

---

### dev-story (Updated)

**Purpose:** Execute a story by implementing tasks based on Kanban tickets, working in priority order, with proper branch management and contextual commits.

**Agent:** DEV (Spring Backend Dev / Flutter Dev)  
**Phase:** 4 (Implementation)  
**Required:** Yes (for each story)  
**Typical Duration:** 2-8 hours per story (varies by complexity)

#### When to Use

Run **after review-task-tickets** to implement the story.

**Trigger Points:**
- After task tickets are reviewed
- When story status is IN PROGRESS
- For each story in story_queue

#### Process Overview (Updated)

**Phase 1: Ticket and Context Loading (Steps 0.3, 1)**
- Load task tickets from Kanban
- Sort tickets by priority and dependencies
- Load story file and story-context.xml
- Review acceptance criteria

**Phase 2: Worktree and Branch Setup (Step 0.5)**
- Determine agent type
- Get first task ticket (highest priority, no dependencies)
- Determine base branch:
  - First task: master (or from config)
  - Subsequent tasks: previous task branch
- Create worktree and branch for current task
- Update task ticket status to "inprogress"

**Phase 3: Implementation (Step 2)**
- Follow implementation plan from task ticket
- Create/modify files as specified
- Implement API endpoints (if Backend)
- Create UI components (if Frontend/Mobile)
- Follow architecture patterns
- Check off completed items in ticket

**Phase 4: Testing (Steps 3-4)**
- Write tests per test plan
- Run tests from worktree
- Verify acceptance criteria

**Phase 5: Contextual Commits (Step 6.3)**
- Commit changes at meaningful points:
  - Logical unit of work complete
  - File created or significantly modified
  - Tests added for a feature
  - Context/concern fully addressed
- Use meaningful commit messages

**Phase 6: Task Completion (Step 6.5)**
- Final commit for task
- Update task ticket status to "inreview"
- Invoke create-pr-from-ticket workflow

**Phase 7: Next Task or Story Completion (Steps 5, 6)**
- If more tasks: Move to next task (repeat from Phase 2)
- If all tasks complete: Mark story as READY FOR REVIEW

#### Key Changes from v1.0

1. **Ticket-Based Work**: Work is based on task tickets, not just story tasks
2. **Priority Order**: Tasks worked in priority order with dependency management
3. **Branch Management**: Each task gets its own branch, based on previous task branch
4. **Contextual Commits**: Commits made at meaningful points, not just at end
5. **Ticket Status Management**: Ticket status updated throughout (todo ? inprogress ? inreview ? done)
6. **PR Automation**: PR created automatically when task is complete

#### Branch Naming Convention

- Format: `{agent_type}/{story_key}-task-{task_number}`
- Example: `backend/1-2-user-auth-task-1`
- Base branch:
  - First task: `master`
  - Subsequent tasks: `{agent_type}/{story_key}-task-{previous_task_number}`

#### Commit Message Format

- Format: `feat({agent_type}): {context_description} - {specific_change}`
- Example: `feat(backend): UserService - Add registerUser method with validation`
- Use UTF-8 encoding for commit messages (especially Korean text)

#### Inputs

Required:
- story-{epic}.{num}-{title}.md
- story-{epic}.{num}-context.xml
- Task tickets (from create-task-tickets)

#### Outputs

- Implementation code (multiple files)
- Test files
- Updated story file (AC checked off)
- Updated task tickets (status: inreview)
- Pull requests (one per task)
- Updated sprint-status.yaml (status: READY FOR REVIEW)

#### Related Workflows

- **create-task-tickets** - Creates tickets to work on
- **review-task-tickets** - Reviews tickets before work
- **create-pr-from-ticket** - Creates PR when task complete
- **code-review** - Next step after story complete

---

### create-pr-from-ticket

**Purpose:** Create a pull request from a completed task ticket, using PR template and proper base branch.

**Agent:** DEV (Spring Backend Dev / Flutter Dev)  
**Phase:** 4 (Implementation)  
**Required:** Yes (automatically invoked by dev-story)  
**Typical Duration:** 5-10 minutes per task

#### When to Use

Automatically invoked by **dev-story** when a task ticket is completed.

**Trigger Points:**
- Task ticket status changed to "inreview"
- Task implementation complete
- All tests passing

#### Process Overview

**Phase 1: Ticket Loading (Step 1)**
- Load task ticket from Kanban
- Validate required inputs (base_branch, head_branch)

**Phase 2: PR Template Loading (Step 2)**
- Load PR template from `.github/pull_request_template.md`
- Use default template if not found

**Phase 3: Change Analysis (Step 3)**
- Get diff between base and head branches
- Analyze changed files
- Summarize key changes

**Phase 4: PR Creation (Step 4)**
- Fill PR template with:
  - Overview (task ticket info)
  - Changes and impact
  - Review points
  - Additional materials
  - Checklist
- Create PR with:
  - Base: Work started branch
  - Head: Current task branch
- Update task ticket with PR link

#### PR Title Format

- Format: `[{ticket_id}] {ticket_title}`
- Example: `[task-123] Story 1.2 Task 1: User Authentication Service`

#### PR Body Structure

Based on `.github/pull_request_template.md`:

```markdown
## ??
[Task ticket title and description]
[Parent story reference]
[Implementation summary]

## ???? ? ?? ??
[List of changed files]
[Key changes made]
[Affected modules/services]

## ??? ?? ?? ???
[Architecture decisions]
[Security considerations]
[Performance implications]
[Testing approach]

## ?? ??
[Task ticket link]
[Story file link]
[Architecture references]

## ?????
[Completed items based on implementation]
```

#### Inputs

Required:
- task_ticket_id
- base_branch (work started branch)
- head_branch (current task branch)

Optional:
- pr_template_path (default: `.github/pull_request_template.md`)

#### Outputs

- Pull request created in GitHub
- PR number and URL
- Task ticket updated with PR link

#### Related Workflows

- **dev-story** - Invokes this workflow when task complete
- **code-review** - Reviews PR after creation

---

## Updated Story Lifecycle Visualization

```
???????????????????????????????????????????????????????????????
? PHASE 4: IMPLEMENTATION (Kanban Ticket-Based Workflow)     ?
???????????????????????????????????????????????????????????????

???????????????????
? Sprint Planning ?  ? Creates sprint-status.yaml
???????????????????     Defines story queue
         ?
         ????????????????????????????????????????????
         ?                                          ?
         ?                                          ?
???????????????????????                            ?
? Epic Tech Context   ?  ? Optional per epic       ?
? (Once per epic)     ?     Provides technical     ?
???????????????????????     guidance              ?
         ?                                          ?
         ?                                          ?
???????????????????????????????????????????????????
? FOR EACH STORY IN QUEUE:                        ?
???????????????????????????????????????????????????
         ?                                          ?
         ?                                          ?
???????????????????                                ?
? Create Story    ?  ? Generates story file        ?
? (TODO ? IN PROGRESS)                            ?
???????????????????                                ?
         ?                                          ?
         ?                                          ?
???????????????????                                ?
? Story Context   ?  ? Assembles focused context   ?
???????????????????                                ?
         ?                                          ?
         ?                                          ?
???????????????????                                ?
? Create Task     ?  ? Creates task-level tickets  ?
? Tickets         ?     with code plans            ?
???????????????????                                ?
         ?                                          ?
         ?                                          ?
???????????????????                                ?
? Review Task     ?  ? Reviews ticket quality      ?
? Tickets         ?     and completeness           ?
???????????????????                                ?
         ?                                          ?
         ?                                          ?
???????????????????????????????????????????????????
? FOR EACH TASK TICKET (Priority Order):          ?
???????????????????????????????????????????????????
         ?                                          ?
         ?                                          ?
???????????????????                                ?
? Setup Worktree  ?  ? Create branch (base:        ?
? & Branch        ?     previous task or master)   ?
???????????????????                                ?
         ?                                          ?
         ?                                          ?
???????????????????                                ?
? Dev Story       ?  ? Implement task from ticket  ?
? (Task: todo ?   ?     - Follow code plan         ?
?  inprogress)    ?     - Contextual commits       ?
???????????????????                                ?
         ?                                          ?
         ?                                          ?
???????????????????                                ?
? Task Complete   ?  ? Update ticket: inreview      ?
?                 ?     Create PR                  ?
???????????????????                                ?
         ?                                          ?
         ????????????????????????????????????????????
         ? More tasks?
         ?
         ?
???????????????????
? Story Complete  ?  ? All tasks done
? (IN PROGRESS ?  ?     Story: READY FOR REVIEW
?  READY FOR REVIEW)                               ?
???????????????????
         ?
         ?
???????????????????
? Code Review     ?  ? Senior dev review
? (READY FOR      ?
?  REVIEW)        ?
???????????????????
         ?
    ???????????
    ? Result? ?
    ???????????
         ?
    ???????????????????????????
    ?    ?                    ?
    ?    ?                    ?
APPROVED  APPROVED           REQUEST
          WITH COMMENTS      CHANGES
    ?         ?                   ?
    ???????????????????????????????
              ?
              ?
    ???????????????????
    ? Story Done      ?  ? READY FOR REVIEW ? DONE
    ???????????????????
             ?
             ???????????????????????????????????????
             ? More stories?
             ?
             ?
    ??????????????????
    ? Epic Complete? ?
    ??????????????????
             ?
        ???????????
        ?         ?
       Yes       No
        ?         ???> Continue to next story
        ?
        ?
???????????????????
? Retrospective   ?  ? Review epic, lessons learned
???????????????????
```

---

## Best Practices for Phase 4 (Updated)

### 1. Always Create Task Tickets First

**Before starting implementation**, create task tickets with code-level plans. This ensures:
- Clear implementation roadmap
- Better estimation
- Easier tracking
- Proper prioritization

### 2. Review Tickets Before Starting Work

**Don't skip ticket review**. Review ensures:
- Implementation plans are complete
- Tasks are feasible
- Architecture alignment
- Proper prioritization

### 3. Work in Priority Order

**Follow ticket priority and dependencies**. This ensures:
- Dependencies are met
- Critical work done first
- Parallel work when possible

### 4. Use Proper Branch Management

**Each task gets its own branch**, based on previous task branch. This ensures:
- Clean git history
- Easy rollback
- Parallel work possible
- Clear task boundaries

### 5. Commit Contextually

**Commit at meaningful points**, not just at end. This ensures:
- Better git history
- Easier debugging
- Clear progress tracking
- Smaller, focused commits

### 6. Always Run story-context

Don't skip context assembly. DEV agent performs better with focused, relevant context.

### 7. Write Tests First (ATDD)

For P0/P1 stories, write failing tests first, then implement to make them pass.

### 8. Code Review P0/P1 Stories

Always review critical stories. P2/P3 can be optional reviews.

### 9. Run Retrospectives

Don't skip retrospectives. They provide valuable insights.

### 10. Use workflow-status

When unsure what to do next, run workflow-status.

### 11. Handle Korean Text Correctly

**Always use UTF-8 encoding** when reading/writing files with Korean text. Verify Korean characters are preserved correctly.

### 12. Maintain Agent Expertise

**Spring Backend Dev**: Follow DDD patterns, Spring Boot best practices, Kotlin idioms, API design  
**Flutter Dev**: Follow Figma designs, Flutter patterns, state management best practices, cross-platform considerations

---

## Common Anti-Patterns (Updated)

### ? Starting Work Without Task Tickets

"Let's just start coding, we'll figure it out."
? **Result**: Unclear scope, missed requirements, poor estimation

### ? Skipping Ticket Review

"The tickets look fine, let's start."
? **Result**: Incomplete plans, missing dependencies, rework

### ? Ignoring Priority Order

"Let's do the easy tasks first."
? **Result**: Blocked by dependencies, critical work delayed

### ? Not Using Proper Branches

"Let's work on master directly."
? **Result**: Conflicts, unclear history, hard to rollback

### ? Committing Only at End

"Let's commit everything at once."
? **Result**: Large commits, hard to review, unclear progress

### ? Skipping story-context

"The DEV agent can just read the full PRD."
? **Result**: Slow context loading, irrelevant info, slower implementation

### ? No Code Reviews

"Code reviews slow us down, skip them."
? **Result**: Technical debt, inconsistent quality, bugs

### ? Skipping Retrospectives

"We're too busy shipping, no time for retros."
? **Result**: Repeat mistakes, no process improvement

### ? Correct Approach

- Create task tickets with code plans
- Review tickets before starting
- Work in priority order
- Use proper branch management
- Commit contextually
- Always assemble story context
- Review P0/P1 stories
- Run retrospectives after epics
- Use workflow-status for guidance
- Handle Korean text with UTF-8
- Maintain agent expertise

---

## Summary

Phase 4 Implementation follows a **Kanban ticket-based workflow**:

| Workflow              | Purpose             | Frequency         |
| --------------------- | ------------------- | ----------------- |
| **sprint-planning**   | Initialize tracking | Once at start     |
| **epic-tech-context** | Technical guidance  | Once per epic     |
| **create-story**      | Generate story file | Per story         |
| **story-context**     | Assemble context    | Per story         |
| **create-task-tickets** | Create task tickets | Per story         |
| **review-task-tickets** | Review tickets | Per story         |
| **dev-story**         | Implement tasks     | Per story         |
| **create-pr-from-ticket** | Create PR | Per task          |
| **code-review**       | Review quality      | Per story (P0/P1) |
| **correct-course**    | Handle changes      | As needed         |
| **retrospective**     | Learn and improve   | After each epic   |

**Key Takeaway:** Implementation is iterative and incremental with task-level tracking. Create task tickets with code plans, review them, work in priority order, use proper Git workflow, and create PRs automatically. Use retrospectives to continuously improve.

**Next:** Testing & QA (testarch workflows) run in parallel with implementation.

See: [workflows-testing.md](./workflows-testing.md)

---

## Additional Resources

- [Korean Encoding Guide](./korean-encoding-guide.md) - Handling Korean text in workflows
- [Agent Expertise Review](./agent-expertise-review.md) - Maintaining agent expertise
- [Improvement Plan](./improvement-plan-kanban-workflow.md) - Detailed improvement plan
