'use client';

import { useEffect } from 'react';

// Next.js <Link> uses history.pushState for same-route hash-only navigation,
// which does NOT fire the browser's native `hashchange` event. This hook
// normalizes that by listening to hashchange, popstate, and a custom
// `locationchange` event dispatched after pushState/replaceState.

let patched = false;

function ensureHistoryPatched() {
  if (patched || typeof window === 'undefined') return;
  patched = true;

  // Defer so listeners don't run inside React's insertion-effect phase
  // (Next.js calls history.pushState from useInsertionEffect during Link nav;
  // firing synchronously there triggers "useInsertionEffect must not schedule
  // updates" when subscribers call setState).
  const fire = () => {
    queueMicrotask(() =>
      window.dispatchEvent(new Event('locationchange'))
    );
  };

  const origPush = window.history.pushState;
  window.history.pushState = function (...args) {
    const result = origPush.apply(this, args);
    fire();
    return result;
  };

  const origReplace = window.history.replaceState;
  window.history.replaceState = function (...args) {
    const result = origReplace.apply(this, args);
    fire();
    return result;
  };

  window.addEventListener('popstate', fire);
}

export default function useHashChange(onChange: () => void) {
  useEffect(() => {
    ensureHistoryPatched();
    window.addEventListener('hashchange', onChange);
    window.addEventListener('locationchange', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('locationchange', onChange);
    };
  }, [onChange]);
}
