import { Portal } from '@gorhom/portal';
import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Gallery from 'react-native-awesome-gallery';
import Animated, {
  type EntryAnimationsValues,
  withTiming,
} from 'react-native-reanimated';
import type Point from '../types/Point';

import useBackHandler from '../hooks/useBackHandler';

type ImageURI = string | undefined;

interface ImageGalleryProps {
  images: ImageURI[];
  totalCount: number;
  selectedImageCenter: Point | null;
  currentImageUrl: string;
  visible: boolean;
  onClose?: () => void | undefined;
  onEndReached?: () => void | undefined;
  imageDimensions: { width: number; height: number };
  animationDuration?: number;
  onIndexChange?: (index: number) => void | undefined;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  selectedImageCenter,
  currentImageUrl,
  visible,
  onClose,
  onEndReached,
  imageDimensions,
  animationDuration,
  onIndexChange,
}) => {
  const initialIndex = Math.max(images.indexOf(currentImageUrl), 0);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const entering = (targetValues: EntryAnimationsValues) => {
    'worklet';
    const duration = animationDuration ?? 750;
    const animations = {
      originX: withTiming(targetValues.targetOriginX, { duration }),
      originY: withTiming(targetValues.targetOriginY, { duration }),
      opacity: withTiming(1, { duration }),
      transform: [
        { scaleX: withTiming(1, { duration }) },
        { scaleY: withTiming(1, { duration }) },
      ],
    };
    const imageRatio = imageDimensions.width / imageDimensions.height;
    const windowRatio = windowWidth / windowHeight;
    const scaleX =
      imageRatio > windowRatio
        ? imageDimensions.width / windowWidth
        : imageDimensions.height / windowHeight / imageRatio;
    const scaleY =
      imageRatio > windowRatio
        ? imageDimensions.width / windowWidth / imageRatio
        : imageDimensions.height / windowHeight;
    const initialValues = {
      originX: (selectedImageCenter?.x ?? 0) - windowWidth / 2,
      originY: (selectedImageCenter?.y ?? 0) - windowHeight / 2,
      opacity: 0,
      transform: [{ scaleX }, { scaleY }],
    };
    return {
      initialValues,
      animations,
    };
  };

  useBackHandler(() => {
    visible && onClose?.();
    return true;
  });

  if (!visible || !images.length) {
    return null;
  }
  return (
    <Portal>
      <Pressable style={styles.container} onPress={onClose}>
        <Gallery
          data={images}
          initialIndex={initialIndex}
          onIndexChange={(index) => {
            onIndexChange?.(index);
            if (index === images.length - 1) {
              onEndReached?.();
            }
          }}
          emptySpaceWidth={0}
          doubleTapInterval={1000}
          renderItem={({ item, setImageDimensions }) => {
            return (
              <Animated.View
                style={StyleSheet.absoluteFill}
                entering={item === currentImageUrl ? entering : undefined}
              >
                <Animated.Image
                  source={{ uri: item }}
                  style={styles.image}
                  resizeMode="contain"
                  onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout;
                    setImageDimensions({ width, height });
                  }}
                />
              </Animated.View>
            );
          }}
          onTap={onClose}
          onSwipeToClose={onClose}
          style={styles.gallery}
        />
      </Pressable>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gallery: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageGallery;
