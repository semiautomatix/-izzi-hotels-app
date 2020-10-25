
import React, { FunctionComponent, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Autocomplete, withKeyboardAwareScrollView } from "react-native-dropdown-autocomplete";

import ThemeContext from '../context/ThemeContext';
import { hexToRgbA } from '../utils/colors';

const CustomAutocomplete: FunctionComponent<any> = ({
  label,
  labelStyle,
  inputContainerStyle,
  inputStyle,
  containerStyle,
  placeholderTextColor,
  ...rest
}) => {
  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
    container: {
      marginLeft: 10,
      marginRight: 10,
      borderBottomWidth: 0,
    },    
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
      marginTop: 0,
    },
    inputStyle: {
      color: theme.form.input.color,
      fontSize: theme.form.input.fontSize,
      borderWidth: 0,    
      alignItems: 'flex-start',
      paddingLeft: 20,
      paddingRight: 20,
      width: '100%'
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
    <View style={S.container}>
      <Text style={combinedLabelStyle}>{label}</Text>
      <View>
        <Autocomplete
          // @ts-ignore
          inputContainerStyle={combinedInputContainerStyle}
          inputStyle={combinedInputStyle}
          containerStyle={combinedContainerStyle}
          placeholderColor={placeholderTextColor ? placeholderTextColor : hexToRgbA(theme.colors.primary, 0.2)}
          pickerStyle={{ 
            backgroundColor: theme.colors.snow,
            // color: theme.form.input.color,
            borderColor: theme.colors.primary,
            width: '100%',
            padding: 0,
            marginLeft: -45
          }}
          overlayStyle={{
            borderBottomColor: theme.colors.primary,

          }}
          highLightColor={theme.colors.primary}
          {...rest}
        />
      </View>
    </View>
  )
}

export default CustomAutocomplete;