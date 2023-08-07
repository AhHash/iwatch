import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { HeaderButtonsProvider, Item } from "react-navigation-header-buttons";
import { preventAutoHideAsync, hideAsync } from "expo-splash-screen";

import CategoriesScreen from "./screens/CategoriesScreen";
import AllCommitmentsScreen from "./screens/AllCommitmentsScreen";
import CurrentCommitmentsScreen from "./screens/CurrentCommitmentsScreen";
import CommitmentScreen from "./screens/CommitmentScreen";
import ManageScreen from "./screens/ManageScreen";
import { useDispatch } from "react-redux";
import { store } from "./store";
import { init, initializeBaseCategories, reset } from "./db";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLayoutEffect } from "react";
import { getAllCategories } from "./features/categories/categoriesthunk";
import { getAllCommitments } from "./features/commitments/commitmentsThunk";
import HeaderAddButton from "./components/ui/HeaderAddButton";
import CategoryScreen from "./screens/CategoryScreen";
import FetchCommitmentsOverlay from "./screens/FetchCommitmentsOverlay";
import NotificationHandler from "./components/NotificationHandler";

preventAutoHideAsync();

const initializeDatabase = async () => {
  await init();
};

const BottomTabs = createBottomTabNavigator();

const TabsNavigator = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerRight: HeaderAddButton,
      }}
    >
      <BottomTabs.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: "Categories",
          tabBarIcon: ({ size, color }) => {
            return (
              <Ionicons
                name="file-tray-full-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <BottomTabs.Screen
        name="CurrentlyCommitments"
        component={CurrentCommitmentsScreen}
        options={{
          title: "Currently Watching",
          tabBarIcon: ({ size, color }) => {
            return <Ionicons name="home-outline" size={size} color={color} />;
          },
        }}
      />
      <BottomTabs.Screen
        name="AllCommitments"
        component={AllCommitmentsScreen}
        options={{
          title: "All Commitments",
          tabBarIcon: ({ size, color }) => {
            return <Ionicons name="time-outline" size={size} color={color} />;
          },
        }}
      />
    </BottomTabs.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const Root = () => {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    initializeDatabase().then(() => {
      dispatch(getAllCategories());
      dispatch(getAllCommitments());
      hideAsync();
    });
  }, []);

  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar />
      <NotificationHandler />
      <HeaderButtonsProvider stackType="native">
        <Stack.Navigator initialRouteName="Tabs">
          <Stack.Screen
            name="Tabs"
            component={TabsNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Manage" component={ManageScreen} />
          <Stack.Screen name="Commitment" component={CommitmentScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen
            name="Fetch"
            component={FetchCommitmentsOverlay}
            options={({ navigation: { goBack } }) => ({
              presentation: "modal",
              title: "Search",
              headerLeft: () => (
                <Item
                  iconName="arrow-back"
                  iconSize={28}
                  IconComponent={Ionicons}
                  onPress={goBack}
                />
              ),
            })}
          />
        </Stack.Navigator>
      </HeaderButtonsProvider>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
