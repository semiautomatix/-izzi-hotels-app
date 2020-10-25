
import React, { FunctionComponent, useContext, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { InputProps } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';

import ThemeContext from '../context/ThemeContext';
import CustomInput from './CustomInput';

interface CustomDateTimeInputProps extends InputProps {
  onDateChange: (date: Date) => void;
}

const CustomDateInput: FunctionComponent<CustomDateTimeInputProps> = ({ onDateChange, ...rest }) => {
  const [isVisible, setVisible] = useState<boolean>(false);

  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
  });

  const _renderDatePicker = () => {
    return (<DateTimePicker
      minimumDate={new Date()}
      mode="date"
      value={new Date()}
      onChange={(event, date) => {          
        setVisible(false);
        onDateChange(date)
      }}
    />);
  }

  return (
    <View>
      <TouchableOpacity onPress={() => {
        setVisible(true)        
      }}>
        <CustomInput
          disabled
          {...rest}
        />
      </TouchableOpacity>
      {isVisible ? _renderDatePicker() : null}
    </View>
  )
}

export default CustomDateInput;