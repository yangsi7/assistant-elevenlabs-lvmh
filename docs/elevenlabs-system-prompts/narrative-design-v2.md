# Narrative Design V2: The Stressed Professional (Extended with Sleep Data)

## Overview

Version 2 extends the core narrative with **sleep data that causally connects to cardiovascular patterns**. The sleep-heart relationship demonstrates how poor sleep quality amplifies and sustains the stress response.

## Sleep Data Integration Strategy

### Core Hypothesis
**Poor sleep → Impaired recovery → Sustained cardiovascular elevation**

The sleep data shows:
1. **Baseline period:** Good sleep (7.5-8h, high quality) → normal HR/BP
2. **Stress period:** Sleep disruption (5.5-6.5h, poor quality) → elevated HR/BP next day
3. **Weekend attempts:** Longer sleep but poor consistency → incomplete recovery
4. **Current state:** Chronic sleep debt perpetuating cardiovascular stress

## Sleep Metrics Design

### Sleep Duration (hours)
- **Optimal:** 7.5-8.5 hours
- **Adequate:** 7-7.5 hours
- **Insufficient:** <7 hours
- **Severely insufficient:** <6 hours

### Sleep Quality Score (0-100)
- **Excellent:** 85-100
- **Good:** 70-84
- **Fair:** 55-69
- **Poor:** <55

Calculated from:
- Time to fall asleep (sleep latency)
- Number of awakenings
- Time awake during night
- Sleep phase balance

### Sleep Consistency Score (0-100)
- **Excellent:** 90-100 (bedtime varies <30 min)
- **Good:** 75-89 (bedtime varies 30-60 min)
- **Fair:** 60-74 (bedtime varies 60-90 min)
- **Poor:** <60 (bedtime varies >90 min)

### Sleep Phases (% of total sleep)
- **Deep Sleep (NREM 3):**
  - Optimal: 15-20%
  - Adequate: 12-15%
  - Insufficient: <12%
- **Light Sleep (NREM 1-2):**
  - Optimal: 50-60%
  - Typical: 60-65%
- **REM Sleep:**
  - Optimal: 20-25%
  - Adequate: 15-20%
  - Insufficient: <15%

## 28-Day Sleep Pattern

### Week 1 (Oct 8-14): Healthy Sleep Baseline
- **Duration:** 7.5-8.2 hours (avg: 7.9h)
- **Quality:** 82-88 (avg: 85 - Good/Excellent)
- **Consistency:** 88-92 (Excellent)
- **Deep Sleep:** 16-18% (Optimal)
- **REM Sleep:** 22-24% (Optimal)
- **Next-day HR:** 58-61 bpm (baseline)
- **Next-day BP:** 114-126/81-83 (optimal)

**Pattern:** Consistent sleep schedule → optimal recovery → healthy metrics

### Week 2 (Oct 15-21): Sleep Baseline Maintained
- **Duration:** 7.3-8.0 hours (avg: 7.7h)
- **Quality:** 78-86 (avg: 82 - Good)
- **Consistency:** 85-90 (Good/Excellent)
- **Deep Sleep:** 15-17% (Optimal)
- **REM Sleep:** 21-23% (Optimal)
- **Next-day HR:** 59-60 bpm (baseline)
- **Next-day BP:** 119-127/82-83 (normal)

**Pattern:** Stable sleep → stable cardiovascular health

### Week 3 (Oct 22-28): Sleep Disruption Begins
- **Key Event:** Oct 24-25 (Thu-Fri) - First major sleep disruption
  - Oct 24: 6.2h sleep, quality 65 (Fair) → Oct 25: HR 60, BP 130/85
- **Oct 26 (Peak stress day):**
  - Previous night (Oct 25-26): 5.8h, quality 58 (Poor), deep sleep 10%
  - Next day: **HR 69 bpm** (highest), **BP 135/88** (highest)
- **Oct 27-28:**
  - Oct 26-27: 6.5h, quality 68
  - Oct 27: HR 63, BP 128/85
  - Oct 27-28: 6.0h, quality 62 (Poor)
  - **Oct 28 (Tuesday spike):** HR 64, BP 135/87

**Pattern:** Sleep duration drops → quality declines → next-day metrics elevate

**Week 3 Averages:**
- Duration: 6.4h (1.3h below baseline)
- Quality: 66 (Fair, -16 points)
- Consistency: 72 (Fair, -15 points)
- Deep sleep: 11.8% (below optimal)
- REM: 18.2% (below optimal)

### Week 4 (Oct 29-Nov 4): Chronic Sleep Debt
- **Pattern:** Attempting recovery but failing
  - Weeknights: 5.5-6.5h (insufficient)
  - Weekend: 7.5-8h (adequate duration BUT poor quality)
  - Quality remains low: 60-70 range even with longer duration
  - Consistency very poor: 58-68 (erratic schedule)

**Specific Days:**
- **Oct 29-30 (Tue-Wed):**
  - Oct 29: 6.8h, quality 72 → Oct 30: HR 63, BP 126/84 (improving)
- **Oct 30-31 (Wed-Thu):**
  - Oct 31: 6.2h, quality 65 → Nov 1: HR 63, BP 135/87 (elevated despite weekend)
- **Nov 1-2 (Fri-Sat):**
  - Nov 1: 7.8h, quality 68 (longer but poor quality) → Nov 2: HR 62, BP 136/88
- **Nov 2-3 (Sat-Sun):**
  - Nov 2: 7.5h, quality 70 → Nov 3: HR 62, BP normal
- **Nov 3-4 (Sun-Mon):**
  - Nov 3: 6.0h, quality 62 (Poor) → **Nov 4 (Tuesday): HR 68, BP 134/87**

**Week 4 Averages:**
- Duration: 6.7h (1.2h below baseline)
- Quality: 66 (Fair)
- Consistency: 62 (Poor)
- Deep sleep: 11.5% (insufficient)
- REM: 17.8% (below optimal)

## Sleep-Heart Correlation Patterns

### Pattern 1: Duration-HR Relationship
**Strong negative correlation:** Less sleep → Higher next-day HR

| Sleep Duration | Next-Day Average HR |
|----------------|---------------------|
| <6 hours | 66.5 bpm |
| 6-7 hours | 63.2 bpm |
| 7-8 hours | 60.1 bpm |
| >8 hours | 59.3 bpm |

**Clinical Mechanism:** Sleep deprivation → increased sympathetic tone → elevated resting HR

### Pattern 2: Quality-BP Relationship
**Moderate negative correlation:** Poor quality → Higher next-day BP

| Sleep Quality | Next-Day Average BP |
|---------------|---------------------|
| Poor (<60) | 134/87 mmHg |
| Fair (60-75) | 129/85 mmHg |
| Good (75-85) | 124/83 mmHg |
| Excellent (>85) | 121/82 mmHg |

**Clinical Mechanism:** Disrupted sleep → cortisol dysregulation → impaired BP dipping → daytime elevation

### Pattern 3: Deep Sleep-Recovery Relationship
**Strong positive correlation:** More deep sleep → Better next-day recovery

| Deep Sleep % | Cardiovascular Recovery |
|--------------|-------------------------|
| <12% | Poor (elevated HR+BP) |
| 12-15% | Moderate (HR or BP elevated) |
| 15-18% | Good (near baseline) |
| >18% | Excellent (optimal baseline) |

**Clinical Mechanism:** Deep sleep = physical recovery, sympathetic withdrawal, cardiovascular repair

### Pattern 4: Consistency-Baseline Stability
**Strong positive correlation:** Better consistency → More stable baseline

| Consistency Score | Metric Stability |
|-------------------|------------------|
| <60 (Poor) | High variability (SD 5.2 bpm, 8.4 mmHg) |
| 60-75 (Fair) | Moderate variability (SD 3.8 bpm, 6.1 mmHg) |
| 75-90 (Good) | Low variability (SD 2.1 bpm, 3.2 mmHg) |
| >90 (Excellent) | Minimal variability (SD 1.3 bpm, 2.1 mmHg) |

**Clinical Mechanism:** Circadian disruption → irregular autonomic patterns → unstable metrics

## Key Causal Chains

### Chain 1: Acute Stress → Sleep Disruption → Sustained Cardiovascular Elevation
1. **Oct 24-25:** Work stressor disrupts sleep (6.2h, quality 65)
2. **Oct 26:** Poor sleep continues (5.8h, quality 58) → Peak CV response (HR 69, BP 135/88)
3. **Oct 27-28:** Sleep remains poor → CV metrics stay elevated
4. **Ongoing:** Sleep debt accumulates → CV system can't recover

### Chain 2: Weekend Recovery Failure
1. **Early weekends (Oct 11-18):** Good sleep (7.5-8h, quality 82+) → Full CV recovery
2. **Late weekends (Nov 1-2):** Longer duration (7.5-8h) BUT poor quality (68-70) → **Incomplete CV recovery**
3. **Implication:** Duration alone insufficient; quality matters

### Chain 3: Tuesday Amplification
1. **Oct 28 (Tuesday):** Poor prior sleep (6.0h, quality 62) + Tuesday stressor → Major spike (HR 64, BP 135/87)
2. **Nov 4 (Tuesday):** Poor prior sleep (6.0h, quality 62) + Tuesday stressor → Major spike (HR 68, BP 134/87)
3. **Mechanism:** Sleep debt + recurring stressor = amplified response

## Medical Plausibility

### Sleep-Cardiovascular Physiology
1. **Sleep deprivation effects:**
   - Increased sympathetic activity (elevated catecholamines)
   - Impaired parasympathetic recovery
   - Cortisol dysregulation
   - Inflammatory marker elevation
   - Insulin resistance (contributes to hypertension)

2. **Deep sleep importance:**
   - Vagal (parasympathetic) dominance
   - Growth hormone secretion (tissue repair)
   - Blood pressure "dipping" (10-20% reduction)
   - Cardiovascular system restoration

3. **REM sleep role:**
   - Emotional processing (stress regulation)
   - Memory consolidation
   - BP variability (can spike but necessary for brain health)

4. **Circadian alignment:**
   - Consistent sleep-wake timing → stable autonomic patterns
   - Irregular schedule → circadian misalignment → metabolic/CV dysfunction

### Clinical Realism: 9/10
This pattern is **extremely common** in professional populations:
- Stress disrupts sleep
- Sleep debt perpetuates stress response
- Positive feedback loop develops
- Highly responsive to intervention

## Narrative Arc for Assistant (V2)

### Opening Insight Structure (Extended):
1. **Positive anchor:** "Zero AFib burden - excellent cardiac rhythm"
2. **Main concern:** "Elevated HR and BP since mid-October"
3. **Root cause identification:** "Sleep disruption starting Oct 24 appears to be driving this"
4. **Causal chain:** "Poor sleep → impaired recovery → sustained cardiovascular elevation"
5. **Pattern synthesis:** "Your sleep debt correlates directly with next-day metrics"
6. **Actionable path:** "Sleep restoration is priority #1, then stress management"

### Data Story Flow (V2):
- **Act 1:** Healthy baseline with good sleep (Week 1-2)
- **Act 2:** Sleep disruption triggers CV response (Oct 24-26)
- **Act 3:** Sleep debt prevents recovery, creates chronic pattern (Week 4)
- **Resolution:** Clear intervention pathway prioritizing sleep

## Cross-Metric Storytelling

### Example 1: The Oct 26 Peak
"Let me connect the dots on October 26, when your heart rate hit its peak at 69 bpm. The night before, you only got 5.8 hours of sleep with a quality score of 58—your worst sleep of the month. This sleep disruption likely prevented your cardiovascular system from recovering, and combined with your elevated stress levels, resulted in the highest readings we've seen: HR 69 and BP 135/88. This demonstrates how sleep acts as a foundation for heart health."

### Example 2: The Weekend Recovery Failure
"Your early October weekends showed perfect recovery: 7.5-8 hours of high-quality sleep led to normal heart rate and blood pressure the next day. But notice the shift in November—you're sleeping similar durations on weekends (7.5-8 hours) yet your metrics remain elevated (BP 135-136/87-88). The difference? Your sleep quality has dropped to 68-70, indicating you're not getting enough deep, restorative sleep. Your body is trying to recover, but the sleep quality isn't sufficient."

### Example 3: The Tuesday Amplification
"Both your Tuesday spikes—October 28 and November 4—share a common pattern: the night before each, you got only 6 hours of poor-quality sleep (quality scores 62). This sleep deficit appears to amplify your response to whatever Tuesday stressor you're facing. On days when you sleep well, even stressors don't elevate your metrics as much. This suggests that addressing your sleep could reduce your vulnerability to stress."

## Instructional Goals (V2)

This extended narrative teaches:
1. **Sleep as Foundation:** Cardiovascular health depends on quality sleep
2. **Causality:** Poor sleep directly impacts next-day metrics (not just correlation)
3. **Quality vs Quantity:** 8 hours of poor sleep < 7 hours of good sleep
4. **Deep Sleep Importance:** Physical recovery happens in deep sleep stages
5. **Circadian Consistency:** Regular schedule stabilizes autonomic function
6. **Intervention Priority:** Sleep optimization enables stress management
7. **Measurement Integration:** Multiple metrics tell coherent story

## Assistant Proactivity Triggers (V2)

When user asks about elevated metrics, assistant should:
1. **Trace to sleep:** "Looking at your sleep data, I see a clear connection..."
2. **Quantify relationship:** "On nights with <6 hours, your next-day HR averages 66.5 vs your baseline 60..."
3. **Identify mechanism:** "This pattern suggests sleep deprivation is preventing cardiovascular recovery..."
4. **Prioritize intervention:** "Before addressing stress directly, let's focus on sleep restoration..."
5. **Provide sleep-specific recommendations:** "Three sleep priorities: duration consistency (aim for 7.5h minimum), sleep quality (reduce disruptions), schedule regularity (same bedtime ±30 min)..."

## Success Metrics for V2 Narrative

✅ Sleep-heart causality clearly demonstrated
✅ Multiple correlation patterns shown (duration, quality, deep sleep, consistency)
✅ Causal chains logically constructed
✅ Medical mechanisms explained accessibly
✅ Intervention priority clarified (sleep first)
✅ Complex multi-metric story remains coherent
✅ Realistic for professional demographic
✅ Actionable insights provided
