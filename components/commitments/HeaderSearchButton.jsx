import { Item } from "react-navigation-header-buttons";
import Ionicons from "@expo/vector-icons/Ionicons";

const HeaderSortButton = ({ onSelect }) => {
  return (
    <Item
      iconName="menu"
      IconComponent={({ color }) => {
        return (
          <Ionicons
            name="search"
            color={color}
            size={20}
            onPress={onSelect}
            style={{}}
          />
        );
      }}
    />
  );
};

export default HeaderSortButton;
