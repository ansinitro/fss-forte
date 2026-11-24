"use client";

import React from "react";

interface ForteLogoProps {
  variant?: "full" | "icon" | "white";
  size?: "sm" | "md" | "lg";
  subtitle?: string;
}

export const ForteLogo: React.FC<ForteLogoProps> = ({
  variant = "full",
  size = "md",
  subtitle = "Болашағыңды таңда"
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex items-center gap-3">
      {/* Official Forte Geometric Icon Mark */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-[22%] bg-[#4A0221] flex items-center justify-center p-1.5 shadow-sm transition-transform hover:scale-105`}
      >
        <svg
          viewBox="0 0 64 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M26.8784 32.5822C24.0093 34.9941 21.8344 38.2063 20.6943 41.8722C20.1165 43.7298 19.8047 45.7002 19.8047 47.7444V51.8183H26.8784V47.7444C26.8784 40.7233 32.5963 35.0087 39.6141 35.0087V27.9316C38.8239 27.9316 38.0449 27.9786 37.2815 28.0691C33.3485 28.5329 29.7619 30.1535 26.8784 32.5822Z"
            fill="url(#forte_g1)"
          />
          <path
            d="M39.6141 12.1953C28.6923 12.1953 19.8047 21.0829 19.8047 32.0081V36.0931C21.5661 32.8016 24.2284 30.0633 27.4584 28.2114C29.0768 23.0355 33.9174 19.2712 39.6141 19.2712H44.5966V12.1953H39.6141Z"
            fill="url(#forte_g2)"
          />
          <defs>
            <linearGradient
              id="forte_g1"
              x1="32.428"
              y1="20.6786"
              x2="11.6715"
              y2="33.8383"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F99184" />
              <stop offset="0.805" stopColor="#B8335F" />
              <stop offset="1" stopColor="#A51652" />
            </linearGradient>
            <linearGradient
              id="forte_g2"
              x1="35.6031"
              y1="4.93885"
              x2="13.2465"
              y2="22.6699"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F99184" />
              <stop offset="0.805" stopColor="#B8335F" />
              <stop offset="1" stopColor="#A51652" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text & Wordmark */}
      {variant !== "icon" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            {/* Forte Official Wordmark Typography */}
            <span
              className={`font-black tracking-tight text-[#A31551] font-sans ${
                variant === "white" ? "text-white" : "text-[#A31551]"
              } ${size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg"} leading-none`}
            >
              Forte
            </span>
            <span
              className={`font-bold tracking-tight ${
                variant === "white" ? "text-zinc-200" : "text-zinc-900"
              } ${size === "lg" ? "text-xl" : size === "sm" ? "text-xs" : "text-sm"} leading-none`}
            >
              Edu
            </span>
          </div>
          {subtitle && (
            <span
              className={`text-[10px] font-semibold leading-tight mt-0.5 ${
                variant === "white" ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
