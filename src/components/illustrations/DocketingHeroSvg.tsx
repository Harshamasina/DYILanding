const calendarDays = [
    ['28', '29', '30', '1', '2', '3', '4'],
    ['5', '6', '7', '8', '9', '10', '11'],
    ['12', '13', '14', '15', '16', '17', '18'],
    ['19', '20', '21', '22', '23', '24', '25'],
    ['26', '27', '28', '29', '30', '31', '1'],
] as const;

const familyChips = ['US17/123,456', 'EP2589 123', 'WO2023/123456', 'JP2024-123456'] as const;

export function DocketingHeroSvg() {
    return (
        <svg
            width="720"
            height="500"
            viewBox="0 0 720 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full opacity-95 select-none"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <linearGradient id="docket-soft-line" x1="84" y1="36" x2="650" y2="446">
                    <stop stopColor="#5B4EF5" stopOpacity="0.56" />
                    <stop offset="1" stopColor="#8E84FF" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="docket-panel" x1="156" y1="124" x2="486" y2="338">
                    <stop stopColor="#FFFFFF" stopOpacity="0.84" />
                    <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.48" />
                </linearGradient>
                <linearGradient id="docket-purple" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#5B4EF5" />
                    <stop offset="1" stopColor="#7567FF" />
                </linearGradient>
                <linearGradient id="docket-cube-fill" x1="300" y1="42" x2="370" y2="110">
                    <stop stopColor="#5B4EF5" stopOpacity="0.38" />
                    <stop offset="1" stopColor="#8B82FF" stopOpacity="0.08" />
                </linearGradient>
                <radialGradient id="docket-glow" cx="50%" cy="48%" r="58%">
                    <stop stopColor="#7C72FF" stopOpacity="0.14" />
                    <stop offset="1" stopColor="#7C72FF" stopOpacity="0" />
                </radialGradient>
                <pattern id="docket-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#6C5CE7" opacity="0.15" />
                </pattern>
            </defs>

            <ellipse cx="374" cy="250" rx="320" ry="232" fill="url(#docket-glow)" opacity="0.85" />
            <path d="M72 458H668L596 126H154Z" fill="url(#docket-dots)" opacity="0.5" />
            <path d="M112 414H624L566 166H172Z" fill="url(#docket-dots)" opacity="0.22" />

            <g stroke="#6C5CE7" fill="none">
                <path d="M80 330C64 176 168 72 322 60C478 48 604 132 648 276" strokeOpacity="0.2" strokeDasharray="5 7" />
                <path d="M124 340C112 210 196 116 322 108C450 100 550 164 590 276" strokeOpacity="0.18" />
                <path d="M186 360C174 254 240 176 338 170C436 164 510 214 540 306" strokeOpacity="0.14" />
                <path d="M496 74L598 124" strokeOpacity="0.25" strokeDasharray="6 7" />
                <path d="M612 136V202C612 216 604 224 590 224H512" strokeOpacity="0.28" strokeDasharray="6 6" />
                <path d="M88 372H128C142 372 150 380 150 394V454H236" strokeOpacity="0.25" strokeDasharray="6 6" />
                <path d="M262 454H410" strokeOpacity="0.25" strokeDasharray="6 6" />
            </g>

            <g stroke="#6C5CE7" strokeLinecap="round" fill="none">
                <path d="M118 88V100M112 94H124" strokeOpacity="0.42" strokeWidth="1.8" />
                <path d="M248 40V52M242 46H254" strokeOpacity="0.42" strokeWidth="1.8" />
                <path d="M610 96V108M604 102H616" strokeOpacity="0.36" strokeWidth="1.8" />
                <path d="M666 150V162M660 156H672" strokeOpacity="0.38" strokeWidth="1.8" />
                <path d="M642 294V306M636 300H648" strokeOpacity="0.38" strokeWidth="1.8" />
                <path d="M430 466V478M424 472H436" strokeOpacity="0.34" strokeWidth="1.8" />
                <path d="M70 262V274M64 268H76" strokeOpacity="0.34" strokeWidth="1.8" />
            </g>

            <g transform="translate(286 26)">
                <path
                    d="M50 0L94 25V75L50 101L6 75V25L50 0Z"
                    fill="white"
                    fillOpacity="0.22"
                    stroke="#6C5CE7"
                    strokeOpacity="0.24"
                    strokeDasharray="4 5"
                />
                <path
                    d="M50 24L73 37V63L50 76L27 63V37L50 24Z"
                    fill="url(#docket-cube-fill)"
                    stroke="#6C5CE7"
                    strokeOpacity="0.34"
                    strokeWidth="1.3"
                />
                <path d="M50 24V76M27 37L50 50L73 37M27 63L50 50L73 63" stroke="white" strokeOpacity="0.34" strokeWidth="1" />
                <circle cx="78" cy="30" r="4" fill="#5B4EF5" opacity="0.65" />
            </g>

            <g transform="translate(92 226)">
                <circle cx="42" cy="42" r="40" fill="white" fillOpacity="0.52" stroke="#5B4EF5" strokeOpacity="0.72" strokeWidth="2" />
                <path d="M42 18V42" stroke="#5B4EF5" strokeOpacity="0.72" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M42 42L58 42" stroke="#5B4EF5" strokeOpacity="0.38" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="42" cy="42" r="3" fill="#5B4EF5" opacity="0.68" />
                <circle cx="68" cy="72" r="13" fill="url(#docket-purple)" />
                <path d="M62 72L66 76L75 66" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            <g>
                <rect x="178" y="132" width="304" height="266" rx="9" fill="url(#docket-panel)" stroke="#6C5CE7" strokeOpacity="0.28" />
                <path d="M178 168H482" stroke="#6C5CE7" strokeOpacity="0.16" />
                <text x="196" y="154" fill="#667085" opacity="0.72" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">
                    DOCKET CALENDAR
                </text>
                <rect x="420" y="142" width="24" height="22" rx="7" fill="white" fillOpacity="0.7" />
                <path d="M434 148L428 153L434 158" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="450" y="142" width="24" height="22" rx="7" fill="white" fillOpacity="0.7" />
                <path d="M459 148L465 153L459 158" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
                    <text
                        key={day}
                        x={207 + index * 38}
                        y="198"
                        textAnchor="middle"
                        fill="#667085"
                        opacity="0.66"
                        fontSize="8"
                        fontWeight="700"
                        fontFamily="Arial, sans-serif"
                    >
                        {day}
                    </text>
                ))}
                {calendarDays.map((week, weekIndex) =>
                    week.map((day, dayIndex) => {
                        const x = 207 + dayIndex * 38;
                        const y = 228 + weekIndex * 36;
                        const isEight = day === '8' && weekIndex === 1;
                        const isFifteen = day === '15';
                        const isTwentyTwo = day === '22';

                        return (
                            <g key={`${weekIndex}-${dayIndex}`}>
                                {isEight && <circle cx={x} cy={y - 4} r="11" fill="url(#docket-purple)" opacity="0.92" />}
                                {isFifteen && <rect x={x - 11} y={y - 15} width="22" height="22" rx="4" fill="url(#docket-purple)" opacity="0.9" />}
                                {isTwentyTwo && <circle cx={x} cy={y - 4} r="12" fill="white" stroke="#5B4EF5" strokeOpacity="0.72" strokeWidth="1.6" />}
                                <text
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    fill={isEight || isFifteen ? 'white' : isTwentyTwo ? '#5B4EF5' : '#475467'}
                                    opacity={day === '28' || day === '29' || day === '30' || (day === '1' && weekIndex === 4) ? 0.35 : 0.72}
                                    fontSize="10"
                                    fontWeight={isEight || isFifteen || isTwentyTwo ? '700' : '600'}
                                    fontFamily="Arial, sans-serif"
                                >
                                    {day}
                                </text>
                            </g>
                        );
                    }),
                )}
            </g>

            <g>
                <rect x="454" y="212" width="220" height="206" rx="9" fill="white" fillOpacity="0.76" stroke="#6C5CE7" strokeOpacity="0.24" />
                {[
                    ['Issue Fee Due', 'May 8, 2025', 'HIGH RISK', '#5B4EF5'],
                    ['Response to Office Action', 'May 15, 2025', 'MEDIUM RISK', '#5B4EF5'],
                    ['Annuity Payment', 'Jun 22, 2025', 'LOW RISK', '#ffffff'],
                ].map(([title, date, risk, fill], index) => (
                    <g key={title} transform={`translate(0 ${index * 58})`}>
                        {index > 0 && <path d="M454 270H674" stroke="#EAECF0" />}
                        <circle cx="478" cy="235" r="6" fill={fill} stroke="#5B4EF5" strokeOpacity="0.72" />
                        <text x="494" y="237" fill="#344054" fontSize="9.4" fontWeight="700" fontFamily="Arial, sans-serif">
                            {title}
                        </text>
                        <text x="494" y="256" fill="#667085" opacity="0.75" fontSize="9" fontFamily="Arial, sans-serif">
                            {date}
                        </text>
                        <rect x="610" y="225" width="54" height="14" rx="4" fill="#EEEAFE" />
                        <text x="637" y="235" textAnchor="middle" fill="#5B4EF5" opacity="0.75" fontSize="6.1" fontWeight="700" fontFamily="Arial, sans-serif">
                            {risk}
                        </text>
                    </g>
                ))}
                <path d="M474 384H480M477 381V387" stroke="#5B4EF5" strokeWidth="1.6" strokeLinecap="round" />
                <text x="496" y="388" fill="#5B4EF5" opacity="0.75" fontSize="10" fontWeight="700" fontFamily="Arial, sans-serif">
                    Add Deadline
                </text>
            </g>

            <g>
                <rect x="106" y="410" width="500" height="74" rx="10" fill="white" fillOpacity="0.78" stroke="#6C5CE7" strokeOpacity="0.2" />
                <text x="122" y="431" fill="#5B4EF5" opacity="0.5" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif">
                    PATENT FAMILY
                </text>
                <path d="M146 456H564" stroke="#6C5CE7" strokeOpacity="0.34" strokeDasharray="5 6" />
                {familyChips.map((chip, index) => {
                    const x = 152 + index * 116;
                    return (
                        <g key={chip}>
                            <rect x={x - 42} y="444" width="96" height="28" rx="14" fill="white" stroke="#5B4EF5" strokeOpacity="0.43" strokeWidth="1.5" />
                            <circle cx={x + 52} cy="444" r="3.8" fill="white" stroke="#5B4EF5" strokeOpacity="0.5" />
                            <text x={x + 6} y="461.5" textAnchor="middle" fill="#5B4EF5" opacity="0.8" fontSize="9.2" fontWeight="700" fontFamily="Arial, sans-serif">
                                {chip}
                            </text>
                        </g>
                    );
                })}
            </g>

            <g>
                <rect x="620" y="410" width="78" height="84" rx="10" fill="white" fillOpacity="0.76" stroke="#6C5CE7" strokeOpacity="0.22" />
                <g transform="translate(647 424)" stroke="#5B4EF5" strokeOpacity="0.76" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5A3 3 0 1 0 6.2 6.1A4.4 4.4 0 0 0 4 13.8A4.2 4.2 0 0 0 4.6 20A4.4 4.4 0 0 0 12 18Z" />
                    <path d="M12 5A3 3 0 1 1 17.8 6.1A4.4 4.4 0 0 1 20 13.8A4.2 4.2 0 0 1 19.4 20A4.4 4.4 0 0 1 12 18Z" />
                    <path d="M12 8.5V21" strokeOpacity="0.5" />
                    <path d="M8.2 12.5C10 12 11.3 10.8 12 9" strokeOpacity="0.46" />
                    <path d="M15.8 12.5C14 12 12.7 10.8 12 9" strokeOpacity="0.46" />
                    <path d="M7 17H10M14 17H17" strokeOpacity="0.42" />
                </g>
                <text x="659" y="463" textAnchor="middle" fill="#5B4EF5" opacity="0.56" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">
                    AI RISK SCORE
                </text>
                <text x="659" y="477" textAnchor="middle" fill="#5B4EF5" opacity="0.82" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif">
                    92
                </text>
                <text x="659" y="488" textAnchor="middle" fill="#5B4EF5" opacity="0.72" fontSize="7" fontWeight="700" fontFamily="Arial, sans-serif">
                    HIGH
                </text>
            </g>

            <g>
                <circle cx="594" cy="92" r="33" fill="white" fillOpacity="0.74" stroke="#6C5CE7" strokeOpacity="0.24" />
                <path
                    d="M582 101H606M587 101V88C587 84 590 80 594 80C598 80 601 84 601 88V101M587 90C584 91 583 94 584 97M601 90C604 91 605 94 604 97M591 106C592 108 596 108 597 106"
                    stroke="#5B4EF5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="612" cy="68" r="6" fill="#5B4EF5" opacity="0.8" />
            </g>

            <g>
                <rect x="514" y="156" width="60" height="28" rx="9" fill="url(#docket-purple)" />
                <text x="544" y="174" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif">
                    DUE
                </text>
            </g>
        </svg>
    );
}
