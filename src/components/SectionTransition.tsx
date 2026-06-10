interface SectionTransitionProps {
  fromColor: string;
  toColor: string;
  height?: string;
}

export default function SectionTransition({ fromColor, toColor, height = '120px' }: SectionTransitionProps) {
  return (
    <div
      className="relative w-full pointer-events-none"
      style={{ height, marginTop: `-${height}`, zIndex: 5 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
        }}
      />
    </div>
  );
}

// 底部渐淡效果
export function SectionFadeOut({ color = 'transparent', height = '80px' }: { color?: string; height?: string }) {
  return (
    <div
      className="relative w-full pointer-events-none"
      style={{ height, marginBottom: `-${height}`, zIndex: 5 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent, ${color})`,
        }}
      />
    </div>
  );
}
