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

const CommitmentImagePicker = ({ onPickImage, initialImage }) => {
  const [status, getPermissoins] = useMediaLibraryPermissions();
  const [inputImage, setInputImage] = useState(null);

  useLayoutEffect(() => {
    setInputImage(initialImage);
  }, [initialImage]);

  const chechPermissions = useCallback(async () => {
    if (status.status == PermissionStatus.GRANTED) {
      return true;
    } else {
      if (
        status.status == PermissionStatus.UNDETERMINED ||
        status.status == "limiited"
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
  });

  const getPhoto = async () => {
    if (!(await chechPermissions())) {
      return;
    } else {
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
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={
          typeof inputImage == "number" ? inputImage : { uri: inputImage }
        }
        style={styles.backgroundImage}
      >
        <Pressable onPress={getPhoto} style={styles.textContainer}>
          <Text style={styles.text}>
            {inputImage ? "Tab To Edit" : "Pick Image"}
          </Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
};

export default CommitmentImagePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 120,
    backgroundColor: "#111",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  textContainer: {
    alignItems: "center",
    backgroundColor: "rgba(75, 75, 75, 0.5)",
  },
  text: {
    fontSize: 28,
    opacity: 0.5,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
