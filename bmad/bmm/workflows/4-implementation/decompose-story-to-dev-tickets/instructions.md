# Decompose Story to Dev Tickets - Workflow Instructions

<critical>The workflow execution engine is governed: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow decomposes a story ticket into prioritized development tasks. Each agent creates multiple task tickets for their specific work, with each task limited to ~500 lines of code changes.</critical>
<critical>Uses Vibe Kanban MCP tools for ticket management.</critical>

<workflow>

  <step n="1" goal="Load config and identify story ticket">
    <action>Resolve variables from config_source: story_dir, output_folder, user_name, communication_language</action>
    <action>If {{story_ticket_id}} not provided:
      1. If {{story_file}} or {{story_key}} provided:
         - Load story file
         - Extract ticket_id from story file (Vibe Kanban Ticket section)
      2. If not found, ask user for story_ticket_id
    </action>
    <action>If {{story_file}} not provided and {{story_key}} provided:
      - Construct path: {{story_dir}}/{{story_key}}.md
      - Load story file
    </action>
    <action>If {{story_file}} provided:
      - Load the COMPLETE story file
      - Extract story_key, epic_num, story_num, story_title
    </action>
    <action>If {{story_file}} not provided but {{story_key}} provided:
      - Parse story_key to extract epic_num and story_num (format: "{{epic_num}}-{{story_num}}-{{title-slug}}")
      - If parsing fails, load story file from {{story_dir}}/{{story_key}}.md to extract epic_num, story_num, story_title
    </action>
    <action>Get story ticket from Vibe Kanban using mcp_vibe_kanban_get_task with {{story_ticket_id}}</action>
    <action>Extract from story ticket:
      - Story key (from title or description)
      - If epic_num or story_num not yet extracted:
        * Parse ticket title if it matches "Story {{epic_num}}.{{story_num}}: {{story_title}}" format
        * Extract epic_num, story_num, story_title from ticket title
      - Problem definition
      - Acceptance criteria
      - Technical context
    </action>
    <action>If epic_num, story_num, or story_title still missing:
      - Load story file from {{story_dir}}/{{story_key}}.md (if story_key available)
      - Or ask user to provide story_file or epic_num, story_num, story_title
    </action>
    <action>If {{project_id}} not provided:
      - Extract from story ticket or ask user
    </action>
  </step>

  <step n="2" goal="Analyze story and identify agent-specific work breakdown">
    <action>Load story file completely (if not already loaded)</action>
    <action>If story file loaded and epic_num, story_num, or story_title missing:
      - Extract story_key, epic_num, story_num, story_title from story file
    </action>
    <action>Analyze story content comprehensively:
      - Review Acceptance Criteria
      - Review Tasks/Subtasks
      - Review Dev Notes (technical context)
      - Review Architecture references
      - Review DDD documentation references
      - Review API interface requirements
      - Review Database schema requirements
    </action>
    <action>Determine agent type from context:
      - If calling agent is Spring Backend Dev: agent_type = "backend"
      - If calling agent is Flutter Dev: agent_type = "mobile"
      - If {{agent_type}} explicitly provided: use provided value
      - Otherwise: ask user which agent type
    </action>
    <action>Identify agent-specific work breakdown based on agent_type:

      <check if="agent_type == 'backend'">
        <action>Identify Backend (BE) work areas:
          - API endpoints to create/modify (REST controllers, request/response DTOs)
          - Domain model entities and value objects
          - Database schema changes (tables, columns, indexes, migrations)
          - Domain services and business logic
          - Repository/data access layer
          - Application services (orchestration)
          - Integration interfaces (external systems, messaging)
          - Authentication/authorization logic
          - Background jobs/workers
          - Testing requirements (unit, integration, API tests)
        </action>
      </check>

      <check if="agent_type == 'mobile' or agent_type == 'flutter'">
        <action>Identify Mobile (MB) work areas:
          - Storage layer (local database, shared preferences, file storage)
          - Server communication layer (API clients, network services)
          - Core domain entities and interfaces (matching backend ubiquitous language)
          - State management (Provider/Riverpod/Bloc state definitions)
          - UI screens and widgets (Figma design implementation)
          - Navigation (routes, deep linking)
          - Platform-specific features (iOS/Android)
          - Testing requirements (widget tests, integration tests, golden tests)
        </action>
      </check>

      <check if="agent_type == 'frontend'">
        <action>Identify Frontend (FE) work areas:
          - Web UI components
          - Web pages/screens
          - Web state management
          - Web API integration
          - Web routing
          - Web styling/design implementation
        </action>
      </check>
    </action>
  </step>

  <step n="3" goal="Decompose work into prioritized tasks (max 500 lines per task)">
    <critical>Each task must be scoped to approximately 500 lines of code changes or less. Break down larger work into multiple tasks.</critical>
    
    <check if="agent_type == 'backend'">
      <action>Decompose Backend work into detailed tasks, ensuring each task is ~500 lines or less:

        For each identified work area, break down into specific implementation tasks:
        
        **Task Decomposition Rules:**
        - Each API endpoint definition = 1 task (if simple) or split if complex
        - Domain model creation = 1 task per aggregate/entity group
        - Database schema changes = 1 task per migration
        - Service implementation = 1 task per service (split if >500 lines)
        - Repository implementation = 1 task per repository
        - Integration interface = 1 task per integration
        - Test suite = included in each task (not separate)

        **Estimate code changes for each task:**
        - Count files to create/modify
        - Estimate lines per file
        - If total > 500 lines, split into multiple tasks
      </action>

      <action>Assign priority to each Backend task based on dependency order:

        **Backend Priority Order (1 = highest priority):**
        
        Priority 1: API Interface Definition
        - Define REST API endpoints (controllers, request/response DTOs)
        - Define API contracts and interfaces
        - Document API specifications
        
        Priority 2: Domain Model and Database Schema
        - Define domain entities and value objects
        - Define database schema (tables, columns, indexes)
        - Create database migrations
        - Define repository interfaces
        
        Priority 3: Domain Logic and Collaborations
        - Implement domain services
        - Implement business logic within aggregates
        - Define domain model collaborations
        - Implement abstractions and interfaces for domain logic
        
        Priority 4: Integration Interfaces
        - Implement application services
        - Define interfaces for external system communication
        - Implement repository data access layer
        - Implement messaging/event interfaces
        
        Priority 5+: Additional Implementation
        - Background jobs/workers
        - Authentication/authorization implementation
        - Additional integrations
        - Performance optimizations

        **Priority Assignment Rules:**
        - Tasks that other tasks depend on get higher priority
        - API interfaces must be defined before implementation
        - Domain models must be defined before business logic
        - Integration interfaces come after domain logic
        - Number priorities sequentially (1, 2, 3, 4, 5, ...)
      </action>
    </check>

    <check if="agent_type == 'mobile' or agent_type == 'flutter'">
      <action>Decompose Mobile work into detailed tasks, ensuring each task is ~500 lines or less:

        For each identified work area, break down into specific implementation tasks:
        
        **Task Decomposition Rules:**
        - Storage layer implementation = 1 task per storage type
        - API client implementation = 1 task per API service
        - Core entities/interfaces = 1 task per domain model group
        - State management = 1 task per state provider/notifier
        - UI screen = 1 task per screen (split if >500 lines)
        - Widget component = 1 task per complex widget (split if >500 lines)
        - Test suite = included in each task (not separate)

        **Estimate code changes for each task:**
        - Count files to create/modify
        - Estimate lines per file
        - If total > 500 lines, split into multiple tasks
      </action>

      <action>Assign priority to each Mobile task based on dependency order:

        **Mobile Priority Order (1 = highest priority):**
        
        Priority 1: Storage and Server Communication + Core Entities/Interfaces
        - Implement storage layer (local database, shared preferences)
        - Implement API client layer (network services, API clients)
        - Define core domain entities matching backend ubiquitous language
        - Define interfaces for core communication
        
        Priority 2: State Management
        - Define state models (data classes, sealed classes)
        - Implement state providers/notifiers
        - Define state management architecture
        
        Priority 3: UI Implementation
        - Implement Flutter screens based on Figma designs
        - Implement reusable widgets
        - Implement navigation
        - Platform-specific UI adaptations
        
        Priority 4+: Additional Features
        - Platform-specific features (iOS/Android)
        - Animations and transitions
        - Performance optimizations
        - Accessibility features

        **Priority Assignment Rules:**
        - Storage/API communication must be ready before state management
        - Core entities must match backend ubiquitous language
        - State management must be ready before UI
        - UI depends on state and API communication
        - Number priorities sequentially (1, 2, 3, 4, 5, ...)
      </action>
    </check>

    <action>Create task list with priorities:
      - For each decomposed task, record:
        * Task description
        * Estimated lines of code (must be ? 500)
        * Priority number
        * Dependencies on other tasks (by priority number)
        * Files to create/modify
        * Test requirements
    </action>

    <action>Validate task breakdown:
      - Ensure no task exceeds 500 lines estimate
      - Ensure priorities follow dependency order
      - Ensure all story requirements are covered
      - Ask user to review and approve task breakdown if needed
    </action>
  </step>

  <step n="4" goal="Create detailed implementation plan for each task">
    <critical>Each task implementation plan MUST be completely standalone - someone with NO prior context should be able to understand and implement the task by reading only this ticket. This requires:</critical>
    <critical>1. Comprehensive Context section with all necessary background information, examples, and explanations</critical>
    <critical>2. Concrete code-level examples showing actual class/function signatures, data structures, and implementation patterns specific to that task</critical>
    <critical>3. All context must include concrete examples, not just abstract descriptions</critical>
    <critical>Do not use generic examples - create specific examples based on the actual task requirements and story context.</critical>
    
    <action>Load and reference story file content to extract context information:
      - Story problem and requirements
      - Acceptance criteria
      - Technical context from Dev Notes
      - Architecture references
      - DDD documentation references
      - Existing code patterns mentioned
      - Integration requirements
    </action>
    
    <action>For each task in priority order, create detailed implementation plan using story context:

      **Task Implementation Plan Format:**

      ```
      **Task Priority {{priority}}: {{task_name}}**

      **Objective:**
      [Clear description of what this task accomplishes]

      **Context (Standalone Implementation Guide):**
      [CRITICAL: This section must enable someone with NO prior context to understand and implement this task. Include:]
      
      **Why This Task Exists:**
      - [Explain the business need or technical requirement this task addresses]
      - [Explain how this task fits into the overall story]
      - [Explain what problem this task solves]
      
      **Story Context:**
      - Parent Story: {{story_key}} - {{story_title}}
      - Story Problem: [Brief summary of the overall story problem]
      - This Task's Role: [How this specific task contributes to solving the story problem]
      - Example: "The story requires user authentication. This task defines the API interface that frontend/mobile will use to authenticate users. Without this interface, other teams cannot proceed with their implementation."
      
      **Technical Context:**
      - [Explain the technical domain/area this task belongs to]
      - [Explain relevant architectural patterns or design decisions]
      - [Explain any constraints or requirements]
      - Example: "This API follows RESTful conventions. We use Spring Boot with Kotlin. The API must use ubiquitous language terms from docs/ddd/ubiquitous-language/ubiquitous-language.yaml. Authentication uses JWT tokens."
      
      **Dependency Context:**
      - [Explain what this task depends on (other tasks, existing code, external systems)]
      - [Explain what depends on this task (future tasks that will use this)]
      - [Explain the data flow or interaction flow]
      - Example: "This task creates the API interface. Priority 2 task will implement the domain model that this API uses. Priority 3 task will implement the business logic. Mobile team will consume this API in their Priority 1 task."
      
      **Domain Context (with Examples):**
      - [Explain relevant domain concepts using ubiquitous language]
      - [Provide concrete examples of domain entities and their relationships]
      - [Explain business rules that apply]
      - Example: "In our domain, a 'User' represents an authenticated person in the system. A 'User' has an 'email' (unique identifier) and 'name' (display name). Users can have multiple 'Sessions' (active login sessions). The 'User' aggregate is in the 'auth' bounded context."
      
      **Code Context (with Examples):**
      - [Explain existing code patterns this task should follow]
      - [Show examples of similar existing implementations]
      - [Explain file structure and organization]
      - Example: "Controllers are in server/app/auth/controller/. Services are in server/app/auth/service/. DTOs are in server/app/auth/dto/. Follow the pattern of existing UserController for structure. See server/app/auth/controller/UserController.kt as reference."
      
      **Integration Context (with Examples):**
      - [Explain how this task integrates with other parts of the system]
      - [Show examples of integration points]
      - [Explain data flow between components]
      - Example: "This API will be called by the Flutter mobile app. The mobile app sends a POST request to /api/v1/auth/login with email and password. The API returns a JWT token that the mobile app stores and uses for subsequent requests."

      **Estimated Code Changes:** ~{{lines}} lines

      **Files to Create:**
      - [File path 1]: [Purpose, estimated lines]
      - [File path 2]: [Purpose, estimated lines]
      ...

      **Files to Modify:**
      - [File path 1]: [Changes needed, estimated lines]
      - [File path 2]: [Changes needed, estimated lines]
      ...

      **Implementation Steps (Code Level):**
      1. [Specific step with file and function/class names]
      2. [Specific step with file and function/class names]
      3. [Specific step with file and function/class names]
      ...

      **Code Examples (Concrete Implementation Details):**
      [CRITICAL: Include actual code examples specific to this task, not generic templates. Show real class/function names, method signatures, data structures, and implementation patterns that will be used in this specific task. Examples should reflect the actual domain entities, API endpoints, and business logic for this task.]

      **Test Implementation Plan:**
      - Unit Tests:
        * [Test file 1]: [What to test, test cases]
        * [Test file 2]: [What to test, test cases]
      - Integration Tests:
        * [Test file 1]: [What to test, test scenarios]
        * [Test file 2]: [What to test, test scenarios]
      - API/Widget Tests:
        * [Test file 1]: [What to test, test scenarios]
        * [Test file 2]: [What to test, test scenarios]

      **Dependencies:**
      - Depends on Priority {{dependency_priority}} task: {{task_name}}
      - [Other dependencies]

      **Acceptance Criteria:**
      1. [Specific, testable criterion]
      2. [Specific, testable criterion]
      ...

      **Definition of Done:**
      - [ ] Code implemented according to plan
      - [ ] All tests written and passing
      - [ ] Code review ready
      - [ ] Documentation updated (if needed)
      ```

      <check if="agent_type == 'backend'">
        <action>For Backend tasks, include comprehensive context in "Context" section:

          **Backend Context Requirements:**
          
          1. **Story Context:**
             - Explain what part of the story this backend task implements
             - Explain which user-facing feature this enables
             - Example: "This task implements the backend API for user profile management. Users can view and edit their profile information through the mobile app. This is part of Story 1.2: User Profile Management."
          
          2. **Technical Context:**
             - Explain Spring Boot architecture patterns used
             - Explain Kotlin conventions and idioms
             - Explain DDD patterns (bounded context, aggregates, entities)
             - Explain database technology and patterns
             - Example: "We use Spring Boot layered architecture: Controller ? Service ? Repository. Controllers handle HTTP requests/responses. Services contain business logic. Repositories handle data access. We follow DDD patterns: entities are in the 'auth' bounded context, stored in PostgreSQL database."
          
          3. **Domain Context:**
             - Reference ubiquitous language from docs/ddd/ubiquitous-language/ubiquitous-language.yaml
             - Explain domain entities and their relationships
             - Explain business rules and validation rules
             - Example: "According to ubiquitous language, a 'User' is an authenticated person. A 'User' has 'email' (String, unique, required), 'name' (String, required, max 100 chars), and 'createdAt' (DateTime). Business rule: email must be valid format. Validation: email must be unique in the system."
          
          4. **Code Context:**
             - Reference existing similar implementations
             - Explain file structure and naming conventions
             - Show examples of similar patterns
             - Example: "Controllers follow pattern: server/app/{bounded-context}/controller/{Entity}Controller.kt. See server/app/auth/controller/UserController.kt for reference. DTOs are in server/app/{bounded-context}/dto/. Services are in server/app/{bounded-context}/service/. Repositories are in server/app/{bounded-context}/repository/."
          
          5. **Integration Context:**
             - Explain API contract (endpoints, request/response formats)
             - Explain how mobile/frontend will consume this
             - Explain database schema and relationships
             - Example: "This API exposes POST /api/v1/users endpoint. Request body: {email: string, name: string, password: string}. Response: 201 Created with {id: number, email: string, name: string}. Mobile app will call this endpoint during user registration. Data is stored in 'users' table with columns: id (BIGSERIAL), email (VARCHAR UNIQUE), name (VARCHAR), password_hash (VARCHAR)."
          
          6. **Dependency Context:**
             - Explain what existing code this uses
             - Explain what other tasks depend on this
             - Explain external dependencies (libraries, services)
             - Example: "This task uses existing JwtTokenService for token generation. This task creates the API interface that Priority 2 task (domain model) will implement. Priority 3 task (business logic) will use the domain model. Mobile team's Priority 1 task will consume this API."
        </action>
        <action>For Backend tasks, include in implementation plan:
          - Specific controller classes and methods
          - Specific DTO classes and properties
          - Specific entity/aggregate classes
          - Specific repository interfaces and implementations
          - Specific service classes and methods
          - Database migration scripts
          - Test classes with specific test methods
          - API contract specifications
        </action>
        <action>For Backend tasks, include concrete code examples in "Code Examples" section. These examples MUST be specific to the actual task being implemented, not generic templates. Include:
          - Actual controller class with method signatures for this specific task:
            ```kotlin
            @RestController
            @RequestMapping("/api/v1/users")
            class UserController(
                private val userService: UserService
            ) {
                @PostMapping
                fun createUser(@RequestBody request: CreateUserRequest): ResponseEntity<UserResponse> {
                    // Implementation details
                }
            }
            ```
          - Example DTO classes with properties:
            ```kotlin
            data class CreateUserRequest(
                val email: String,
                val name: String,
                val password: String
            )
            ```
          - Example entity classes:
            ```kotlin
            @Entity
            @Table(name = "users")
            class User(
                @Id @GeneratedValue
                val id: Long,
                val email: String,
                val name: String
            )
            ```
          - Example repository interface:
            ```kotlin
            interface UserRepository : JpaRepository<User, Long> {
                fun findByEmail(email: String): User?
            }
            ```
          - Example service class:
            ```kotlin
            @Service
            class UserService(
                private val userRepository: UserRepository
            ) {
                fun createUser(request: CreateUserRequest): User {
                    // Implementation details
                }
            }
            ```
          - Example test class structure:
            ```kotlin
            @SpringBootTest
            class UserControllerTest {
                @Test
                fun `createUser__given_validRequest__then_returnsUserResponse`() {
                    // Test implementation
                }
            }
            ```
          - Database migration example (if applicable):
            ```sql
            CREATE TABLE users (
                id BIGSERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                name VARCHAR(255) NOT NULL
            );
            ```
        </action>
      </check>

      <check if="agent_type == 'mobile' or agent_type == 'flutter'">
        <action>For Mobile tasks, include comprehensive context in "Context" section:

          **Mobile Context Requirements:**
          
          1. **Story Context:**
             - Explain what part of the story this mobile task implements
             - Explain which user-facing feature this enables
             - Example: "This task implements the user profile screen in the Flutter mobile app. Users can view and edit their profile information. This is part of Story 1.2: User Profile Management. The screen displays user's name, email, and allows editing these fields."
          
          2. **Technical Context:**
             - Explain Flutter architecture patterns used
             - Explain state management approach (Riverpod/Provider/Bloc)
             - Explain Dart conventions and idioms
             - Explain platform-specific considerations (iOS/Android)
             - Example: "We use Riverpod for state management. Screens are in lib/screens/. Widgets are in lib/widgets/. State providers are in lib/providers/. API clients are in lib/api/. Storage is in lib/storage/. We follow Flutter best practices: const constructors, proper keys, widget composition."
          
          3. **Domain Context:**
             - Reference ubiquitous language from docs/ddd/ubiquitous-language/ubiquitous-language.yaml
             - Explain domain entities matching backend
             - Explain business rules that apply in UI
             - Example: "We use the same domain terms as backend. A 'User' entity matches backend structure: {id: string, email: string, name: string}. UI validation rules: email must be valid format, name must be 1-100 characters. These match backend validation rules."
          
          4. **Design Context:**
             - Reference Figma design files
             - Explain design system components used
             - Explain layout and styling requirements
             - Example: "This screen follows Figma design: https://figma.com/file/xxx. Uses design system colors: primary (blue-500), secondary (gray-200). Typography: heading (text-2xl, font-bold), body (text-base). Spacing: padding-4, gap-2. Follows Material Design 3 guidelines."
          
          5. **Code Context:**
             - Reference existing similar implementations
             - Explain file structure and naming conventions
             - Show examples of similar patterns
             - Example: "Screens follow pattern: lib/screens/{feature}/{Feature}Screen.dart. See lib/screens/auth/LoginScreen.dart for reference. State providers are in lib/providers/{feature}/{feature}_provider.dart. API clients are in lib/api/{feature}_api_client.dart. Follow the pattern of existing ProfileScreen for structure."
          
          6. **Integration Context:**
             - Explain API integration (endpoints, request/response)
             - Explain local storage usage
             - Explain navigation flow
             - Example: "This screen calls GET /api/v1/users/me to fetch user data. On save, calls PUT /api/v1/users/me with updated data. User data is cached in local storage using UserStorage. After successful update, navigates back to previous screen. Uses UserApiClient for API calls."
          
          7. **Dependency Context:**
             - Explain what existing code this uses
             - Explain what other tasks depend on this
             - Explain external dependencies (packages, services)
             - Example: "This task uses existing UserApiClient from Priority 1 task. This task uses UserStorage from Priority 1 task. This screen is accessed from main navigation menu. Priority 3 task (additional features) may add more functionality to this screen. Uses riverpod package for state management, dio package for HTTP."
        </action>
        <action>For Mobile tasks, include in implementation plan:
          - Specific screen/widget classes
          - Specific state management classes
          - Specific API client classes and methods
          - Specific storage classes and methods
          - Specific entity/model classes
          - Test classes with specific test scenarios
          - Figma design references
        </action>
        <action>For Mobile tasks, include concrete code examples in "Code Examples" section. These examples MUST be specific to the actual task being implemented, not generic templates. Include:
          - Actual screen class structure for this specific task:
            ```dart
            class UserProfileScreen extends StatelessWidget {
              const UserProfileScreen({super.key});
              
              @override
              Widget build(BuildContext context) {
                return Scaffold(
                  appBar: AppBar(title: const Text('User Profile')),
                  body: // Implementation details
                );
              }
            }
            ```
          - Example state management (Riverpod/Provider):
            ```dart
            @riverpod
            class UserNotifier extends _$UserNotifier {
              @override
              Future<User> build() async {
                return await ref.read(userRepositoryProvider).getCurrentUser();
              }
              
              Future<void> updateUser(User user) async {
                // Implementation details
              }
            }
            ```
          - Example API client class:
            ```dart
            class UserApiClient {
              final Dio _dio;
              
              UserApiClient(this._dio);
              
              Future<User> getUser(String id) async {
                final response = await _dio.get('/api/v1/users/$id');
                return User.fromJson(response.data);
              }
            }
            ```
          - Example storage class:
            ```dart
            class UserStorage {
              final SharedPreferences _prefs;
              
              UserStorage(this._prefs);
              
              Future<void> saveUser(User user) async {
                await _prefs.setString('user', jsonEncode(user.toJson()));
              }
            }
            ```
          - Example entity/model class:
            ```dart
            class User {
              final String id;
              final String email;
              final String name;
              
              User({required this.id, required this.email, required this.name});
              
              factory User.fromJson(Map<String, dynamic> json) {
                return User(
                  id: json['id'],
                  email: json['email'],
                  name: json['name'],
                );
              }
            }
            ```
          - Example widget test:
            ```dart
            void main() {
              testWidgets('UserProfileScreen__given_userData__then_displaysUserInfo', (tester) async {
                // Test implementation
              });
            }
            ```
        </action>
      </check>
    </action>

    <action>Store all task plans in structured format for ticket creation</action>
  </step>

  <step n="5" goal="Create prioritized task tickets in Vibe Kanban">
    <action>Verify {{project_id}} is valid</action>
    
    <action>For each task in priority order (1, 2, 3, ...), create ticket:

      <check if="agent_type == 'backend'">
        <action>Create BE task ticket using mcp_vibe_kanban_create_task:
          - project_id: {{project_id}}
          - title: "{{epic_num}}.{{story_num}}-{{priority}} BE: {{story_title}}"
          - description: [Full task implementation plan from step 4]
        </action>
      </check>

      <check if="agent_type == 'mobile' or agent_type == 'flutter'">
        <action>Create MB task ticket using mcp_vibe_kanban_create_task:
          - project_id: {{project_id}}
          - title: "{{epic_num}}.{{story_num}}-{{priority}} MB: {{story_title}}"
          - description: [Full task implementation plan from step 4]
        </action>
      </check>

      <check if="agent_type == 'frontend'">
        <action>Create FE task ticket using mcp_vibe_kanban_create_task:
          - project_id: {{project_id}}
          - title: "{{epic_num}}.{{story_num}}-{{priority}} FE: {{story_title}}"
          - description: [Full task implementation plan from step 4]
        </action>
      </check>

      <action>Store ticket_id for each created ticket with its priority</action>
    </action>

    <action>Create ticket dependency mapping:
      - For each ticket, record which priority tickets it depends on
      - Store this mapping for develop-story workflow reference
    </action>

    <action>Update story file with dev ticket references:
      - Add "## Dev Tickets" section if not exists
      - List all created task tickets in priority order:
        * Priority 1: {{ticket_id_1}} - {{ticket_title_1}}
        * Priority 2: {{ticket_id_2}} - {{ticket_title_2}}
        * Priority 3: {{ticket_id_3}} - {{ticket_title_3}}
        ...
      - Add note: "Tasks should be developed in priority order. Each priority task becomes the base branch for the next priority task."
    </action>
  </step>

  <step n="6" goal="Report ticket creation and development workflow guidance">
    <action>Verify all tickets were created successfully</action>
    
    <action>Generate development workflow guidance for develop-story workflow:
      - Priority order: Tasks must be developed in priority order (1, 2, 3, ...)
      - Base branch strategy: Each priority task's branch becomes the base for the next priority
      - Example: Priority 1 ? branch "story-1-2-p1", Priority 2 ? branch from "story-1-2-p1" as "story-1-2-p2"
    </action>

    <output>**? Dev Task Tickets Created Successfully, {user_name}!**

**Story:** {{story_key}} - {{story_title}}

**Created Task Tickets (in priority order):**

<check if="agent_type == 'backend'">
**Backend (BE) Tasks:**
<for-each task in priority order>
- **Priority {{priority}}: {{ticket_id}}**
  - Title: {{epic_num}}.{{story_num}}-{{priority}} BE: {{story_title}}
  - Estimated Lines: ~{{lines}} lines
  - Dependencies: {{dependencies}}
  - Status: todo
</for-each>
</check>

<check if="agent_type == 'mobile' or agent_type == 'flutter'">
**Mobile (MB) Tasks:**
<for-each task in priority order>
- **Priority {{priority}}: {{ticket_id}}**
  - Title: {{epic_num}}.{{story_num}}-{{priority}} MB: {{story_title}}
  - Estimated Lines: ~{{lines}} lines
  - Dependencies: {{dependencies}}
  - Status: todo
</for-each>
</check>

**Development Workflow:**
1. Start with Priority 1 task - create branch from story branch
2. Complete Priority 1: implement, test, code review, merge
3. Start Priority 2 task - create branch from Priority 1 branch (as base)
4. Continue in priority order, using previous priority as base branch
5. Each task includes comprehensive test implementation
6. Each task is limited to ~500 lines of code changes

**Next Steps:**
1. Review task tickets in Vibe Kanban
2. Begin development with Priority 1 task using *develop-story workflow
3. Follow priority order for subsequent tasks
4. Update story when all tasks are completed
    </output>
  </step>

</workflow>
