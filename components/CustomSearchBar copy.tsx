
import React, { FunctionComponent, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { SearchBarProps, SearchBar } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';
import { hexToRgbA } from '../utils/colors';

const CustomSearchBar: FunctionComponent<SearchBarProps> = ({ inputContainerStyle, inputStyle, containerStyle, placeholderTextColor, ...rest}) => {
  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
    labelStyle: {
      color: theme.colors.primary,
      paddingBottom: 5,
      fontWeight: 'bold'
    },
    inputContainerStyle: {
      backgroundColor: hexToRgbA(theme.colors.primary, 0.2),
      borderBottomWidth: 0,
      borderRadius: 10,
      height: 50,
      paddingLeft: 20,
      paddingRight: 20,      
    },
    inputStyle: {
      color: theme.colors.primary,      
    },
    containerStyle: {
      marginBottom: 10
    },
  });

  // const combinedLabelStyle = StyleSheet.flatten([S.labelStyle, labelStyle]);
  const combinedInputContainerStyle = StyleSheet.flatten([S.inputContainerStyle, inputContainerStyle]);
  const combinedInputStyle = StyleSheet.flatten([S.inputStyle, inputStyle]);
  const combinedContainerStyle = StyleSheet.flatten([S.containerStyle, containerStyle]);

  return (
    <SearchBar
      // labelStyle={combinedLabelStyle}
      inputContainerStyle={combinedInputContainerStyle}
      inputStyle={combinedInputStyle}
      containerStyle={combinedContainerStyle}
      placeholderTextColor={placeholderTextColor ? placeholderTextColor : hexToRgbA(theme.colors.primary, 0.2)}
      {...rest}
    />
  )
}

export default CustomSearchBar;