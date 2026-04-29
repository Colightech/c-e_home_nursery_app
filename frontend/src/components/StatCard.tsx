import React from "react";
import { View, Text } from "react-native";

type StatCardProps = {
  title: string;
  value: number | string;
};

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <View
      style={{
        width: "100%",
        padding: 15,
        margin: 5,
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 14, color: "gray" }}>{title}</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{value}</Text>
    </View>
  );
};

export default StatCard;