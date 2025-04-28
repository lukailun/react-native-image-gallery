import { useWindowDimensions } from 'react-native';
import { Easing, Keyframe } from 'react-native-reanimated';
import type Point from '../types/Point';
import type { ReanimatedKeyframe } from 'react-native-reanimated/lib/typescript/layoutReanimation/animationBuilder/Keyframe';

interface UseImageGalleryAnimationProps {
  animationDuration?: number;
  imageDimensions: { width: number; height: number };
  selectedImageCenter: Point | null;
}

type UseImageGalleryAnimationReturn = {
  enteringAnimation: ReanimatedKeyframe;
};

export default function useImageGalleryAnimation({
  animationDuration,
  imageDimensions,
  selectedImageCenter,
}: UseImageGalleryAnimationProps): UseImageGalleryAnimationReturn {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const duration = animationDuration ?? 500;
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

  return {
    enteringAnimation,
  };
}
