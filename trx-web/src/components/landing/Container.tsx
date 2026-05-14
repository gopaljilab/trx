import { MAX_W } from "./tokens";

export function Container({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`mx-auto box-border w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 ${className}`}
      style={{ maxWidth: MAX_W, ...style }}
    >
      {children}
    </div>
  );
}
