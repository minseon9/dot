# Create Ubiquitous Language - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow creates the ubiquitous language that ALL agents must use. This is the single source of truth for domain terminology.</critical>

<workflow>
  <step n="1" goal="Initialize language registry">
    <action>Create language directory: {output_folder}/ubiquitous-language/</action>
    <action>Initialize language file: {{language_file}}</action>
    <action>If language file exists, load it for updating</action>
  </step>

  <step n="2" goal="Discover domain terms">
    <action>Collaborate with user to identify domain terms:
      - Core domain concepts
      - Business terms
      - Technical terms (that are domain-specific)
      - Actions/verbs in the domain
      - Relationships
    </action>
    <action>For each term, define:
      - Term (exact word/phrase)
      - Definition (clear, unambiguous)
      - Context (where it's used)
      - Examples (usage examples)
      - Related terms
    </action>
    <template-output file="{language_file}">domain_terms</template-output>
  </step>

  <step n="3" goal="Organize language by bounded contexts">
    <action>Group terms by bounded context:
      - Each bounded context has its own terms
      - Terms can be shared (but clearly marked)
      - Context-specific meanings documented
    </action>
    <action>Define context boundaries and relationships</action>
    <template-output file="{language_file}">language_structure</template-output>
  </step>

  <step n="4" goal="Create language registry format">
    <action>Structure language as YAML:
      - Terms organized by bounded context
      - Each term has: definition, context, examples, related
      - Version tracking
      - Last updated date
    </action>
    <action>Ensure format is easily readable by agents</action>
    <template-output file="{language_file}">language_registry</template-output>
  </step>

  <step n="5" goal="Save and notify agents">
    <action>Save language file</action>
    <action>Create language reference document for agents</action>
    <action>Document how agents should load and use language</action>
    <output>**? Ubiquitous Language Created Successfully, {user_name}!**

**Language Details:**
- Language File: {{language_file}}
- Terms Defined: {{term_count}}
- Bounded Contexts: {{context_count}}

**CRITICAL: All agents must now use this language!**
- Run `sync-language-to-agents` to propagate to all agents
- Agents should load this file in their critical_actions
    </output>
  </step>
</workflow>