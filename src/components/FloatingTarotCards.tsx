const CDN_BASE = 'https://cdn.jsdelivr.net/gh/tarotm/78-tarot-cards@main';

interface FloatingCard {
  id: string;
  name: string;
  image: string;
  x: string;
  y: string;
  floatClass: string;
  size: number;
  rotate: number;
  opacity: number;
}

const floatingCards: FloatingCard[] = [
  { id: '0', name: '愚者', image: `${CDN_BASE}/00-TheFool.webp`, x: '8%', y: '28%', floatClass: 'float-orbit-1', size: 56, rotate: -14, opacity: 0.5 },
  { id: '17', name: '星星', image: `${CDN_BASE}/17-TheStar.webp`, x: '82%', y: '22%', floatClass: 'float-orbit-2', size: 52, rotate: 12, opacity: 0.42 },
  { id: '18', name: '月亮', image: `${CDN_BASE}/18-TheMoon.webp`, x: '4%', y: '52%', floatClass: 'float-orbit-3', size: 48, rotate: 8, opacity: 0.38 },
  { id: '19', name: '太阳', image: `${CDN_BASE}/19-TheSun.webp`, x: '88%', y: '50%', floatClass: 'float-orbit-4', size: 54, rotate: -10, opacity: 0.45 },
  { id: '8', name: '力量', image: `${CDN_BASE}/08-Strength.webp`, x: '12%', y: '78%', floatClass: 'float-orbit-5', size: 46, rotate: -6, opacity: 0.35 },
  { id: '6', name: '恋人', image: `${CDN_BASE}/06-TheLovers.webp`, x: '78%', y: '76%', floatClass: 'float-orbit-6', size: 50, rotate: 14, opacity: 0.4 },
];

export default function FloatingTarotCards() {
  return (
    <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none">
      {floatingCards.map((card) => (
        <div
          key={card.id}
          className="absolute"
          style={{
            left: card.x,
            top: card.y,
            width: card.size,
            height: card.size * 1.72,
            zIndex: 1,
          }}
        >
          <div
            className={`relative w-full h-full ${card.floatClass}`}
            style={{
              transform: `rotateZ(${card.rotate}deg)`,
              opacity: card.opacity,
            }}
          >
            <div
              className="absolute inset-0 rounded-md overflow-hidden border border-gold/10"
              style={{
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src="/images/card-back.jpg"
                alt={card.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes floatOrbit1 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(-14deg); }
          25% { transform: translateY(-14px) translateX(6px) rotate(-12.5deg); }
          50% { transform: translateY(-8px) translateX(-4px) rotate(-15deg); }
          75% { transform: translateY(-18px) translateX(3px) rotate(-13.5deg); }
        }
        @keyframes floatOrbit2 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(12deg); }
          33% { transform: translateY(-10px) translateX(-7px) rotate(13.5deg); }
          66% { transform: translateY(-16px) translateX(5px) rotate(10.5deg); }
        }
        @keyframes floatOrbit3 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(8deg); }
          20% { transform: translateY(-12px) translateX(8px) rotate(9.5deg); }
          40% { transform: translateY(-6px) translateX(-5px) rotate(6.5deg); }
          60% { transform: translateY(-20px) translateX(4px) rotate(10deg); }
          80% { transform: translateY(-10px) translateX(-3px) rotate(7deg); }
        }
        @keyframes floatOrbit4 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(-10deg); }
          30% { transform: translateY(-8px) translateX(-6px) rotate(-8.5deg); }
          60% { transform: translateY(-14px) translateX(7px) rotate(-11.5deg); }
        }
        @keyframes floatOrbit5 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(-6deg); }
          25% { transform: translateY(-16px) translateX(-4px) rotate(-4.5deg); }
          50% { transform: translateY(-10px) translateX(6px) rotate(-7deg); }
          75% { transform: translateY(-20px) translateX(-3px) rotate(-5deg); }
        }
        @keyframes floatOrbit6 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(14deg); }
          33% { transform: translateY(-12px) translateX(5px) rotate(15.5deg); }
          66% { transform: translateY(-18px) translateX(-6px) rotate(12.5deg); }
        }
        .float-orbit-1 { animation: floatOrbit1 10s ease-in-out infinite; }
        .float-orbit-2 { animation: floatOrbit2 12s ease-in-out infinite 1.5s; }
        .float-orbit-3 { animation: floatOrbit3 9s ease-in-out infinite 0.8s; }
        .float-orbit-4 { animation: floatOrbit4 11s ease-in-out infinite 2.2s; }
        .float-orbit-5 { animation: floatOrbit5 13s ease-in-out infinite 0.5s; }
        .float-orbit-6 { animation: floatOrbit6 10.5s ease-in-out infinite 3s; }
      `}</style>
    </div>
  );
}
