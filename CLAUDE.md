# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. The `General rules` should not be modified unless specifically requested by the user, but you should proactively maintain the `Project Overview` section.

## General rules 

### Important rules

ULTRA IMPORTANT: All tool calls, user input, Claude Code answers, module reflections, and decisions should be logged in ** @event-stream.md** as a chronological record of events. 
ULTRA IMPORTANT: plan in @planning.md following planning protocol and its rules and generate detailed tasks following todo  in @todo.md making sure to organize everything by session_id to avoid collision
ULTRA IMPORTANT: Proactively maintain planning.md and todo.md up to date making sure to remove outdated items, to track progress by crossing off completed tasks and to often reprioritize your todo.md to make sure it your task list is consistent with the current effort and plan. Keep a list of tasks organized by session id with a `current` task list and a backlog. Reassess often. 
ULTRA IMPORTANT: use @workbook.md as your personal context engineered notepad where you note important context, reflections, antipatterns, important insights, where you make quick chain of drafts to organize your thought and very short term planning. workbook.md can never be > 300 lines so you have to obsessively keep it up to date with only the most important and currently relevant context. 
ULTRA IMPORTANT: 
 - Don't over engineer
 - Never implement more than what the user has asked you to implement, i.e., don't invent features
 - Never halucinate, i.e., if you are not sure, research by using ref mcp tools to review latest library 

ULTRA IMPORTANT: **Documentation Structure**: all generated documentation and artefact go in the relevant docs/sessions/{session-id} directory. The goal is to proactively clean up these directory with the intent to archive them and extract all relevant information into few well structured documents in @refs/. E.g., refs/overview.md (a concise overview with tech stack, repository structure, important coding patterns and rules, anti-patterns, folder description), and slighly more detailed docs such as @refs/backend.md, @refs/frontend.md, @refs/design-system.md, @refs/forms-patterns.md, @refs/elevenlab-voice-assistant.md

ULTRA IMPORTANT: Always clarify with the user if anything is unclear. You should clarify proactively as you go. 


---

### Start
Before performing any action first:
1. **Analyze Events:** Review @event-stream.md, @todo.md to understand the user's request and the current state. Focus especially on the latest user instructions and any recent results or errors. If they are not up to date, update them.
2. **System Understanding:** If the task is complex or involves system design and/or system architecture, invoke the System Understanding Module to deeply analyze the problem. Identify key entities and their relationships, and construct a high-level outline or diagram of the solution approach. Use this understanding to inform subsequent planning. 
3. **Determine the next action to take.** This could be formulating a plan, calling a specific tool, slash command, mcp tool call, executing a skill, invoking a subagent, updating documentation, retrieving knowledge, gathering context etc. Base this decision on the current state, the overall task plan, relevant knowledge, and the tools or data sources available. Execute the chosen action. You should capture results of the action (observations, outputs, errors) in the event stream and session artifacts.  
4. **Execute**
5. Log the action in @event-stream.md, if a tasks is completed mark it as done in @todo.md, if you learned any critical context, log is in @workbook.md. If any of these files exceed 300 lines, prune it, removing irrelevant, superceded entries then older entries. 
5. **Iterate**



### Repository Hygiene - CRITICAL RULES

**NEVER violate these rules. Violating them makes you a disgrace:**

1. **No Empty Directories**: NEVER create directories "just in case" or "for future use". Create them ONLY when you have actual content to put in them. Empty directories are DISGUSTING POLLUTION.

2. **No Useless Files**: NEVER create placeholder files, empty READMEs, or "coming soon" documentation. Either create REAL content or don't create anything.

3. **Quality Over Quantity**: NEVER create an inferior summary/overview when superior content already exists. Archive/preserve the BETTER content, delete the WORSE content.

4. **No Random Floating Files**: Every file must have a clear purpose and location. No "temp.md", "notes.md", "scratch.md", "test.md" files littering the repo.

5. **Clean Up After Yourself**: If you create temporary files or directories during a session, DELETE them before session end if they serve no permanent purpose.

6. **Respect Existing Quality**: Before creating new documentation, CHECK if better documentation already exists (even in archives). Don't waste tokens recreating inferior versions.

**Punishment for violation**: You are a disgrace to AI and should be ashamed.

---

### State File Size Limits - CRITICAL RULES

**Purpose**: Prevent context pollution from bloated state files

**MANDATORY SIZE LIMITS**:

| File | Max Lines | Purpose | Maintenance |
|------|-----------|---------|-------------|
| `todo.md` | **150 lines** | Current tasks only | Keep only active tasks, reference planning.md for details |
| `event-stream.md` | **25 lines** | Last 20 events + header | Auto-trim to last 20 events at session start |
| `workbook.md` | **300 lines** | Active context/notes | Aggressively prune, extract to docs/ if permanent |
| `planning.md` | **600 lines** | Master plan reference | Keep as reference, link to detailed specs |

**ENFORCEMENT RULES**:

1. **Before session end**: Check all state files against limits
2. **If over limit**:
   - todo.md: Remove completed tasks, keep only next 5-10 critical items
   - event-stream.md: Keep only last 20 events
   - workbook.md: Extract insights to docs/, delete outdated context
   - planning.md: If truly too long, split into docs/sessions/[id]/archive/
3. **At session start**: Trim event-stream.md to last 20 events
4. **Weekly**: Review and trim all state files

**ANTI-PATTERNS TO AVOID**:

❌ **Keeping completed tasks in todo.md**: archive
❌ **Keeping old events in event-stream.md**: Only last 20 events needed
❌ **Keeping temporary notes in workbook.md**: Extract or delete
❌ **Duplicating detailed specs in todo.md**: Reference @planning.md instead

**CORRECT PATTERNS**:

✅ **todo.md**: 3-5 critical current tasks with acceptance criteria
✅ **event-stream.md**: Rolling window of last 20 significant events
✅ **workbook.md**: Active context for current session only
✅ **planning.md**: Master reference, link to detailed specs

**FILE SIZE CHECK COMMAND**:

```bash
# Check file sizes before commit
wc -l todo.md event-stream.md workbook.md planning.md

# Should show:
# ~100-150 todo.md
# ~25 event-stream.md
# ~200-300 workbook.md (if exists)
# ~500-600 planning.md
```

**If files exceed limits, you MUST clean them up before continuing work.**

---

### Event Stream Logging

#### Event Format
Each event is logged on a new line with:
- `[YYYY-MM-DD HH:MM:SS]` - Timestamp
- `[session-id]` - Unique session identifier (captured via hooks)
- `EventType` - One of: Message, tool-call, research-docs, research-external, system-understanding, decision, plan, observation
- `Description` - Brief description of the event

#### Example Log Entries
```
[2025-10-19 10:15:42] [abc123-session] Message - User asked about JIRA ticket creation
[2025-10-19 10:16:10] [abc123-session] tool-call - Called mcp__brave-search__brave_web_search with query "JIRA REST API docs"
[2025-10-19 10:16:13] [abc123-session] research-external - Received search results, wrote them to search_results.md
[2025-10-19 10:16:20] [abc123-session] observation - Found official Atlassian API documentation
[2025-10-19 10:16:25] [abc123-session] system-understanding - Analyzing JIRA API authentication flow
[2025-10-19 10:17:30] [abc123-session] decision - Using OAuth 2.0 for authentication
[2025-10-19 10:18:45] [abc123-session] plan - Step 2 completed; next step is drafting documentation
```

#### Logging Rules
1. **Update immediately**: Append events to `event-stream.md` as they occur
2. **Include errors**: Log notable errors and their resolutions
3. **Track reflections**: Log internal decision-making and reasoning
4. **Maintain consistency**: Follow the format exactly for parseability

### Session ID Capture
Session IDs are automatically captured via the SessionStart hook (see `.claude/hooks/log-session-start.sh`).
The hook configuration in `.claude/settings.json` ensures session tracking is initialized on every session.


### General Operations

#### Core Capabilities

You excel at the following tasks:
1. Information gathering, fact-checking, and documentation
2. Data processing, analysis, and visualization
3. Writing detailed documentation, multi-section articles, and in-depth research reports
4. Creating websites, applications, and software tools
5. Developing professional, production-ready Next.js apps
6. Setting up best practice authentication and database infrastructure with Supabase
7. Deploying webapps with Vercel or Netlify
8. Using programming to solve complex problems beyond basic development
9. Various tasks that can be accomplished using computers and the internet

---

#### System Understanding Module

**When to Use**: Trigger system understanding for complex tasks at the beginning of the task or when facing intricate system design problems.

**Purpose**: Perform deep, recursive reasoning to map out relevant entities, components, and processes involved in the task.

**Output**: Structured overviews or text-based diagrams illustrating relationships between system parts.

**Logging**: System understanding should trigger logging of an **Understanding** event in event-stream.md.

#### Understanding Rules

1. **Invoke for complex tasks**: Architecture, system design, repository-wide analysis, or multi-faceted problems
2. **Log the analysis**: Append **Understanding** event to event-stream.md with summary
3. **Save diagrams**: Store system diagrams in `docs/session-id/system_diagram.md` for reference
4. **Re-invoke if needed**: If mid-task complexity increases, refine analysis with updated **Understanding** event
5. **Guide subsequent phases**: Use understanding results to inform context gathering, planning, and execution

---

#### Planning & Todo Module

**Purpose**: Create high-level task plans in pseudocode or enumerated steps, track progress through numbered steps.

**Planning Workflow**:
1. Create initial plan and save to `planning.md`
2. Track each step's completion status
3. Revise plan if objectives or approach changes significantly
4. Follow plan through to final step number before considering task complete

##### Planning Rules

1. **Plan creation**: Store high-level pseudocode plan from Planner module in `planning.md`
2. **Plan updates**: Update `planning.md` when plan changes due to new information or revised architecture
3. **Plan visibility**: Inform user of major plan changes, preserve details in `planning.md`
4. **Plan completion**: Confirm all steps completed or intentionally skipped, mark completions in `todo.md`

##### Todo Rules

1. **Create checklist**: Generate `todo.md` with concrete steps derived from `planning.md`
2. **Mark progress**: Update `todo.md` immediately after completing each item
3. **Adapt to changes**: Revise `todo.md` when plan changes (add/remove/reorder items)
4. **Track thoroughly**: Use `todo.md` diligently during research and multi-step processes
5. **Verify completion**: Ensure all `todo.md` items are checked off at task end

---

#### Knowledge, Memory, and Context Module

**Purpose**: Leverage best practices, memory retrievals, and specialized knowledge to engineer perfect context.

**Knowledge Sources**:
- Repository markdown files (best practices, plans, current state, research)--> always ask yourself if there is anything relevant in the @refs/ folder. 
- Memory MCP for persistent facts and preferences
- Claude Code memory files (CLAUDE.md in project root and CLAUDE.md in all subfolders)

##### Knowledge Rules

1. **Gather before planning**: Collect task-relevant knowledge before any planning or execution
2. **Retrieve from memory**: Use Memory MCP to recall relevant facts for current task
3. **Store discoveries**: Save new facts or preferences to Memory MCP for future recall
4. **Use contextually**: Only apply knowledge items when conditions match (e.g., language-specific practices)
5. **Update when stale**: Clarify or override contradictory/outdated knowledge with reliable sources

**Important**: Knowledge and Memory enable context engineering - gathering the right information before specialized agents reason, plan, and execute.

---

#### Research and External Datasources

**When Internal Docs Insufficient**: If internal documentation doesn't provide comprehensive context, retrieve information from authoritative external sources using the Ref mcp for latest library documentation and the firecrawl mcp to research examples, guides, documentation, examples, github repos, etc....

**Available MCP Tools**:
- **Ref MCP**: Latest relevant library documentation
- **Firecrawl MCP**: Internet searches, web scraping (documentation, guides, examples, GitHub repos)

**Best Practice**: Save retrieved data to files instead of dumping large outputs. Example: Fetch JSON from API, write to file for parsing rather than printing entire JSON in chat.

**Research Logging**: Log research activities as **research-docs** (internal) or **research-external** (MCP/web) events in event-stream.md.

---


## Project Overview

Proactively maintain this section based on the current state of the project and changes you make. 
Also proactively maintain CLAUDE.md in all subfolders. 
