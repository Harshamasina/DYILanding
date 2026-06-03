const searchTabs = [
    { label: 'Patents', x: 166, width: 82, cx: 207 },
    { label: 'Non-Patents', x: 276, width: 118, cx: 335 },
    { label: 'Clinical Trials', x: 424, width: 122, cx: 485 },
] as const;

const resultRows = [
    { y: 234, width: 142, subWidth: 178 },
    { y: 298, width: 112, subWidth: 164 },
    { y: 362, width: 96, subWidth: 182 },
] as const;

const chartBars = [
    { x: 372, height: 26 },
    { x: 390, height: 18 },
    { x: 408, height: 34 },
    { x: 426, height: 44 },
    { x: 444, height: 32 },
    { x: 462, height: 38 },
] as const;

const checklistItems = ['Relevant', 'Novel', 'Non-Obvious'] as const;

const plusMarks = [
    'M232 16V30M225 23H239',
    'M136 56V70M129 63H143',
    'M688 150V170M678 160H698',
    'M625 252V266M618 259H632',
    'M626 380V394M619 387H633',
    'M6 502V516M0 509H13',
] as const;

function DocumentIcon({ x, y }: { x: number; y: number }) {
    return (
        <g transform={`translate(${x} ${y})`} stroke="#5B4EF5" strokeLinecap="round" strokeLinejoin="round">
            <path
                d="M4 0H19L29 10V36H4Z"
                fill="white"
                fillOpacity="0.48"
                strokeOpacity="0.34"
                strokeWidth="1.7"
            />
            <path d="M19 1V10H28" strokeOpacity="0.32" strokeWidth="1.5" />
            <path d="M10 18H23M10 24H23M10 30H19" strokeOpacity="0.38" strokeWidth="1.5" />
        </g>
    );
}

export function PatentSearchHeroSvg() {
    return (
        <svg
            width="736"
            height="620"
            viewBox="0 0 736 620"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full max-w-[736px] opacity-95"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <linearGradient id="patent-search-purple" x1="518" y1="345" x2="612" y2="432">
                    <stop stopColor="#5B4EF5" stopOpacity="0.82" />
                    <stop offset="1" stopColor="#8A7FFF" stopOpacity="0.58" />
                </linearGradient>
                <linearGradient id="patent-search-panel" x1="170" y1="148" x2="600" y2="480">
                    <stop stopColor="#FFFFFF" stopOpacity="0.84" />
                    <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="patent-search-cube" x1="586" y1="48" x2="670" y2="132">
                    <stop stopColor="#6C5CE7" stopOpacity="0.34" />
                    <stop offset="1" stopColor="#6C5CE7" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient id="patent-search-bar" x1="238" y1="246" x2="402" y2="246">
                    <stop stopColor="#5B4EF5" stopOpacity="0.64" />
                    <stop offset="1" stopColor="#C8C2FF" stopOpacity="0.42" />
                </linearGradient>
                <radialGradient id="patent-search-glow" cx="50%" cy="48%" r="58%">
                    <stop stopColor="#7C72FF" stopOpacity="0.13" />
                    <stop offset="1" stopColor="#7C72FF" stopOpacity="0" />
                </radialGradient>
                <pattern id="patent-search-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.95" fill="#6C5CE7" opacity="0.15" />
                </pattern>
            </defs>

            <ellipse cx="374" cy="304" rx="332" ry="258" fill="url(#patent-search-glow)" />
            <path d="M86 572H686L614 214H158Z" fill="url(#patent-search-dots)" opacity="0.48" />
            <path d="M118 526H646L584 270H176Z" fill="url(#patent-search-dots)" opacity="0.2" />

            <g stroke="#6C5CE7" fill="none">
                <circle cx="382" cy="284" r="270" strokeOpacity="0.14" />
                <circle cx="382" cy="284" r="238" strokeOpacity="0.13" strokeDasharray="5 7" />
                <circle cx="382" cy="284" r="176" strokeOpacity="0.1" />
                <path d="M146 122C222 52 332 18 444 42C546 64 624 138 660 238" strokeOpacity="0.11" strokeDasharray="5 7" />
                <path d="M110 414C94 266 172 146 304 112C442 76 582 146 628 280" strokeOpacity="0.12" />
            </g>

            <g stroke="#6C5CE7" strokeLinecap="round" fill="none">
                {plusMarks.map((path) => (
                    <path key={path} d={path} strokeOpacity="0.34" strokeWidth="1.8" />
                ))}
                <circle cx="84" cy="124" r="4.6" strokeOpacity="0.3" strokeWidth="1.7" />
                <circle cx="664" cy="210" r="4.4" strokeOpacity="0.26" strokeWidth="1.7" />
                <circle cx="18" cy="194" r="3.6" strokeOpacity="0.24" strokeWidth="1.5" />
            </g>

            <g transform="translate(24 176)" stroke="#5B4EF5" fill="none">
                <circle cx="65" cy="65" r="54" fill="white" fillOpacity="0.48" strokeOpacity="0.18" />
                <circle cx="65" cy="65" r="41" strokeOpacity="0.54" strokeWidth="1.8" />
                <ellipse cx="65" cy="65" rx="17" ry="41" strokeOpacity="0.42" strokeWidth="1.6" />
                <path d="M24 65H106M32 45H98M32 85H98" strokeOpacity="0.42" strokeWidth="1.5" />
                <path d="M65 24V106" strokeOpacity="0.36" strokeWidth="1.5" />
            </g>

            <g transform="translate(558 18)">
                <circle cx="66" cy="70" r="64" stroke="#6C5CE7" strokeOpacity="0.17" strokeDasharray="5 6" />
                <circle cx="66" cy="70" r="48" stroke="#6C5CE7" strokeOpacity="0.1" />
                <path
                    d="M66 28L104 50V94L66 116L28 94V50L66 28Z"
                    fill="url(#patent-search-cube)"
                    stroke="#6C5CE7"
                    strokeOpacity="0.34"
                    strokeWidth="1.5"
                />
                <path
                    d="M66 28V116M28 50L66 72L104 50M28 94L66 72L104 94"
                    stroke="#6C5CE7"
                    strokeOpacity="0.28"
                    strokeWidth="1.35"
                />
                <path d="M66 72L66 28L104 50V94L66 72Z" fill="#5B4EF5" opacity="0.12" />
            </g>

            {searchTabs.map((tab) => (
                <g key={tab.label}>
                    <rect
                        x={tab.x}
                        y="72"
                        width={tab.width}
                        height="36"
                        rx="9"
                        fill="white"
                        fillOpacity="0.78"
                        stroke="#6C5CE7"
                        strokeOpacity="0.26"
                        strokeWidth="1.5"
                    />
                    <text
                        x={tab.cx}
                        y="95"
                        textAnchor="middle"
                        fill="#5B4EF5"
                        opacity="0.82"
                        fontSize="12"
                        fontWeight="700"
                        fontFamily="Arial, sans-serif"
                    >
                        {tab.label}
                    </text>
                    <path d={`M${tab.cx} 108V150`} stroke="#6C5CE7" strokeOpacity="0.32" strokeDasharray="5 6" />
                    <circle cx={tab.cx} cy="116" r="3" fill="#5B4EF5" opacity="0.55" />
                </g>
            ))}

            <g>
                <rect
                    x="176"
                    y="154"
                    width="414"
                    height="322"
                    rx="14"
                    fill="url(#patent-search-panel)"
                    stroke="#5B4EF5"
                    strokeOpacity="0.44"
                    strokeWidth="1.8"
                />
                <rect x="200" y="180" width="350" height="42" rx="10" fill="white" fillOpacity="0.74" stroke="#6C5CE7" strokeOpacity="0.18" />
                <g transform="translate(211 192)" stroke="#5B4EF5" strokeLinecap="round" strokeWidth="1.8">
                    <circle cx="8" cy="8" r="6.5" strokeOpacity="0.55" />
                    <path d="M13 13L20 20" strokeOpacity="0.55" />
                </g>
                <text x="244" y="205" fill="#667085" opacity="0.56" fontSize="12.5" fontWeight="600" fontFamily="Arial, sans-serif">
                    Search patents, keywords, assignees...
                </text>
                <rect x="512" y="186" width="30" height="30" rx="8" fill="white" stroke="#6C5CE7" strokeOpacity="0.28" />
                <g stroke="#5B4EF5" strokeOpacity="0.66" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M521 195H533M521 202H533M521 209H533" />
                    <circle cx="525" cy="195" r="1.8" fill="#5B4EF5" stroke="none" />
                    <circle cx="531" cy="202" r="1.8" fill="#5B4EF5" stroke="none" />
                    <circle cx="527" cy="209" r="1.8" fill="#5B4EF5" stroke="none" />
                </g>

                {resultRows.map((row, index) => (
                    <g key={row.y}>
                        <rect x="200" y={row.y} width="350" height="52" rx="7" fill="white" fillOpacity="0.58" stroke="#6C5CE7" strokeOpacity="0.14" />
                        <DocumentIcon x={214} y={row.y + 9} />
                        <rect x="256" y={row.y + 15} width={row.width} height="7" rx="3.5" fill="url(#patent-search-bar)" opacity={index === 0 ? 0.86 : 0.58} />
                        <rect x="256" y={row.y + 32} width={Math.min(row.subWidth, 166)} height="6" rx="3" fill="#C8C2FF" opacity="0.34" />
                    </g>
                ))}
                <path d="M258 430H510" stroke="#C8C2FF" strokeOpacity="0.22" strokeWidth="6" strokeLinecap="round" />
            </g>

            <g>
                <path d="M532 356L584 408" stroke="#4538E1" strokeOpacity="0.22" strokeWidth="28" strokeLinecap="round" />
                <path d="M534 356L584 406" stroke="url(#patent-search-purple)" strokeWidth="21" strokeLinecap="round" />
                <path d="M540 362L578 400" stroke="#9F97FF" strokeOpacity="0.58" strokeWidth="7" strokeLinecap="round" />
                <circle cx="488" cy="306" r="64" fill="white" fillOpacity="0.5" stroke="#5B4EF5" strokeOpacity="0.62" strokeWidth="2.3" />
                <circle cx="488" cy="306" r="53" fill="white" fillOpacity="0.28" stroke="#5B4EF5" strokeOpacity="0.56" strokeWidth="1.7" />
                <path d="M448 287C461 264 492 254 518 265" stroke="white" strokeOpacity="0.58" strokeWidth="3" strokeLinecap="round" />
                <path d="M522 347L538 363" stroke="#5B4EF5" strokeOpacity="0.62" strokeWidth="11" strokeLinecap="round" />
            </g>

            <g>
                <rect x="32" y="420" width="184" height="142" rx="12" fill="white" fillOpacity="0.74" stroke="#6C5CE7" strokeOpacity="0.22" />
                <g stroke="#5B4EF5" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M82 492L112 510V546L82 564L52 546V510Z" fill="white" fillOpacity="0.08" strokeWidth="1.8" />
                    <path d="M60 515V541M82 496L105 509M104 547L83 559" strokeWidth="1.4" />
                    <path d="M82 492V466M112 510L136 476M136 476V450M142 480L166 494" strokeWidth="1.7" />
                    <path d="M112 510L142 524M142 524L166 508M142 524V540" strokeWidth="1.7" />
                    <path d="M132 477V452" strokeWidth="1.1" />
                    <path d="M166 508L186 518" strokeWidth="1.7" />
                </g>
                <text x="66" y="462" fill="#5B4EF5" opacity="0.75" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">
                    Cl
                </text>
                <text x="130" y="448" fill="#5B4EF5" opacity="0.72" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">
                    O
                </text>
                <text x="168" y="501" fill="#5B4EF5" opacity="0.72" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">
                    N
                </text>
                <text x="150" y="548" fill="#5B4EF5" opacity="0.72" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">
                    NH
                </text>
                <text x="174" y="555" fill="#5B4EF5" opacity="0.72" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif">
                    2
                </text>
            </g>

            <g>
                <rect x="278" y="486" width="200" height="78" rx="10" fill="white" fillOpacity="0.74" stroke="#6C5CE7" strokeOpacity="0.2" />
                <text x="296" y="516" fill="#667085" opacity="0.82" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">
                    Results
                </text>
                <text x="296" y="540" fill="#344054" opacity="0.82" fontSize="18" fontWeight="700" fontFamily="Arial, sans-serif">
                    120M+
                </text>
                {chartBars.map((bar, index) => (
                    <rect
                        key={bar.x}
                        x={bar.x}
                        y={548 - bar.height}
                        width="10"
                        height={bar.height}
                        rx="2"
                        fill={index === 3 ? '#5B4EF5' : '#8E84FF'}
                        opacity={index === 3 ? 0.5 : 0.28}
                    />
                ))}
            </g>

            <g>
                <rect x="570" y="470" width="140" height="106" rx="10" fill="white" fillOpacity="0.76" stroke="#6C5CE7" strokeOpacity="0.24" />
                {checklistItems.map((item, index) => {
                    const y = 496 + index * 28;
                    return (
                        <g key={item}>
                            <circle cx="594" cy={y - 3} r="10" fill="#5B4EF5" opacity="0.82" />
                            <path d={`M589 ${y - 3}L593 ${y + 1}L600 ${y - 7}`} stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <text x="616" y={y + 1} fill="#344054" opacity="0.76" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">
                                {item}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}
