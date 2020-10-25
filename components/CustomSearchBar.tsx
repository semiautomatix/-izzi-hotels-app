
import React, { FunctionComponent, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { SearchBarProps, SearchBar, Text } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';
import { hexToRgbA } from '../utils/colors';
import { View } from 'react-native-animatable';

interface CustomSearcBarProps extends SearchBarProps{
  label?: string,
  labelStyle?: any
}

const CustomSearchBar: FunctionComponent<CustomSearcBarProps> = ({ label, labelStyle, inputContainerStyle, inputStyle, containerStyle, placeholderTextColor, ...rest}) => {
  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
    labelStyle: {
      color: theme.form.input.label.color,
      fontWeight: theme.form.input.label.fontWeight,  
      fontSize: theme.form.input.label.fontSize,
      paddingBottom: 5,
      paddingLeft: 10
    },
    inputContainerStyle: {
      backgroundColor: "transparent", //hexToRgbA(theme.colors.primary, 0.2),
      borderBottomWidth: 0,
      borderRadius: 10,
      // height: 50,    
    },
    inputStyle: {
      color: theme.form.input.color, 
      fontSize: theme.form.input.fontSize, 
    },
    containerStyle: {
      backgroundColor: theme.form.input.backgroundColor,
      marginBottom: 10,
      borderRadius: 10,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      marginLeft: 10,
      marginRight: 10,  
      height: 50,
      paddingTop: 5     
    },
  });

  const combinedLabelStyle = StyleSheet.flatten([S.labelStyle, labelStyle]);
  const combinedInputContainerStyle = StyleSheet.flatten([S.inputContainerStyle, inputContainerStyle]);
  const combinedInputStyle = StyleSheet.flatten([S.inputStyle, inputStyle]);
  const combinedContainerStyle = StyleSheet.flatten([S.containerStyle, containerStyle]);

  return (
    <View>
      {label ? <Text style={combinedLabelStyle}>{label}</Text> : null}
      <SearchBar
        searchIcon={false}
        clearIcon={false}
        // labelStyle={combinedLabelStyle}
        inputContainerStyle={combinedInputContainerStyle}
        inputStyle={combinedInputStyle}
        containerStyle={combinedContainerStyle}
        placeholderTextColor={placeholderTextColor ? placeholderTextColor : hexToRgbA(theme.colors.primary, 0.2)}
        {...rest}
      />
    </View>
  )
}

export default CustomSearchBar;