
import React, { FunctionComponent, useContext, useState } from 'react';
import { StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { InputProps } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';

import ThemeContext from '../context/ThemeContext';
import CustomInput from './CustomInput';

interface CustomDateTimeInputProps extends InputProps {
  onDateTimeChange: (date: Date) => void
  error?: Error
}

const CustomDateTimeInput: FunctionComponent<CustomDateTimeInputProps> = ({ onDateTimeChange, error, ...rest }) => {
  const [newDate, setNewDate] = useState<Date>(undefined);
  const [isVisible, setVisible] = useState<boolean>(false);

  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
  });

  const _renderDateTimePicker = () => {
    if (Platform.OS === 'ios') {
      return (<DateTimePicker
        minimumDate={new Date()}
        mode="datetime"
        value={new Date()}
        onChange={(event, date) => {          
          setVisible(false);
          onDateTimeChange(date)
        }}
      />);
    } 
    return (<View>
      {!newDate ? <DateTimePicker
          minimumDate={new Date()}
          display="default"
          mode="date"
          value={new Date()}
          onChange={(event, date) => setNewDate(date)}
        /> :
        <DateTimePicker
          minimumDate={new Date()}
          display="default"
          mode="time"
          value={new Date()}
          onChange={(event, time) => {
            setVisible(false);
            onDateTimeChange(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 
              time.getHours(), time.getMinutes(), time.getSeconds()));
          }}
        />
      }
    </View>);
  }

  return (
    <View>
      <TouchableOpacity onPress={() => {
        setNewDate(undefined);
        setVisible(true)        
      }}>
        <CustomInput
          disabled
          error={error}
          {...rest}
        />
      </TouchableOpacity>
      {isVisible ? _renderDateTimePicker() : null}
    </View>
  )
}

export default CustomDateTimeInput;