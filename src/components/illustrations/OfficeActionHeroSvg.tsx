/* Decorative hero companion for the office actions page. Same canvas, glow,
   dot fields, orbit rings, plus marks, and cube as the patent search and
   docketing illustrations. It reads as the page's story: grounds of
   rejection feed a claim chart, the analysis is signed, claim 1 is amended
   with support, and the response clears its checks for approval. */

const groundTabs = [
    { label: '§ 103 Obviousness', x: 168, width: 140, cx: 238 },
    { label: '§ 112(b) Definiteness', x: 324, width: 160, cx: 404 },
    { label: 'Objection', x: 500, width: 84, cx: 542 },
] as const;

const limitationRows = [
    { label: '[1a]', y: 216, bar: 150, cite: 'SMITH  ¶ [0024]', reading: 'FULL' },
    { label: '[1b]', y: 268, bar: 188, cite: 'SMITH  ¶ [0031]', reading: 'FULL' },
    { label: '[1c]', y: 380, bar: 124, cite: 'JONES  ¶ [0042]', reading: 'PARTIAL' },
] as const;

const checklistItems = ['Mapped', 'Signed', 'Approved'] as const;

const plusMarks = [
    'M232 16V30M225 23H239',
    'M128 40V54M121 47H135',
    'M688 150V170M678 160H698',
    'M700 334V348M693 341H707',
    'M6 502V516M0 509H13',
    'M248 586V600M241 593H255',
] as const;

export function OfficeActionHeroSvg() {
    return (
        <svg
            width="736"
            height="620"
            viewBox="0 0 736 620"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full max-w-184 opacity-95 select-none"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <linearGradient id="oa-hero-purple" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#5B4EF5" />
                    <stop offset="1" stopColor="#7567FF" />
                </linearGradient>
                <linearGradient id="oa-hero-panel" x1="176" y1="154" x2="590" y2="476">
                    <stop stopColor="#FFFFFF" stopOpacity="0.86" />
                    <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.52" />
                </linearGradient>
                <linearGradient id="oa-hero-cube" x1="608" y1="38" x2="692" y2="122">
                    <stop stopColor="#6C5CE7" stopOpacity="0.34" />
                    <stop offset="1" stopColor="#6C5CE7" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient id="oa-hero-bar" x1="250" y1="0" x2="440" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5B4EF5" stopOpacity="0.62" />
                    <stop offset="1" stopColor="#C8C2FF" stopOpacity="0.42" />
                </linearGradient>
                <radialGradient id="oa-hero-glow" cx="50%" cy="48%" r="58%">
                    <stop stopColor="#7C72FF" stopOpacity="0.13" />
                    <stop offset="1" stopColor="#7C72FF" stopOpacity="0" />
                </radialGradient>
                <pattern id="oa-hero-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.95" fill="#6C5CE7" opacity="0.15" />
                </pattern>
            </defs>

            {/* ── Atmosphere ── */}
            <ellipse cx="374" cy="304" rx="332" ry="258" fill="url(#oa-hero-glow)" />
            <path d="M86 572H686L614 214H158Z" fill="url(#oa-hero-dots)" opacity="0.48" />
            <path d="M118 526H646L584 270H176Z" fill="url(#oa-hero-dots)" opacity="0.2" />

            <g stroke="#6C5CE7" fill="none">
                <circle cx="382" cy="300" r="270" strokeOpacity="0.14" />
                <circle cx="382" cy="300" r="238" strokeOpacity="0.13" strokeDasharray="5 7" />
                <circle cx="382" cy="300" r="176" strokeOpacity="0.1" />
                <path d="M146 122C222 52 332 18 444 42C546 64 624 138 660 238" strokeOpacity="0.11" strokeDasharray="5 7" />
                <path d="M110 414C94 266 172 146 304 112C442 76 582 146 628 280" strokeOpacity="0.12" />
            </g>

            <g stroke="#6C5CE7" strokeLinecap="round" fill="none">
                {plusMarks.map(path => (
                    <path key={path} d={path} strokeOpacity="0.34" strokeWidth="1.8" />
                ))}
                <circle cx="84" cy="160" r="4.6" strokeOpacity="0.3" strokeWidth="1.7" />
                <circle cx="664" cy="214" r="4.4" strokeOpacity="0.26" strokeWidth="1.7" />
                <circle cx="18" cy="380" r="3.6" strokeOpacity="0.24" strokeWidth="1.5" />
            </g>

            {/* ── Cube, top right ── */}
            <g transform="translate(580 10)">
                <circle cx="66" cy="70" r="64" stroke="#6C5CE7" strokeOpacity="0.17" strokeDasharray="5 6" />
                <circle cx="66" cy="70" r="48" stroke="#6C5CE7" strokeOpacity="0.1" />
                <path d="M66 28L104 50V94L66 116L28 94V50L66 28Z" fill="url(#oa-hero-cube)" stroke="#6C5CE7" strokeOpacity="0.34" strokeWidth="1.5" />
                <path d="M66 28V116M28 50L66 72L104 50M28 94L66 72L104 94" stroke="#6C5CE7" strokeOpacity="0.28" strokeWidth="1.35" />
                <path d="M66 72L66 28L104 50V94L66 72Z" fill="#5B4EF5" opacity="0.12" />
            </g>

            {/* ── Grounds of rejection, feeding the chart ── */}
            {groundTabs.map(tab => (
                <g key={tab.label}>
                    <rect x={tab.x} y="72" width={tab.width} height="36" rx="9" fill="white" fillOpacity="0.78" stroke="#6C5CE7" strokeOpacity="0.26" strokeWidth="1.5" />
                    <text x={tab.cx} y="95" textAnchor="middle" fill="#5B4EF5" opacity="0.82" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif">
                        {tab.label}
                    </text>
                    <path d={`M${tab.cx} 108V154`} stroke="#6C5CE7" strokeOpacity="0.32" strokeDasharray="5 6" />
                    <circle cx={tab.cx} cy="116" r="3" fill="#5B4EF5" opacity="0.55" />
                </g>
            ))}

            {/* ── Reply due chip and the office action document, left ── */}
            <g>
                <rect x="34" y="96" width="104" height="30" rx="9" fill="url(#oa-hero-purple)" />
                <g transform="translate(46 104)" stroke="white" strokeWidth="1.6" strokeLinecap="round">
                    <circle cx="7" cy="7" r="6.2" />
                    <path d="M7 3.6V7L9.4 8.6" />
                </g>
                <text x="64" y="116" fill="white" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif">REPLY DUE</text>
                <path d="M86 126V170" stroke="#6C5CE7" strokeOpacity="0.32" strokeDasharray="5 6" />
            </g>
            <g transform="translate(24 172)">
                <path d="M10 0H96L124 28V160C124 165.5 119.5 170 114 170H10C4.5 170 0 165.5 0 160V10C0 4.5 4.5 0 10 0Z" fill="white" fillOpacity="0.8" stroke="#5B4EF5" strokeOpacity="0.4" strokeWidth="1.7" />
                <path d="M96 1V22C96 25.3 98.7 28 102 28H123" stroke="#5B4EF5" strokeOpacity="0.32" strokeWidth="1.5" />
                <text x="14" y="26" fill="#5B4EF5" opacity="0.82" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif">USPTO</text>
                <rect x="14" y="36" width="70" height="17" rx="5" fill="#EEEAFE" />
                <text x="49" y="48" textAnchor="middle" fill="#5B4EF5" opacity="0.8" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif">NON-FINAL</text>
                <rect x="14" y="66" width="94" height="5" rx="2.5" fill="#C8C2FF" opacity="0.5" />
                <rect x="14" y="78" width="80" height="5" rx="2.5" fill="#C8C2FF" opacity="0.4" />
                <rect x="14" y="90" width="88" height="5" rx="2.5" fill="#C8C2FF" opacity="0.4" />
                <rect x="14" y="108" width="62" height="6" rx="3" fill="url(#oa-hero-bar)" opacity="0.7" />
                <rect x="14" y="120" width="92" height="5" rx="2.5" fill="#C8C2FF" opacity="0.4" />
                <rect x="14" y="132" width="70" height="5" rx="2.5" fill="#C8C2FF" opacity="0.4" />
                <circle cx="100" cy="148" r="12" fill="white" stroke="#5B4EF5" strokeOpacity="0.5" strokeWidth="1.5" />
                <text x="100" y="153" textAnchor="middle" fill="#5B4EF5" opacity="0.8" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">§</text>
            </g>
            <path d="M148 256H176" stroke="#6C5CE7" strokeOpacity="0.36" strokeDasharray="5 6" />
            <circle cx="176" cy="256" r="3.5" fill="#5B4EF5" opacity="0.6" />

            {/* ── Claim chart, centre ── */}
            <g>
                <rect x="176" y="154" width="414" height="322" rx="14" fill="url(#oa-hero-panel)" stroke="#5B4EF5" strokeOpacity="0.44" strokeWidth="1.8" />
                <text x="200" y="187" fill="#667085" opacity="0.78" fontSize="12.5" fontWeight="700" fontFamily="Arial, sans-serif">CLAIM 1  ·  § 103 CHART</text>
                <rect x="452" y="172" width="114" height="22" rx="7" fill="white" fillOpacity="0.8" stroke="#6C5CE7" strokeOpacity="0.22" />
                <text x="509" y="187" textAnchor="middle" fill="#5B4EF5" opacity="0.8" fontSize="10" fontWeight="700" fontFamily="Arial, sans-serif">SMITH + JONES</text>
                <path d="M176 204H590" stroke="#6C5CE7" strokeOpacity="0.16" />

                {limitationRows.map((row, index) => {
                    const expanded = index === 1;
                    const full = row.reading === 'FULL';
                    return (
                        <g key={row.label}>
                            <rect x="200" y={row.y} width="350" height={expanded ? 104 : 44} rx="7" fill="white" fillOpacity={expanded ? 0.78 : 0.58} stroke="#6C5CE7" strokeOpacity={expanded ? 0.3 : 0.14} />
                            <text x="212" y={row.y + 19} fill="#5B4EF5" opacity="0.85" fontSize="11" fontWeight="700" fontFamily="'Courier New', monospace">{row.label}</text>
                            <rect x="250" y={row.y + 11} width={row.bar} height="7" rx="3.5" fill="url(#oa-hero-bar)" opacity={expanded ? 0.86 : 0.58} />
                            <text x="250" y={row.y + 35} fill="#667085" opacity="0.7" fontSize="9.5" fontWeight="600" fontFamily="'Courier New', monospace">{row.cite}</text>
                            <rect x="470" y={row.y + 10} width="68" height="20" rx="6" fill={full ? '#5B4EF5' : 'white'} fillOpacity={full ? 0.82 : 0.9} stroke="#5B4EF5" strokeOpacity={full ? 0 : 0.5} />
                            <text x="504" y={row.y + 24} textAnchor="middle" fill={full ? 'white' : '#5B4EF5'} fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif">{row.reading}</text>
                            {expanded && (
                                <g>
                                    <rect x="250" y={row.y + 46} width="286" height="34" rx="6" fill="#5B4EF5" fillOpacity="0.06" />
                                    <rect x="250" y={row.y + 46} width="3" height="34" rx="1.5" fill="#5B4EF5" opacity="0.75" />
                                    <rect x="264" y={row.y + 55} width="232" height="5" rx="2.5" fill="#8E84FF" opacity="0.38" />
                                    <rect x="264" y={row.y + 66} width="168" height="5" rx="2.5" fill="#8E84FF" opacity="0.3" />
                                    <rect x="250" y={row.y + 84} width="116" height="16" rx="8" fill="white" stroke="#5B4EF5" strokeOpacity="0.45" />
                                    <circle cx="260" cy={row.y + 92} r="5" fill="#5B4EF5" opacity="0.82" />
                                    <path d={`M257.6 ${row.y + 92}L259.4 ${row.y + 93.8}L262.6 ${row.y + 90.2}`} stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                    <text x="270" y={row.y + 95.5} fill="#5B4EF5" opacity="0.85" fontSize="8.5" fontWeight="700" fontFamily="Arial, sans-serif">QUOTE MATCHED</text>
                                </g>
                            )}
                        </g>
                    );
                })}

                <rect x="232" y="436" width="318" height="26" rx="13" fill="#5B4EF5" fillOpacity="0.08" stroke="#5B4EF5" strokeOpacity="0.2" />
                <circle cx="248" cy="449" r="7" fill="url(#oa-hero-purple)" />
                <path d="M244.6 449L247 451.4L251.6 446.6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="262" y="453" fill="#5B4EF5" opacity="0.85" fontSize="10.5" fontWeight="700" fontFamily="Arial, sans-serif">Analysis signed after attorney review</text>
            </g>

            {/* ── Attorney signature seal, over the chart edge ── */}
            <g>
                <circle cx="598" cy="296" r="48" fill="white" fillOpacity="0.62" stroke="#5B4EF5" strokeOpacity="0.5" strokeWidth="2.2" />
                <circle cx="598" cy="296" r="38" fill="white" fillOpacity="0.4" stroke="#5B4EF5" strokeOpacity="0.36" strokeWidth="1.5" strokeDasharray="4 4" />
                <g transform="translate(582 278)" stroke="#5B4EF5" strokeOpacity="0.78" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 2L29 7V17C29 26 16 33 16 33C16 33 3 26 3 17V7Z" fill="white" fillOpacity="0.6" />
                    <path d="M10 17L14.5 21.5L22.5 13" strokeWidth="2" />
                </g>
                <path d="M564 262C574 252 590 248 606 251" stroke="white" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
                <circle cx="632" cy="262" r="10" fill="url(#oa-hero-purple)" />
                <path d="M627.5 262L630.5 265L636.5 259" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="566" y="350" width="64" height="18" rx="9" fill="white" fillOpacity="0.85" stroke="#5B4EF5" strokeOpacity="0.4" />
                <text x="598" y="362.5" textAnchor="middle" fill="#5B4EF5" opacity="0.85" fontSize="8.5" fontWeight="700" fontFamily="Arial, sans-serif">SIGNED</text>
            </g>

            {/* ── Filing copy, right ── */}
            <g transform="translate(644 382)">
                <path d="M8 0H40L56 16V66C56 70.4 52.4 74 48 74H8C3.6 74 0 70.4 0 66V8C0 3.6 3.6 0 8 0Z" fill="white" fillOpacity="0.8" stroke="#5B4EF5" strokeOpacity="0.4" strokeWidth="1.6" />
                <path d="M40 1V12C40 14.2 41.8 16 44 16H55" stroke="#5B4EF5" strokeOpacity="0.32" strokeWidth="1.4" />
                <rect x="8" y="24" width="30" height="4" rx="2" fill="#C8C2FF" opacity="0.5" />
                <rect x="8" y="33" width="38" height="4" rx="2" fill="#C8C2FF" opacity="0.4" />
                <rect x="8" y="48" width="40" height="16" rx="5" fill="url(#oa-hero-purple)" />
                <text x="28" y="59.5" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="700" fontFamily="Arial, sans-serif">DOCX</text>
            </g>
            <path d="M598 368V396C598 404 604 410 612 410H644" stroke="#6C5CE7" strokeOpacity="0.3" strokeDasharray="5 6" />

            {/* ── Amended claim with support, bottom left ── */}
            <g>
                <rect x="32" y="420" width="184" height="142" rx="12" fill="white" fillOpacity="0.76" stroke="#6C5CE7" strokeOpacity="0.22" />
                <text x="48" y="446" fill="#667085" opacity="0.82" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif">CLAIM 1</text>
                <rect x="120" y="433" width="80" height="18" rx="6" fill="#EEEAFE" />
                <text x="160" y="445.5" textAnchor="middle" fill="#5B4EF5" opacity="0.85" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif">AMENDED</text>
                <rect x="48" y="462" width="150" height="5" rx="2.5" fill="#CBD5E1" opacity="0.7" />
                <rect x="48" y="475" width="56" height="5" rx="2.5" fill="#CBD5E1" opacity="0.7" />
                <rect x="112" y="474" width="86" height="7" rx="3.5" fill="#5B4EF5" opacity="0.28" />
                <path d="M112 486H198" stroke="#5B4EF5" strokeOpacity="0.7" strokeWidth="1.5" />
                <rect x="48" y="492" width="44" height="5" rx="2.5" fill="#CBD5E1" opacity="0.7" />
                <rect x="100" y="492" width="40" height="5" rx="2.5" fill="#CBD5E1" opacity="0.5" />
                <path d="M98 494.5H142" stroke="#98A2B3" strokeWidth="1.3" />
                <rect x="148" y="492" width="50" height="5" rx="2.5" fill="#CBD5E1" opacity="0.7" />
                <path d="M48 512H198" stroke="#6C5CE7" strokeOpacity="0.14" />
                <g transform="translate(48 526)" stroke="#5B4EF5" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.5 9.5L9.5 6.5M5 7.5L3.5 9A3 3 0 0 0 7.5 13.2L9 11.5M11.5 9L13 7.5A3 3 0 0 0 9 3.3L7.5 5" />
                </g>
                <text x="70" y="539" fill="#5B4EF5" opacity="0.85" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif">As filed ¶ [0036]</text>
                <circle cx="190" cy="535" r="8" fill="url(#oa-hero-purple)" />
                <path d="M186.4 535L188.8 537.4L193.6 532.6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* ── Approval readiness, bottom centre ── */}
            <g>
                <rect x="278" y="486" width="200" height="78" rx="10" fill="white" fillOpacity="0.76" stroke="#6C5CE7" strokeOpacity="0.2" />
                <text x="296" y="514" fill="#667085" opacity="0.82" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">Checks hold</text>
                <text x="296" y="542" fill="#344054" opacity="0.82" fontSize="18" fontWeight="700" fontFamily="Arial, sans-serif">14 / 14</text>
                <circle cx="438" cy="525" r="22" stroke="#C8C2FF" strokeOpacity="0.45" strokeWidth="6" />
                <circle cx="438" cy="525" r="22" stroke="url(#oa-hero-purple)" strokeWidth="6" strokeLinecap="round" strokeDasharray="128 138" transform="rotate(-90 438 525)" opacity="0.85" />
                <path d="M431 525L436 530L445 520" stroke="#5B4EF5" strokeOpacity="0.85" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* ── Outcome checklist, bottom right ── */}
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
