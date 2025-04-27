import React, { type ReactElement } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  type ListRenderItemInfo,
  type StyleProp,
  type ImageStyle,
} from 'react-native';
import { useCallback } from 'react';
import Animated from 'react-native-reanimated';

interface ImageListProps {
  urls: string[];
  gridSpacing?: number;
  columnCount?: number;
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
  columnCount = 3,
  imageRatio = 1,
  //   ...flatListProps
}: ImageListProps) {
  const { width: windowWidth } = useWindowDimensions();
  const imageWidth =
    (windowWidth - (columnCount - 1) * gridSpacing) / columnCount;
  const imageHeight = imageWidth * imageRatio;

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

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>): ReactElement | null => {
      const imageStyle: StyleProp<ImageStyle> = {
        width: imageWidth,
        height: imageHeight,
      };
      return (
        <Pressable
          // ref={(ref) => {
          //   if (ref) {
          //     // imageRefs.current[item.id] = ref
          //   }
          // }}
          // className="flex-1 justify-center items-center"
          style={imageStyle}
          onPress={() => {
            //   const imageRef = imageRefs.current[item.id]
            //   if (imageRef) {
            //     imageRef.measure((x, y, width, height, pageX, pageY) => {
            //       const itemCenterX = pageX + width / 2
            //       const itemCenterY = pageY + height / 2
            //       displayImageCenter.current = { x: itemCenterX, y: itemCenterY }
            //       updateGalleryImageUrl(item.meta.url)
            //     })
            //   }
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
    <>
      <Animated.FlatList
        style={styles.flatList}
        // {...flatListProps}
        data={urls}
        renderItem={renderItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatList: {
    width: '100%',
    height: '100%',
  },
});
