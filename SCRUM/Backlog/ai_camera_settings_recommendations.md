---
status: backlog
priority: P2
agent_claimed: null
claimed_at: null
updated: 2026-08-20
---

# AI Camera Settings Recommendations

> **Repo:** LIGHTLOG
> **Description:** Recommend ISO/aperture/shutter based on light conditions and subject type

---

## Context

Given current light conditions and subject type (landscape, portrait, action, astro), suggest optimal camera settings.

---

## Acceptance Criteria

- [ ] Exposure triangle calculator from light meter value
- [ ] Subject-type presets with recommended aperture/shutter priority
- [ ] Natural language explanation of tradeoffs per recommendation
- [ ] Camera model-specific profiles for sensor/focal length aware suggestions

---

## Technical Notes

- Exposure value formula; OpenAI API for natural language explanations; camera DB with sensor specs
