import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { HomeScreen } from "./HomeScreen";
import { FlowerProductDetailScreen } from "./FlowerProductDetailScreen";

export type RootStaskProps = {
  Home: undefined;
  FlowerProductDetail: {
    productId: string;
    sharedProduct?: { id: string; imageUrl: string };
  };
};

const Stack = createSharedElementStackNavigator<RootStaskProps>();

export const RootNavigator = () => {
  return (
    <NavigationContainer
      theme={Object.assign(DefaultTheme, {
        colors: { background: "transparent" },
      })}
    >
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="FlowerProductDetail"
          component={FlowerProductDetailScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
          initialParams={{ sharedProduct: { id: "0", imageUrl: "undefined" } }}
          sharedElementsConfig={(route, otherRoute, showing) => {
            const { sharedProduct } = route.params;
            return [
              {
                id: `sharedProduct.${sharedProduct.id}.imageUrl`,
              },
            ];
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
