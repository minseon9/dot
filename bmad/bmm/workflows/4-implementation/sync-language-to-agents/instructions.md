# Sync Language to Agents - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow ensures ALL agents load and use the ubiquitous language.</critical>

<workflow>
  <step n="1" goal="Load language and find agents">
    <action>Load ubiquitous language file: {{language_file}}</action>
    <action>Verify language file exists and is valid</action>
    <action>Find all agent YAML files in {{agent_dir}}</action>
    <action>List all agents that need language integration</action>
  </step>

  <step n="2" goal="Update agent critical_actions">
    <action>For each agent YAML file:
      1. Load agent file
      2. Check if critical_actions exists
      3. Check if language loading action exists
      4. If missing, add:
         - "Load ubiquitous language from {output_folder}/ubiquitous-language/ubiquitous-language.yaml"
         - "Use ONLY terms from ubiquitous language - never invent domain terms"
         - "If domain term needed but not in language, STOP and ask DDD Expert to add it"
      5. Save updated agent file
    </action>
    <template-output>agent_updates</template-output>
  </step>

  <step n="3" goal="Verify integration">
    <action>For each updated agent, verify:
      - Language loading action is present
      - Action is in correct format
      - Agent will load language on startup
    </action>
    <output>**? Language Synced to All Agents, {user_name}!**

**Updated Agents:**
{{agent_list}}

**Next Steps:**
1. Agents will now load ubiquitous language on startup
2. Run `check-agent-language-compliance` to verify usage
3. When language updates, run this workflow again to sync
    </output>
  </step>
</workflow>