type SVGProps = React.SVGProps<SVGSVGElement>;

export function SearchIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}
export function UserIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
export function HeartIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" {...props}>
      <path d="M12 21s-7-4.5-9.5-9.2C.8 8.4 2.9 5 6.2 5c1.9 0 3.5 1 4.3 2.3C11.3 6 12.9 5 14.8 5 18.1 5 20.2 8.4 18.5 11.8 16 16.5 12 21 12 21Z" strokeLinejoin="round" />
    </svg>
  );
}
export function CartIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" {...props}>
      <path d="M3 5h2l2.4 11a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </svg>
  );
}
export function GridIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
export function ChevronDownIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}
export function TagIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.5" />
    </svg>
  );
}
export function ArrowRightIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}
export function ShieldIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" {...props}>
      <path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6l-8-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function CheckBadgeIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" {...props}>
      <path d="M12 2 14 4l3-.5L18 6.5 20.5 8l-.5 3 2 2-2 2 .5 3-2.5 1.5-1 2.5L17 20.5l-3 .5L12 23l-2-2-3-.5-1-2.5-2.5-1 .5-3-2-2 2-2-.5-3L6.5 6 7 3.5 10 4l2-2Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function TruckIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" {...props}>
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}
export function WalletIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M16 13h3" strokeLinecap="round" />
    </svg>
  );
}
export function ReturnIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" {...props}>
      <path d="M4 12a8 8 0 1 0 2.3-5.6" strokeLinecap="round" />
      <path d="M4 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function HeadsetIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" {...props}>
      <path d="M4 15v-3a8 8 0 1 1 16 0v3" />
      <rect x="2.5" y="14" width="4.5" height="6" rx="1.5" />
      <rect x="17" y="14" width="4.5" height="6" rx="1.5" />
      <path d="M21 18v1a3 3 0 0 1-3 3h-3" strokeLinecap="round" />
    </svg>
  );
}
export function DotIcon() {
  return <span className="inline-block h-1 w-1 rounded-full bg-slate-400" />;
}
export function SparkIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2 13.5 9 20 10l-6.5 1L12 18l-1.5-7L4 10l6.5-1L12 2Z" />
    </svg>
  );
}
export function StarIcon({
  fillClass = "fill-amber-400",
  ...props
}: SVGProps & { fillClass?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={fillClass} {...props}>
      <path d="m12 2 3 7 7 .5-5.5 4.5 2 7L12 17l-6.5 4 2-7L2 9.5 9 9l3-7Z" />
    </svg>
  );
}
export function QuoteIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M7 7h4v4H9c0 3 1 4 3 4v2c-4 0-6-2-6-6V7Zm9 0h4v4h-2c0 3 1 4 3 4v2c-4 0-6-2-6-6V7Z" />
    </svg>
  );
}
export function MailIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" strokeLinejoin="round" />
    </svg>
  );
}
export function PhoneIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M4 5c0-1 1-2 2-2h2l2 5-2 1a12 12 0 0 0 7 7l1-2 5 2v2c0 1-1 2-2 2A17 17 0 0 1 4 5Z" strokeLinejoin="round" />
    </svg>
  );
}
export function PinIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M12 22s-7-7.5-7-13a7 7 0 1 1 14 0c0 5.5-7 13-7 13Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
export function FacebookIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
      <path d="M13 22v-8h3l.5-3H13V9c0-1 .3-1.5 1.8-1.5H17V5h-2.4c-2.6 0-3.6 1.5-3.6 3.5V11H8v3h3v8h2Z" />
    </svg>
  );
}
export function InstagramIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
export function YoutubeIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
      <path d="M22 8s-.2-1.5-.8-2.1c-.8-.8-1.6-.8-2-.9C16 5 12 5 12 5s-4 0-7.2.3c-.4 0-1.2 0-2 .8C2.2 6.7 2 8.2 2 8.2S2 10 2 11.8v1.4C2 15 2 16.8 2 16.8s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.7.2 7.3.3 7.3.3s4 0 7.2-.3c.4 0 1.2 0 2-.8.6-.6.8-2.1.8-2.1s0-1.8 0-3.6v-1.4C22 10 22 8 22 8ZM10 15V9l5 3-5 3Z" />
    </svg>
  );
}
export function TiktokIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
      <path d="M14 3h2.5c.2 1.6 1.4 3 3 3.3V9c-1.8 0-3.3-.6-4.5-1.6V15a5 5 0 1 1-5-5v2.5a2.5 2.5 0 1 0 2.5 2.5V3Z" />
    </svg>
  );
}
export function WhatsappIcon(props: SVGProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" {...props}>
      <path d="M20.5 3.5A11 11 0 0 0 3.2 17.3L2 22l4.9-1.2A11 11 0 1 0 20.5 3.5ZM12 20.2a9 9 0 0 1-4.6-1.3l-.3-.2-2.9.7.8-2.8-.2-.3A9.2 9.2 0 1 1 12 20.2Zm5-6.5c-.3-.1-1.7-.8-1.9-.9s-.5-.1-.7.1-.7.9-.9 1.1-.4.2-.7.1a7.3 7.3 0 0 1-3.7-3.3c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5l-.9-2.2c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.5 3.5 0 0 0-1.1 2.6c0 1.5 1.1 3 1.3 3.2a11.6 11.6 0 0 0 4.6 4c.6.3 1.1.4 1.5.5a3.6 3.6 0 0 0 1.6-.1 2.8 2.8 0 0 0 1.8-1.3 2.4 2.4 0 0 0 .1-1.3c0-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}
