import Link from 'next/link';
import { Children, isValidElement } from 'react';
import { ArrowUpRight } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    className?: string;
}

interface ButtonAsButton extends ButtonBaseProps {
    href?: undefined;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    disabled?: boolean;
}

interface ButtonAsLink extends ButtonBaseProps {
    href: string;
    type?: undefined;
    /** Optional click handler, e.g. to close a mobile menu on navigation. */
    onClick?: () => void;
    /** Open the link in a new tab (adds a secure rel). For external handoffs. */
    newTab?: boolean;
    /** Skip the small visible external glyph where space is tight; the
        screen-reader "opens in a new tab" text is always kept. */
    hideExternalGlyph?: boolean;
    disabled?: undefined;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-primary/40',
    secondary:
        'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white',
    outline:
        'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
    ghost:
        'bg-transparent text-text-secondary hover:text-primary hover:bg-page-bg-alt',
    /* The secondary action beside a primary button: a plain underlined link,
       so each section has one button, not two competing ones. */
    link:
        'bg-transparent text-primary underline decoration-primary/30 decoration-1 underline-offset-[6px] hover:decoration-primary',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

/* Links keep the text size but drop the button padding. */
const linkSizeStyles: Record<ButtonSize, string> = {
    sm: 'py-2 text-sm',
    md: 'py-3 text-base',
    lg: 'py-4 text-lg',
};

export function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles =
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

    const sizing = variant === 'link' ? linkSizeStyles[size] : sizeStyles[size];
    const classes = `${baseStyles} ${variantStyles[variant]} ${sizing} ${className}`;

    if ('href' in props && props.href) {
        const { href, onClick, newTab, hideExternalGlyph } = props as ButtonAsLink;
        /* A link that leaves the site gets a small external glyph, unless
           its label already ends with an icon of its own. */
        const endsWithIcon = isValidElement(Children.toArray(children).at(-1));
        return (
            <Link
                href={href}
                className={classes}
                onClick={onClick}
                {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
                {children}
                {newTab && !endsWithIcon && !hideExternalGlyph && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden="true" />}
                {newTab && <span className="sr-only">(opens in a new tab)</span>}
            </Link>
        );
    }

    const { type = 'button', onClick, disabled } = props as ButtonAsButton;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${classes} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );
}
