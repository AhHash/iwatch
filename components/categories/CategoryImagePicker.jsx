import { useCallback, useLayoutEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  Text,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import {
  useMediaLibraryPermissions,
  PermissionStatus,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";

import { getImgUri } from "../../util/format";
import { globalColors } from "../../constants/styles";

const CategoryImagePicker = ({ onPickImage, initialImage }) => {
  const [status, getPermissoins] = useMediaLibraryPermissions();
  const [inputImage, setInputImage] = useState();

  useLayoutEffect(() => {
    setInputImage(initialImage);
  }, [initialImage]);

  const chechPermissions = useCallback(async () => {
    if (status.status == PermissionStatus.GRANTED) {
      return true;
    } else {
      if (
        status.status == PermissionStatus.UNDETERMINED ||
        status.status == "limited"
      ) {
        return !((await getPermissoins()) == PermissionStatus.DENIED);
      } else {
        Alert.alert(
          "Permissions Required",
          "Please change your permissions settings to allow library access"
        );
        return false;
      }
    }
  }, [status]);

  const getPhoto = useCallback(async () => {
    if (!(await chechPermissions())) {
      return;
    }

    const result = await launchImageLibraryAsync({
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [16, 9],
      mediaTypes: MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setInputImage(result.assets[0].uri);
      onPickImage(result.assets[0].uri);
    }
  }, [status]);

  return (
    <Pressable style={styles.container} onPress={getPhoto}>
      <ImageBackground
        source={getImgUri(inputImage)}
        style={styles.backgroundImage}
      >
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {inputImage ? "Tab To Edit" : "Pick Image"}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default CategoryImagePicker;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 130,
    backgroundColor: globalColors.pickerContainerBackground,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: globalColors.pickerImage,
    borderRadius: 5,
    overflow: "hidden",
  },
  textContainer: {
    alignItems: "center",
    backgroundColor: globalColors.textBackground,
    opacity: 0.7,
  },
  text: {
    fontSize: 28,
    opacity: 0.3,
    fontWeight: "bold",
    color: globalColors.textMain,
  },
});
