import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Custom hook to handle Android back button presses.
 * @param callback - A function that returns a boolean. Return true to prevent default back action.
 */
export default function useBackHandler(callback: () => boolean) {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      callback
    );
    return () => subscription.remove();
  }, [callback]);
}
