import { ImageList } from 'react-native-image-gallery';

export default function App() {
  const images = [
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
  ];
  return <ImageList urls={images} />;
}
