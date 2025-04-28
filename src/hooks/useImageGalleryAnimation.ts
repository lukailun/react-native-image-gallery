import { useWindowDimensions } from 'react-native';
import {
  type EntryAnimationsValues,
  withTiming,
  type EntryExitAnimationFunction,
} from 'react-native-reanimated';
import type Point from '../types/Point';

interface UseImageGalleryAnimationProps {
  animationDuration?: number;
  imageDimensions: { width: number; height: number };
  selectedImageCenter: Point | null;
}

type UseImageGalleryAnimationReturn = {
  entering: EntryExitAnimationFunction;
};

export default function useImageGalleryAnimation({
  animationDuration,
  imageDimensions,
  selectedImageCenter,
}: UseImageGalleryAnimationProps): UseImageGalleryAnimationReturn {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const entering: EntryExitAnimationFunction = (
    targetValues: EntryAnimationsValues
  ) => {
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

  return {
    entering,
  };
}
