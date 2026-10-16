import './Logo.css'

type LogoProps = {
    size?: number
}

function Logo({ size = 30 }: LogoProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
            <rect className="logo-tile" width="32" height="32" rx="8" />
            <path className="logo-m" d="M9.5 22.5V9.5M22.5 22.5V9.5" strokeWidth="2.6" strokeLinecap="round" />
            <path className="logo-v" d="M9.5 9.5L16 16.5L22.5 9.5" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default Logo