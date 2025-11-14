/**
 * Velithra - Accessibility Utilities
 * WCAG 2.1 AA compliant helpers
 */

/**
 * Announce changes to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Generate unique ID for ARIA labels
 */
let idCounter = 0;
export function generateAriaId(prefix: string = 'velithra'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReaders(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getAttribute('aria-hidden') !== 'true'
  );
}

/**
 * Get accessible name for an element
 */
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent || '';
  }

  // Check title
  const title = element.getAttribute('title');
  if (title) return title;

  // Check text content
  return element.textContent || '';
}

/**
 * Focus management
 */
export function setFocusOnElement(selector: string, delay: number = 0) {
  setTimeout(() => {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      element.focus();
      // Scroll into view if needed
      element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, delay);
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
}

/**
 * ARIA roles for common components
 */
export const ARIA_ROLES = {
  navigation: 'navigation',
  main: 'main',
  complementary: 'complementary',
  banner: 'banner',
  contentinfo: 'contentinfo',
  search: 'search',
  form: 'form',
  dialog: 'dialog',
  alertdialog: 'alertdialog',
  alert: 'alert',
  status: 'status',
  progressbar: 'progressbar',
  tablist: 'tablist',
  tab: 'tab',
  tabpanel: 'tabpanel',
  menu: 'menu',
  menuitem: 'menuitem',
  button: 'button',
  link: 'link',
  listbox: 'listbox',
  option: 'option',
  grid: 'grid',
  row: 'row',
  gridcell: 'gridcell',
  tree: 'tree',
  treeitem: 'treeitem',
} as const;

/**
 * Common ARIA attributes
 */
export interface AriaAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-controls'?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-disabled'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-selected'?: boolean;
  'aria-pressed'?: boolean | 'mixed';
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-readonly'?: boolean;
  'aria-valuenow'?: number;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuetext'?: string;
  role?: string;
}

/**
 * Color contrast checker (WCAG AA: 4.5:1 for normal text)
 */
export function checkColorContrast(foreground: string, background: string): {
  ratio: number;
  passAA: boolean;
  passAAA: boolean;
} {
  const getLuminance = (color: string): number => {
    // Simple RGB extraction (works for hex colors)
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passAA: ratio >= 4.5,
    passAAA: ratio >= 7,
  };
}

/**
 * Screen reader only class
 */
export const srOnly = 'sr-only';

/**
 * Focus visible styles (for keyboard navigation)
 */
export const focusVisible = 
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';
