"use client";

import Link from "next/link";
import React from "react";

export type BrandLogoVariant = "full" | "symbol" | "wordmark" | "spoke";
export type BrandLogoSize = "sm" | "md" | "lg" | "xl" | "custom";

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  className?: string;
  href?: string;
  spokeName?: string;
  showSlogan?: boolean;
  /** Opzionale: mostra o nasconde il cerchio blu di sfondo (#1a294d) */
  withCircleBackground?: boolean;
}

const SIZE_MAPS = {
  symbol: {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
    custom: "",
  },
  text: {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
    custom: "",
  },
  slogan: {
    sm: "text-[7px]",
    md: "text-[9px]",
    lg: "text-[10px]",
    xl: "text-[11px]",
    custom: "",
  },
};

const OFFICIAL_PULSE_PATH = "M 336.22 91.43 Q 345.42 95.55 353.18 101.92 A 0.49 0.47 37.8 0 1 353.27 102.57 L 353.26 102.59 A 0.44 0.44 0.0 0 1 352.68 102.72 Q 343.14 97.29 332.52 94.26 C 324.44 91.96 305.71 89.68 310.09 104.50 A 0.63 0.63 0.0 0 0 310.96 104.89 C 322.77 99.42 341.48 95.25 351.90 105.06 A 0.67 0.66 41.6 0 0 352.87 105.01 C 357.72 99.29 363.85 94.69 371.24 96.96 C 387.45 101.95 387.68 130.62 385.38 143.64 A 0.26 0.26 0.0 0 1 384.86 143.62 Q 384.69 141.94 384.47 138.01 Q 383.86 127.38 380.67 117.31 C 378.38 110.12 370.47 96.52 361.68 107.06 A 0.55 0.55 0.0 0 0 361.82 107.89 Q 365.26 109.94 371.82 116.68 C 378.59 123.63 384.90 133.72 381.97 143.70 A 0.46 0.46 0.0 0 0 382.38 144.29 C 388.60 144.72 395.92 148.10 398.30 154.15 C 401.64 162.65 395.66 171.66 389.48 177.28 Q 379.15 186.68 365.52 191.63 A 0.21 0.21 0.0 0 1 365.26 191.34 Q 365.44 191.02 365.84 190.76 C 375.86 184.47 391.42 173.29 392.90 160.82 C 393.44 156.31 389.58 153.52 385.43 152.82 A 0.57 0.56 -85.3 0 0 384.78 153.38 Q 384.79 155.09 383.30 162.02 C 381.03 172.63 375.37 185.50 364.08 188.64 A 0.60 0.59 69.0 0 0 363.71 189.49 Q 364.05 190.16 365.02 193.84 Q 366.45 199.24 365.14 203.70 C 362.27 213.54 351.87 214.58 343.41 213.24 Q 327.07 209.58 314.48 198.69 A 0.39 0.39 0.0 0 1 314.93 198.05 Q 326.09 204.43 338.21 207.31 C 345.62 209.07 362.27 209.68 357.58 196.27 A 0.59 0.59 0.0 0 0 356.77 195.93 C 345.02 201.40 326.11 205.59 315.84 195.73 A 0.67 0.67 0.0 0 0 314.86 195.79 C 309.70 202.15 302.11 207.23 293.76 202.72 C 280.41 195.50 279.98 169.90 282.37 157.35 A 0.32 0.32 0.0 0 1 283.00 157.41 Q 283.19 169.47 286.30 181.18 C 288.24 188.49 296.15 205.00 306.03 193.78 A 0.56 0.56 0.0 0 0 305.89 192.93 Q 302.96 191.17 296.78 185.06 C 289.73 178.08 282.72 167.50 285.74 157.23 A 0.54 0.54 0.0 0 0 285.27 156.54 Q 279.70 156.04 275.26 153.29 C 262.32 145.29 270.22 130.61 278.53 123.26 Q 289.17 113.83 302.21 109.19 A 0.23 0.23 0.0 0 1 302.42 109.59 Q 300.24 111.18 298.53 112.28 C 290.12 117.64 273.77 130.61 274.85 141.78 C 275.19 145.29 279.31 147.63 282.34 147.99 A 0.58 0.58 0.0 0 0 282.99 147.46 C 284.19 134.60 289.85 116.04 303.60 112.19 A 0.61 0.60 -16.4 0 0 304.02 111.43 C 301.65 103.78 300.03 95.24 307.72 89.98 C 315.59 84.59 328.11 87.66 336.22 91.43 Z M 311.35 107.67 Q 314.83 115.50 324.30 123.66 Q 331.05 129.47 333.42 130.87 A 0.89 0.88 -48.7 0 0 334.42 130.80 Q 341.60 125.13 343.49 122.05 C 346.44 117.24 350.08 110.96 344.57 107.37 C 336.04 101.82 321.14 104.14 311.72 106.88 A 0.58 0.58 0.0 0 0 311.35 107.67 Z M 359.69 109.61 Q 354.64 116.52 352.28 128.79 Q 350.61 137.53 350.58 140.28 A 0.89 0.88 11.4 0 0 351.14 141.11 Q 359.63 144.51 363.24 144.61 C 368.87 144.77 376.12 144.80 376.49 138.24 C 377.05 128.09 367.62 116.33 360.56 109.54 A 0.58 0.58 0.0 0 0 359.69 109.61 Z M 285.57 148.58 Q 294.10 149.46 305.91 145.29 Q 314.32 142.32 316.72 140.05 Q 315.81 130.99 314.07 127.81 C 311.36 122.85 307.72 116.56 301.85 119.56 C 292.78 124.21 287.38 138.31 285.06 147.86 A 0.58 0.58 0.0 0 0 285.57 148.58 Z M 330.59 145.25 Q 328.24 146.74 327.93 147.33 Q 327.62 147.91 327.74 150.69 Q 327.85 153.47 328.20 154.03 Q 328.56 154.59 331.02 155.88 Q 333.48 157.17 334.14 157.14 Q 334.80 157.11 337.15 155.63 Q 339.50 154.14 339.81 153.56 Q 340.12 152.97 340.00 150.19 Q 339.89 147.41 339.54 146.86 Q 339.18 146.30 336.72 145.00 Q 334.26 143.71 333.60 143.74 Q 332.94 143.77 330.59 145.25 Z M 382.18 152.33 Q 373.65 151.43 361.83 155.57 Q 353.41 158.53 351.01 159.88 A 0.89 0.88 71.3 0 0 350.57 160.78 Q 351.90 169.85 353.63 173.03 C 356.33 178.00 359.96 184.29 365.83 181.31 C 374.91 176.68 380.35 162.59 382.68 153.04 A 0.58 0.58 0.0 0 0 382.18 152.33 Z M 308.14 191.27 Q 313.17 184.33 315.48 172.05 Q 317.12 163.29 317.14 160.54 A 0.89 0.88 11.2 0 0 316.58 159.71 Q 308.07 156.34 304.46 156.25 C 298.82 156.11 291.56 156.12 291.22 162.68 C 290.69 172.85 300.17 184.57 307.27 191.35 A 0.58 0.58 0.0 0 0 308.14 191.27 Z M 356.32 193.19 Q 352.85 185.36 343.39 177.21 Q 336.64 171.41 334.28 170.01 A 0.89 0.88 -48.7 0 0 333.28 170.08 Q 326.10 175.74 324.22 178.82 C 321.27 183.62 317.63 189.89 323.14 193.48 C 331.66 199.03 346.54 196.71 355.95 193.98 A 0.58 0.58 0.0 0 0 356.32 193.19 Z";

export default function BrandLogo({
  variant = "full",
  size = "md",
  className = "",
  href,
  spokeName,
  showSlogan = true,
  withCircleBackground = true,
}: BrandLogoProps) {
  const SymbolSVG = (
    <svg
      className={`${SIZE_MAPS.symbol[size]} shrink-0 transition-transform duration-200 group-hover:scale-105`}
      viewBox="248.87 65.44 170 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="PULSE Symbol"
    >
      {withCircleBackground && (
        <circle cx="333.87" cy="150.44" r="82" fill="#1a294d" />
      )}
      <path d={OFFICIAL_PULSE_PATH} fill="var(--color-accent, #cbfa1f)" />
    </svg>
  );

  const BrandText = (
    <div className="flex flex-col leading-none select-none">
      <div className="flex items-center gap-1.5">
        <span
          className={`font-bold tracking-wider text-slate-900 dark:text-white ${SIZE_MAPS.text[size]}`}
          style={{ fontFamily: "var(--font-heading, inherit)" }}
        >
          PULSE
        </span>
        {variant === "spoke" && spokeName && (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            / {spokeName}
          </span>
        )}
      </div>

      {showSlogan && variant !== "symbol" && variant !== "spoke" && (
        <span
          className={`text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase mt-1 ${SIZE_MAPS.slogan[size]}`}
        >
          We build. We launch. We repeat.
        </span>
      )}
    </div>
  );

  const content = (
    <div className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      {variant !== "wordmark" && SymbolSVG}
      {variant !== "symbol" && BrandText}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cbfa1f] rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}