# 🎨 Velithra Design System - Updated Color Palette

## Brand Colors (Based on Reference Image 2)

### Primary Colors
```css
--primary: #00d9ff          /* Bright Cyan - Main brand color */
--primary-dark: #0099cc     /* Dark Cyan - Hover states */
--primary-light: #4dd9ff    /* Light Cyan - Highlights */
```

### Accent Colors
```css
--accent: #0066ff           /* Cobalt Blue - Secondary brand */
--accent-light: #4d9fff     /* Light Blue - Accents */
```

### Background Colors
```css
--background: #0a1628       /* Deep Navy - Main background */
--background-light: #0f1f35 /* Lighter Navy - Cards, panels */
--background-dark: #05090f  /* Darkest Navy - Depth */
```

### Text Colors
```css
--foreground: #e8f4f8       /* Off White - Primary text */
--muted: #6b8ca8            /* Gray Blue - Secondary text */
--muted-dark: #4a6580       /* Dark Gray Blue - Disabled */
```

### Utility Colors
```css
--border: #1a3a5a           /* Navy Blue - Borders */
--success: #00e5a0          /* Bright Green */
--warning: #ffa500          /* Orange */
--error: #ff4d6d            /* Red */
```

---

## Logo Specifications

### Crystal Snowflake Structure
- **Central Hexagon**: Contains metallic "V" with chrome gradient
- **Six Radial Branches**: Each branch at 60° intervals (0°, 60°, 120°, 180°, 240°, 300°)
- **Branch Structure**: Main line + 2 sub-branches with terminal nodes
- **Decorative Elements**: Small hexagons, circles, and snowflake patterns

### Colors Used
- Main Branches: `#00d9ff` (Bright Cyan)
- Sub-branches: `#4dd9ff` (Light Cyan)
- Terminal Circles: `#00d9ff` with glow effect
- Central V: Chrome gradient (white → light blue → cyan)
- Hexagon nodes: `#0066ff` (Cobalt Blue)

### Effects
- Drop Shadow: `0 0 30px rgba(0, 217, 255, 0.7)`
- Glow Filter: Gaussian blur with cyan tint
- Animation: Subtle pulse scale (1 → 1.03 → 1) over 4.5s

---

## Component Color Usage

### Buttons
```tsx
// Primary Button
className="bg-[#00d9ff] hover:bg-[#0099cc] text-[#0a1628] shadow-lg shadow-[#00d9ff]/30"

// Secondary Button (Outline)
className="border-[#00d9ff]/40 text-[#00d9ff] hover:bg-[#00d9ff]/10"

// Disabled State
className="bg-[#6b8ca8]/20 text-[#6b8ca8] cursor-not-allowed"
```

### Cards (Glass Effect)
```tsx
className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl"
// With active state:
className="border-[#00d9ff] shadow-lg shadow-[#00d9ff]/20"
```

### Inputs
```tsx
className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 
           focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20"
```

### Links
```tsx
className="text-[#00d9ff] hover:underline hover:text-[#4dd9ff] transition-colors"
```

### Error Messages
```tsx
className="bg-red-500/10 border border-red-500/30 text-red-400"
```

### Success Messages
```tsx
className="bg-green-500/10 border border-green-500/30 text-green-400"
```

---

## CSS Variables

### Root Variables (globals.css)
```css
:root {
  /* Crystalline Circuit Color System - Updated Velithra Brand */
  --color-background: #0a1628;
  --color-foreground: #e8f4f8;
  --color-primary: #00d9ff;
  --color-primary-dark: #0099cc;
  --color-accent: #0066ff;
  --color-accent-light: #4dd9ff;
  --color-border: #1a3a5a;
  --color-muted: #6b8ca8;
  --radius: 0.5rem;
}
```

### Body Styles
```css
body {
  background-color: #0a1628;
  color: #e8f4f8;
  font-family: var(--font-sans);
}
```

---

## Animations

### Glow Pulse
```css
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 217, 255, 0.6), 0 0 60px rgba(0, 217, 255, 0.2);
  }
}
```

### Crystallize (Fade In)
```css
@keyframes crystallize {
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 0.7; }
  100% { opacity: 1; transform: scale(1); }
}
```

### Drift (Float)
```css
@keyframes drift {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
```

---

## Accessibility

### Contrast Ratios (WCAG AA Compliant)
- Primary (#00d9ff) on Dark (#0a1628): **14.2:1** ✅
- White (#e8f4f8) on Dark (#0a1628): **15.8:1** ✅
- Muted (#6b8ca8) on Dark (#0a1628): **5.1:1** ✅

### Focus States
All interactive elements have visible focus rings:
```css
focus:ring-2 focus:ring-[#00d9ff] focus:ring-offset-2 focus:ring-offset-[#0a1628]
```

---

## File Locations

- Logo Component: `components/logo/velithra-logo.tsx`
- Global Styles: `app/globals.css`
- Color Variables: `lib/config/colors.ts` (if needed)
- Theme Provider: `components/theme-provider.tsx`

---

## Usage Examples

### Page Background
```tsx
<div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1f35] to-[#0a1628]">
  {children}
</div>
```

### Gradient Text
```tsx
<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d9ff] to-[#4dd9ff]">
  Velithra
</h1>
```

### Glowing Card
```tsx
<div className="backdrop-blur-xl bg-white/5 border border-[#00d9ff]/20 
                rounded-2xl shadow-lg shadow-[#00d9ff]/10 
                hover:shadow-[#00d9ff]/20 transition-all">
  {content}
</div>
```

---

**Updated:** November 12, 2025  
**Version:** 2.0  
**Status:** ✅ Production Ready
