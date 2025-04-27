import { PortalProvider } from '@gorhom/portal';
import { ImageList } from 'react-native-image-gallery';

export default function App() {
  const images = [
    'https://api.dicebear.com/7.x/avataaars/png?seed=John',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Kitty',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Jane',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Peter',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Alice',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Bob',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Charlie',
    'https://api.dicebear.com/7.x/avataaars/png?seed=David',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Eve',
    'https://api.dicebear.com/7.x/avataaars/png?seed=Frank',
  ];
  return (
    <PortalProvider>
      <ImageList urls={images} />
    </PortalProvider>
  );
}
