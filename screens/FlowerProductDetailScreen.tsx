import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import faker from "faker";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Easing,
  Dimensions,
} from "react-native";
import "react-native-gesture-handler";
import { SharedElement } from "react-navigation-shared-element";
import { RootStaskProps } from "./index";

export const FlowerProductDetailScreen = ({
  navigation,
  route,
}: StackScreenProps<RootStaskProps, "FlowerProductDetail">) => {
  const { width, height } = Dimensions.get("screen");
  const [slideY] = useState(new Animated.Value(25));
  const [opacity] = useState(new Animated.Value(0));
  const { productId, sharedProduct } = route.params;

  useEffect(() => {
    Animated.timing(slideY, {
      toValue: 0,
      duration: 1200,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [slideY]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <SharedElement
        id={`sharedProduct.${sharedProduct?.id}.imageUrl`}
        style={[StyleSheet.absoluteFillObject]}
      >
        <Animated.Image
          source={{ uri: sharedProduct?.imageUrl }}
          style={StyleSheet.absoluteFillObject}
        />
      </SharedElement>
      <View
        style={{
          width,
          padding: 26,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <Animated.Text
          style={{
            fontWeight: "800",
            fontSize: 16,
            color: "white",
            marginBottom: 20,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 1,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            opacity: opacity,
            transform: [
              {
                translateY: slideY,
              },
            ],
          }}
        >
          {faker.name.firstName()}
        </Animated.Text>
        <Animated.Text
          style={{
            fontSize: 14,
            color: "white",
            lineHeight: 14 * 1.5,
            marginBottom: 20,
            fontWeight: "600",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 1,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            opacity: opacity,
            transform: [
              {
                translateY: slideY,
              },
            ],
          }}
        >
          {faker.lorem.lines()}
        </Animated.Text>
        <TouchableOpacity
          style={{
            padding: 12,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 24,
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ fontSize: 16, color: "#333", fontWeight: "bold" }}>
            この猫を選ぶ（初回無料）
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
