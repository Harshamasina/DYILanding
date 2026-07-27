import type { OgCardContent, OgVisual } from '@/lib/og';
import { OG_SIZE } from '@/lib/og';
import { OG_FONT_BODY, OG_FONT_DISPLAY, OG_FONT_MONO } from '@/lib/og-fonts';

/* Generated social cards are rendered by Satori, which has no stylesheet.
 * Inline styles and SVG data URIs are therefore intentional in this file.
 *
 * The composition mirrors the product UI: an off-white workspace, elevated
 * white surface, navy product canvas, indigo interaction lines, quiet borders,
 * and small mono labels. Each route chooses a purpose-built vector scene so
 * the preview communicates the page before its title is read. */

const COLOR = {
    ground: '#f8fafc',
    surface: '#ffffff',
    title: '#0f172a',
    body: '#64748b',
    wordmark: '#334155',
    navy: '#0f1b2d',
    navyLight: '#1b2f54',
    indigo: '#4f46e5',
    indigoDeep: '#4338ca',
    indigoLight: '#818cf8',
    meta: '#64748b',
    rule: '#e2e8f0',
    chipBg: 'rgba(99, 102, 241, 0.12)',
    chipBorder: 'rgba(129, 140, 248, 0.38)',
} as const;

const DOMAIN = 'designyourinvention.com';

const HEX_MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240">
<polygon points="100,10 190,62 190,166 100,218 10,166 10,62" fill="#0F1B2D"/>
<polygon points="100,10 190,62 100,114" fill="#818CF8" opacity=".8"/>
<polygon points="190,62 190,166 100,114" fill="#6366F1" opacity=".8"/>
<polygon points="190,166 100,218 100,114" fill="#4F46E5" opacity=".8"/>
<polygon points="100,218 10,166 100,114" fill="#312E81" opacity=".8"/>
<polygon points="10,166 10,62 100,114" fill="#0F1B2D" opacity=".9"/>
<polygon points="10,62 100,10 100,114" fill="#4F46E5" opacity=".8"/>
<polygon points="100,85 118,96 118,118 100,129 82,118 82,96" fill="#fff" opacity=".9"/>
</svg>`;

function svgSrc(svg: string): string {
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const HEX_MARK_SRC = svgSrc(HEX_MARK);
const HEX_RATIO = 240 / 200;

const SCENES: Record<OgVisual, string> = {
    platform: `
        <path d="M75 89L194 174L318 86M194 174L95 302M194 174L312 304" class="wire"/>
        <rect x="129" y="111" width="130" height="126" rx="24" class="card"/>
        <g stroke="#fff" stroke-width=".35" stroke-opacity=".14">
          <path d="M194 126l39 22-39 26z" fill="#a5b4fc"/>
          <path d="M233 148v49l-39-23z" fill="#818cf8"/>
          <path d="M233 197l-39 23v-46z" fill="#6366f1"/>
          <path d="M194 220l-39-23 39-23z" fill="#4f46e5"/>
          <path d="M155 197v-49l39 26z" fill="#312e81"/>
          <path d="M155 148l39-22v48z" fill="#4338ca"/>
        </g>
        <path d="M194 126l39 22v49l-39 23-39-23v-49z" fill="none" stroke="#a5b4fc" stroke-width="2"/>
        <path d="M194 159l14 8v15l-14 8-14-8v-15z" fill="#fff" opacity=".94"/>
        <circle cx="194" cy="174.5" r="2.2" fill="#6366f1"/>
        <g class="node"><circle cx="75" cy="89" r="29"/><path d="M61 89h28M75 75v28"/></g>
        <g class="node"><circle cx="318" cy="86" r="29"/><path d="M305 94l9 9 18-25"/></g>
        <g class="node"><circle cx="95" cy="302" r="29"/><path d="M82 302h26M87 291h16M87 313h16"/></g>
        <g class="node"><circle cx="312" cy="304" r="29"/><path d="M300 311l10-18 8 12 7-8"/></g>`,
    editorial: `
        <rect x="56" y="77" width="270" height="258" rx="24" class="card"/>
        <rect x="78" y="103" width="96" height="15" rx="7.5" fill="#818cf8" opacity=".85"/>
        <rect x="78" y="142" width="190" height="10" rx="5" class="line"/>
        <rect x="78" y="166" width="220" height="10" rx="5" class="line"/>
        <rect x="78" y="190" width="168" height="10" rx="5" class="line"/>
        <rect x="78" y="232" width="92" height="73" rx="14" fill="#6366f1" opacity=".22" stroke="#818cf8"/>
        <rect x="186" y="232" width="112" height="10" rx="5" class="line"/>
        <rect x="186" y="256" width="92" height="10" rx="5" class="line"/>
        <rect x="186" y="280" width="68" height="10" rx="5" class="line"/>
        <path d="M286 91l45-29 17 18-39 36-28 7z" fill="url(#brand)" stroke="#c7d2fe" stroke-width="2"/>
        <path d="M309 116l-10-12" stroke="#fff" stroke-width="2"/>`,
    docketing: `
        <path d="M112 73v268" class="wire"/>
        <circle cx="112" cy="104" r="10" class="dot"/><circle cx="112" cy="202" r="10" class="dot"/><circle cx="112" cy="300" r="10" class="dot"/>
        <rect x="142" y="72" width="185" height="70" rx="18" class="card"/>
        <rect x="162" y="93" width="66" height="10" rx="5" fill="#818cf8"/>
        <rect x="162" y="116" width="128" height="8" rx="4" class="line"/>
        <rect x="142" y="170" width="185" height="70" rx="18" class="card"/>
        <rect x="162" y="191" width="90" height="10" rx="5" fill="#fbbf24" opacity=".9"/>
        <rect x="162" y="214" width="142" height="8" rx="4" class="line"/>
        <rect x="142" y="268" width="185" height="70" rx="18" class="card"/>
        <rect x="162" y="289" width="76" height="10" rx="5" fill="#34d399" opacity=".9"/>
        <path d="M278 302l9 9 18-22" fill="none" stroke="#34d399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
    search: `
        <rect x="51" y="75" width="254" height="260" rx="25" class="card"/>
        <rect x="75" y="101" width="206" height="40" rx="20" fill="#0f1b2d" stroke="#818cf8"/>
        <circle cx="99" cy="121" r="8" fill="none" stroke="#a5b4fc" stroke-width="3"/><path d="M105 127l8 8" stroke="#a5b4fc" stroke-width="3"/>
        <rect x="130" y="116" width="105" height="9" rx="4.5" class="line"/>
        <path d="M90 205l49-28 49 28v56l-49 28-49-28z" fill="#6366f1" opacity=".16" stroke="#818cf8" stroke-width="2"/>
        <circle cx="139" cy="233" r="18" fill="#6366f1" opacity=".7"/>
        <circle cx="242" cy="211" r="56" fill="#0f1b2d" stroke="#c7d2fe" stroke-width="7"/>
        <path d="M282 252l47 47" stroke="#c7d2fe" stroke-width="12" stroke-linecap="round"/>
        <circle cx="226" cy="196" r="8" class="dot"/><circle cx="260" cy="224" r="6" fill="#34d399"/>`,
    drafting: `
        <rect x="72" y="58" width="238" height="300" rx="26" class="card"/>
        <path d="M235 58h49a26 26 0 0126 26v49z" fill="#6366f1" opacity=".28"/>
        <rect x="99" y="101" width="90" height="13" rx="6.5" fill="#818cf8"/>
        <rect x="99" y="144" width="174" height="9" rx="4.5" class="line"/>
        <rect x="99" y="169" width="156" height="9" rx="4.5" class="line"/>
        <rect x="99" y="194" width="184" height="9" rx="4.5" class="line"/>
        <rect x="99" y="236" width="184" height="74" rx="15" fill="#6366f1" opacity=".12" stroke="#818cf8"/>
        <path d="M119 274h47l18-20 22 34 18-22 18 8" fill="none" stroke="#a5b4fc" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M319 84v42M298 105h42M306 92l26 26M332 92l-26 26" stroke="#f8fafc" stroke-width="4" stroke-linecap="round"/>`,
    comparison: `
        <rect x="48" y="81" width="132" height="254" rx="23" fill="#111f35" stroke="#475569"/>
        <rect x="205" y="61" width="140" height="294" rx="23" class="card"/>
        <rect x="70" y="108" width="70" height="11" rx="5.5" fill="#64748b"/>
        <rect x="228" y="89" width="84" height="11" rx="5.5" fill="#818cf8"/>
        <g fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M73 160l8 8 14-17M73 211l8 8 14-17" stroke="#64748b"/>
          <path d="M230 150l8 8 15-18M230 201l8 8 15-18M230 252l8 8 15-18M230 303l8 8 15-18" stroke="#34d399"/>
        </g>
        <g class="line"><rect x="107" y="157" width="48" height="8" rx="4"/><rect x="107" y="208" width="38" height="8" rx="4"/>
        <rect x="266" y="147" width="55" height="8" rx="4"/><rect x="266" y="198" width="45" height="8" rx="4"/><rect x="266" y="249" width="58" height="8" rx="4"/><rect x="266" y="300" width="38" height="8" rx="4"/></g>
        <path d="M176 190h35l-10-10M211 190l-10 10" fill="none" stroke="#a5b4fc" stroke-width="3" stroke-linecap="round"/>`,
    careers: `
        <path d="M194 124v68M194 192L93 255M194 192l101 63" class="wire"/>
        <rect x="140" y="68" width="108" height="86" rx="22" class="card"/>
        <circle cx="194" cy="98" r="15" fill="#818cf8"/><path d="M166 136c7-18 49-18 56 0" fill="#6366f1" opacity=".55"/>
        <rect x="48" y="236" width="108" height="100" rx="22" class="card"/>
        <circle cx="102" cy="268" r="15" fill="#34d399"/><rect x="71" y="300" width="62" height="9" rx="4.5" class="line"/>
        <rect x="240" y="236" width="108" height="100" rx="22" class="card"/>
        <circle cx="294" cy="268" r="15" fill="#fbbf24"/><rect x="263" y="300" width="62" height="9" rx="4.5" class="line"/>
        <circle cx="194" cy="192" r="9" class="dot"/>`,
    support: `
        <path d="M72 84h225a28 28 0 0128 28v112a28 28 0 01-28 28H168l-55 49 14-49H72a28 28 0 01-28-28V112a28 28 0 0128-28z" class="card"/>
        <circle cx="124" cy="168" r="12" fill="#818cf8"/><circle cx="184" cy="168" r="12" fill="#6366f1"/><circle cx="244" cy="168" r="12" fill="#4338ca"/>
        <circle cx="292" cy="284" r="65" fill="url(#brand)" stroke="#c7d2fe" stroke-width="3"/>
        <path d="M267 282l17 17 34-40" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
    legal: `
        <path d="M194 59l111 42v86c0 79-44 137-111 173-67-36-111-94-111-173v-86z" fill="url(#brand)" opacity=".9" stroke="#c7d2fe" stroke-width="3"/>
        <rect x="129" y="119" width="130" height="157" rx="18" fill="#0f1b2d" stroke="#a5b4fc"/>
        <rect x="151" y="147" width="68" height="11" rx="5.5" fill="#818cf8"/>
        <rect x="151" y="180" width="86" height="8" rx="4" class="line"/>
        <rect x="151" y="204" width="75" height="8" rx="4" class="line"/>
        <path d="M151 244l10 10 20-24" fill="none" stroke="#34d399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
    compliance: `
        <path d="M119 64l79 30v61c0 56-31 98-79 123-48-25-79-67-79-123V94z" fill="#6366f1" opacity=".24" stroke="#a5b4fc" stroke-width="3"/>
        <path d="M86 167l23 23 45-55" fill="none" stroke="#34d399" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M207 122h130M207 190h130M207 258h130" stroke="#818cf8" stroke-width="2" stroke-dasharray="5 8"/>
        <circle cx="226" cy="122" r="9" class="dot"/><circle cx="270" cy="190" r="9" class="dot"/><circle cx="316" cy="258" r="9" class="dot"/>
        <rect x="218" y="139" width="91" height="30" rx="15" class="card"/><rect x="237" y="207" width="91" height="30" rx="15" class="card"/><rect x="218" y="275" width="91" height="30" rx="15" class="card"/>`,
    analytics: `
        <rect x="46" y="71" width="300" height="270" rx="25" class="card"/>
        <path d="M78 292h236M83 285V119" stroke="#475569" stroke-width="2"/>
        <path d="M91 259l51-58 43 24 52-81 70 41" fill="none" stroke="url(#brand)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M91 259l51-58 43 24 52-81 70 41v95H91z" fill="#6366f1" opacity=".12"/>
        <circle cx="142" cy="201" r="8" class="dot"/><circle cx="237" cy="144" r="8" class="dot"/><circle cx="307" cy="185" r="8" class="dot"/>
        <rect x="104" y="101" width="88" height="11" rx="5.5" fill="#818cf8"/>`,
    migration: `
        <g class="card"><rect x="50" y="82" width="118" height="68" rx="16"/><rect x="50" y="173" width="118" height="68" rx="16"/><rect x="50" y="264" width="118" height="68" rx="16"/></g>
        <g class="line"><rect x="73" y="104" width="72" height="8" rx="4"/><rect x="73" y="127" width="49" height="8" rx="4"/>
        <rect x="73" y="195" width="61" height="8" rx="4"/><rect x="73" y="218" width="72" height="8" rx="4"/>
        <rect x="73" y="286" width="72" height="8" rx="4"/><rect x="73" y="309" width="44" height="8" rx="4"/></g>
        <path d="M183 207h72m-18-18l18 18-18 18" fill="none" stroke="#a5b4fc" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <ellipse cx="306" cy="112" rx="51" ry="23" fill="#6366f1" opacity=".42" stroke="#a5b4fc" stroke-width="2"/>
        <path d="M255 112v174c0 13 23 23 51 23s51-10 51-23V112" fill="#6366f1" opacity=".16" stroke="#a5b4fc" stroke-width="2"/>
        <path d="M255 199c0 13 23 23 51 23s51-10 51-23M255 257c0 13 23 23 51 23s51-10 51-23" fill="none" stroke="#818cf8" stroke-width="2"/>`,
};

function sceneSvg(visual: OgVisual): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 400">
      <defs>
        <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#818cf8"/><stop offset="1" stop-color="#4338ca"/>
        </linearGradient>
        <style>
          .card{fill:#172841;stroke:#64748b;stroke-width:1.5}
          .line{fill:#64748b;opacity:.62}
          .wire{fill:none;stroke:#818cf8;stroke-width:2.5;stroke-dasharray:5 8}
          .dot{fill:#818cf8;stroke:#c7d2fe;stroke-width:2}
          .node circle{fill:#172841;stroke:#818cf8;stroke-width:2}
          .node path{fill:none;stroke:#c7d2fe;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
        </style>
      </defs>
      <circle cx="337" cy="41" r="96" fill="#6366f1" opacity=".10"/>
      <circle cx="44" cy="368" r="118" fill="#4338ca" opacity=".12"/>
      ${SCENES[visual]}
    </svg>`;
}

function clamp(text: string, max: number): string {
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:]$/, '')}...`;
}

function titleSize(title: string): number {
    if (title.length <= 29) return 60;
    if (title.length <= 43) return 54;
    if (title.length <= 60) return 48;
    if (title.length <= 78) return 42;
    return 38;
}

function Backdrop() {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: OG_SIZE.width,
                height: OG_SIZE.height,
                display: 'flex',
                backgroundColor: COLOR.ground,
                backgroundImage:
                    'radial-gradient(circle at 0% 100%, rgba(67, 56, 202, 0.20), transparent 38%), radial-gradient(circle at 100% 0%, rgba(129, 140, 248, 0.18), transparent 36%)',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 28,
                    left: 30,
                    width: OG_SIZE.width - 60,
                    height: OG_SIZE.height - 56,
                    display: 'flex',
                    borderRadius: 30,
                    border: `1px solid ${COLOR.rule}`,
                    backgroundColor: COLOR.surface,
                    boxShadow: '0 24px 70px rgba(15, 27, 45, 0.12)',
                    overflow: 'hidden',
                }}
            />
        </div>
    );
}

function Wordmark({ size = 35 }: { size?: number }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={HEX_MARK_SRC} alt="" width={size} height={size * HEX_RATIO} />
            <span
                style={{
                    marginLeft: 14,
                    fontFamily: OG_FONT_MONO,
                    fontSize: 15,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: COLOR.wordmark,
                }}
            >
                Design Your Invention
            </span>
        </div>
    );
}

function VisualPanel({ card }: { card: OgCardContent }) {
    return (
        <div
            style={{
                position: 'absolute',
                top: 57,
                right: 58,
                width: 386,
                height: 516,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 24,
                border: '1px solid rgba(129, 140, 248, 0.25)',
                backgroundColor: COLOR.navy,
                backgroundImage:
                    'linear-gradient(145deg, rgba(27, 47, 84, 0.98), rgba(15, 27, 45, 1) 58%, rgba(49, 46, 129, 0.92))',
                boxShadow: '0 18px 38px rgba(15, 27, 45, 0.18)',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 13px',
                    borderRadius: 999,
                    border: `1px solid ${COLOR.chipBorder}`,
                    backgroundColor: COLOR.chipBg,
                    fontFamily: OG_FONT_MONO,
                    fontSize: 13,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                    color: '#c7d2fe',
                }}
            >
                <span
                    style={{
                        width: 7,
                        height: 7,
                        marginRight: 9,
                        borderRadius: 999,
                        backgroundColor: COLOR.indigoLight,
                        boxShadow: '0 0 12px rgba(129,140,248,.9)',
                    }}
                />
                {card.eyebrow}
            </div>
            <img
                src={svgSrc(sceneSvg(card.visual))}
                alt=""
                width={390}
                height={400}
                style={{ position: 'absolute', left: -2, top: 66 }}
            />
            <div
                style={{
                    position: 'absolute',
                    left: 22,
                    right: 22,
                    bottom: 19,
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 14,
                    borderTop: '1px solid rgba(148, 163, 184, 0.20)',
                    fontFamily: OG_FONT_MONO,
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#94a3b8',
                }}
            >
                <span>Intelligent IPMS</span>
                <span style={{ color: '#a5b4fc' }}>Secure by design</span>
            </div>
        </div>
    );
}

function BrandCard({ card }: { card: OgCardContent }) {
    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                padding: '70px 510px 58px 76px',
            }}
        >
            <Wordmark />
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
                <div
                    style={{
                        fontFamily: OG_FONT_DISPLAY,
                        fontSize: 68,
                        lineHeight: 1.03,
                        letterSpacing: '-0.025em',
                        color: COLOR.title,
                    }}
                >
                    {card.title}
                </div>
                <div
                    style={{
                        marginTop: 24,
                        maxWidth: 560,
                        fontFamily: OG_FONT_BODY,
                        fontSize: 22,
                        lineHeight: 1.55,
                        color: COLOR.body,
                    }}
                >
                    Compliance-native IP portfolio management for modern teams.
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    paddingTop: 20,
                    borderTop: `1px solid ${COLOR.rule}`,
                    fontFamily: OG_FONT_MONO,
                    fontSize: 15,
                    letterSpacing: '0.12em',
                    color: COLOR.indigo,
                }}
            >
                {DOMAIN}
            </div>
            <VisualPanel card={card} />
        </div>
    );
}

function TitleCard({ card }: { card: OgCardContent }) {
    const description = clamp(card.description, 142);

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                padding: '69px 510px 52px 76px',
            }}
        >
            <Wordmark />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    justifyContent: 'center',
                    paddingTop: 17,
                }}
            >
                <div
                    style={{
                        maxWidth: 630,
                        fontFamily: OG_FONT_DISPLAY,
                        fontSize: titleSize(card.title),
                        lineHeight: 1.09,
                        letterSpacing: '-0.022em',
                        color: COLOR.title,
                    }}
                >
                    {card.title}
                </div>
                {description ? (
                    <div
                        style={{
                            marginTop: 21,
                            maxWidth: 615,
                            fontFamily: OG_FONT_BODY,
                            fontSize: 19,
                            lineHeight: 1.55,
                            color: COLOR.body,
                        }}
                    >
                        {description}
                    </div>
                ) : null}
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 19,
                    borderTop: `1px solid ${COLOR.rule}`,
                }}
            >
                <span
                    style={{
                        fontFamily: OG_FONT_MONO,
                        fontSize: 14,
                        letterSpacing: '0.1em',
                        color: COLOR.indigo,
                    }}
                >
                    {DOMAIN}
                </span>
                {card.meta ? (
                    <span
                        style={{
                            maxWidth: 285,
                            fontFamily: OG_FONT_MONO,
                            fontSize: 12,
                            letterSpacing: '0.02em',
                            textAlign: 'right',
                            color: COLOR.meta,
                        }}
                    >
                        {card.meta}
                    </span>
                ) : null}
            </div>
            <VisualPanel card={card} />
        </div>
    );
}

export function OgCard({ card }: { card: OgCardContent }) {
    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                width: OG_SIZE.width,
                height: OG_SIZE.height,
                backgroundColor: COLOR.ground,
            }}
        >
            <Backdrop />
            {card.variant === 'brand' ? <BrandCard card={card} /> : <TitleCard card={card} />}
        </div>
    );
}
