import type { ComponentType } from 'react';

export interface CircularGalleryItem {
  image: string;
  text: string;
}

export interface CircularGalleryProps {
  items?: CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollEase?: number;
  font?: string;
}

declare const CircularGallery: ComponentType<CircularGalleryProps>;
export default CircularGallery;
