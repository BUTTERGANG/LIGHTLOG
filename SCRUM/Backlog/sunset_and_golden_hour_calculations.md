---
status: backlog
priority: P2
agent_claimed: null
claimed_at: null
updated: 2026-08-20
---

# Sunset and Golden Hour Calculations

> **Repo:** LIGHTLOG
> **Description:** Accurate astronomical calculations for any GPS location with timezone handling

---

## Context

Core functionality -- compute sunrise/sunset, golden hour, blue hour, and twilight times for any location on any date.

---

## Acceptance Criteria

- [ ] Astronomical calculations using suncalc/solar library
- [ ] GPS location picker with saved favorite locations
- [ ] Golden hour and blue hour windows with quality score
- [ ] Timezone-aware display with DST handling

---

## Technical Notes

- suncalc-js for calculations; Geolocation API for auto-detect; timezone database for DST
