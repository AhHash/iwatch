import {
  HiddenItem,
  OverflowMenu,
  overflowMenuPressHandlerDropdownMenu,
} from "react-navigation-header-buttons";
import Ionicons from "@expo/vector-icons/Ionicons";

const HeaderSortButton = ({ onValueChange }) => {
  return (
    <OverflowMenu
      onPress={overflowMenuPressHandlerDropdownMenu}
      style={{ marginRight: 10 }}
      OverflowIcon={({ color }) => (
        <Ionicons name="menu" size={28} color={color} />
      )}
    >
      <HiddenItem
        title="Sort by Status"
        onPress={() => {
          onValueChange("status");
        }}
      />
      <HiddenItem
        title="Sort by Recent"
        onPress={() => {
          onValueChange("recent");
        }}
      />
    </OverflowMenu>
  );
};

export default HeaderSortButton;
