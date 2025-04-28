import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

/** The hook return type. */
type UseImageGalleryReturn = {
  /** Whether the gallery is visible. */
  visible: boolean;
  /** The currently displayed image url. */
  imageUrl?: string;
  /** Function to set initial image url to the gallery. */
  setImageUrl: Dispatch<SetStateAction<string | undefined>>;
  /** Function to dismiss the gallery. */
  dismiss: () => void;
};

export default function useImageGallery(
  initialImageUrl?: string
): UseImageGalleryReturn {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [visible, setVisible] = useState(initialImageUrl !== undefined);

  useEffect(() => {
    setVisible(imageUrl !== undefined);
  }, [imageUrl]);

  const dismiss = useCallback(() => {
    setImageUrl(undefined);
  }, [setImageUrl]);

  return {
    visible,
    imageUrl,
    setImageUrl,
    dismiss,
  };
}
