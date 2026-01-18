import React from "react";

interface KetoIconProps {
    size?: number;
    className?: string;
}

export default function KetoIcon({ size = 24, className }: KetoIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M22 7a4.95 4.95 0 0 0-8.6-3.4c-1.5 1.6-1.6 1.8-5 2.6a8 8 0 1 0 9.4 9.5c.7-3.4 1-3.6 2.6-5c1-1 1.6-2.3 1.6-3.7" />
                <circle cx="10" cy="14" r="3.5" />
            </g>
        </svg>
    );
}
