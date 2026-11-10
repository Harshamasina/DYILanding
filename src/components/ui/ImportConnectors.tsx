'use client';

import { motion } from 'framer-motion';

/* The ruled line the import steps sit on: across the top on desktop, down
   the left edge on phones. It draws once when it scrolls into view. */
export function ImportConnectors() {
    return (
        <>
            <motion.span
                aria-hidden="true"
                className="absolute top-0 right-0 left-0 hidden h-px origin-left bg-primary/30 lg:block"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            />
            <motion.span
                aria-hidden="true"
                className="absolute top-2 bottom-2 left-[4.5px] w-px origin-top bg-primary/30 lg:hidden"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            />
        </>
    );
}
