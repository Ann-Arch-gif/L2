import { ViewTransition, type ReactNode } from "react";

// Wraps each page so navigating fades the old page out and the new one up (see globals.css ".page").
// It lives in every page, not the layout: layouts persist, so they never enter or exit.
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
