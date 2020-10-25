
import React, { FunctionComponent } from 'react';
import { View, StyleSheet, Picker, PickerProps } from 'react-native';
import { Text, IconProps } from 'react-native-elements';

interface IItem {
  label: string,
  value: string
}

interface DropDownProps extends PickerProps {
  items: IItem[],
  label: string,
  labelStyle: any,
  leftIcon?: Partial<IconProps> | React.ReactElement<{}>;
  nullable?: boolean
}

const DropDown: FunctionComponent<DropDownProps> = ({ items, label, labelStyle, leftIcon, nullable = false, ...rest }) => {
  const S = StyleSheet.create({
    container: {
      marginLeft: 10,
      marginRight: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'silver'
    },
    label: {
      fontSize: 16,      
      color: 'grey',
      fontWeight: 'normal',
      marginBottom: -5
    },
    leftIconStyle: {
      paddingTop: 15, 
      paddingLeft: 15
    },
    pickerStyle: {
      flex: 1, 
      height: 50, 
      paddingRight: 40,
      marginLeft: -5
    }
  });

  const combinedStyles = StyleSheet.flatten([S.label, labelStyle]);  

  return (
    <View style={S.container}>
      <Text style={combinedStyles}>{label}</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={S.leftIconStyle}>
          {leftIcon}
        </View>
        <Picker
          style={S.pickerStyle}
          {...rest}
        >
          {nullable ? <Picker.Item label='Select an option...' value={undefined} /> : <React.Fragment /> }
          {items.map(
            (item) => <Picker.Item label={item.label} value={item.value} />
          )}
      </Picker>
     </View>
    </View>
  )
}

export default DropDown;