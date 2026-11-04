"use client";

import Link from "next/link";
import { useState } from "react";

interface SpokeBannerProps {
  dismissible?: boolean;
}

/**
 * SpokeBanner - Adaptive banner for Spokes with Dark vs Light mode support.
 * 
 * Contrast logic and inverted theme behavior:
 * - IN DARK MODE (Spoke / Primary Canvas Default):
 *   - Banner Background: Dark Surface / Big Stone (#111d38 / #1a294d).
 *   - "LegalFlow AI" Badge: WHITE background (#ffffff) with dark Big Stone text (#1a294d).
 *   - Text: Light (#f4f4f5).
 *   - Accent CTA: Electric Lime (#cbfa1f).
 * 
 * - IN LIGHT MODE (If the Spoke/App uses Light Mode):
 *   - Banner Background: Light Surface (#ffffff / #f8fafc).
 *   - "LegalFlow AI" Badge: DARK background in negative (#1a294d) with WHITE text (#ffffff).
 *   - Text: Big Stone (#1a294d).
 *   - Accent CTA: Persian Blue / Tan Hide for high contrast on light backgrounds.
 */
export default function SpokeBanner({ dismissible = false }: SpokeBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="w-full flex justify-center pt-2 px-2 sm:px-0"
      data-hub="legal"
    >
      <div
        className="
          flex items-center gap-2 sm:gap-3 max-w-full truncate py-2 px-5 sm:px-6 shadow-md transition-all
          
          /* Adaptive Model: Inverted background relative to the current theme */
          bg-[#111d38] dark:bg-[#111d38] light:bg-white
          /* Standard Tailwind Fallback: Light Mode vs Dark Mode */
          bg-white dark:bg-[#111d38]
          
          /* Adaptive borders */
          border border-slate-200 dark:border-white/10
          
          /* Adaptive text */
          text-[#1a294d] dark:text-[#f4f4f5]
          
          rounded-xl
          text-xs sm:text-sm font-sans
          hover:border-[#cbfa1f]/60 dark:hover:border-[#cbfa1f]/60
        "
      >
        {/* Spoke Badge (LegalFlow AI) */}
        {/* WHITE background in Dark Mode, DARK background (Negative) in Light Mode */}
        <span
          className="
            /* In Dark Mode: WHITE background with dark Big Stone text (#1a294d) */
            dark:bg-[#cbfa1f] dark:text-[#1a294d]
            
            /* In Light Mode: DARK Big Stone background (#1a294d) with WHITE text */
            bg-[#1a294d] text-white
            
            text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 transition-colors
          "
        >
          LegalFlow AI
        </span>

        {/* Text + Link */}
        <Link
          href="https://pulse-hub-01-legalflow.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="
            truncate font-medium transition group
            text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white
          "
        >
          Are you a legal professional? Speed up Due Diligence and analyze any contract securely.
          
          {/* Accent CTA: Electric Lime (#cbfa1f) in Dark, Tan Hide (#fb9163) / Persian Blue in Light */}
          <span
            className="
              font-semibold underline ml-1.5 transition
              text-[#1f1cc8] dark:text-[#fb9163]
              group-hover:text-[#fb9163] dark:group-hover:text-[#b8e619]
            "
          >
            Discover PULSE →
          </span>
        </Link>

        {/* Optional close button */}
        {dismissible && (
          <button
            onClick={() => setVisible(false)}
            className="text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white ml-1.5 shrink-0 text-sm font-bold transition"
            title="Close"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}