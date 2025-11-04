# Chrome DevTools MCP: E2E Testing Guide

**Purpose**: Concise guide for rapid, reliable E2E testing of Next.js web applications using Chrome DevTools MCP

**Version**: 1.0
**Last Updated**: 2025-11-03

---

## Quick Start

**Configuration** (already in `.mcp.json`):
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

**Basic Test Pattern**:
1. Open page → Take snapshot → Verify elements
2. Interact (click/fill) → Wait for response → Verify state
3. Check console logs → Check network requests → Take screenshot
4. Repeat for each user flow step

---

## Available Tools (26 Total)

### Navigation & Pages
- **`list_pages`** - See all open browser tabs/windows
- **`select_page`** - Switch to specific tab by index
- **`new_page`** - Open new tab with URL
- **`navigate_page`** - Go to URL in current tab
- **`close_page`** - Close tab by index
- **`wait_for`** - Wait for text/element to appear (with timeout)

### Element Interaction
- **`take_snapshot`** - Get text-based page structure with UIDs (FAST, prefer over screenshot)
- **`click`** - Click element by UID from snapshot
- **`fill`** - Fill input/select by UID
- **`fill_form`** - Fill multiple fields at once
- **`hover`** - Hover over element
- **`drag`** - Drag & drop between elements
- **`upload_file`** - Upload file via input element
- **`handle_dialog`** - Accept/dismiss browser dialogs

### Debugging & Monitoring
- **`take_screenshot`** - Capture visual screenshot (PNG/JPEG/WebP)
- **`list_console_messages`** - Get console logs (filter by type: log/error/warn)
- **`get_console_message`** - Get full message details by ID
- **`list_network_requests`** - Get network activity (filter by resource type)
- **`get_network_request`** - Get full request/response details
- **`evaluate_script`** - Run JavaScript in page context

### Performance Analysis
- **`performance_start_trace`** - Begin performance recording
- **`performance_stop_trace`** - End recording, get trace data
- **`performance_analyze_insight`** - Analyze specific performance insight

### Environment Control
- **`emulate_cpu`** - Throttle CPU (1-20x slowdown)
- **`emulate_network`** - Throttle network (Offline, 3G, 4G)
- **`resize_page`** - Set viewport dimensions

---

## Session Management (CRITICAL)

### Avoiding Mixed Sessions

**Problem**: Multiple browser instances can interfere with each other (shared cookies, storage, cache)

**Solution**: Use `--isolated` flag for temporary profiles

**Best Practice**:
```bash
# Launch with isolated profile (auto-cleanup on close)
npx -y chrome-devtools-mcp@latest --isolated
```

**For Testing**:
1. **Always start fresh** - Close all Chrome instances before testing
2. **One test at a time** - Don't run parallel tests in same browser
3. **Use select_page** - If multiple tabs exist, always select correct one first
4. **Verify context** - Check page URL before actions: `list_pages` → `select_page`

**Example Workflow**:
```typescript
// 1. List all pages to see what's open
list_pages()

// 2. Select the correct page (e.g., index 0 for first tab)
select_page({ pageIdx: 0 })

// 3. Verify you're on the right page
take_snapshot() // Check title/content

// 4. Proceed with test
```

---

## Rapid Testing Workflow

### Pattern 1: Snapshot-First Testing (FASTEST)

**Why**: `take_snapshot` is faster than screenshots, provides structured data with UIDs

**Workflow**:
```typescript
// 1. Take snapshot to get page structure
const snapshot = take_snapshot()
// Returns: text representation with uid="123" for each interactive element

// 2. Find element UID from snapshot text
// Example: <button uid="42">Submit</button>

// 3. Interact directly with UID
click({ uid: "42" })

// 4. Wait for result
wait_for({ text: "Success", timeout: 5000 })

// 5. Take new snapshot to verify
const afterSnapshot = take_snapshot()
```

**Advantages**:
- No need to search for selectors
- Works even if CSS/classes change
- Faster than visual screenshot analysis
- Returns full page text for grep/search

### Pattern 2: Screenshot for Visual Verification

**Use When**: Need to verify visual appearance, layout, or design

**Workflow**:
```typescript
// 1. Take screenshot
take_screenshot({ format: "png", quality: 90 })

// 2. Analyze screenshot for visual issues
// Check: alignment, colors, fonts, images loaded

// 3. Compare with expected design
```

### Pattern 3: Console + Network Monitoring

**Use When**: Debugging JavaScript errors, API calls, or performance

**Workflow**:
```typescript
// 1. Start with clean console
navigate_page({ url: "http://localhost:3000/upload" })

// 2. Perform action
click({ uid: "upload-button" })

// 3. Check console for errors
const logs = list_console_messages({ types: ["error", "warn"] })

// 4. Check network requests
const requests = list_network_requests({ resourceTypes: ["xhr", "fetch"] })

// 5. Get details on failed requests
const failedRequest = get_network_request({ reqid: 123 })
```

---

## Finding Links & Navigation

### Method 1: Snapshot Search (RECOMMENDED)

```typescript
// 1. Take snapshot
const snapshot = take_snapshot()

// 2. Search snapshot text for link
// Look for: <a uid="X" href="/review">Review Invoices</a>

// 3. Click link by UID
click({ uid: "X" })
```

### Method 2: JavaScript Evaluation

```typescript
// Find all links
evaluate_script({
  function: `() => {
    return Array.from(document.querySelectorAll('a'))
      .map(a => ({ text: a.textContent, href: a.href }))
  }`
})

// Click link by text
evaluate_script({
  function: `() => {
    const link = Array.from(document.querySelectorAll('a'))
      .find(a => a.textContent.includes('Review'));
    if (link) link.click();
    return !!link;
  }`
})
```

---

## Screenshot Analysis

### Taking Screenshots

**Full page**:
```typescript
take_screenshot({ fullPage: true, format: "png" })
```

**Element only**:
```typescript
take_screenshot({ uid: "element-uid", format: "png" })
```

**High quality**:
```typescript
take_screenshot({ format: "jpeg", quality: 95 })
```

### Analysis Workflow

1. **Capture state** - Take screenshot at key checkpoints
2. **Visual comparison** - Compare with expected design
3. **Debugging** - Screenshot on error for context
4. **Documentation** - Screenshot successful flows for reference

**Best Practice**: Save screenshots with descriptive names
```typescript
// Example: upload-page-initial.png, upload-page-processing.png, upload-page-success.png
```

---

## Running Test Scripts

### Method 1: Inline JavaScript

**Simple checks**:
```typescript
evaluate_script({
  function: `() => {
    return document.title;
  }`
})
```

**Complex validation**:
```typescript
evaluate_script({
  function: `() => {
    const errors = document.querySelectorAll('.error-message');
    return {
      hasErrors: errors.length > 0,
      errorCount: errors.length,
      errorTexts: Array.from(errors).map(e => e.textContent)
    };
  }`
})
```

### Method 2: With Element Arguments

```typescript
// Pass element UID to script
evaluate_script({
  function: `(el) => {
    return {
      tagName: el.tagName,
      text: el.textContent,
      classes: el.className
    };
  }`,
  args: [{ uid: "element-uid" }]
})
```

---

## Network Monitoring

### Checking API Calls

**List all requests**:
```typescript
list_network_requests({
  resourceTypes: ["xhr", "fetch"],
  pageSize: 50
})
```

**Filter by type**:
```typescript
// Only API calls
list_network_requests({ resourceTypes: ["xhr", "fetch"] })

// Only scripts
list_network_requests({ resourceTypes: ["script"] })

// Only images
list_network_requests({ resourceTypes: ["image"] })
```

**Get request details**:
```typescript
const request = get_network_request({ reqid: 123 })
// Returns: URL, method, status, headers, body, timing
```

### Verifying API Responses

**Pattern**:
1. Perform action that triggers API call
2. List network requests
3. Find relevant request by URL pattern
4. Get full request details
5. Verify status code, response body

```typescript
// Example: Verify invoice creation API call
const requests = list_network_requests({ resourceTypes: ["fetch"] });
const createInvoiceReq = requests.find(r => r.url.includes('/api/process'));
const details = get_network_request({ reqid: createInvoiceReq.id });

// Check: status === 200, response body contains invoice_id
```

---

## Console Log Checking

### Filtering Logs

**By type**:
```typescript
// Errors only
list_console_messages({ types: ["error"] })

// Errors + warnings
list_console_messages({ types: ["error", "warn"] })

// All types
list_console_messages({ types: ["log", "debug", "info", "error", "warn"] })
```

**With pagination**:
```typescript
// First 50 messages
list_console_messages({ pageSize: 50, pageIdx: 0 })

// Next 50 messages
list_console_messages({ pageSize: 50, pageIdx: 1 })
```

### Getting Full Message Details

```typescript
const messages = list_console_messages({ types: ["error"] });
const firstError = messages[0];
const details = get_console_message({ msgid: firstError.msgid });
// Returns: full stack trace, arguments, source location
```

---

## Common Testing Patterns

### Pattern 1: Login Flow

```typescript
// 1. Navigate to login
navigate_page({ url: "http://localhost:3000/login" })

// 2. Take snapshot to get form UIDs
const snapshot = take_snapshot()

// 3. Fill form (find UIDs from snapshot)
fill_form({
  elements: [
    { uid: "email-input-uid", value: "user@example.com" },
    { uid: "password-input-uid", value: "password123" }
  ]
})

// 4. Click submit
click({ uid: "submit-button-uid" })

// 5. Wait for redirect
wait_for({ text: "Dashboard", timeout: 5000 })

// 6. Verify success
const afterSnapshot = take_snapshot()
// Check snapshot contains "Dashboard" or "Welcome"
```

### Pattern 2: Form Submission with Validation

```typescript
// 1. Fill form
fill_form({ elements: [...] })

// 2. Submit
click({ uid: "submit-uid" })

// 3. Check for errors (both console and UI)
const consoleErrors = list_console_messages({ types: ["error"] })
const snapshot = take_snapshot() // Look for error messages in UI

// 4. If successful, check network
const requests = list_network_requests({ resourceTypes: ["fetch"] })
const submitRequest = requests.find(r => r.url.includes('/api/submit'))
const details = get_network_request({ reqid: submitRequest.reqid })

// 5. Verify response
// Check details.status === 200 and details.response contains expected data
```

### Pattern 3: File Upload

```typescript
// 1. Take snapshot to find file input
const snapshot = take_snapshot()

// 2. Upload file
upload_file({
  uid: "file-input-uid",
  filePath: "/absolute/path/to/file.xlsx"
})

// 3. Monitor upload progress (if visible)
wait_for({ text: "Uploading", timeout: 2000 })

// 4. Wait for completion
wait_for({ text: "Upload complete", timeout: 30000 })

// 5. Check console for errors
const errors = list_console_messages({ types: ["error"] })

// 6. Verify results
const afterSnapshot = take_snapshot()
```

### Pattern 4: Checking Supabase RLS

**Cannot check RLS directly in browser**, but can verify effects:

```typescript
// 1. Login as user A
// 2. Create resource (invoice, email draft)
// 3. Note resource ID
// 4. Logout
// 5. Login as user B (or no login)
// 6. Try to access resource directly
navigate_page({ url: `http://localhost:3000/invoices/${resourceId}` })

// 7. Verify access denied
const snapshot = take_snapshot()
// Should see: 403, 404, or redirect to login

// 8. Check console for auth errors
const errors = list_console_messages({ types: ["error"] })
```

**Better approach**: Check Supabase logs using Supabase MCP tools:
```typescript
mcp__supabase__get_logs({ service: "api" })
// Look for RLS policy violations
```

---

## Performance Testing

### Recording Trace

```typescript
// 1. Start trace
performance_start_trace({ reload: true, autoStop: false })

// 2. Perform actions
click({ uid: "submit-uid" })
wait_for({ text: "Complete", timeout: 10000 })

// 3. Stop trace
performance_stop_trace()
// Returns: performance metrics, insights

// 4. Analyze specific insights
performance_analyze_insight({ insightName: "LCPBreakdown" })
```

### Key Metrics

- **LCP (Largest Contentful Paint)** - Main content load time
- **FID (First Input Delay)** - Interactivity responsiveness
- **CLS (Cumulative Layout Shift)** - Visual stability
- **DocumentLatency** - Time to interactive

---

## Troubleshooting

### Issue: Element Not Found

**Solution**: Always take fresh snapshot before clicking
```typescript
// WRONG
const snapshot = take_snapshot()
click({ uid: "42" })
wait_for({ text: "Loading" })
click({ uid: "99" }) // May fail if page changed

// CORRECT
const snapshot1 = take_snapshot()
click({ uid: "42" })
wait_for({ text: "Loading" })
const snapshot2 = take_snapshot() // Fresh snapshot
click({ uid: "99" })
```

### Issue: Timeout Waiting

**Solution**: Increase timeout or check console for errors
```typescript
wait_for({ text: "Complete", timeout: 30000 }) // 30 seconds

// If still fails, check errors
const errors = list_console_messages({ types: ["error"] })
```

### Issue: Mixed Browser Sessions

**Solution**: Close all Chrome, use --isolated flag, verify with list_pages
```typescript
// Check what's open
const pages = list_pages()
console.log(pages) // Should only show your test page

// If multiple pages, close extras
close_page({ pageIdx: 1 })
```

### Issue: Network Request Not Found

**Solution**: Check resource type filter, increase page size
```typescript
// Try broader filter
list_network_requests({ resourceTypes: ["xhr", "fetch", "document"] })

// Or get all requests
list_network_requests({})
```

---

## Best Practices Summary

1. **Always use snapshots first** - Faster than screenshots, provides UIDs
2. **Verify page context** - Use `list_pages` + `select_page` before actions
3. **Use --isolated flag** - Prevents session contamination
4. **Wait after navigation** - Use `wait_for` to ensure page loaded
5. **Check console on errors** - First place to look for JavaScript issues
6. **Monitor network** - Verify API calls succeed
7. **Take screenshots on failure** - Visual context for debugging
8. **Test one flow at a time** - Avoid parallel tests in same browser
9. **Use absolute paths** - For file uploads
10. **Clean up after tests** - Close browser, clear state

---

## Related Documentation

- **Chrome DevTools MCP**: https://github.com/ChromeDevTools/chrome-devtools-mcp
- **Supabase MCP**: Use for checking server logs, RLS policies
- **Next.js Testing**: See Next.js DevTools MCP for build/runtime errors

---

**Remember**: Chrome DevTools MCP is for browser-side testing. For server-side checks (RLS, database, Edge Functions), use Supabase MCP tools.
