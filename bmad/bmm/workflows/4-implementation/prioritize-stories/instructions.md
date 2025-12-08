# Prioritize Stories - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow prioritizes stories based on metrics, business value, and impact. Uses data-driven analysis for ranking.</critical>

<workflow>

  <step n="1" goal="Load config and identify stories to prioritize">
    <action>Resolve variables from config_source: story_dir, output_folder, user_name, communication_language</action>
    <action>Load sprint-status.yaml to get backlog stories</action>
    <action>If {{prioritize_all}} == true:
      1. Load all stories with status "backlog" or "drafted"
      2. Load story files from {{story_dir}}
    </action>
    <action>If specific stories requested:
      1. Load specified story files
      2. Extract story metadata
    </action>
    <action>Determine prioritization method:
      - "metrics": Prioritize based on metrics impact
      - "value": Prioritize based on business value
      - "impact": Prioritize based on user/technical impact
      - "custom": Use custom criteria
    </action>
  </step>

  <step n="2" goal="Extract metrics and value data from stories">
    <action>For each story, extract:
      - Problem Definition (to understand value)
      - Metrics section (for impact measurement)
      - Solution Results (if implemented, for success metrics)
      - Epic priority (if available)
      - Dependencies
    </action>
    <action>Analyze metrics for each story:
      - Expected impact (if metrics defined)
      - Measurable outcomes
      - Baseline vs target values
      - Current actual values (if available)
    </action>
    <action>Calculate business value indicators:
      - User impact (high/medium/low)
      - Revenue impact (if applicable)
      - Cost savings (if applicable)
      - Strategic alignment
    </action>
    <template-output file="{prioritization_report_file}">story_data_extraction</template-output>
  </step>

  <step n="3" goal="Apply prioritization criteria">
    <check if="prioritization_method == 'metrics'">
      <action>Rank stories by metrics impact:
        1. Calculate metrics score: (target - baseline) / baseline
        2. Weight by metric importance
        3. Consider measurement feasibility
        4. Rank by highest potential impact
      </action>
    </check>

    <check if="prioritization_method == 'value'">
      <action>Rank stories by business value:
        1. Assess revenue/cost impact
        2. Evaluate user satisfaction impact
        3. Consider strategic importance
        4. Weight by urgency
        5. Rank by value score
      </action>
    </check>

    <check if="prioritization_method == 'impact'">
      <action>Rank stories by overall impact:
        1. User impact (breadth and depth)
        2. Technical impact (system improvements)
        3. Risk reduction
        4. Dependencies (blocking others?)
        5. Rank by combined impact score
      </action>
    </check>

    <check if="prioritization_method == 'custom'">
      <action>Ask user for custom prioritization criteria</action>
      <action>Apply custom criteria to rank stories</action>
    </check>
  </step>

  <step n="4" goal="Consider dependencies and constraints">
    <action>Identify story dependencies:
      - Which stories depend on others?
      - Which stories are blockers?
      - Dependency chain analysis
    </action>
    <action>Adjust priority based on dependencies:
      - Blocking stories get higher priority
      - Dependent stories follow blockers
      - Independent stories can be prioritized freely
    </action>
    <action>Check for constraints:
      - Resource availability
      - Timeline constraints
      - Technical dependencies
    </action>
    <template-output file="{prioritization_report_file}">dependency_analysis</template-output>
  </step>

  <step n="5" goal="Generate prioritized backlog">
    <action>Create prioritized list:
      - Rank stories 1, 2, 3... by priority
      - Include priority score/ranking
      - Show reasoning for each ranking
    </action>
    <action>Group by priority tiers:
      - P0: Critical (must do first)
      - P1: High (important)
      - P2: Medium (nice to have)
      - P3: Low (can defer)
    </action>
    <action>Generate recommendations:
      - Which stories to work on next
      - Suggested sprint/iteration planning
      - Stories that can be deferred
    </action>
    <template-output file="{prioritization_report_file}">prioritized_backlog</template-output>
  </step>

  <step n="6" goal="Update sprint-status.yaml (optional)">
    <action>If user approves:
      1. Update story priorities in sprint-status.yaml
      2. Reorder backlog based on priority
      3. Update priority field for each story
    </action>
    <action>Preserve existing structure and comments</action>
  </step>

  <step n="7" goal="Save and report">
    <action>Save prioritization report</action>
    <action>Display prioritized backlog to user</action>
    <output>**? Story Prioritization Complete, {user_name}!**

**Prioritization Results:**
- Method: {{prioritization_method}}
- Stories Analyzed: {{story_count}}
- Priority Tiers:
  * P0 (Critical): {{p0_count}}
  * P1 (High): {{p1_count}}
  * P2 (Medium): {{p2_count}}
  * P3 (Low): {{p3_count}}

**Report Saved:** {{prioritization_report_file}}

**Next Steps:**
1. Review prioritized backlog
2. Update sprint-status.yaml with new priorities (if approved)
3. Plan next iteration based on priorities
    </output>
  </step>

</workflow>