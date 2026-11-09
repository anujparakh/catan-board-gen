// Google Analytics 4. Only loads when a measurement ID is set at build time (VITE_GA_MEASUREMENT_ID),
// so local dev and tests send nothing.
const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

// gtag expects the real `arguments` object, not an array.
const gtag = function () {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
} as (...args: unknown[]) => void;

export function initAnalytics() {
  if (!id) return;
  window.dataLayer = window.dataLayer || [];
  gtag('js', new Date());
  gtag('config', id);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}
