# Persona Review Consensus: grantedai.com Redesign Plan

**Date:** 2026-02-06
**Method:** 5 grant writer personas independently reviewed the live grantedai.com site and `homepageRedesign.md`, then conferred on priorities.

## Reviewers

| Persona | Organization | Segment |
|---------|-------------|---------|
| **Marisol Rivera** | WE ACT for Environmental Justice (NYC nonprofit) | Mid-size nonprofit, EPA/HUD grants, $12M portfolio |
| **Dr. Priya Nandakumar** | University of Washington (R1 academic) | Academic PI, NSF/NOAA grants, $2.8M funded |
| **Ethan J. Park** | RAND Corporation (defense think tank) | Defense/IC proposals, DARPA BAAs, $45M captured |
| **TJ Jackson** | Black Belt Community Foundation (small CBO, Selma AL) | First-time federal applicant, 6 staff, $800K budget |
| **Dr. Angela Crow Feather** | Sitting Bull College (tribal college, Standing Rock) | TCU researcher, data sovereignty, $1.2M funded |

---

## Priority Ranking (Consensus)

Each persona ranked their top 3 must-haves. Here is the aggregate:

| Priority | Issue | Votes as #1 | Votes in Top 3 | Personas |
|----------|-------|-------------|----------------|----------|
| **P0** | Data privacy/security statement + complete FAQ | 3 | 5 | ALL |
| **P1** | Fix product descriptions to match actual product (tech page, 3-step flow, feature lists) | 1 | 3 | Ethan, TJ, Priya |
| **P2** | Real product evidence (screenshots, sample output, or demo) | 0 | 4 | Priya, Ethan, Marisol, Angela |
| **P3** | Remove placeholder testimonials + stock photos | 0 | 3 | Angela, Ethan, Marisol |
| **P4** | Expand agency list + rewrite equity section with specific institutional language | 0 | 3 | Angela, Marisol, TJ |
| **HM** | Nonprofit/education pricing tier | 0 | 0 (all 5 mentioned as honorable mention) | ALL |

---

## WHAT MUST BE ADDED to the Redesign Plan

### A1. Data Privacy & Security (HIGHEST PRIORITY -- do before any visual work)

**Consensus: All 5 personas flagged this as a dealbreaker.**

The current site has:
- One sentence on the tech page: "Data from our users remains private and never becomes training data"
- FAQ questions about data trust that are 100% placeholder text
- No privacy policy link, no security page, no data handling documentation

**Required additions:**

1. **Homepage trust statement near CTA** (above the fold or adjacent to sign-up):
   > "Your proposals are never used to train AI models. Data encrypted in transit and at rest. Delete your data anytime."

2. **Dedicated /security or /trust page** with:
   - Data retention and deletion policy
   - Confirmation inputs are never used for model training
   - Which third-party APIs process data (OpenAI) and under what DPA
   - Data residency (US servers)
   - Encryption standards (at rest + in transit)
   - FERPA awareness for educational institutions
   - Data sovereignty statement for tribal/Indigenous institutions:
     > "We understand some institutions operate under data sovereignty frameworks. You retain full ownership of all uploaded content. All data can be permanently deleted at any time."

3. **Complete all FAQ answers immediately** -- placeholder text on questions about data trust is actively damaging credibility

4. **Add "Data & Privacy" link to main navigation**, not just footer (Angela, Ethan)

**Why this is P0:** Priya won't use the tool for unpublished research. Ethan's RAND infosec team would reject it on first screen. Angela can't show it to her Tribal Council IRB. Marisol manages sensitive community health data. TJ handles vulnerable population information. No amount of visual polish compensates for missing trust infrastructure.

---

### A2. Product Evidence Section (Screenshots, Sample Output, or Demo)

**Consensus: 4 of 5 personas explicitly requested this; the 5th (TJ) asked for "before/after" which is the same need.**

The current site has zero product screenshots. Users cannot see what the tool produces before signing up.

**Required additions:**

1. **At minimum one product screenshot** on the homepage showing the actual workspace -- ideally the AI coach mid-conversation analyzing an RFP, or a drafted section with coverage indicators
2. **Sample output section** -- a real (or realistic fictional) drafted grant section showing input questions alongside the AI's output. Suggested examples by persona:
   - NSF Broader Impacts section (Priya)
   - EPA Environmental Justice work plan (Marisol)
   - USDA Community Facilities narrative (TJ)
   - Any section showing coverage analysis (Ethan)
3. **Consider a 60-second screen recording** of the upload-to-draft workflow (Ethan ranked this highly)
4. The CSS document-stack illustration from Plan B3 is acceptable as an interim step but should not be the final state -- real product evidence is the goal

---

### A3. Expanded Agency List

**Consensus: 4 of 5 personas (all except Ethan, who focuses on DARPA which is already included).**

Current site mentions only NIH and NSF. The redesign plan adds DARPA, USDA, EPA, DOE, NOAA.

**Additional agencies that must be included:**
- **HUD** (Marisol, TJ) -- community development, fair housing
- **HRSA** (Marisol, TJ) -- health center grants, rural health
- **ACF** (Marisol, TJ) -- Administration for Children and Families
- **IHS** (Angela) -- Indian Health Service
- **BIA** (Angela) -- Bureau of Indian Affairs

**Change the label from "Trusted by researchers applying to" to "Built for applications to"** -- "Trusted by" implies existing institutional relationships that don't exist yet (flagged by Priya, Marisol, Ethan).

---

### A4. Audience-Inclusive Messaging

**Consensus: All 5 personas noted the site speaks only to academic researchers.**

**Required additions:**

1. **"Who is this for?" section** that explicitly names:
   - Academic researchers (NSF, NIH, DOE)
   - Nonprofits and community organizations (EPA, USDA, HUD)
   - Tribal colleges and Indigenous-serving institutions (NSF TCUP, EPA IGAP)
   - Small organizations without dedicated grant writing staff
   - First-time federal applicants

2. **"No grants department required" messaging** (TJ's suggestion, endorsed by Marisol and Priya) -- position Granted as the grants office you can't afford to hire. This differentiates from ChatGPT and speaks to the users who need the tool most.

3. **First-time applicant content** -- a section or FAQ entry: "Never applied for a federal grant before? Here's how Granted helps." (TJ)

4. **Grant writer cost comparison** -- "A professional grant writer charges $5,000-$15,000 per proposal. Granted costs $29/month." (TJ)

---

### A5. Equity Section Rewrite

**Consensus: 3 of 5 personas flagged the current language as dated or performative (Angela, Marisol, TJ).**

**Current problematic language:** "well-known equity issues that disproportionately affect the careers of women, minorities, and non-native English speakers"

**Required changes:**
- Remove the word "minorities" entirely (Angela: "dated term")
- Replace demographic shorthand with structural barriers and specific institution types:
  > "The grant system has always favored organizations with dedicated grants departments and expensive consultants. We built Granted to change that -- for community nonprofits, tribal colleges, HBCUs, first-time federal applicants, and researchers at under-resourced institutions."
- Back up equity claims with specific product features (Does it simplify jargon? Handle first-time applicant workflows? Support organizations without compliance staff?)
- If no data exists on actual impact for underserved users, frame as mission rather than demonstrated impact (Priya)

---

### A6. Nonprofit/Education Pricing Signal

**Consensus: All 5 personas mentioned this as important, though none ranked it #1.**

**Required additions:**
- Add a visible line on the pricing page: "Nonprofit or educational institution? Contact us for special pricing" (costs nothing to add)
- Consider a 25% nonprofit discount on Professional tier ($67/month instead of $89)
- Consider institutional/site license option for universities and TCUs (Priya, Angela)
- Extended trial period beyond 7 days for nonprofits (TJ: "I need at least a month to test it on a real application cycle")
- ROI framing: "On average, users complete a full federal grant draft in X hours instead of Y hours" (Angela)

---

### A7. Team/About Page

**Consensus: Ethan explicitly requested this; implicit in other personas' trust concerns.**

- Who built this? What are their credentials in grants and in AI?
- "At RAND we evaluate the team before the technology" (Ethan)

---

## WHAT MUST BE CHANGED in the Redesign Plan

### C1. Technology Page: Complete Rewrite (Not Just Homepage)

**Consensus: All 5 personas flagged the tech page as misleading or harmful.**

The current technology page references FAISS, LangChain, AutoGPT, "model weights finetuned by leading fundraising experts," and "recurrent loops of reflection and evaluation." The actual product uses OpenAI Agents SDK with coverage analysis and section-by-section drafting.

**Required changes:**
- Remove all references to FAISS, LangChain, AutoGPT (Ethan: "If a technical evaluator at DARPA sees 'AutoGPT' on your tech stack in 2026, they will close the tab")
- Replace with accurate description of current workflow: RFP analysis, requirement extraction, AI coach Q&A, section-by-section drafting with coverage tracking
- Describe what differentiates this from ChatGPT: it reads the actual RFP, discovers required sections, tracks coverage, grounds output in user-specific facts
- Include an architecture overview or workflow diagram (Ethan)
- Keep the data privacy sentence but expand it significantly (see A1)
- Priya: "The actual product is genuinely novel. Lead with what it does, not legacy architecture references."

**Priority note:** Ethan argues the tech page is the single highest-ROI fix on the entire site. The redesign plan treats it as secondary to homepage visual changes. **Elevate this to Phase 1.**

---

### C2. Placeholder Testimonials: Remove or Replace

**Consensus: All 5 personas agreed these must not ship as-is.**

Current redesign plan includes placeholder testimonials from fabricated personas:
- "Dr. Sarah Chen, Research Director"
- "Dr. Amit Patel, Principal Investigator"
- "Maria Rodriguez, Grants Manager"

**Required changes:**
- If real testimonials are available from beta users, use those (with attribution and permission)
- If no real testimonials exist, **remove the section entirely** (Angela, Ethan)
- Replace with a product demo section or "Join our pilot program" CTA (Marisol)
- If placeholders are used temporarily, they must represent audience diversity: include a community foundation director, tribal program coordinator, or first-time federal applicant -- not three university researchers (TJ)

---

### C3. 3-Step Workflow Copy: Treat as Content Accuracy Fix

**Consensus: All 5 personas approved the redesign plan's updated copy.**

The current site says: "Create a new project / Select a model and complete the prompt / Watch as Granted creates a draft"

The redesign correctly updates to: "Upload your RFP / Answer questions from your AI coach / Get a complete, grounded first draft"

**Ethan's note:** This should be treated as a content accuracy fix (the current copy describes a different product), not a cosmetic copy update. Prioritize it accordingly.

---

### C4. Hero Subtitle / Value Proposition

**Consensus: 3 personas suggested changes to the hero messaging.**

- Angela: Consider a secondary line signaling breadth: "From NSF R01s to tribal environmental grants -- built for the full spectrum of grant-seeking"
- TJ: The headline "You have better things to do with your time" resonates, keep it
- Ethan: "You have better things to do with your time" is patronizing to professionals who consider proposal writing a core competency -- consider audience segmentation

**Recommendation:** Keep the headline (resonates with 4 of 5 personas). Add a subtitle that signals audience breadth per Angela's suggestion.

---

## WHAT SHOULD BE REMOVED or DEPRIORITIZED

### D1. Deprioritize Animation Polish (Move to Phase 4)

**Consensus: Ethan explicitly recommended this; implicit in all other personas' "fix trust first" framing.**

The following items from the redesign plan should be deprioritized until content accuracy and trust infrastructure are in place:

- **A2: Scroll-triggered section reveals** -- nice to have, not urgent
- **A4: Button shimmer effects** -- polish, not substance
- **A5: Gold rule animation** -- decorative, low impact
- **A4: Card hover lift animations** -- minor enhancement

**Keep from animation plan:**
- **A1: Staggered hero entrance** -- fast to implement, provides professional feel (Ethan approved)
- **A3: Stats counter animation** -- reinforces credibility data

---

### D2. Remove Stock Photos Immediately

**Consensus: All 5 personas flagged stock photos as harmful to credibility.**

- Remove portrait-1.png and portrait-2.png from the homepage
- Replace with product screenshots (preferred) or CSS illustrations (acceptable interim)
- Do not replace stock photos with different stock photos -- use real product evidence or abstract visuals

---

### D3. Remove "50+ Writing Models" / "30+ Writing Models" Copy

**Consensus: All 5 personas found this confusing or misleading.**

- TJ: "50+ writing models means nothing to me. Is that 50 types of grants? 50 templates?"
- Ethan: "Legacy copy from an older product"
- Priya: Contradicts the actual AI coach workflow
- Replace with accurate feature descriptions tied to the current product

---

## IMPLEMENTATION ORDER (Revised)

Based on persona consensus, the redesign plan's implementation order should be restructured:

### Phase 1: Trust Infrastructure (DO FIRST -- before any visual work)
1. Complete all FAQ answers (especially data privacy questions)
2. Create /security or /trust page with data handling policies
3. Add homepage privacy statement near CTA
4. Add "Data & Privacy" to main navigation
5. Rewrite technology page to reflect actual product architecture
6. Fix 3-step workflow copy (content accuracy, not cosmetic)
7. Remove "50+ writing models" language everywhere

### Phase 2: Content Accuracy & Product Evidence
8. Replace stock photos with product screenshots or CSS illustrations
9. Add at least one real product screenshot to homepage
10. Remove placeholder testimonials (replace with real quotes or remove section)
11. Expand agency logo list (add HUD, HRSA, ACF, IHS, BIA)
12. Change "Trusted by researchers applying to" → "Built for applications to"
13. Add "Who is this for?" audience section
14. Rewrite equity section with structural language
15. Add "No grants department required" messaging

### Phase 3: Pricing & Conversion
16. Add "Nonprofit? Contact us for special pricing" to pricing page
17. Add grant writer cost comparison ("$5K-$15K per proposal vs. $29/month")
18. Consider extended trial for nonprofits
19. Add team/about page

### Phase 4: Visual Polish & Animation
20. Staggered hero entrance animation (A1)
21. Stats counter animation (A3)
22. Scroll-triggered section reveals (A2) -- if time permits
23. Button shimmer, card hover, gold rule animations (A4, A5) -- lowest priority

---

## CROSS-CUTTING THEME

All 5 personas converged on a single meta-insight: **the product is better than the marketing.** The actual Granted workflow (RFP analysis, AI coach Q&A, section-by-section drafting with coverage tracking) is genuinely differentiated and valuable. But the website describes a different, older, less impressive product while simultaneously failing to address the trust concerns that every segment of the target market shares. The highest-ROI work is not visual redesign -- it is content accuracy and trust infrastructure. As Ethan put it: "Fix the trust deficit before the typography." As Priya put it: "Fix the trust signals first, then worry about animations."
