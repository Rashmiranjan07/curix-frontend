
import React, { useId } from "react";

export default function CurixLogo({
  size = "md",
  showSubtitle = true,
  light = false,
  className = "",
  animated = true,
}) {
  const id = useId().replace(/:/g, "");

  const sizes = {
    sm: {
      mark: "h-10 w-10",
      title: "text-xl",
      subtitle: "text-[8px] tracking-[0.19em]",
      gap: "gap-2.5",
    },
    md: {
      mark: "h-12 w-12",
      title: "text-[29px]",
      subtitle: "text-[9px] tracking-[0.22em]",
      gap: "gap-3",
    },
    lg: {
      mark: "h-[62px] w-[62px]",
      title: "text-4xl",
      subtitle: "text-[10px] tracking-[0.25em]",
      gap: "gap-4",
    },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div
      className={[
        "group inline-flex items-center select-none",
        s.gap,
        className,
      ].join(" ")}
      aria-label="Curix healthcare"
    >
      {/* Dimensional healthcare emblem */}
      <div
        className={[
          "relative isolate shrink-0",
          s.mark,
          animated
            ? "transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-[1.04]"
            : "",
        ].join(" ")}
      >
        {/* Ambient teal illumination */}
        <div className="absolute inset-1 rounded-[30%] bg-teal-400/30 blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-90" />

        {/* Soft contact shadow */}
        <div className="absolute inset-[12%] translate-y-1 rounded-[28%] bg-slate-950/30 blur-md" />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          className="relative h-full w-full overflow-visible drop-shadow-[0_5px_5px_rgba(5,25,45,0.22)]"
          role="img"
          aria-label="Curix medical emblem"
        >
          <defs>
            <linearGradient
              id={`${id}-shell`}
              x1="6"
              y1="4"
              x2="42"
              y2="45"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A7FFF0" />
              <stop offset=".25" stopColor="#2CE0C2" />
              <stop offset=".68" stopColor="#00A896" />
              <stop offset="1" stopColor="#087D87" />
            </linearGradient>

            <linearGradient
              id={`${id}-edge`}
              x1="12"
              y1="8"
              x2="40"
              y2="42"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1B4968" />
              <stop offset=".55" stopColor="#0A2945" />
              <stop offset="1" stopColor="#041424" />
            </linearGradient>

            <linearGradient
              id={`${id}-glass`}
              x1="12"
              y1="5"
              x2="36"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" stopOpacity=".95" />
              <stop offset=".45" stopColor="#D8FFF8" stopOpacity=".45" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity=".04" />
            </linearGradient>

            <linearGradient
              id={`${id}-cross`}
              x1="18"
              y1="14"
              x2="31"
              y2="34"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#D5FFF7" />
            </linearGradient>

            <filter
              id={`${id}-shadow`}
              x="-30%"
              y="-30%"
              width="160%"
              height="170%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="1.5"
                floodColor="#03283A"
                floodOpacity=".35"
              />
            </filter>
          </defs>

          {/* Rear structural layer for a raised 3D appearance */}
          <path
            d="M31 8.5C25.5 5.3 17.8 6.2 12.7 10.5C6.3 15.8 5.8 25.6 10.5 32.3C14.9 38.5 23.4 40.4 30.1 36.1L35 32.5"
            stroke={`url(#${id}-edge)`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(0 1.7)"
          />

          {/* Main sculpted C silhouette */}
          <path
            d="M32 9.5C26.3 5.7 18.8 6.8 13.8 11.1C7.5 16.5 7.1 25.7 11.8 32.1C16.5 38.4 25.3 39.5 31.5 34.4L35.1 31.1"
            stroke={`url(#${id}-shell)`}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${id}-shadow)`}
          />

          {/* Glass highlight along the upper curve */}
          <path
            d="M29.5 10.3C24.8 7.9 18.7 9 14.6 12.7"
            stroke={`url(#${id}-glass)`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Medical cross with dimensional backing */}
          <path
            d="M22 15.5H26V20.5H31V24.5H26V29.5H22V24.5H17V20.5H22V15.5Z"
            fill={`url(#${id}-edge)`}
            transform="translate(0 1.2)"
          />

          <path
            d="M22 14.5H26V19.5H31V23.5H26V28.5H22V23.5H17V19.5H22V14.5Z"
            fill={`url(#${id}-cross)`}
          />

          {/* Tiny highlight on the medical cross */}
          <path
            d="M22.8 15.5H25.2"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Pulse detail */}
          <path
            d="M11.8 27H16L18.1 24.5L20.1 28.1"
            stroke="#E8FFFB"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".95"
          />

          {/* Precision finishing highlight */}
          <circle cx="35.1" cy="31.1" r="1.4" fill="#C6FFF5" />
        </svg>
      </div>

      {/* Premium wordmark */}
      <div className="flex min-w-0 flex-col justify-center">
        <div className="flex items-baseline leading-none">
          <span
            className={[
              s.title,
              "font-extrabold tracking-[-0.065em]",
              "transition-colors duration-300",
              light
                ? "text-white group-hover:text-[#C5FFF4]"
                : "text-[#0A1C35] group-hover:text-[#123D58]",
            ].join(" ")}
          >
            Curi
          </span>

          <span
            className={[
              s.title,
              "font-extrabold tracking-[-0.065em]",
              "bg-gradient-to-br from-[#63F4D7] via-[#0BC2A8] to-[#008A91]",
              "bg-clip-text text-transparent",
            ].join(" ")}
          >
            x
          </span>

          {/* Small signature highlight */}
          <span className="ml-1.5 mb-0.5 h-1.5 w-1.5 self-center rounded-full bg-[#20D7B8] shadow-[0_0_9px_rgba(32,215,184,0.6)]" />
        </div>

        {showSubtitle && (
          <span
            className={[
              "mt-1.5 whitespace-nowrap font-semibold uppercase",
              s.subtitle,
              light ? "text-slate-400" : "text-slate-500",
            ].join(" ")}
          >
            HEALTHCARE 
          </span>
        )}
      </div>
    </div>
  );
}
