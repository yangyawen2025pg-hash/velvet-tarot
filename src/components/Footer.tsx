export default function Footer() {
  return (
    <footer className="relative bg-ink py-10">
      <div className="max-w-xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-px bg-gold/40" />
          <div className="w-1.5 h-1.5 rotate-45 bg-gold/40" />
          <div className="w-12 h-px bg-gold/40" />
        </div>
        <p className="font-body text-sm text-blush/70 mb-2">
          Velvet Tarot Room ✦ 愿每一张牌都带给你温柔的力量
        </p>
        <p className="font-body text-xs text-dusty-rose/50">
          © 2025
        </p>
      </div>
    </footer>
  );
}
