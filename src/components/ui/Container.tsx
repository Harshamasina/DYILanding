interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    as?: 'div' | 'section' | 'article' | 'main';
    /* 'wide' matches the header width (max-w-352) so the hero lines up with the
       nav; 'default' is the standard max-w-7xl used by the rest of the page. */
    size?: 'default' | 'wide';
}

export function Container({
    children,
    className = '',
    as: Component = 'div',
    size = 'default',
}: ContainerProps) {
    const maxWidth = size === 'wide' ? 'max-w-400' : 'max-w-7xl';
    return (
        <Component
            className={`mx-auto w-full ${maxWidth} px-4 sm:px-6 lg:px-8 ${className}`}
        >
            {children}
        </Component>
    );
}
