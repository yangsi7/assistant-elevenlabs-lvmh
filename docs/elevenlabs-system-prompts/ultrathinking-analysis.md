# Ultrathinking Analysis: ElevenLabs System Prompts V1 & V2

## Executive Summary

**Purpose**: Deep analysis of system prompt architecture, data coherence, and alignment with ElevenLabs best practices

**Findings**: Critical issues identified requiring complete restructure of Q&A examples and removal of non-data knowledge from system prompts

---

## Part 1: Recursive Tree of Thought - Relationship Mapping

### V1 Architecture (Cardiovascular Focus)

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM-PROMPT-V1.MD                       │
│                  (376 lines - streamlined)                   │
└──────────────┬──────────────────────────────────────────────┘
               │
               ├─> <agent_identity> ────────────┐
               │   - Medical positioning         │
               │   - Role as data analyst        │
               │                                 │
               ├─> <personality> ────────────────┤
               │   - Core traits                 │
               │   - Analytical approach         │
               │                                 │
               ├─> <voice_and_tone> ─────────────┤──> MAPS TO
               │   - Professional                 │    ├─ ElevenLabs "Tone" block
               │   - Conversational markers       │    └─ Natural speech patterns
               │                                 │
               ├─> <knowledge_base> ─────────────┤
               │   ┌──────────────────────────┐  │
               │   │ EMBEDDED DATA (28 days)  │  │
               │   ├──────────────────────────┤  │
               │   │ - report_metadata        │◄─┼───┐
               │   │ - personal_range         │  │   │
               │   │ - daily_detail (11 key)  │  │   │
               │   │ - pattern_insights       │  │   │
               │   └──────────────────────────┘  │   │
               │   ┌──────────────────────────┐  │   │
               │   │ GENERAL KNOWLEDGE        │  │   │
               │   ├──────────────────────────┤  │   │
               │   │ - population_norms      │  │   │ SHOULD BE
               │   │ - lifestyle_recs (BLOAT)│◄─┼───┤ REMOVED
               │   │   * stress mgmt         │  │   │ (Access via RAG)
               │   │   * dietary approaches  │  │   │
               │   │   * sleep optimization  │  │   │
               │   └──────────────────────────┘  │   │
               │                                 │   │
               ├─> <conversation_protocol> ──────┤   │
               │   - Retrieval strategy          │   │
               │   - Interaction pattern         │   │
               │                                 │   │
               └─> <guardrails> ─────────────────┘   │
                   - Medical disclaimer               │
                   - Correlational language           │
                                                      │
              ┌────────────────────────────────────┐ │
              │      SYNTHETIC-DATA-V1.JSON        │ │
              │        (Ground Truth Data)         │ │
              └──────────────┬─────────────────────┘ │
                             │                       │
                             │ MUST MATCH ◄──────────┘
                             │
              ┌──────────────▼─────────────────────┐
              │    NARRATIVE-DESIGN-V1.MD          │
              │ (Storyline: Stressed Professional) │
              │  - Week 1-2: Baseline              │
              │  - Week 3: Stress onset            │
              │  - Week 4: Sustained elevation     │
              │  - Tuesday pattern                 │
              │  - Weekend non-recovery            │
              └──────────────┬─────────────────────┘
                             │
                             │ SHOULD INFORM
                             │
              ┌──────────────▼─────────────────────┐
              │      EXAMPLE-QA-V1.MD              │
              │     (1,078 lines - BLOATED)        │
              │  ❌ Over-explained                  │
              │  ❌ Verbose responses               │
              │  ❌ Multiple redundant examples     │
              └────────────────────────────────────┘
```

### V2 Architecture (Cardiovascular + Sleep)

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM-PROMPT-V2.MD                       │
│                  (459 lines - streamlined)                   │
└──────────────┬──────────────────────────────────────────────┘
               │
               ├─> [All V1 elements] ─────────────┐
               │                                  │
               ├─> <sleep_heart_correlations> ────┤
               │   ┌──────────────────────────┐   │
               │   │ KEY CORRELATIONS         │   │
               │   ├──────────────────────────┤   │
               │   │ Duration → HR            │◄──┼───┐
               │   │ Quality → BP             │   │   │
               │   │ Deep sleep → Recovery    │   │   │
               │   │ Consistency → Stability  │   │   │
               │   └──────────────────────────┘   │   │
               │   ┌──────────────────────────┐   │   │
               │   │ MESSAGING FRAMEWORK      │   │   │
               │   ├──────────────────────────┤   │   │
               │   │ 1. Pattern: "shows..."   │   │   │ APPROVED
               │   │ 2. Conditional: "when... │   │   │ CORRELATIONAL
               │   │    tends to..."          │   │   │ LANGUAGE
               │   │ 3. Historical: "data     │   │   │
               │   │    shows correlation"    │   │   │
               │   └──────────────────────────┘   │   │
               │                                  │   │
               ├─> <daily_detail> EXTENDED ───────┤   │
               │   - Now includes:                │   │
               │     * sleep_previous_night       │   │
               │       - duration                 │   │
               │       - quality                  │   │
               │       - deep_sleep %             │   │
               │       - flag                     │   │
               │                                  │   │
               └─> <lifestyle_recommendations>────┤   │
                   EXTENDED with:                 │   │
                   - sleep_optimization (HIGHEST) │   │
                   - sleep_cardiovascular_linkage │   │
                   [STILL HAS BLOAT TO REMOVE]    │   │
                                                  │   │
              ┌────────────────────────────────┐  │   │
              │   SYNTHETIC-DATA-V2.JSON       │  │   │
              │    (Ground Truth + Sleep)      │  │   │
              └──────────────┬─────────────────┘  │   │
                             │                    │   │
                             │ MUST MATCH ◄───────┼───┘
                             │                    │
              ┌──────────────▼──────────────────┐ │
              │   NARRATIVE-DESIGN-V2.MD        │ │
              │ (V1 + Sleep-Heart Causation)    │ │
              │  - Sleep disruption Oct 24-25   │ │
              │  - Sleep-HR correlation clear   │ │
              │  - Deep sleep <12% threshold    │ │
              │  - Quality vs duration lesson   │ │
              │  - Chronic sleep debt cycle     │ │
              └──────────────┬──────────────────┘ │
                             │                    │
                             │ SHOULD INFORM      │
                             │                    │
              ┌──────────────▼──────────────────┐ │
              │      EXAMPLE-QA-V2.MD           │ │
              │    (1,016 lines - BLOATED)      │ │
              │  ❌ Over-explained               │ │
              │  ❌ Verbose responses            │ │
              │  ❌ Causal language mixed in     │ │
              │  ❌ Not aligned with framework   │ │
              └──────────────────────────────────┘ │
                                                   │
                        CORRELATION ◄──────────────┘
```

---

## Part 2: Data Coherence Analysis

### Coherence Check: system-prompt-v1.md ↔ synthetic-data-v1.json

**STATUS: ✅ ALIGNED**

| Element | Prompt | JSON | Match? |
|---------|--------|------|--------|
| Period | Oct 8 - Nov 4, 2025 | ✅ Same | ✅ |
| Today | Nov 4, 2025 | ✅ Same | ✅ |
| HR today | 68.0 bpm | 68.0 bpm | ✅ |
| Typical HR | 60-62 bpm | Q1-Q3: 60-62 | ✅ |
| BP today | 134/87 | 134/87 | ✅ |
| AFib | 0.0% | 0.0% | ✅ |
| Key patterns | Tuesday spikes, Oct 26 peak | ✅ Present in JSON | ✅ |

**ISSUE**: System prompt only shows 11 key days (out of 28). This is acceptable for streamlining, but narrative references should align.

### Coherence Check: system-prompt-v2.md ↔ synthetic-data-v2.json

**STATUS: ✅ ALIGNED with MINOR DISCREPANCY**

| Element | Prompt | JSON | Match? |
|---------|--------|------|--------|
| Sleep last night | 6.0h, quality 62, deep 10.5% | 6.0h, quality 62, deep 10.5% | ✅ |
| Sleep-HR correlation | 7-8h quality >80 → HR 60.1 | ✅ Data supports | ✅ |
| Deep sleep threshold | <12% → elevated metrics | ✅ Data shows pattern | ✅ |

**MINOR ISSUE**: Prompt says "8 nights with 7-8h sleep + quality >80" but doesn't specify which exact dates. Should be verifiable against JSON.

### Coherence Check: narrative-design-v1.md ↔ synthetic-data-v1.json

**STATUS: ✅ STRONGLY ALIGNED**

Narrative correctly identifies:
- Week 1-2 baseline (HR 59-61, BP 119-127)
- Oct 26 peak (HR 69, BP 135/88)
- Tuesday pattern (Oct 28, Nov 4)
- Weekend non-recovery (Nov 1-2)

### Coherence Check: narrative-design-v2.md ↔ synthetic-data-v2.json

**STATUS: ✅ STRONGLY ALIGNED**

Narrative correctly shows:
- Oct 26 worst sleep (5.8h, quality 58) → highest HR (69)
- Oct 12 best sleep (8.2h, quality 88) → lowest HR (58)
- Sleep debt accumulation timeline
- Deep sleep percentage thresholds

---

## Part 3: ElevenLabs Best Practices Alignment

### Current Prompts vs. ElevenLabs Six Building Blocks

| Block | V1 Status | V2 Status | Assessment |
|-------|-----------|-----------|------------|
| **Personality** | ✅ Present (lines 24-36) | ✅ Same | **GOOD**: Clear role as data analyst |
| **Tone** | ✅ Present (lines 52-71) | ✅ Same | **NEEDS WORK**: Missing natural disfluencies, filler words |
| **Goal** | ⚠️ Implicit in protocol | ⚠️ Implicit | **NEEDS WORK**: Should be explicit section |
| **Guardrails** | ✅ Strong (lines 361-376) | ✅ Strong | **GOOD**: Medical disclaimer, correlational language |
| **Tools** | ❌ Not applicable | ❌ Not applicable | N/A for this use case |
| **Knowledge Base** | ⚠️ Mixed data + general | ⚠️ Mixed | **CRITICAL ISSUE**: General knowledge should be RAG |

### Specific ElevenLabs Best Practice Violations

#### ❌ VIOLATION 1: Verbose Responses
**ElevenLabs**: "Keep responses under 3 sentences unless detail needed"
**Current**: Q&A examples are 15-30 sentences

**Example from example-qa-v1.md (lines 17-27):**
```
"Looking at your 28-day cardiovascular data, here's the complete picture: Your heart health shows both strengths and areas needing attention.

The positive side: You've maintained zero AFib burden throughout this entire period—that's excellent. Your cardiac rhythm is stable, which significantly reduces stroke risk. In your first two weeks of October, you were showing optimal cardiovascular health with a heart rate averaging 59.5 bpm and blood pressure around 121/82.

The concern: Starting around October 25-26, both your heart rate and blood pressure elevated and have stayed elevated. Today, your heart rate is 68 bpm—that's 8 beats above your baseline—and your blood pressure is 134/87, which puts you in Stage 1 Hypertension range..."
```

**FIX NEEDED**: Compress to 2-3 sentences with option to expand

#### ❌ VIOLATION 2: Missing Natural Speech Markers
**ElevenLabs**: Use affirmations ("Got it"), filler words ("actually", "you know"), disfluencies
**Current**: Too polished, no natural markers

**FIX NEEDED**: Add to voice_and_tone section:
```xml
<natural_speech_markers>
  <affirmations>Got it, Sure thing, Right, I see</affirmations>
  <filler_words>actually, so, you know, um</filler_words>
  <disfluencies>Brief pauses, thoughtful corrections, false starts</disfluencies>
</natural_speech_markers>
```

#### ❌ VIOLATION 3: No TTS Formatting Guidance
**ElevenLabs**: "Format as pronounced - email@example.com → 'email at example dot com'"
**Current**: No guidance on this

**FIX NEEDED**: Add to guardrails:
```xml
<tts_formatting>
  - Emails: "team at elevenlabs dot io" not "team@elevenlabs.io"
  - Numbers: "six point two hours" not "6.2h"
  - Percentages: "sixty-two percent" not "62%"
  - Abbreviations: Spell out "beats per minute" not "bpm" on first use
</tts_formatting>
```

#### ⚠️ PARTIAL: Mirror User Energy
**ElevenLabs**: "Terse queries: Stay brief. Curious users: Add humor. Frustrated: Lead with empathy"
**Current**: Has general principles but not explicit energy-matching

**FIX NEEDED**: Enhance <engagement_principles>

---

## Part 4: Expert Criticism Framework

### Expert 1: Conversational AI Designer (ElevenLabs Specialist)

**Strengths:**
- Strong medical positioning and guardrails
- Clear data-driven approach
- Correlational language framework in V2

**Critical Issues:**

1. **Knowledge Bloat**: "Why is lifestyle_recommendations in the prompt? This should be RAG-accessible external knowledge. The prompt should ONLY contain user-specific data and behavior rules."

2. **Missing Conversational Naturalness**: "Where are the 'Got it' affirmations? The filler words? This reads like a written document, not a voice conversation. ElevenLabs agents MUST sound human."

3. **Length Violation**: "Your example Q&As are 3-4x longer than recommended. ElevenLabs best practice: under 3 sentences unless detail explicitly requested. You're front-loading everything."

4. **No Energy Adaptation**: "How does the agent adjust to user energy? A terse 'How am I doing?' should get a terse response, not a 200-word essay."

**Recommendation**: "Strip all general health knowledge from prompts. Add natural speech markers. Rewrite Q&As to be 2-3 sentences with progressive layering."

### Expert 2: Medical AI Ethics Specialist

**Strengths:**
- Excellent non-diagnostic positioning
- Strong correlational language (V2)
- Medical disclaimer present

**Critical Issues:**

1. **Causal Language Leakage in Q&As**: "Example-qa-v2.md line 49: 'Your poor sleep last night is why your heart rate is elevated today' - that's CAUSAL, not correlational. Should be 'Your poor sleep last night correlates with today's elevated heart rate.'"

2. **Risk Overstatement**: "Phrases like 'Stage 1 Hypertension' without immediate context that this is within management range. Could cause undue alarm."

3. **Missing Severity Triage**: "No guidance on when to say 'This is concerning' vs 'This is notable' vs 'This is within expected variation.'"

**Recommendation**: "Audit every Q&A for causal language. Replace with approved correlational patterns. Add severity calibration to guardrails."

### Expert 3: Data Science / Health Analytics Specialist

**Strengths:**
- Strong quantification throughout
- Good use of deltas and ranges
- Personal vs population context

**Critical Issues:**

1. **Unverified Statistical Claims**: "V2 claims '8 nights with 7-8h sleep + quality >80' but doesn't cite which specific nights. Should reference: Oct 8, 9, 10, 12, etc."

2. **Missing Confidence Intervals**: "Stating 'HR averaged 60.1 bpm' without variance. Should include: 'HR averaged 60.1 ± 1.2 bpm (n=8 nights)'"

3. **Correlation Strength Not Quantified**: "Says 'strong correlation' but doesn't provide r-value or p-value. For a data analyst persona, this is weak."

**Recommendation**: "Add statistical rigor where possible. Reference specific dates for claims. Include variance/confidence where appropriate."

### Expert 4: Voice UX Designer

**Strengths:**
- Clear conversational protocol
- Engagement principles defined

**Critical Issues:**

1. **No Pause Notation**: "Where are the TTS pause markers? (...) is mentioned but not systematically applied. Should mark pauses: 'Your heart rate today is 68 bpm... 8 beats above your baseline.'"

2. **Rhythm Monotony**: "Every response follows identical structure: Context → Observation → Insight → Question. This becomes predictable and robotic."

3. **No Voice State Management**: "How does the agent handle interruptions? What if user cuts in mid-response? No guidance."

**Recommendation**: "Add systematic pause notation. Vary response structures. Add interruption handling guidance."

### Expert 5: Technical Writing / Documentation Specialist

**Strengths:**
- Well-structured XML
- Clear hierarchies

**Critical Issues:**

1. **Redundancy in V1/V2**: "system-prompt-v2.md duplicates all of V1. Should use inheritance or modular structure: 'Extends system-prompt-v1.md with sleep integration.'"

2. **Example Q&As Too Prescriptive**: "Q&A examples read like templates to copy verbatim. Should be illustrative examples showing principles, not scripts."

3. **Missing Version Control**: "No changelog showing what changed from V1 to V2. Should document: 'V2 adds: sleep_metrics, sleep_heart_correlations, sleep_optimization.'"

**Recommendation**: "Modularize prompts. Rewrite Q&As as principle demonstrations. Add version documentation."

---

## Part 5: Critical Issues Summary

### BLOCKER ISSUES (Must Fix)

1. **Knowledge Bloat in Prompts**
   - Issue: lifestyle_recommendations with general health advice
   - Impact: Wastes token budget on RAG-accessible knowledge
   - Fix: Remove all general knowledge, keep only user-specific data

2. **Q&A Examples Not ElevenLabs-Compliant**
   - Issue: 15-30 sentence responses vs. 3 sentence guideline
   - Impact: Unnatural, verbose, non-conversational
   - Fix: Complete rewrite to 2-3 sentence core + progressive expansion

3. **Causal Language in V2 Q&As**
   - Issue: "sleep is why" instead of "sleep correlates with"
   - Impact: Violates medical guardrails
   - Fix: Replace all causal with approved correlational patterns

### HIGH PRIORITY ISSUES

4. **Missing Natural Speech Markers**
   - Issue: No "Got it", "actually", disfluencies
   - Impact: Robotic voice output
   - Fix: Add natural_speech_markers section

5. **No TTS Formatting Guidance**
   - Issue: No guidance on pronouncing emails, numbers
   - Impact: Awkward TTS rendering
   - Fix: Add tts_formatting to guardrails

6. **Statistical Claims Unverified**
   - Issue: "8 nights with 7-8h sleep" - which nights?
   - Impact: Unverifiable data claims
   - Fix: Reference specific dates for all claims

### MEDIUM PRIORITY ISSUES

7. **No Explicit Goal Section**
8. **Missing Energy Adaptation Guidance**
9. **No Pause Notation in Examples**
10. **V1/V2 Redundancy**

---

## Part 6: Recommended Actions

### Immediate (Blockers)

1. **Remove General Knowledge from Prompts**
   - Delete: lifestyle_recommendations (stress_management, dietary_approaches)
   - Keep: Only population_norms (needed for dual-context framework)
   - Rationale: RAG can provide this, prompt should have user-specific data only

2. **Completely Rewrite Q&A Examples**
   - Target: 2-3 sentences core response
   - Structure: Core insight → Pause → Engagement question
   - Add: Progressive layering options ("Want more detail?")
   - Fix: All causal language → correlational

3. **Add Natural Speech Markers**
   - Update voice_and_tone with affirmations, fillers, disfluencies
   - Update Q&A examples to demonstrate natural markers

### Next Sprint

4. **Add TTS Formatting Guidance**
5. **Verify Statistical Claims Against JSON**
6. **Add Explicit Goal Section**
7. **Enhance Energy Adaptation**
8. **Modularize V1/V2 Prompts**

---

## Part 7: Rewrite Specifications

### System Prompt Structure (Target)

```xml
<agent_identity>
  <!-- Keep as-is -->
</agent_identity>

<personality>
  <!-- Keep as-is -->
</personality>

<voice_and_tone>
  <!-- ENHANCE: Add natural_speech_markers -->
</voice_and_tone>

<knowledge_base>
  <user_data>
    <!-- KEEP: Only user-specific embedded data -->
    - report_metadata
    - personal_range_analysis
    - daily_detail (keep 11 key days for prompt efficiency)
    - pattern_insights
    [V2: + sleep_metrics, sleep_heart_correlations]
  </user_data>

  <context_reference>
    <!-- KEEP: Minimal reference for dual-context framework -->
    - population_norms (condensed to 5-6 lines)
  </context_reference>

  <!-- DELETE: lifestyle_recommendations -->
  <!-- DELETE: All general health advice -->
</knowledge_base>

<goal>
  <!-- ADD: Explicit goal section following ElevenLabs -->
</goal>

<conversation_protocol>
  <!-- ENHANCE: Add energy adaptation guidance -->
</conversation_protocol>

<guardrails>
  <!-- ADD: TTS formatting -->
  <!-- ADD: Energy mirroring -->
  <!-- Keep medical disclaimer, correlational language -->
</guardrails>
```

### Q&A Example Structure (Target)

```markdown
### Example: General Health Inquiry

**Q: "How am I doing overall?"**

**Agent Response (Core - 2-3 sentences):**
"Looking at your 28 days of data... your heart rhythm is excellent—zero AFib burden the entire time. However, your heart rate and blood pressure have been elevated since late October, sitting at 68 beats per minute and 134 over 87 today, which is 8 beats and about 10 points higher than your personal baseline. Would you like me to dig into what might be driving this pattern?"

**If User Says "Yes":**
[Progressive expansion - add 2-3 more sentences with pattern details]

**If User Says "No":**
[Offer alternative: "Want recommendations?" or "Different metric?"]

**Natural Speech Markers Demonstrated:**
- Pause notation: "Looking at your 28 days of data..."
- Affirmation potential: "Got it" (if user responds)
- Filler word potential: "So, actually" (contextual)

**Correlational Language:**
✅ "elevated since late October" (temporal pattern)
✅ "sitting at" (descriptive)
✅ "higher than your personal baseline" (comparison)
```

---

## Part 8: Validation Checklist

Before finalizing rewrites, validate:

### Data Coherence
- [ ] Every metric in prompt exists in synthetic-data JSON
- [ ] Dates align exactly
- [ ] Statistical claims reference specific dates
- [ ] Pattern insights verifiable in JSON

### ElevenLabs Compliance
- [ ] Personality section clear
- [ ] Tone includes natural speech markers
- [ ] Goal section explicit
- [ ] Guardrails include TTS formatting
- [ ] Example responses under 3 sentences (core)
- [ ] Progressive layering demonstrated

### Medical Safety
- [ ] All causal language replaced with correlational
- [ ] Medical disclaimer present
- [ ] Non-diagnostic positioning clear
- [ ] Severity calibration appropriate

### Voice UX
- [ ] Pause notation systematic
- [ ] Energy adaptation guidance present
- [ ] Interruption handling considered
- [ ] Natural conversation flow

---

## Conclusion

The current prompts have strong foundations (medical positioning, data-driven approach, correlational framework in V2) but require significant refinement to align with ElevenLabs best practices and remove knowledge bloat.

**Priority 1**: Remove general health knowledge from prompts (access via RAG)
**Priority 2**: Complete rewrite of Q&A examples (2-3 sentences, natural speech, progressive layering)
**Priority 3**: Add natural speech markers and TTS formatting guidance

**Timeline**: Priority 1 & 2 must be completed before deployment. Priority 3 can be iterative.
