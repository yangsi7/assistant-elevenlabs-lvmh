# CRITICAL: ALWAYS USE SHADCN MCP FIRST

**ULTRA IMPORTANT**: Before implementing ANY UI component, ALWAYS search shadcn MCP registries first.

## Mandatory Workflow

1. **SEARCH FIRST**: Use `mcp__shadcn__search_items_in_registries` to find prebuilt components
2. **VIEW COMPONENT**: Use `mcp__shadcn__view_items_in_registries` to see implementation details
3. **GET EXAMPLES**: Use `mcp__shadcn__get_item_examples_from_registries` to see usage examples
4. **INSTALL**: Use `mcp__shadcn__get_add_command_for_items` to get installation command

## Never Custom Build When Prebuilt Exists

- ❌ NEVER create custom components without searching first
- ❌ NEVER implement drag-and-drop manually
- ❌ NEVER build file upload UI from scratch
- ✅ ALWAYS search @shadcn, @magicui, @elevenlabs, @originui registries
- ✅ ALWAYS use prebuilt components when available
- ✅ ALWAYS check for demo/example components

## Example: File Upload / Dropzone

Before creating custom dropzone:
1. Search: `mcp__shadcn__search_items_in_registries` for "dropzone", "upload", "file"
2. Check examples: `mcp__shadcn__get_item_examples_from_registries` for "dropzone-demo"
3. Install prebuilt component
4. Customize with Tailwind classes only

## Why This Matters

- Prebuilt components are tested, accessible, and optimized
- Saves time and prevents bugs
- Ensures consistency with design system
- Follows project design process (@.claude/domain-specific-imports/project-design-process.md)
