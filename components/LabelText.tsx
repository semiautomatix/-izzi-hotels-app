
import React, { FunctionComponent, useContext } from 'react';
import { StyleSheet, StyleProp, TextStyle, ViewStyle} from 'react-native';
import { Text } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';
import { View } from 'react-native-animatable';

interface LabelTextProps {
  label: string,
  labelStyle?: StyleProp<TextStyle>,
  textStyle?: StyleProp<TextStyle>,
  containerStyle?: StyleProp<ViewStyle>
}

const LabelText: FunctionComponent<LabelTextProps> = ({ labelStyle, textStyle, containerStyle, label, children }) => {
  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
    containerStyle: {
      paddingLeft: 10
    },
    labelStyle: {
      color: theme.form.input.label.color,      
      fontWeight: theme.form.input.label.fontWeight,  
      fontSize: theme.form.input.label.fontSize,
      paddingBottom: 5,
    },
    textStyle: theme.text1
  });

  const combinedLabelStyle: StyleProp<TextStyle> = StyleSheet.flatten([S.labelStyle, labelStyle]) as StyleProp<TextStyle>;
  const combinedTextStyle: StyleProp<TextStyle> = StyleSheet.flatten([S.textStyle, textStyle]) as StyleProp<TextStyle>;
  const combinedContaierStyle: StyleProp<ViewStyle> = StyleSheet.flatten([S.containerStyle, containerStyle]) as StyleProp<ViewStyle>;

  return (
    <View
      style={combinedContaierStyle}
    >
      <Text style={combinedLabelStyle}>{label}</Text>
      <Text style={combinedTextStyle}>{children}</Text>
    </View>
  )
}

export default LabelText;