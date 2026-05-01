import { TextInput, TextInputProps, StyleProp, TextStyle } from "react-native";
import styles from "../style/auth/addUserStyle";

type AppInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
};

const AppInput = ({ style, ...props }: AppInputProps) => {
  return (
    <TextInput
      style={[styles.userInputStyle, style]}
      placeholderTextColor="#aaa"
      {...props}
    />
  );
};

export default AppInput;