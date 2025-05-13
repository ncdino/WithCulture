import React from "react";
import { View, Image, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const ImageSlider = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <View>
      <Carousel
        loop
        width={width}
        height={400}
        autoPlay
        scrollAnimationDuration={2000}
        data={images}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
            resizeMode="contain"
          />
        )}
      />
    </View>
  );
};

export default ImageSlider;
