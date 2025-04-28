import { useRef, type ReactElement } from 'react';
import {
  Pressable,
  useWindowDimensions,
  type ListRenderItemInfo,
  type StyleProp,
  type ImageStyle,
  View,
  StatusBar,
} from 'react-native';
import { useCallback } from 'react';
import Animated from 'react-native-reanimated';
import type Point from '../types/Point';
import ImageGallery from './ImageGallery';
import useImageGallery from '../hooks/useImageGallery';

interface ImageListProps {
  urls: string[];
  gridSpacing?: number;
  numColumns?: number;
  imageRatio?: number;
  animationDuration?: number;
}

export function ImageList({
  urls,
  gridSpacing = 4,
  numColumns = 3,
  imageRatio = 1,
  animationDuration = 500,
}: ImageListProps) {
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth =
    (windowWidth - (numColumns - 1) * gridSpacing) / numColumns;
  const imageHeight = imageWidth * imageRatio;
  const imageRefs = useRef<{ [key: string]: View }>({});
  const selectedImageCenter = useRef<Point | null>(null);
  const { visible, imageUrl, setImageUrl, dismiss } = useImageGallery();

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>): ReactElement | null => {
      const imageStyle: StyleProp<ImageStyle> = {
        width: imageWidth,
        height: imageHeight,
      };
      return (
        <Pressable
          ref={(ref) => {
            if (!ref) return;
            imageRefs.current[item] = ref;
          }}
          style={imageStyle}
          onPress={() => {
            const imageRef = imageRefs.current[item];
            if (!imageRef) return;
            imageRef.measureInWindow((x, y, width, height) => {
              const itemCenterX = x + width / 2;
              const itemCenterY = y + height / 2;
              selectedImageCenter.current = { x: itemCenterX, y: itemCenterY };
              setImageUrl(item);
            });
          }}
        >
          <Animated.Image
            key={item}
            source={{ uri: item }}
            style={imageStyle}
          />
        </Pressable>
      );
    },
    [imageWidth, imageHeight, imageRefs, setImageUrl]
  );

  return (
    <>
      <StatusBar hidden={visible} animated />
      <Animated.FlatList
        keyExtractor={(item) => item}
        numColumns={numColumns}
        columnWrapperStyle={{ gap: gridSpacing }}
        contentContainerStyle={{ gap: gridSpacing }}
        data={urls}
        renderItem={renderItem}
      />
      <ImageGallery
        images={urls}
        totalCount={urls.length}
        selectedImageCenter={selectedImageCenter.current}
        currentImageUrl={imageUrl}
        visible={visible}
        onClose={() => {
          dismiss();
          selectedImageCenter.current = null;
        }}
        onEndReached={() => {}}
        imageDimensions={{ width: imageWidth, height: imageHeight }}
        animationDuration={animationDuration}
      />
    </>
  );
}
