import { useRef, type ReactElement } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  type ListRenderItemInfo,
  type StyleProp,
  type ImageStyle,
  View,
} from 'react-native';
import { useCallback } from 'react';
import Animated from 'react-native-reanimated';
import type Point from '../types/Point';

interface ImageListProps {
  urls: string[];
  gridSpacing?: number;
  numColumns?: number;
  imageRatio?: number;
}

// type ImageListProps = Omit<
//   FlatListPropsWithLayout<string>,
//   keyof Props
// > &
//   Props;

export function ImageList({
  urls,
  gridSpacing = 4,
  numColumns = 3,
  imageRatio = 1,
  //   ...flatListProps
}: ImageListProps) {
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth =
    (windowWidth - (numColumns - 1) * gridSpacing) / numColumns;
  const imageHeight = imageWidth * imageRatio;
  const imageRefs = useRef<{ [key: string]: View }>({});

  //   const ListHeaderComponent = useMemo(() => {
  //     return (
  //       <View style={styles.headerWrapper}>
  //         <View
  //           style={[styles.headerContainer, { top: -navigationBarHeight }]}
  //           onLayout={(event: LayoutChangeEvent) => {
  //             setHeaderLayout({
  //               ...event.nativeEvent.layout,
  //               height: event.nativeEvent.layout.height + navigationBarHeight,
  //             });
  //           }}
  //         >
  //           <Animated.View
  //             style={parallax ? headerBackgroundAnimatedStyle : undefined}
  //           >
  //             <HeaderBackground />
  //           </Animated.View>
  //           {HeaderContent && (
  //             <Animated.View
  //               style={[
  //                 headerContentAnimatedStyle,
  //                 styles.headerContentContainer,
  //               ]}
  //             >
  //               <HeaderContent />
  //             </Animated.View>
  //           )}
  //           {navigationBarColor && (
  //             <Animated.View
  //               style={[
  //                 navigationBarAnimatedStyle,
  //                 styles.animatedNavigationBar,
  //                 { backgroundColor: navigationBarColor },
  //               ]}
  //             />
  //           )}
  //           <Animated.Text
  //             onLayout={(event: LayoutChangeEvent) => {
  //               setHeaderTitleLayout(event.nativeEvent.layout);
  //             }}
  //             numberOfLines={1}
  //             style={[
  //               headerTitleAnimatedStyle,
  //               styles.headerTitle,
  //               headerTitleStyle,
  //             ]}
  //           >
  //             {title}
  //           </Animated.Text>
  //         </View>
  //       </View>
  //     );
  //   }, [
  //     navigationBarHeight,
  //     parallax,
  //     headerBackgroundAnimatedStyle,
  //     HeaderBackground,
  //     HeaderContent,
  //     headerContentAnimatedStyle,
  //     headerTitleAnimatedStyle,
  //     headerTitleStyle,
  //     title,
  //     setHeaderLayout,
  //     setHeaderTitleLayout,
  //     navigationBarAnimatedStyle,
  //     navigationBarColor,
  //   ]);

  //   type CustomItem = typeof HEADER_ITEM | T;

  const selectedImageCenter = useRef<Point | null>(null);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>): ReactElement | null => {
      const imageStyle: StyleProp<ImageStyle> = {
        width: imageWidth,
        height: imageHeight,
      };
      return (
        <Pressable
          ref={(ref) => {
            if (ref) {
              imageRefs.current[item] = ref;
            }
          }}
          style={imageStyle}
          onPress={() => {
            const imageRef = imageRefs.current[item];
            if (!imageRef) return;
            imageRef.measure((width, height, pageX, pageY) => {
              const itemCenterX = pageX + width / 2;
              const itemCenterY = pageY + height / 2;
              selectedImageCenter.current = { x: itemCenterX, y: itemCenterY };
              //   updateGalleryImageUrl(item.meta.url)
            });
          }}
        >
          <Animated.Image source={{ uri: item }} style={imageStyle} />
        </Pressable>
      );
    },
    [
      imageWidth,
      imageHeight,
      //   flatListProps,
    ]
  );

  return (
    <Animated.FlatList
      style={styles.flatList}
      numColumns={numColumns}
      columnWrapperStyle={{ gap: gridSpacing }}
      contentContainerStyle={{ gap: gridSpacing }}
      // {...flatListProps}
      data={urls}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    width: '100%',
    height: '100%',
  },
  columnWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
