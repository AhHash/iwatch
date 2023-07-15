import {
  HiddenItem,
  OverflowMenu,
  overflowMenuPressHandlerDropdownMenu,
  defaultOnOverflowMenuPress,
} from "react-navigation-header-buttons";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const HeaderAddButton = ({}) => {
  const { navigate } = useNavigation();

  return (
    <OverflowMenu
      style={{ marginRight: 10 }}
      OverflowIcon={({ color }) => (
        <Ionicons name="add" size={28} color={color} />
      )}
    >
      <HiddenItem
        title="Add New Category"
        onPress={() => {
          navigate("Manage", { mode: "add", type: "category" });
        }}
      />
      <HiddenItem
        title="Add New Commitment"
        onPress={() => {
          navigate("Manage", { mode: "add", type: "commitment" });
        }}
      />
    </OverflowMenu>
  );
};

export default HeaderAddButton;
