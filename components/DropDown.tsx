
import React, { FunctionComponent, useContext } from 'react';
import { View, StyleSheet, Picker, PickerProps, StyleProp, TextStyle } from 'react-native';
import { Text } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';
import { hexToRgbA } from '../utils/colors';

interface IItem {
  label: string,
  value: string
}

interface DropDownProps extends PickerProps {
  items: IItem[],
  label: string,
  nullable?: boolean,
  labelStyle?: any,
  errorProps?: object,
  errorStyle?: StyleProp<TextStyle>,
  error?: Error, 
}

const DropDown: FunctionComponent<DropDownProps> = ({ 
  items, label, labelStyle = {}, nullable = false, error, errorProps, errorStyle, ...rest 
}) => {
  const theme = useContext(ThemeContext);
  
  const S = StyleSheet.create({
    container: {     
      marginLeft: 10,
      marginRight: 10,
      margin: 10
    },
    labelStyle: {
      fontSize: theme.form.input.label.fontSize,      
      color: theme.form.input.label.color,
      paddingBottom: 5,
      fontWeight: theme.form.input.label.fontWeight
    },
    inputContainerStyle: {
      backgroundColor: hexToRgbA(theme.colors.primary, 0.2),
      borderBottomWidth: 0,
      borderRadius: 10,
      height: 50,
      paddingLeft: 20,
      paddingRight: 20,
      flexDirection: 'row',
    },    
    pickerStyle: {
      flex: 1, 
      height: 50, 
      paddingRight: 40,
      marginLeft: -5
    },
    error: {
      margin: 5,
      fontSize: 12,
      color: theme.colors.error,
    }    
  });
  
  const combinedLabelStyles = StyleSheet.flatten([S.labelStyle, labelStyle]);  
  const pickerItems = nullable ? [{value: undefined, label:'Select an option...'}, ...items] : items;

  return (
    <View style={S.container}>
      <Text style={combinedLabelStyles}>{label}</Text>
      <View style={S.inputContainerStyle}>
        <Picker
          style={S.pickerStyle}
          {...rest}
        >
          {pickerItems.map(
            (item) => <Picker.Item key={item.value} label={item.label} value={item.value} />
          )}
      </Picker>
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
    </View>
  )
}

export default DropDown;