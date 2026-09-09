import React from 'react';
import './cv.css';

/**
 * Bare layout: no navbar, footer, grain or smooth-scroll wrapper. The CV page
 * is a print document, so it opts out of the site chrome entirely.
 */
export default function CvPrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="cv-root">{children}</div>;
}
