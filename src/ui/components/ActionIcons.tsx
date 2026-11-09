// Small stroke icons for the board's action buttons.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export const RotateIcon = ({ className = 'size-5' }) => (
  <svg {...base} className={className}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66" />
    <path d="M20 4v5h-5" />
  </svg>
);

export const ExpandIcon = ({ className = 'size-5' }) => (
  <svg {...base} className={className}>
    <path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" />
  </svg>
);

export const CloseIcon = ({ className = 'size-5' }) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/** A die, for "New board". */
export const DieIcon = ({ className = 'size-6' }) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);
