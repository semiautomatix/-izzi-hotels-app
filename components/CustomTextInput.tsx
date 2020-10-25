
import React, { FunctionComponent, useContext } from 'react';
import { StyleSheet, StyleProp, TextStyle, TextInput, ViewStyle, View, TextInputProps } from 'react-native';
import { Text } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';

interface LabelTextProps extends TextInputProps {
  label: string,
  labelStyle?: StyleProp<TextStyle>,
  containerStyle?: StyleProp<ViewStyle>  
  textInputStyle?: StyleProp<TextStyle>,
  errorProps?: object,
  errorStyle?: StyleProp<TextStyle>,
  error?: Error,  
}

const CustomTextInput: FunctionComponent<LabelTextProps> = ({ 
  textInputStyle, label, labelStyle, containerStyle, placeholderTextColor, children, errorProps, errorStyle, error, ...rest 
}) => {
  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
    containerStyle: {
      paddingLeft: 10,
      paddingRight: 10
    },
    labelStyle: {
      color: theme.form.input.label.color,      
      fontWeight: theme.form.input.label.fontWeight,  
      fontSize: theme.form.input.label.fontSize,
      paddingBottom: 5,
    },    
    textInputStyle: {
      color: theme.form.input.color,  
      fontSize: theme.form.input.fontSize,   
      backgroundColor: theme.form.input.backgroundColor,
      borderBottomWidth: 0,
      borderRadius: theme.form.input.borderRadius,  
      padding: 20,      
      textAlignVertical: 'top'     
    },
    error: {
      margin: 5,
      fontSize: 12,
      color: theme.colors.error,
    }
  });

  const combinedTextInputStyle: StyleProp<TextStyle> = StyleSheet.flatten([S.textInputStyle, textInputStyle]) as StyleProp<TextStyle>;
  const combinedLabelStyle: StyleProp<TextStyle> = StyleSheet.flatten([S.labelStyle, labelStyle]) as StyleProp<TextStyle>;
  const combinedContaierStyle: StyleProp<ViewStyle> = StyleSheet.flatten([S.containerStyle, containerStyle]) as StyleProp<ViewStyle>;  

  return (
    <View
      style={combinedContaierStyle}
    >
      <Text style={combinedLabelStyle}>{label}</Text>    
      <TextInput 
        style={combinedTextInputStyle}
        placeholderTextColor={placeholderTextColor ? placeholderTextColor : theme.form.input.placeHolder.color}
        {...rest}
      >
        {children}
      </TextInput>
      {!!error && (
          <Text
            {...errorProps}
            style={StyleSheet.flatten([
              S.error,
              errorStyle && errorStyle,
            ])}
          >
            {error.message}
          </Text>
        )}      
    </View>
  )
}

export default CustomTextInput;