import {
  HiddenItem,
  Item,
  OverflowMenu,
  overflowMenuPressHandlerDropdownMenu,
} from "react-navigation-header-buttons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "react-native";

const HeaderSortButton = ({ onSelect }) => {
  return (
    <Item
      iconName="menu"
      IconComponent={({ color }) => {
        return (
          <Ionicons name="search" color={color} size={20} onPress={onSelect} />
        );
      }}
    />
  );
};

export default HeaderSortButton;
