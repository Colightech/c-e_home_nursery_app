
import React from "react";
import { View, Text, Image } from "react-native";
import styles from "../style/auth/avaterStyle"
import Ionicons from "react-native-vector-icons/Ionicons";


type AvatarPropsType = {
  imageUrl?: string;
  name?: string;
};

const Avatar = ({ imageUrl, name }: AvatarPropsType) => {

  const getAvaterName = () => {
    if (!name) return "";

    const splitName = name.trim().split(" ");

    if (splitName.length >= 2) {
      return (
        splitName[0][0].toUpperCase() +
        splitName[1][0].toUpperCase()
      );
    }

    return splitName[0][0].toUpperCase();
  };

  const avaterName = getAvaterName();

  return (
    <View style={styles.container}>
        {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imageUrl} />
        ) : name ? (
            <Text style={styles.nameText}>{avaterName}</Text>
        ) : (
            <Ionicons name="person-outline" size={35} color="black" style={styles.avaterIcon} />
        )}
    </View>
    );
};

export default Avatar;