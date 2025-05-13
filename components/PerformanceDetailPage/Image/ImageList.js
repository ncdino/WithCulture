import { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { Image } from "expo-image";
export default function ImageList({ images }) {
  const [imageSizes, setImageSizes] = useState({});

  useEffect(() => {
    const fetchImageSize = async () => {
      const sizes = {};

      for (const uri of images) {
        try {
          const { width, height } = await Image.getSizeAsync(uri);
          sizes[uri] = { width, height };
        } catch (e) {
          console.error("fetch error: ", e);
          sizes[uri] = { width: 300, height: 200 };
        }
      }
      setImageSizes(sizes);
    };
    fetchImageSize();
  }, [images]);

  return (
    <FlatList
      data={images}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View>
          <Image
            source={{ uri: item }}
            style={{
              width: imageSizes[item]?.width || 300,
              height: imageSizes[item]?.height || 200,
            }}
            contentFit="contain"
          />
          <Text style={styles.imageText}>
            {imageSizes[item]
              ? `Size: ${imageSizes[item].width} x ${imageSizes[item].height}`
              : "Loading..."}
          </Text>
        </View>
      )}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    marginVertical: 10,
    alignItems: "center",
  },
  imageText: {
    marginTop: 5,
    fontSize: 12,
    color: "#555",
  },
});
