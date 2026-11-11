import type { PhotoItem, PhotoOrientation } from '../types/dashboard';

export const classifyAspectRatio = (width: number, height: number): { ratio: number; orientation: PhotoOrientation } => {
  const ratio = width / (height || 1);
  if (ratio >= 1.6) {
    return { ratio, orientation: 'landscape' };
  } else if (ratio >= 1.2) {
    return { ratio, orientation: 'standard' };
  } else {
    return { ratio, orientation: 'portrait' };
  }
};

// Curated showcase demonstration images covering landscape, squarish, and portrait
export const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    title: 'Yosemite Valley Reflections',
    location: 'California, USA',
    aspectRatio: 1.77,
    orientation: 'landscape',
    credit: 'Bailey Zindel (Unsplash)',
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=85',
    title: 'Starry Alpine Peaks',
    location: 'Swiss Alps',
    aspectRatio: 1.78,
    orientation: 'landscape',
    credit: 'Benjamin Voros (Unsplash)',
  },
  {
    id: 'photo-3',
    // Portrait photo (aspect ratio ~ 0.67) - triggers dual-blur wings & UI Widget Shift!
    url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=85',
    title: 'Autumn in Kyoto Pagoda',
    location: 'Kyoto, Japan',
    aspectRatio: 0.67,
    orientation: 'portrait',
    credit: 'Su San Lee (Unsplash)',
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=85',
    title: 'Misty Redwood Forest',
    location: 'Pacific Northwest',
    aspectRatio: 1.65,
    orientation: 'landscape',
    credit: 'Luca Bravo (Unsplash)',
  },
  {
    id: 'photo-5',
    // Standard / squarish photo (aspect ratio ~ 1.33)
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
    title: 'Bamboo Forest Sanctuary',
    location: 'Arashiyama, Japan',
    aspectRatio: 1.33,
    orientation: 'standard',
    credit: 'Manuel Cosentino (Unsplash)',
  },
  {
    id: 'photo-6',
    // Striking vertical portrait photo (aspect ratio ~ 0.66)
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85',
    title: 'Dolomites Pinnacle Mist',
    location: 'South Tyrol, Italy',
    aspectRatio: 0.66,
    orientation: 'portrait',
    credit: 'Kalen Emsley (Unsplash)',
  },
];

export class PhotoService {
  private photos: PhotoItem[] = DEFAULT_PHOTOS;
  private currentIndex: number = 0;
  private preloadedImages: Map<string, HTMLImageElement> = new Map();
  private source: 'local' | 'custom' | 'showcase' = 'showcase';

  constructor() {
    this.initPhotos();
  }

  public async initPhotos(): Promise<PhotoItem[]> {
    // 1. Check if user configured custom photos in localStorage
    try {
      const stored = localStorage.getItem('dashboard_custom_photos');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.photos = parsed;
          this.source = 'custom';
          this.preloadUpcoming(0);
          return this.photos;
        }
      }
    } catch (e) {
      console.error('Error loading custom photos', e);
    }

    // 2. Check local photo directory via /api/photos
    try {
      const res = await fetch('/api/photos');
      if (res.ok) {
        const localList: PhotoItem[] = await res.json();
        if (Array.isArray(localList) && localList.length > 0) {
          this.photos = localList;
          this.source = 'local';
          this.preloadUpcoming(0);
          return this.photos;
        }
      }
    } catch (e) {
      // /api/photos unavailable or empty
    }

    // 3. Fallback to curated showcase photos
    this.photos = DEFAULT_PHOTOS;
    this.source = 'showcase';
    this.preloadUpcoming(0);
    this.preloadUpcoming(1);
    return this.photos;
  }

  public getSource(): 'local' | 'custom' | 'showcase' {
    return this.source;
  }

  public saveCustomPhotos(photos: PhotoItem[]): void {
    this.photos = photos;
    this.source = 'custom';
    localStorage.setItem('dashboard_custom_photos', JSON.stringify(photos));
    this.currentIndex = 0;
    this.preloadUpcoming(0);
  }

  public resetToShowcase(): void {
    localStorage.removeItem('dashboard_custom_photos');
    this.photos = DEFAULT_PHOTOS;
    this.source = 'showcase';
    this.currentIndex = 0;
    this.preloadUpcoming(0);
  }

  public getPhotos(): PhotoItem[] {
    return this.photos;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getCurrentPhoto(): PhotoItem {
    return this.photos[this.currentIndex] || this.photos[0];
  }

  public getNextPhoto(): PhotoItem {
    const nextIdx = (this.currentIndex + 1) % this.photos.length;
    return this.photos[nextIdx];
  }

  public advance(): PhotoItem {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.preloadUpcoming((this.currentIndex + 1) % this.photos.length);
    return this.getCurrentPhoto();
  }

  public goToIndex(index: number): PhotoItem {
    this.currentIndex = (index + this.photos.length) % this.photos.length;
    this.preloadUpcoming((this.currentIndex + 1) % this.photos.length);
    return this.getCurrentPhoto();
  }

  public preloadUpcoming(targetIndex: number): void {
    const nextPhoto = this.photos[targetIndex];
    if (!nextPhoto || this.preloadedImages.has(nextPhoto.url)) return;

    const img = new Image();
    img.src = nextPhoto.url;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        const { ratio, orientation } = classifyAspectRatio(img.naturalWidth, img.naturalHeight);
        nextPhoto.aspectRatio = ratio;
        nextPhoto.orientation = orientation;
      }
    };
    this.preloadedImages.set(nextPhoto.url, img);
  }
}

export const photoService = new PhotoService();
