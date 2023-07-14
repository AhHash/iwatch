import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import { title } from "../util/format";
import ManageCategory from "../components/categories/ManageCategory";
import ManageCommitment from "../components/commitments/ManageCommitment";
import { setIsEditing as setIsEditingCategories } from "../features/categories/categoriesSlice";
import { setIsEditing as setIsEditingCommitments } from "../features/commitments/commitmentsSlice";

const ManageScreen = ({ route, navigation }) => {
  const { mode, type, id, data } = route.params;
  const dispatch = useDispatch();
  const isFocuesed = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title(`${mode} ${type}`),
    });
    if (mode == "add") {
      dispatch(setIsEditingCategories(false));
      dispatch(setIsEditingCommitments(false));
    }
  }, [route, isFocuesed]);

  if (type == "category") {
    return <ManageCategory id={id} />;
  } else {
    return <ManageCommitment id={id} data={data} />;
  }
};

export default ManageScreen;
