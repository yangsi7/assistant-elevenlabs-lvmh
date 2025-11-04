# Claude Code Permissions Configuration Guide

**Purpose**: Configure auto-approval for safe, non-destructive tools to enable smooth plan mode and research workflows without constant interruptions.

**File**: `.claude/settings.json`

---

## Quick Start

Add this `permissions` block to your `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp__Ref__ref_search_documentation",
      "mcp__Ref__ref_read_url",
      "mcp__mcp-server-firecrawl__firecrawl_scrape",
      "mcp__mcp-server-firecrawl__firecrawl_search",
      "mcp__mcp-server-firecrawl__firecrawl_map",
      "mcp__mcp-server-firecrawl__firecrawl_crawl",
      "mcp__mcp-server-firecrawl__firecrawl_check_crawl_status",
      "mcp__mcp-server-firecrawl__firecrawl_extract",
      "mcp__supabase__list_tables",
      "mcp__supabase__list_extensions",
      "mcp__supabase__list_migrations",
      "mcp__supabase__list_edge_functions",
      "mcp__supabase__list_storage_buckets",
      "mcp__supabase__list_branches",
      "mcp__supabase__get_edge_function",
      "mcp__supabase__get_logs",
      "mcp__supabase__get_advisors",
      "mcp__supabase__get_project_url",
      "mcp__supabase__get_anon_key",
      "mcp__supabase__get_storage_config",
      "mcp__supabase__execute_sql",
      "mcp__supabase__generate_typescript_types",
      "mcp__shadcn__get_project_registries",
      "mcp__shadcn__list_items_in_registries",
      "mcp__shadcn__search_items_in_registries",
      "mcp__shadcn__view_items_in_registries",
      "mcp__shadcn__get_item_examples_from_registries",
      "mcp__shadcn__get_add_command_for_items",
      "mcp__shadcn__get_audit_checklist",
      "mcp__calculator__calculate",
      "Read",
      "Glob",
      "Grep",
      "Write(*.md)",
      "Write(**/*.md)",
      "Edit(*.md)",
      "Edit(**/*.md)",
      "MultiEdit(*.md)",
      "MultiEdit(**/*.md)",
      "Write(docs/**)",
      "Edit(docs/**)",
      "Write(.claude/memory/**)",
      "Edit(.claude/memory/**)",
      "Write(/tmp/**)",
      "Edit(/tmp/**)",
      "Bash(fd:*)",
      "Bash(rg:*)",
      "Bash(find:*)",
      "Bash(grep:*)",
      "Bash(ag:*)",
      "Bash(ack:*)",
      "Bash(cat:*)",
      "Bash(head:*)",
      "Bash(tail:*)",
      "Bash(wc:*)",
      "Bash(du:*)",
      "Bash(file:*)",
      "Bash(stat:*)",
      "Bash(ls:*)",
      "Bash(tree:*)",
      "Bash(jq:*)",
      "Bash(yq:*)",
      "Bash(sed:*)",
      "Bash(awk:*)",
      "Bash(sort:*)",
      "Bash(uniq:*)",
      "Bash(cut:*)",
      "Bash(project-intel.mjs:*)",
      "Bash(./project-intel.mjs:*)",
      "Bash(node project-intel.mjs:*)",
      "Bash(pwd:*)",
      "Bash(cd:*)",
      "Bash(echo:*)",
      "Bash(printf:*)",
      "Bash(mkdir -p docs/**)",
      "Bash(mkdir -p /tmp/**)",
      "Bash(mkdir -p .claude/memory/**)",
      "WebFetch"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Edit(./.env)",
      "Edit(./.env.*)",
      "Edit(./secrets/**)",
      "Write(./.env)",
      "Write(./.env.*)",
      "Write(./secrets/**)",
      "Bash(rm:*)",
      "Bash(rmdir:*)",
      "Bash(mv:*)",
      "Bash(cp:*)",
      "Bash(curl:*)",
      "Bash(wget:*)",
      "Bash(nc:*)",
      "Bash(netcat:*)",
      "Bash(sudo:*)",
      "Bash(su:*)",
      "Bash(chmod:*)",
      "Bash(chown:*)"
    ],
    "ask": [
      "mcp__supabase__apply_migration",
      "mcp__supabase__deploy_edge_function",
      "mcp__supabase__update_storage_config",
      "mcp__supabase__create_branch",
      "mcp__supabase__delete_branch",
      "mcp__supabase__merge_branch",
      "mcp__supabase__reset_branch",
      "mcp__supabase__rebase_branch"
    ]
  }
}
```

---

## What This Does

### ✅ Auto-Approved (No Prompts)

**MCP Tools - Research**:
- Ref MCP (documentation search)
- Firecrawl MCP (web scraping)
- Calculator

**MCP Tools - Supabase (Read-Only)**:
- List operations (tables, migrations, storage, functions, branches)
- Get operations (logs, advisors, config, types)
- Execute SQL (SELECT queries)

**MCP Tools - shadcn**:
- All component discovery and search tools

**File Operations**:
- Read/Glob/Grep (all file reading)
- Write/Edit markdown files (*.md, docs/, .claude/memory/)
- Write to /tmp (temporary files)

**Bash Commands - Safe**:
- Search: fd, rg, find, grep
- File info: cat, head, tail, ls, tree, stat
- Data processing: jq, yq, sed, awk, sort, uniq
- Navigation: pwd, cd
- Output: echo, printf
- Safe mkdir: docs/, /tmp/, .claude/memory/ only

**Web**:
- WebFetch (all web fetching)

---

### 🔒 Blocked (Denied Completely)

**Sensitive Files**:
- .env, .env.*, secrets/** (all operations)

**Destructive Operations**:
- rm, rmdir, mv, cp (file deletion/moving)

**Network Tools**:
- curl, wget, nc, netcat (raw network access)

**System Modifications**:
- sudo, su, chmod, chown (privilege escalation)

---

### ⚠️ Ask for Confirmation

**Supabase Write Operations**:
- apply_migration
- deploy_edge_function
- update_storage_config
- Branch operations (create/delete/merge/reset/rebase)

---

## Why This Matters

**Problem**: Claude Code interrupts every 2-3 seconds in plan mode for permission approvals, making research and planning workflows frustrating.

**Solution**: Pre-approve all **safe, non-destructive, read-only operations** so Claude can work autonomously during research and planning phases.

**Result**: Smooth plan mode execution, faster research, no interruptions for safe tools.

---

## Permission Patterns

### Basic Format

```json
"allow": [
  "ToolName",                    // Allow all uses of ToolName
  "ToolName(pattern)",           // Allow ToolName with specific pattern
  "Bash(command:*)"              // Allow bash command (prefix match)
]
```

### Examples

```json
"Read",                          // Allow all file reading
"Write(*.md)",                   // Allow writing markdown files
"Write(docs/**)",                // Allow writing in docs/ directory
"Bash(ls:*)",                    // Allow ls command
"Bash(mkdir -p docs/**)",        // Allow mkdir in docs/ only
"mcp__toolname__function"        // Allow specific MCP tool function
```

### Important Notes

1. **Bash uses prefix matching**, not regex
   - `Bash(git diff:*)` matches `git diff`, `git diff --staged`, etc.
   - `Bash(rm:*)` blocks `rm`, `rm -rf`, etc.

2. **Glob patterns work for file paths**
   - `Write(*.md)` = all .md files in current dir
   - `Write(**/*.md)` = all .md files recursively
   - `Write(docs/**)` = all files in docs/ recursively

3. **Deny takes precedence over allow**
   - If a rule is in both `allow` and `deny`, it's denied

4. **Order matters in settings.json precedence**:
   - Enterprise managed settings (highest)
   - Command line args
   - Local project (.claude/settings.local.json)
   - Shared project (.claude/settings.json)
   - User settings (~/.claude/settings.json) (lowest)

---

## Adding Custom MCP Tools

When you add new MCP tools to your project, add their read-only functions to `allow`:

```json
"allow": [
  "mcp__custom-tool__read_data",
  "mcp__custom-tool__search",
  "mcp__custom-tool__list_items"
]
```

Add write functions to `ask` or `deny` as appropriate:

```json
"ask": [
  "mcp__custom-tool__create_item",
  "mcp__custom-tool__update_item"
],
"deny": [
  "mcp__custom-tool__delete_all"
]
```

---

## Project-Specific Additions

### For Next.js Projects

```json
"allow": [
  "Bash(npm run lint:*)",
  "Bash(npm run type-check:*)",
  "Bash(npm run test:*)",
  "Write(components/**)",
  "Write(app/**)",
  "Write(lib/**)"
]
```

### For Python Projects

```json
"allow": [
  "Bash(python -m pytest:*)",
  "Bash(python -m black:*)",
  "Bash(python -m mypy:*)",
  "Write(src/**/*.py)",
  "Write(tests/**/*.py)"
]
```

### For Docker Projects

```json
"allow": [
  "Bash(docker ps:*)",
  "Bash(docker logs:*)",
  "Bash(docker inspect:*)"
],
"ask": [
  "Bash(docker run:*)",
  "Bash(docker build:*)"
],
"deny": [
  "Bash(docker system prune:*)",
  "Bash(docker rm:*)"
]
```

---

## Troubleshooting

### Claude still asks for permission

**Check**:
1. Settings file syntax is valid JSON (no trailing commas, no comments)
2. Tool name matches exactly (case-sensitive)
3. Pattern syntax is correct (prefix match for Bash, glob for files)
4. No typos in tool names

**Validate**:
```bash
# Check JSON syntax
jq . .claude/settings.json

# View current settings
/config
```

### Permission denied when it should be allowed

**Check**:
1. Is the tool in `deny` list? (Deny takes precedence)
2. Is the pattern too restrictive?
3. Is there a managed enterprise policy overriding?

**Fix**:
- Remove from `deny` if accidentally added
- Broaden the pattern (e.g., `Write(docs/*)` → `Write(docs/**)`)
- Check enterprise policies with `/config`

---

## Security Best Practices

1. **Always deny sensitive files**:
   ```json
   "deny": [
     "Read(./.env)",
     "Read(./.env.*)",
     "Read(./secrets/**)",
     "Read(./**/*secret*)",
     "Read(./**/*credential*)"
   ]
   ```

2. **Never auto-approve destructive operations**:
   ```json
   "deny": [
     "Bash(rm:*)",
     "Bash(git push --force:*)",
     "Bash(docker system prune:*)"
   ]
   ```

3. **Use `ask` for write operations on critical systems**:
   ```json
   "ask": [
     "mcp__database__apply_migration",
     "mcp__deployment__deploy_to_production"
   ]
   ```

4. **Limit file writes to specific directories**:
   ```json
   "allow": [
     "Write(docs/**)",
     "Write(/tmp/**)"
   ]
   ```
   Rather than:
   ```json
   "allow": [
     "Write"  // Allows writing anywhere!
   ]
   ```

---

## Official Documentation

- **Settings Reference**: https://docs.anthropic.com/en/docs/claude-code/settings
- **IAM & Permissions**: https://docs.anthropic.com/en/docs/claude-code/iam
- **MCP Configuration**: https://docs.anthropic.com/en/docs/claude-code/mcp

**Check latest docs**: `/docs settings` or `/docs iam`

---

**Last Updated**: 2025-11-03
**Version**: 1.0
**Project**: Horkos Invoice Automation (reference implementation)
