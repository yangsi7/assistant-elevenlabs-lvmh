# ElevenLabs System Prompts Directory

## Purpose

Production-ready ElevenLabs voice assistant system prompts for SKIIN platform health monitoring demo (LVMH). Transformed from passive/flowery to professional/proactive with embedded synthetic data.

## Core Files

### System Prompts (Production)
- **`system-prompt-v1.md`** (614 lines) - Core cardiovascular metrics with 28 days embedded data
- **`system-prompt-v2.md`** (1,144 lines) - V1 + sleep integration with full sleep-heart correlations

### Q&A Examples
- **`example-qa-v1.md`** - 15 conversation scenarios for V1
- **`example-qa-v2.md`** - 27 scenarios (15 base + 12 sleep-focused) for V2

### Reference Data
- **`synthetic-data-v1.json`** - 28-day cardiovascular data (supplementary reference)
- **`synthetic-data-v2.json`** - 28-day cardiovascular + sleep data (supplementary reference)

### Documentation
- **`narrative-design-v1.md`** - "Stressed Professional" storyline documentation
- **`narrative-design-v2.md`** - Extended narrative with sleep-heart causation
- **`improvement-summary.md`** - Complete transformation summary and usage guide
- **`system-prompt-template.md`** - Original template structure (reference)

## Data Architecture

**CRITICAL**: All data is embedded directly in system prompts (user requirement). JSON files are supplementary only.

**V1 Structure**:
```
<daily_detail>
  <date value="Tuesday, November 4, 2025">
    <hr value="68.0" flag="‼ anomalously high" />
    <systolic value="134.0" flag="⚠ above typical" />
    <diastolic value="87.0" flag="⚠ above typical" />
    <afib value="0.00%" flag="✓ typical" />
    <note>Context</note>
  </date>
  <!-- 27 more days -->
</daily_detail>
```

**V2 Additions**:
```xml
<sleep_previous_night>
  <duration>6.0 hours</duration>
  <quality>62</quality>
  <deep_sleep>10.5%</deep_sleep>
  <flag>⚠ poor</flag>
</sleep_previous_night>
```

## Narrative Pattern

**"Stressed Professional"** - 28 days showing:
- **Baseline** (Week 1-2): Healthy metrics, good sleep
- **Inflection** (Oct 25-26): Clear stress onset
- **Sustained Elevation** (Week 3-4): Chronic pattern with Tuesday spikes
- **Weekend Non-Recovery**: Acute becoming chronic

## Usage

**For LVMH Demo**:
- Use **V1** for standard cardiovascular monitoring demo (10-15 min)
- Use **V2** for advanced sleep-integration demo (20-30 min)

**Implementation**:
1. Deploy system prompt to ElevenLabs agent
2. All data embedded - zero external dependencies
3. Voice-optimized delivery (natural transitions, pauses)

## Key Features

- **Proactive Insights**: Leads with findings before questions
- **Quantified**: All observations have specific values and deltas
- **Multi-Metric**: Connects HR + BP + Sleep into narratives
- **Personal Baseline**: Flags deviations from user's typical range
- **Actionable**: Every insight includes specific recommendations

## Knowledge Base

Medical reference materials in `knowledge/`:
- `heart-health-knowledge.txt` - Clinical ranges, interpretation
- `afib-knowledge.txt` - AFib burden significance
- `key-heart-metric-and-population-normal-range.txt` - Quick reference

## Maintenance

**To Update with Real Data**:
1. Replace `<daily_detail>` section with actual user data
2. Update `<personal_range_analysis>` with real baselines
3. Maintain XML structure and flag system
4. Preserve medical disclaimers and guardrails

**Flag System**:
- `✓` typical - Within personal Q1-Q3 range
- `⚠` above/below typical - Outside Q1-Q3
- `‼` anomalously high/low - Extreme deviation
- `—` no data - Missing measurement
