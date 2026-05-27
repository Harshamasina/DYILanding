import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
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
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
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

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if ('href' in props && props.href) {
        const { href, onClick, newTab } = props as ButtonAsLink;
        return (
            <Link
                href={href}
                className={classes}
                onClick={onClick}
                {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
                {children}
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
