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
  exiting: EntryExitAnimationFunction;
};

export default function useImageGalleryAnimation({
  animationDuration,
  imageDimensions,
  selectedImageCenter,
}: UseImageGalleryAnimationProps): UseImageGalleryAnimationReturn {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const duration = animationDuration ?? 750;
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

  const entering: EntryExitAnimationFunction = (
    targetValues: EntryAnimationsValues
  ) => {
    'worklet';
    const animations = {
      originX: withTiming(targetValues.targetOriginX, { duration }),
      originY: withTiming(targetValues.targetOriginY, { duration }),
      transform: [
        { scaleX: withTiming(1, { duration }) },
        { scaleY: withTiming(1, { duration }) },
      ],
    };
    const initialValues = {
      originX: (selectedImageCenter?.x ?? 0) - windowWidth / 2,
      originY: (selectedImageCenter?.y ?? 0) - windowHeight / 2,
      transform: [{ scaleX }, { scaleY }],
    };
    return {
      initialValues,
      animations,
    };
  };

  const exiting: EntryExitAnimationFunction = (
    targetValues: EntryAnimationsValues
  ) => {
    'worklet';
    const animations = {
      originX: withTiming((selectedImageCenter?.x ?? 0) - windowWidth / 2, {
        duration,
      }),
      originY: withTiming((selectedImageCenter?.y ?? 0) - windowHeight / 2, {
        duration,
      }),
      transform: [
        { scaleX: withTiming(scaleX, { duration }) },
        { scaleY: withTiming(scaleY, { duration }) },
      ],
    };
    const initialValues = {
      originX: targetValues.targetOriginX,
      originY: targetValues.targetOriginY,
      transform: [{ scaleX: 1 }, { scaleY: 1 }],
    };
    return {
      initialValues,
      animations,
    };
  };

  return {
    entering,
    exiting,
  };
}
