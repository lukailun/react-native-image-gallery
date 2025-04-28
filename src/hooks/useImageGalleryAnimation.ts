import { useWindowDimensions } from 'react-native';
import { Easing, Keyframe } from 'react-native-reanimated';
import type Point from '../types/Point';
import type { ReanimatedKeyframe } from 'react-native-reanimated/lib/typescript/layoutReanimation/animationBuilder/Keyframe';
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_GRID_SPACING,
  DEFAULT_NUM_COLUMNS,
} from '../types/Constants';
import { useMemo } from 'react';

interface UseImageGalleryAnimationProps {
  animationDuration?: number;
  imageDimensions: { width: number; height: number };
  selectedImageCenter: Point | null;
  gridSpacing?: number;
  numColumns?: number;
  indexAlpha?: number;
  initialIndex?: number;
}

type UseImageGalleryAnimationReturn = {
  enteringAnimation: ReanimatedKeyframe;
  exitingAnimation: ReanimatedKeyframe;
};

export default function useImageGalleryAnimation({
  animationDuration,
  imageDimensions,
  selectedImageCenter,
  gridSpacing = DEFAULT_GRID_SPACING,
  numColumns = DEFAULT_NUM_COLUMNS,
  indexAlpha = 0,
  initialIndex = 0,
}: UseImageGalleryAnimationProps): UseImageGalleryAnimationReturn {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const duration = animationDuration ?? DEFAULT_ANIMATION_DURATION;
  const imageWidth = imageDimensions.width;
  const imageHeight = imageDimensions.height;
  const imageRatio = imageWidth / imageHeight;
  const windowRatio = windowWidth / windowHeight;
  const scaleX =
    imageRatio > windowRatio
      ? imageDimensions.width / windowWidth
      : imageDimensions.height / windowHeight / imageRatio;
  const scaleY =
    imageRatio > windowRatio
      ? imageDimensions.width / windowWidth / imageRatio
      : imageDimensions.height / windowHeight;

  const animations = useMemo(() => {
    // 计算目标图片在网格中的位置
    const targetIndex = Math.round(initialIndex + indexAlpha);
    const row = Math.floor(targetIndex / numColumns);
    const col = targetIndex % numColumns;

    const targetImageCenter = {
      x: col * (imageWidth + gridSpacing) + imageWidth / 2,
      y: row * (imageHeight + gridSpacing) + imageHeight / 2,
    };

    const enteringAnimation = new Keyframe({
      0: {
        transform: [
          { translateX: (selectedImageCenter?.x ?? 0) - windowWidth / 2 },
          { translateY: (selectedImageCenter?.y ?? 0) - windowHeight / 2 },
          { scaleX },
          { scaleY },
        ],
      },
      100: {
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
        easing: Easing.inOut(Easing.ease),
      },
    }).duration(duration);

    const exitingAnimation = new Keyframe({
      0: {
        transform: [
          { translateX: 0 },
          { translateY: 0 },
          { scaleX: 1 },
          { scaleY: 1 },
        ],
      },
      100: {
        transform: [
          { translateX: (targetImageCenter.x ?? 0) - windowWidth / 2 },
          { translateY: (targetImageCenter.y ?? 0) - windowHeight / 2 },
          { scaleX },
          { scaleY },
        ],
        easing: Easing.inOut(Easing.ease),
      },
    }).duration(duration);

    return {
      enteringAnimation,
      exitingAnimation,
    };
  }, [
    indexAlpha,
    initialIndex,
    numColumns,
    gridSpacing,
    imageWidth,
    imageHeight,
    selectedImageCenter,
    windowWidth,
    windowHeight,
    scaleX,
    scaleY,
    duration,
  ]);

  return animations;
}
