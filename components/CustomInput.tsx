
import React, { FunctionComponent, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { InputProps, Input } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';
import { hexToRgbA } from '../utils/colors';

interface CustomInputProps extends InputProps {
  error?: Error
}

const CustomInput: FunctionComponent<CustomInputProps> = ({ 
  labelStyle, 
  inputContainerStyle, 
  inputStyle, 
  containerStyle, 
  placeholderTextColor, 
  error,
  ...rest
}) => {
  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
    labelStyle: {
      color: theme.form.input.label.color,      
      fontWeight: theme.form.input.label.fontWeight,  
      fontSize: theme.form.input.label.fontSize,
      paddingBottom: 5,
    },
    inputContainerStyle: {
      backgroundColor: theme.form.input.backgroundColor,
      borderBottomWidth: 0,
      borderRadius: theme.form.input.borderRadius,
      height: theme.form.input.height,
      paddingLeft: 20,
      paddingRight: 20,      
    },
    inputStyle: {
      color: theme.form.input.color,  
      fontSize: theme.form.input.fontSize
    },
    containerStyle: {
      marginBottom: 10
    },
  });

  const combinedLabelStyle = StyleSheet.flatten([S.labelStyle, labelStyle]);
  const combinedInputContainerStyle = StyleSheet.flatten([S.inputContainerStyle, inputContainerStyle]);
  const combinedInputStyle = StyleSheet.flatten([S.inputStyle, inputStyle]);
  const combinedContainerStyle = StyleSheet.flatten([S.containerStyle, containerStyle]);

  return (
    <Input
      // @ts-ignore
      labelStyle={combinedLabelStyle}
      inputContainerStyle={combinedInputContainerStyle}
      inputStyle={combinedInputStyle}
      containerStyle={combinedContainerStyle}
      placeholderTextColor={placeholderTextColor ? placeholderTextColor : hexToRgbA(theme.colors.primary, 0.2)}
      errorMessage={error && error.message}
      {...rest}
    />
  )
}

export default CustomInput;