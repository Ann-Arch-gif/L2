// Decorative Siem Reap scene shown in the hero until a real photo is set (site.json → heroImage).

const frond = "M0 0C10-8 26-10 40-4 27-2 13 2 0 0Z";
const frondAngles = [-170, -140, -112, -86, -62, -38, -14, 12, 160, 190];

function SugarPalm({ x, baseY, topY, scale = 1 }: { x: number; baseY: number; topY: number; scale?: number }) {
  return (
    <g>
      <path
        d={`M${x} ${baseY}C${x - 3} ${baseY - 50} ${x + 3} ${topY + 60} ${x + 4} ${topY}`}
        stroke="#6b4a33"
        strokeWidth={5 * scale}
        strokeLinecap="round"
        fill="none"
      />
      <g className="palm-crown" style={{ transformOrigin: `${x + 4}px ${topY}px` }}>
        <g transform={`translate(${x + 4} ${topY}) scale(${scale})`}>
          {frondAngles.map((angle) => (
            <path key={angle} d={frond} fill="#4f6b3a" transform={`rotate(${angle})`} />
          ))}
          <circle r="6" fill="#3f5a2e" />
        </g>
      </g>
    </g>
  );
}

function Tower({ cx, base, tip, half }: { cx: number; base: number; tip: number; half: number }) {
  const h = base - tip;
  return (
    <path
      d={`M${cx - half} ${base}V${tip + h * 0.55}C${cx - half} ${tip + h * 0.42} ${cx - half * 0.8} ${tip + h * 0.34} ${cx - half * 0.6} ${tip + h * 0.28}C${cx - half * 0.4} ${tip + h * 0.18} ${cx - half * 0.2} ${tip + h * 0.08} ${cx} ${tip}C${cx + half * 0.2} ${tip + h * 0.08} ${cx + half * 0.4} ${tip + h * 0.18} ${cx + half * 0.6} ${tip + h * 0.28}C${cx + half * 0.8} ${tip + h * 0.34} ${cx + half} ${tip + h * 0.42} ${cx + half} ${tip + h * 0.55}V${base}Z`}
    />
  );
}

export function HeroIllustration({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 440 520" role="img" aria-label={title} className="h-full w-full">
      <defs>
        <clipPath id="hero-arch">
          <path d="M0 520V220a220 220 0 0 1 440 0v300Z" />
        </clipPath>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9e6c4" />
          <stop offset="0.75" stopColor="#f3c08f" />
        </linearGradient>
        <linearGradient id="hero-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efc596" />
          <stop offset="1" stopColor="#e2a878" />
        </linearGradient>
        <radialGradient id="hero-window">
          <stop offset="0" stopColor="#ffe29a" />
          <stop offset="1" stopColor="#ffe29a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g clipPath="url(#hero-arch)">
        <rect width="440" height="520" fill="url(#hero-sky)" />

        {/* Sun */}
        <g className="sun-pulse" style={{ transformOrigin: "220px 220px" }}>
          <circle cx="220" cy="220" r="98" fill="#f8dc9a" opacity="0.55" />
          <circle cx="220" cy="220" r="64" fill="#f4c463" />
        </g>

        {/* Clouds */}
        <g fill="#fdf3e2" opacity="0.85">
          <path d="M44 170c6-14 26-16 34-6 8-10 30-6 30 8 12 0 16 14 4 16H40c-12-2-10-18 4-18Z" />
          <path d="M318 132c5-11 21-13 27-5 7-8 24-5 24 6 10 0 13 11 3 13h-57c-10-2-8-14 3-14Z" />
        </g>

        {/* Birds */}
        <g stroke="#9a4f2c" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55">
          <path d="M300 186q6-6 12 0q6-6 12 0" />
          <path d="M330 206q4-4 8 0q4-4 8 0" />
        </g>

        {/* Angkor silhouette */}
        <g fill="#c4855a">
          <Tower cx={85} base={350} tip={262} half={13} />
          <Tower cx={355} base={350} tip={262} half={13} />
          <Tower cx={140} base={340} tip={224} half={18} />
          <Tower cx={300} base={340} tip={224} half={18} />
          <Tower cx={220} base={340} tip={164} half={25} />
          <path d="M52 364h336v-14h-28v-10H80v10H52Z" />
        </g>
        <g stroke="#dda274" strokeWidth="2" strokeLinecap="round">
          <path d="M206 300h28M209 276h22M212 254h16M214 234h12" />
          <path d="M130 306h20M132 288h16M290 306h20M292 288h16" />
        </g>

        {/* Moat */}
        <rect y="364" width="440" height="60" fill="url(#hero-water)" />
        <g stroke="#fbe7c9" strokeWidth="2" strokeLinecap="round" opacity="0.8">
          <path d="M60 380h40M150 392h60M260 384h50M340 398h40M110 408h30" />
        </g>

        {/* Ground */}
        <path d="M0 428c80-16 160 10 240 2s140 6 200-2v92H0Z" fill="#8d9b63" />
        <path d="M0 470c90-12 170 8 250 0s130 4 190-4v54H0Z" fill="#6f8350" />

        {/* Palms */}
        <SugarPalm x={128} baseY={470} topY={318} />
        <SugarPalm x={384} baseY={482} topY={286} scale={1.1} />
        <SugarPalm x={418} baseY={476} topY={350} scale={0.75} />

        {/* Khmer stilt house with a warm window */}
        <g>
          <circle cx="66" cy="432" r="30" fill="url(#hero-window)" className="window-glow" />
          <path d="M40 448v26M56 448v26M76 448v26M92 448v26" stroke="#6b4a33" strokeWidth="3" />
          <path d="M96 452l18 22" stroke="#6b4a33" strokeWidth="3" strokeLinecap="round" />
          <rect x="34" y="418" width="64" height="32" rx="2" fill="#f4dfc0" />
          <path d="M24 420 66 386l42 34Z" fill="#9a4f2c" />
          <path d="M58 398l8-7 8 7" stroke="#d9a441" strokeWidth="2" fill="none" />
          <rect x="56" y="426" width="20" height="14" rx="1.5" fill="#f6c25b" />
          <path d="M66 426v14" stroke="#e0a64a" strokeWidth="1.5" />
          <rect x="40" y="428" width="10" height="22" fill="#c98a5e" />
        </g>
      </g>

      <path d="M2 520V220a218 218 0 0 1 436 0v300" fill="none" stroke="#e3d3bd" strokeWidth="4" />
    </svg>
  );
}
