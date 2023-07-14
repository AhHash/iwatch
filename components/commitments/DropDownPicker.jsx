import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { title } from "../../util/format";

DropDownPicker.setTheme("DARK");
DropDownPicker.setListMode("SCROLLVIEW");

const DropDownPickerComponent = ({
  data,
  name,
  placeholder,
  togglePickersExcept,
  setPickerValues,
  pickerValues,
  open,
  setErrors,
  style,
  hideIcons,
}) => {
  return (
    <View style={style}>
      <DropDownPicker
        hideSelectedItemIcon={hideIcons}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          height: style?.slice(-1)[0]?.height,
        }}
        textStyle={{
          fontSize: 15,
          fontWeight: "bold",
          color: "white",
        }}
        listItemContainerStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
        listItemLabelStyle={{
          color: "white",
        }}
        placeholder={title(`select ${placeholder || name}`)}
        open={open}
        value={pickerValues[name]}
        items={data.map((dataItem) => {
          if (dataItem.colorCode && !hideIcons) {
            return {
              label: title(dataItem.name),
              value: dataItem.id,
              icon: () => {
                return (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: dataItem.colorCode,
                    }}
                  />
                );
              },
            };
          }
          return {
            label: title(dataItem.name) || title(dataItem),
            value: dataItem.id || dataItem,
          };
        })}
        onPress={() => {
          togglePickersExcept(name);
        }}
        onSelectItem={(item) => {
          if (setErrors) {
            setErrors((previousErrors) =>
              previousErrors.filter((error) => error != name)
            );
          }
          togglePickersExcept(name);
          setPickerValues((previousValues) => {
            return { ...previousValues, [name]: item.value };
          });
        }}
      />
    </View>
  );
};
export default DropDownPickerComponent;
