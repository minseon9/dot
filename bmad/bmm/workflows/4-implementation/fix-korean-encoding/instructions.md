# Fix Korean Encoding - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow fixes Korean encoding issues in files by converting them to UTF-8 using cat heredoc method.</critical>
<critical>CRITICAL: Always use cat command with heredoc (single quotes around EOF) to ensure UTF-8 encoding when writing files with Korean text.</critical>

<workflow>

  <step n="1" goal="Identify files to fix">
    <action>If {{target_file}} provided:
      1. Check if file exists
      2. Check file encoding: file -I {{target_file}}
      3. If encoding is not utf-8 or contains Korean text issues, add to fix list
    </action>
    <action>If {{target_dir}} provided and {{fix_all}} == true:
      1. Scan directory for .md, .yaml, .yml, .txt files
      2. Check encoding for each file: file -I {{file_path}}
      3. Check for Korean text corruption (grep for ??? or ??)
      4. Add files with encoding issues to fix list
    </action>
    <action>If neither provided: Ask user to specify file or directory</action>
    <action>Display list of files to fix</action>
  </step>

  <step n="2" goal="Read file content">
    <action>For each file in fix list:
      1. Read file content (try UTF-8 first, fallback to latin-1 if needed)
      2. Detect Korean text corruption (check for ??? or ?? patterns)
      3. Store original content for comparison
    </action>
    <action>If Korean text is corrupted:
      - Note: Original Korean text may be lost
      - Attempt to restore from context if possible
      - If restoration not possible, mark for manual review
    </action>
  </step>

  <step n="3" goal="Fix encoding using cat heredoc">
    <action>For each file to fix:
      1. Prepare file content with corrected Korean text (if possible)
      2. Use cat command with heredoc to write file with UTF-8 encoding:
         cat > {{target_file}} << 'EOF'
         # File content here
         EOF
      3. Use single quotes around 'EOF' to prevent variable substitution
      4. Follow {project-root}/docs/encoding-fix-method.md solution 1
    </action>
    <action>Verify encoding after write:
      - Run: file -I {{target_file}}
      - Should show: charset=utf-8
      - If not utf-8, re-write using cat heredoc
    </action>
    <action>Verify Korean text:
      - Check for ??? or ?? patterns (should not exist)
      - If Korean text still corrupted, mark for manual review
    </action>
  </step>

  <step n="4" goal="Report results">
    <action>Compile fix results:
      - Files successfully fixed (encoding now utf-8)
      - Files with Korean text restored
      - Files requiring manual review (corrupted text cannot be restored)
    </action>
    <action>Display results to user</action>
    <output>**? Korean Encoding Fix Complete, {user_name}!**

**Results:**
- Files Fixed: {{fixed_count}}
- Files Requiring Manual Review: {{review_count}}

**Fixed Files:**
{{fixed_files_list}}

**Files Requiring Manual Review:**
{{review_files_list}}

**Next Steps:**
1. Review files marked for manual review
2. Restore Korean text manually if needed
3. Verify all files show charset=utf-8: file -I {{file_path}}
    </output>
  </step>

</workflow>
