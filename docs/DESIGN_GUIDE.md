# Convertfy CRM Design Guide

Design language for the dark B2B SaaS experience. Blue is the brand color for everything except CTAs, which are exclusively green.

## Color Palette
- **Primary Blue `#3B82F6`**: icons, borders, highlights, step numbers, LED effects
- **Secondary Blue `#60A5FA`**: link hover, secondary elements
- **Accent Purple `#818CF8`**: subtle accents, gradients
- **CTA Green `#25D366`**: only action buttons (WhatsApp green)
- **Success Green `#22C55E`**: checkmarks, success/online indicators
- **Text**: Headings `#FFFFFF`, Body `#E5E7EB`, Secondary `#9CA3AF`, Muted `#6B7280`
- **Backgrounds**: Base `#0A0A0A`, Card `rgba(59, 130, 246, 0.05)`, Badge `rgba(59, 130, 246, 0.1)`
- **Borders**: Default `rgba(59, 130, 246, 0.2)`, Highlight `#3B82F6`, Success `rgba(34, 197, 94, 0.3)`

## Typography
- Font family: `'Plus Jakarta Sans', sans-serif`
- Import: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap">`
- Weights: 300, 400 (body), 500, 600 (buttons/labels), 700 (headings), 800 (hero)
- Sizes: H1 64–72px, H2 `text-4xl sm:text-5xl`, H3 `text-xl`/`text-2xl`, Body `text-base`/`text-lg`, Small `text-sm`

## Component Patterns
### Section Header
```jsx
<div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
  <div
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
    style={{
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
    }}
  >
    <span className="text-sm font-medium text-text-secondary">Badge Text</span>
  </div>

  <h2 className="text-4xl sm:text-5xl font-bold text-white">
    Main headline text
    <span className="block" style={{ color: '#3B82F6' }}>
      highlighted text
    </span>
  </h2>

  <p className="text-lg text-text-body">Description text goes here</p>
</div>
```

### Card
```jsx
<div
  className="rounded-2xl p-8 hover:shadow-medium transition-smooth"
  style={{
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
  }}
>
  {/* Card content */}
</div>
```

### CTA Button
```jsx
<button
  className="px-8 py-4 text-white font-semibold rounded-lg shadow-medium hover:shadow-strong hover:opacity-90 transition-smooth"
  style={{ backgroundColor: '#25D366' }}
>
  Start Free Trial
</button>
```

### Icon Container
```jsx
<div
  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-strong"
  style={{ backgroundColor: '#3B82F6' }}
>
  <Icon className="w-10 h-10 text-white" />
</div>
```

### Text Link
```jsx
<button
  className="font-semibold hover:underline underline-offset-4 transition-smooth"
  style={{ color: '#60A5FA' }}
>
  Learn more →
</button>
```

## Effects & Animations
- Shadows: soft `0 2px 8px rgba(59, 130, 246, 0.08)`, medium `0 8px 24px rgba(59, 130, 246, 0.15)`, strong `0 16px 48px rgba(59, 130, 246, 0.2)`, glow `0 0 40px rgba(59, 130, 246, 0.4)`
- LED light bar glow: `0 0 20px 5px rgba(59, 130, 246, 0.8), 0 0 60px 20px rgba(59, 130, 246, 0.4), 0 0 120px 50px rgba(59, 130, 246, 0.2)`
- CTA glow (green): `0 0 30px rgba(37, 211, 102, 0.4)`
- Text glow animation:
```css
@keyframes text-glow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.5),
                 0 0 40px rgba(59, 130, 246, 0.3);
  }
  50% {
    text-shadow: 0 0 30px rgba(59, 130, 246, 0.7),
                 0 0 60px rgba(59, 130, 246, 0.4);
  }
}
```
- Transitions: smooth `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);`, bounce `transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);`
- Tailwind animations available: `animate-fade-in`, `animate-scale-in`, `animate-slide-in-right`, `animate-lamp-pulse`, `animate-text-glow`

## Spacing & Layout
- Container: `container mx-auto px-4 sm:px-6 lg:px-8` (max width ~1400px)
- Section vertical padding: `py-16 md:py-24` (or `py-24`)
- Element spacing: `space-y-4` (tight) or `space-y-8` (loose)
- Section headers margin: `mb-16`
- Border radius: small `rounded-md`, default `rounded-lg`, large `rounded-2xl`, full `rounded-full`

## Checklist for New Pages
- Background: use `#0A0A0A`
- Text: headings `text-white`; body `#E5E7EB`; secondary `#9CA3AF`; muted `#6B7280`
- Buttons: CTA background `#25D366`; secondary buttons with `rgba(59, 130, 246, 0.3)` border; links `#60A5FA`
- Cards/containers: background `rgba(59, 130, 246, 0.05)`; border `rgba(59, 130, 246, 0.2)`; hover `hover:shadow-medium`
- Icons: primary `#3B82F6`; success `#22C55E`
- Badges: background `rgba(59, 130, 246, 0.1)`; border `rgba(59, 130, 246, 0.2)`

## Reference Files
- `src/index.css` — CSS variables, animations
- `tailwind.config.ts` — theme colors, custom classes
- `src/components/ui/button.tsx` — button variants
- `src/components/FeaturesSection.tsx` — card patterns
- `src/components/HowItWorksSection.tsx` — timeline, lamp effect
- `src/components/PricingSection.tsx` — pricing cards, badges
