import { StackScreenProps } from "@react-navigation/stack";
import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  Image,
  ScrollView,
  SectionList,
} from "react-native";
import "react-native-gesture-handler";
import { RootStaskProps } from "./index";
import { SharedElement } from "react-navigation-shared-element";
import { fetchImagesFromPixels, ImageSource } from "../states/fetchImages";
import faker from "faker";
import _ from "lodash";
import { DateTime } from "luxon";
// FlatListで最初と最後の要素が真ん中になるために必要な両サイドのパディングを計算する
const calcSidePadding = (screenWidth: number, itemWidth: number) => {
  return (screenWidth - itemWidth) / 2;
};

const { width, height } = Dimensions.get("screen");
const IMAGE_WIDTH = 240;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.5;
const SPACING = 20;
const SIDE_SPACING = calcSidePadding(width, IMAGE_WIDTH);

type Order = {
  id: string;
  month: Date;
  imageUrl: string;
};

export const HomeScreen = ({
  navigation,
  route,
}: StackScreenProps<RootStaskProps, "Home">) => {
  const [images, setImages] = useState<ImageSource[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [offsetX, setOffsetX] = useState(0);
  const [contentW, setContentW] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      setImages(await fetchImagesFromPixels(3));
      setOrders(
        (await fetchImagesFromPixels(40)).map((item) => ({
          id: item.id.toString(),
          imageUrl: item.src.portrait,
          month: faker.date.past(),
        }))
      );
    };
    fetchImages();
  }, []);

  const groupedOrders = () => {
    const grouped = _.groupBy(orders, (order) =>
      DateTime.fromJSDate(order.month).startOf("month").toISO()
    );
    return _.sortBy(Object.entries(grouped), (item) => item[0]);
  };

  return (
    <ScrollView
      style={[
        StyleSheet.absoluteFill,
        {
          flex: 1,
        },
      ]}
    >
      <View
        style={{
          padding: SPACING,
          marginTop: 50,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
            letterSpacing: 2.5,
            color: "#333",
          }}
        >
          最初の猫を選ぼう
        </Text>
      </View>

      <Animated.FlatList
        onScrollEndDrag={(ev) => {
          setOffsetX(ev.nativeEvent.contentOffset.x);
        }}
        onMomentumScrollEnd={(ev) => {
          setOffsetX(ev.nativeEvent.contentOffset.x);
        }}
        onContentSizeChange={(contentWidth: number) => {
          setContentW(contentWidth);
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
        data={images}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        snapToOffsets={images.map(
          (item, index) => (SPACING + IMAGE_WIDTH) * index
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SIDE_SPACING,
          paddingVertical: 40,
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (SPACING + IMAGE_WIDTH),
            index * IMAGE_WIDTH,
            (index + 1) * (SPACING + IMAGE_WIDTH),
          ];

          const scale = scrollX.interpolate({
            inputRange: inputRange,
            outputRange: [0.9, 1.1, 0.9],
          });

          return (
            <Animated.View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: IMAGE_WIDTH,
                height: IMAGE_HEIGHT,
                marginHorizontal: SPACING / 2,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 12,
              }}
            >
              <TouchableOpacity
                style={[StyleSheet.absoluteFillObject]}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate("FlowerProductDetail", {
                    productId: item.id.toString(),
                    sharedProduct: {
                      id: item.id.toString(),
                      imageUrl: item.src.portrait,
                    },
                  });
                }}
              >
                <SharedElement
                  id={`sharedProduct.${item.id}.imageUrl`}
                  style={[StyleSheet.absoluteFillObject]}
                >
                  <Animated.Image
                    source={{ uri: item.src.portrait }}
                    style={[
                      StyleSheet.absoluteFillObject,
                      {
                        transform: [{ scale }],
                        borderRadius: 12,
                        resizeMode: "cover",
                      },
                    ]}
                  />
                </SharedElement>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />

      <FlatList
        data={groupedOrders().reverse()}
        style={{ width: width, backgroundColor: "#EEE" }}
        keyExtractor={(item, index) => `calender.${index}`}
        contentContainerStyle={{ padding: 20 }}
        renderItem={(item) => {
          const month = DateTime.fromISO(item.item[0]);
          const items = item.item[1];
          return (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                // alignItems: "stretch",
                alignContent: "space-between",
                paddingBottom: 20,
              }}
            >
              <View
                style={{
                  flexGrow: 1,
                  marginRight: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#999",
                    textAlign: "center",
                  }}
                >
                  {month.toFormat("yyyy")}
                </Text>
                <Text
                  style={{
                    fontSize: 26,
                    color: "#333",
                    fontWeight: "800",
                    textAlign: "center",
                  }}
                >
                  {month.toFormat("L")}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#333",
                    textAlign: "center",
                  }}
                >
                  {month.toFormat("LLL")}
                </Text>
              </View>
              <View style={[{ flexGrow: 5 }]}>
                {_.chunk(items, 2).map((chunk) => {
                  return (
                    <View
                      style={[
                        {
                          flex: 1,
                          marginBottom: 10,
                          minHeight: 180,
                          flexDirection: "row",
                        },
                      ]}
                    >
                      {chunk.map((order, index) => {
                        return (
                          <Image
                            style={{
                              flexGrow: 1,
                              resizeMode: "cover",
                              borderRadius: 10,
                              marginRight:
                                index == 0 && chunk.length == 2 ? 10 : 0,
                            }}
                            source={{ uri: order.imageUrl }}
                          />
                        );
                      })}
                    </View>
                  );
                })}
                {/* {items.map((order, index) => {
                  return (
                    <View
                      style={{
                        marginBottom: 20,
                        // marginRight: index % 2 == 0 ? 20 : 0,
                      }}
                      key={`calendar.order.${order.id}`}
                    >
                      <Image
                        style={[
                          {
                            minWidth: 120,
                            minHeight: 160,
                            resizeMode: "cover",
                            borderRadius: 10,
                          },
                        ]}
                        source={{ uri: order.imageUrl }}
                      />
                    </View>
                  );
                })} */}
              </View>
            </View>
          );
        }}
      />
    </ScrollView>
  );
};
