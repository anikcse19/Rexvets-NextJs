// global.d.ts or types.d.ts

declare module "*.mp4" {
  const src: string;
  export default src;
}

// Tawk.to API declarations
declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void;
      showWidget: () => void;
      setAttributes: (attributes: any) => void;
      addEvent: (event: string, callback: () => void) => void;
      [key: string]: any;
    };
  }
}

export {};