import { Portal } from '@gorhom/portal';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Gallery from 'react-native-awesome-gallery';
import Animated from 'react-native-reanimated';
import type Point from '../types/Point';

import useBackHandler from '../hooks/useBackHandler';
import useImageGalleryAnimation from '../hooks/useImageGalleryAnimation';
import { DEFAULT_GRID_SPACING, DEFAULT_NUM_COLUMNS } from '../types/Constants';

type ImageURI = string | undefined;

interface ImageGalleryProps {
  images: ImageURI[];
  totalCount: number;
  selectedImageCenter: Point | null;
  currentImageUrl: string | undefined;
  visible: boolean;
  onClose?: () => void | undefined;
  onEndReached?: () => void | undefined;
  imageDimensions: { width: number; height: number };
  animationDuration?: number;
  gridSpacing?: number;
  numColumns?: number;
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
  gridSpacing = DEFAULT_GRID_SPACING,
  numColumns = DEFAULT_NUM_COLUMNS,
  onIndexChange,
}) => {
  const initialIndex = Math.max(images.indexOf(currentImageUrl), 0);
  const [indexAlpha, setIndexAlpha] = useState(0);

  const { enteringAnimation, exitingAnimation } = useImageGalleryAnimation({
    animationDuration,
    imageDimensions,
    selectedImageCenter,
    gridSpacing,
    numColumns,
    indexAlpha,
    initialIndex,
  });

  useBackHandler(() => {
    visible && onClose?.();
    return true;
  });

  if (!visible || !images.length) {
    return null;
  }

  return (
    <Portal>
      <Gallery
        data={images}
        initialIndex={initialIndex}
        onIndexChange={(index) => {
          setIndexAlpha(index - initialIndex);
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
              style={StyleSheet.absoluteFillObject}
              entering={enteringAnimation}
              exiting={exitingAnimation}
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
