# 🌐 Velithra - Accessibility & PWA Guide

## ♿ Accessibility Features (WCAG 2.1 AA Compliant)

### Keyboard Navigation

Velithra supports full keyboard navigation throughout the application.

#### Global Shortcuts
- **Alt + H** - Navigate to Dashboard
- **Alt + M** - Navigate to Modules
- **Alt + U** - Navigate to Users
- **Alt + C** - Navigate to Courses
- **Ctrl + /** - Focus Search Input
- **Escape** - Close Modal/Dialog
- **Tab** - Navigate between focusable elements
- **Shift + Tab** - Navigate backwards
- **Enter** - Activate buttons/links
- **Space** - Toggle checkboxes/switches

#### Focus Management
- Skip to main content link (visible on Tab focus)
- Focus trap in modals and dialogs
- Clear focus indicators on all interactive elements
- Logical tab order throughout the application

### Screen Reader Support

All components are optimized for screen readers:
- Semantic HTML structure
- ARIA labels on all interactive elements
- Live regions for dynamic content updates
- Descriptive text for icons and images
- Status announcements for async operations

### Color & Contrast

- WCAG AA compliant color contrast (4.5:1 minimum)
- Dark mode support synced with OS preferences
- Color-blind friendly palette
- No reliance on color alone for information

### Typography

- Responsive font sizes (minimum 16px)
- Proper heading hierarchy (h1 → h6)
- Readable line height (1.5 for body text)
- Sufficient letter spacing

### Forms

- Clear labels for all inputs
- Inline validation with error messages
- Required field indicators
- Disabled state clearly communicated

## 📱 Progressive Web App (PWA)

### Features

#### ✅ Installability
- Add to home screen on mobile devices
- Desktop installation support
- Custom install prompt after 30 seconds
- Standalone display mode

#### ⚡ Performance
- Service worker caching strategy
- Offline support for static assets
- API cache with NetworkFirst strategy
- Image optimization with CacheFirst

#### 📊 Cache Strategy

```typescript
// Fonts - CacheFirst (1 year)
Google Fonts → Cache → Network

// Images - CacheFirst (30 days)
PNG/JPG/SVG → Cache → Network

// API - NetworkFirst (5 minutes)
/api/* → Network → Cache (with 10s timeout)
```

#### 🔔 Capabilities
- Background sync (when implemented)
- Push notifications (when implemented)
- Offline mode support
- Fast load times (< 2s)

### Installation

#### Desktop
1. Open Velithra in Chrome/Edge
2. Click install icon in address bar
3. Or wait for install prompt
4. Click "Install"

#### Mobile (Android)
1. Open Velithra in Chrome
2. Tap menu (⋮)
3. Select "Add to Home screen"
4. Tap "Add"

#### Mobile (iOS)
1. Open Velithra in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Manifest Configuration

```json
{
  "name": "Velithra - Enterprise Platform",
  "short_name": "Velithra",
  "display": "standalone",
  "theme_color": "#00d9ff",
  "background_color": "#0a1628",
  "start_url": "/dashboard"
}
```

### Service Worker

- Automatic registration
- Skip waiting for updates
- Runtime caching strategies
- Offline fallback pages

## 🔧 Developer Guide

### Using Accessibility Utilities

```typescript
import { announceToScreenReader, ARIA_ROLES, focusVisible } from '@/lib/utils/accessibility';

// Announce to screen reader
announceToScreenReader('Data saved successfully', 'polite');

// ARIA attributes
<button
  aria-label="Delete item"
  aria-pressed={isActive}
  role={ARIA_ROLES.button}
  className={focusVisible}
>
  <TrashIcon />
</button>
```

### Keyboard Navigation Hook

```typescript
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';

function MyComponent() {
  useKeyboardNavigation([
    {
      key: 'n',
      ctrl: true,
      action: () => createNew(),
      description: 'Create new item (Ctrl+N)'
    }
  ]);
}
```

### Focus Trap

```typescript
import { useFocusTrap } from '@/hooks/use-keyboard-navigation';

function Modal({ isOpen }) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, modalRef);
  
  return <div ref={modalRef}>...</div>;
}
```

## 🧪 Testing

### Keyboard Navigation
1. Disable mouse/trackpad
2. Use Tab to navigate entire app
3. Verify all actions accessible via keyboard
4. Check focus indicators are visible

### Screen Reader
1. Enable VoiceOver (Mac) or NVDA (Windows)
2. Navigate with screen reader shortcuts
3. Verify all content is announced
4. Check form validation messages

### Color Contrast
1. Use Chrome DevTools Lighthouse
2. Run accessibility audit
3. Verify contrast ratios
4. Test in dark mode

### PWA
1. Open Lighthouse in DevTools
2. Run PWA audit
3. Check all criteria pass
4. Test offline functionality

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Next.js PWA Plugin](https://github.com/shadowwalker/next-pwa)

## 🎯 Checklist

### Accessibility
- [x] Keyboard navigation
- [x] Screen reader support
- [x] ARIA labels
- [x] Focus management
- [x] Color contrast
- [x] Skip to content
- [x] Error announcements
- [x] Form accessibility

### PWA
- [x] Service worker
- [x] Web manifest
- [x] Offline support
- [x] Install prompt
- [x] App icons
- [x] Theme color
- [x] Splash screen
- [x] Shortcuts

---

**Built with ❤️ for everyone**
