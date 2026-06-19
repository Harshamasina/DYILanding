const networkNodes = [
    [88, 286],
    [126, 248],
    [126, 324],
    [170, 226],
    [172, 286],
    [172, 346],
    [218, 250],
    [220, 322],
    [252, 286],
] as const;

const networkEdges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 4],
    [2, 5],
    [3, 6],
    [3, 4],
    [4, 6],
    [4, 7],
    [5, 7],
    [6, 8],
    [7, 8],
] as const;

const plusMarks = [
    'M86 130V142M80 136H92',
    'M620 174V186M614 180H626',
    'M604 372V384M598 378H610',
    'M128 430V442M122 436H134',
    'M650 330V342M644 336H656',
] as const;

export function AiDraftingHeroSvg() {
    return (
        <svg
            width="728"
            height="560"
            viewBox="0 0 728 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ai-drafting-svg h-auto w-full opacity-95 select-none"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <linearGradient id="ai-drafting-line" x1="180" y1="92" x2="540" y2="420">
                    <stop stopColor="#5B4EF5" stopOpacity="0.62" />
                    <stop offset="1" stopColor="#8E84FF" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="ai-drafting-soft" x1="304" y1="316" x2="456" y2="468">
                    <stop stopColor="#6C5CE7" stopOpacity="0.22" />
                    <stop offset="1" stopColor="#6C5CE7" stopOpacity="0.05" />
                </linearGradient>
                <radialGradient id="ai-drafting-badge-fill" cx="38%" cy="24%" r="72%">
                    <stop stopColor="#FFFFFF" stopOpacity="0.64" />
                    <stop offset="0.42" stopColor="#B9B1FF" stopOpacity="0.38" />
                    <stop offset="1" stopColor="#6C5CE7" stopOpacity="0.2" />
                </radialGradient>
                <linearGradient id="ai-drafting-badge-stroke" x1="332" y1="342" x2="424" y2="456">
                    <stop stopColor="#FFFFFF" stopOpacity="0.72" />
                    <stop offset="0.45" stopColor="#6C5CE7" stopOpacity="0.36" />
                    <stop offset="1" stopColor="#5B4EF5" stopOpacity="0.18" />
                </linearGradient>
                <linearGradient id="ai-drafting-cube" x1="538" y1="82" x2="628" y2="172">
                    <stop stopColor="#6C5CE7" stopOpacity="0.34" />
                    <stop offset="1" stopColor="#6C5CE7" stopOpacity="0.08" />
                </linearGradient>
                <radialGradient id="ai-drafting-glow" cx="50%" cy="50%" r="50%">
                    <stop stopColor="#6C5CE7" stopOpacity="0.14" />
                    <stop offset="1" stopColor="#6C5CE7" stopOpacity="0" />
                </radialGradient>
                <pattern
                    id="ai-drafting-dots"
                    x="0"
                    y="0"
                    width="14"
                    height="14"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="2" cy="2" r="0.95" fill="#6C5CE7" opacity="0.17" />
                </pattern>
            </defs>

            <ellipse cx="376" cy="270" rx="288" ry="224" fill="url(#ai-drafting-glow)" />
            <path
                d="M18 506H700L606 300H126Z"
                fill="url(#ai-drafting-dots)"
                opacity="0.62"
            />
            <path
                d="M82 448H646L598 318H130Z"
                fill="url(#ai-drafting-dots)"
                opacity="0.28"
            />
            <path
                d="M18 506H700L606 300H126Z"
                fill="url(#ai-drafting-glow)"
                opacity="0.28"
            />

            <g stroke="#6C5CE7" fill="none">
                <circle cx="378" cy="252" r="206" strokeOpacity="0.14" strokeDasharray="4 7" />
                <circle cx="378" cy="252" r="174" strokeOpacity="0.18" />
                <circle cx="378" cy="252" r="138" strokeOpacity="0.13" />
                <path d="M378 72V444" strokeOpacity="0.16" strokeDasharray="7 9" />
                <circle cx="378" cy="92" r="5.5" strokeOpacity="0.48" />
                <circle cx="378" cy="116" r="4.5" strokeOpacity="0.24" />
                <circle cx="378" cy="444" r="5.5" strokeOpacity="0.28" />
            </g>

            <g stroke="#6C5CE7" strokeLinecap="round" fill="none">
                {plusMarks.map((path) => (
                    <path key={path} d={path} strokeOpacity="0.36" strokeWidth="1.7" />
                ))}
            </g>

            <g stroke="#5B4EF5" strokeOpacity="0.42" strokeWidth="1.8" strokeLinecap="round" fill="none">
                <path d="M154 130C154 153 142 165 119 165C142 165 154 177 154 200C154 177 166 165 189 165C166 165 154 153 154 130Z" />
            </g>

            <g stroke="#6C5CE7" strokeOpacity="0.28" strokeWidth="1.45" strokeLinecap="round" fill="none">
                {networkEdges.map(([from, to]) => {
                    const [x1, y1] = networkNodes[from];
                    const [x2, y2] = networkNodes[to];

                    return (
                        <line
                            key={`${from}-${to}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                        />
                    );
                })}
            </g>
            <g fill="#5B4EF5">
                {networkNodes.map(([cx, cy]) => (
                    <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.3" opacity="0.56" />
                ))}
            </g>
            <circle cx="218" cy="250" r="7" stroke="#6C5CE7" strokeOpacity="0.2" />
            <circle cx="220" cy="322" r="7" stroke="#6C5CE7" strokeOpacity="0.2" />
            <circle cx="58" cy="196" r="3.5" stroke="#6C5CE7" strokeOpacity="0.32" />

            <path
                d="M282 118H444L502 176V374C502 389 492 399 477 399H282C267 399 257 389 257 374V143C257 128 267 118 282 118Z"
                fill="white"
                fillOpacity="0.46"
                stroke="url(#ai-drafting-line)"
                strokeWidth="2"
            />
            <path
                d="M444 118V163C444 171 450 177 458 177H502"
                stroke="#6C5CE7"
                strokeOpacity="0.42"
                strokeWidth="2"
            />
            <text
                x="300"
                y="190"
                fill="#6C5CE7"
                opacity="0.68"
                fontSize="52"
                fontFamily="Georgia, serif"
                fontWeight="700"
            >
                T
            </text>
            <g stroke="#6C5CE7" strokeLinecap="round">
                <path d="M364 182H430" strokeOpacity="0.2" strokeWidth="2" />
                <path d="M300 220H452" strokeOpacity="0.24" strokeWidth="2" />
                <path d="M300 250H470" strokeOpacity="0.2" strokeWidth="2" />
                <path d="M300 280H426" strokeOpacity="0.18" strokeWidth="2" />
                <path d="M300 310H374" strokeOpacity="0.16" strokeWidth="2" />
                <path d="M300 340H454" strokeOpacity="0.16" strokeWidth="2" />
                <path d="M420 310H424M438 310H442M456 310H460" strokeOpacity="0.32" strokeWidth="2" />
            </g>

            <g>
                <ellipse cx="378" cy="420" rx="72" ry="22" fill="#5B4EF5" opacity="0.07" />
                <circle cx="378" cy="398" r="68" fill="url(#ai-drafting-soft)" />
                <circle cx="378" cy="398" r="56" fill="url(#ai-drafting-badge-fill)" />
                <circle cx="378" cy="398" r="56" stroke="url(#ai-drafting-badge-stroke)" strokeWidth="1.5" />
                <circle cx="378" cy="398" r="42" stroke="#6C5CE7" strokeOpacity="0.18" />
                <path
                    d="M342 376C352 360 371 351 391 355"
                    stroke="white"
                    strokeOpacity="0.58"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M330 398H426"
                    stroke="#5B4EF5"
                    strokeOpacity="0.18"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <path
                    d="M378 346V450"
                    stroke="#5B4EF5"
                    strokeOpacity="0.12"
                    strokeWidth="1.5"
                    strokeDasharray="5 7"
                />
                <circle cx="378" cy="342" r="4.5" fill="white" fillOpacity="0.58" stroke="#6C5CE7" strokeOpacity="0.3" />
                <circle cx="378" cy="454" r="4.5" fill="white" fillOpacity="0.5" stroke="#6C5CE7" strokeOpacity="0.26" />
                <text
                    x="346"
                    y="417"
                    fill="#5B4EF5"
                    opacity="0.82"
                    fontSize="47"
                    fontFamily="Georgia, serif"
                    fontWeight="700"
                >
                    AI
                </text>
            </g>

            <g transform="translate(526 72)">
                <circle cx="62" cy="62" r="62" stroke="#6C5CE7" strokeOpacity="0.13" strokeDasharray="4 6" />
                <path
                    d="M62 20L98 41V83L62 104L26 83V41L62 20Z"
                    fill="url(#ai-drafting-cube)"
                    stroke="#6C5CE7"
                    strokeOpacity="0.34"
                    strokeWidth="1.5"
                />
                <path
                    d="M62 20V104M26 41L62 62L98 41M26 83L62 62L98 83"
                    stroke="#6C5CE7"
                    strokeOpacity="0.28"
                    strokeWidth="1.35"
                />
                <path d="M62 62L62 20L98 41V83L62 62Z" fill="#5B4EF5" opacity="0.12" />
            </g>

            <g transform="translate(528 230)" stroke="#6C5CE7" fill="none">
                <circle cx="46" cy="46" r="68" strokeOpacity="0.13" />
                <circle cx="46" cy="46" r="44" strokeOpacity="0.13" />
                <circle cx="46" cy="46" r="20" strokeOpacity="0.12" />
                <path
                    d="M46 4L85 27V72L46 96L7 72V27L46 4Z"
                    fill="white"
                    fillOpacity="0.16"
                    strokeOpacity="0.36"
                    strokeWidth="1.8"
                />
                <path
                    d="M46 4V96M7 27L46 50L85 27M7 72L46 50L85 72"
                    strokeOpacity="0.24"
                    strokeWidth="1.45"
                />
                <circle cx="46" cy="50" r="6.5" fill="#5B4EF5" stroke="none" opacity="0.48" />
            </g>

            <circle cx="612" cy="318" r="5.5" stroke="#6C5CE7" strokeOpacity="0.25" />
            <circle cx="642" cy="404" r="4.5" stroke="#6C5CE7" strokeOpacity="0.22" />
            <circle cx="108" cy="420" r="4.5" stroke="#6C5CE7" strokeOpacity="0.22" />
        </svg>
    );
}
