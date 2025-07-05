import React from "react";
import { View, Dimensions, ScrollView, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface SwipeablePanelProps {
  children: React.ReactNode;
  initialPosition: number;
  expandedPosition: number;
  showDragIndicator?: boolean;
  backgroundColor?: string;
  className?: string;
  style?: ViewStyle;
  scrollViewProps?: any;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SwipeablePanel: React.FC<SwipeablePanelProps> = ({
  children,
  initialPosition,
  expandedPosition,
  showDragIndicator = true,
  backgroundColor = "white",
  style,
  scrollViewProps = {},
}) => {
  const translateY = useSharedValue(initialPosition);

  // build a Pan gesture with the new API
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      // nothing needed here since sharedValue holds current
    })
    .onChange((e) => {
      // clamp between expandedPosition and initialPosition
      const next = translateY.value + e.changeY;
      translateY.value = Math.min(
        initialPosition,
        Math.max(expandedPosition, next)
      );
    })
    .onFinalize((e) => {
      const mid = (initialPosition + expandedPosition) / 1.3;
      // decide snap: down if fast or past midpoint
      const shouldClose = e.velocityY > 500 || translateY.value > mid;
      translateY.value = withSpring(
        shouldClose ? initialPosition : expandedPosition,
        { damping: 16, stiffness: 120 }
      );
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: SCREEN_HEIGHT - expandedPosition,
            backgroundColor,
          },
          animatedStyle,
          style,
        ]}
      >
        {showDragIndicator && (
          <View className="items-center py-2">
            <View className="w-12 h-1 bg-gray-300 rounded-full dark:bg-gray-600" />
          </View>
        )}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
};

export default SwipeablePanel;
