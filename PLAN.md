# Implementation Plan

## Phase 1: Scaffolding & Design System (Builder Task)

### Goal
Create a stunning, FT-inspired landing page with placeholder content. Focus on getting the design perfect — the content will be refined based on research.

### Design Direction
- **Inspiration:** Financial Times, The Economist
- **Fonts:** Serif for headlines (like Financier), clean sans for body
- **Colors:** Off-white/cream background, dark text, subtle accent color
- **Layout:** Generous white space, clear hierarchy, professional authority
- **Feel:** Modern, crisp, trustworthy, premium

### Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (minimal - logo/title only)                              │
├─────────────────────────────────────────────────────────────────┤
│ HERO                                                            │
│ - Big headline                                                  │
│ - Subhead (1-2 sentences)                                       │
│ - Visual hint (abstract option tree or branching paths)         │
├─────────────────────────────────────────────────────────────────┤
│ THE PROBLEM                                                     │
│ - Traditional dev = forced bets                                 │
│ - Cost of being wrong                                           │
│ - "Most good ideas never get tried"                             │
├─────────────────────────────────────────────────────────────────┤
│ THE THEORY                                                      │
│ - Real options explained simply                                 │
│ - Key formula (visual, not intimidating)                        │
│ - "Optionality has value"                                       │
├─────────────────────────────────────────────────────────────────┤
│ THE AI SHIFT                                                    │
│ - Exploration cost → near zero                                  │
│ - Moonshots unlocked                                            │
│ - Innovation space expands                                      │
├─────────────────────────────────────────────────────────────────┤
│ CALCULATOR (interactive)                                        │
│ - Inputs: uncertainty, # approaches, costs, value at stake      │
│ - Outputs: option value, recommended N, risk reduction          │
│ - Visual comparison chart                                       │
├─────────────────────────────────────────────────────────────────┤
│ CASE STUDIES (2-3)                                              │
│ - Before/after scenarios                                        │
│ - Real numbers                                                  │
│ - Visual breakdowns                                             │
├─────────────────────────────────────────────────────────────────┤
│ REFERENCES                                                      │
│ - Academic citations                                            │
│ - "Based on established economic theory"                        │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER (minimal)                                                │
│ - Credit, links                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Technical Requirements

1. **Single HTML file** (index.html) with embedded CSS
   - Or separate style.css if cleaner
   - No build step required
   - Works by just opening in browser

2. **Responsive**
   - Desktop-first but mobile-friendly
   - Works well on presentation screens (talks)
   - Shareable on LinkedIn (good og:image)

3. **Calculator**
   - Pure JavaScript, no dependencies
   - Sliders for inputs
   - Real-time output updates
   - Chart showing comparison (can use Chart.js via CDN)

4. **Performance**
   - Fast load (minimal dependencies)
   - No layout shift
   - Smooth animations (subtle, professional)

### File Structure

```
option-value/
├── index.html          # Main page
├── style.css           # Styles (FT-inspired)
├── calculator.js       # Calculator logic
├── assets/
│   ├── og-image.png    # Social share image
│   └── favicon.ico     # Favicon
├── README.md           # Project readme
├── PLAN.md             # This file
└── content/
    ├── theory.md       # Theory section content
    ├── case-studies.md # Case study content
    └── references.md   # Academic references
```

### Placeholder Content

For Phase 1, use Lorem Ipsum-style placeholder text that matches the intended length and tone. Real content comes in Phase 2 after research.

---

## Phase 2: Content Integration (After Research)

- Replace placeholder text with researched content
- Finalize calculator formulas
- Add real case study numbers
- Polish copy

---

## Phase 3: Polish & Deploy

- Final design tweaks
- og:image creation
- Deploy to Perttu's domain
- Test sharing on LinkedIn

---

## Success Criteria

### Design
- [ ] Looks like it could be on FT or Bloomberg
- [ ] Impressive enough to show during talks
- [ ] Professional enough for LinkedIn shares
- [ ] Calculator is intuitive and satisfying to use

### Technical
- [ ] Works with no build step
- [ ] Loads fast
- [ ] Mobile responsive
- [ ] Good social sharing preview
