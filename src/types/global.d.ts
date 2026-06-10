declare global {
  interface Window {
    particleBurst?: (x: number, y: number, count?: number) => void;
  }
}

export {};
