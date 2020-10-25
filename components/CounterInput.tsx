
import React, { FunctionComponent, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { InputProps, Input, Button, Icon } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';
import { hexToRgbA } from '../utils/colors';
import CustomInput from './CustomInput';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface CounterInputProps extends Omit<InputProps, 'value'> {
  value: number,
  onChangeValue: (count: number) => void,
  maximum?: number,
  minimum?: number
}

const CounterInput: FunctionComponent<CounterInputProps> = ({ 
  value, 
  maximum, 
  minimum,
  onChangeValue, 
  inputContainerStyle, 
  inputStyle,
  ...rest 
}) => {
  const [count, setCount] = useState<number>(value < minimum ? minimum : value > maximum ? maximum : value);

  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
    buttonStyleRight: {
      backgroundColor: hexToRgbA(theme.colors.primary, 0.2),
    },
    buttonStyleLeft: {
      backgroundColor: "red",
    },
    inputContainerStyle: {
      paddingLeft: 0
    },
    inputStyle: { 
      textAlign: 'center',
      paddingLeft: 15,
      fontSize: 18
    }
  });

  const combinedInputContainerStyle = StyleSheet.flatten([S.inputContainerStyle, inputContainerStyle]);
  const combinedInputStyle = StyleSheet.flatten([S.inputStyle, inputStyle]);

  const increment = () => {
    let newCount = count + 1 > maximum ? maximum : count + 1;
    setCount(newCount);
    onChangeValue(newCount);
  }

  const decrement = () => {
    let newCount = count - 1 < minimum ? minimum : count - 1;
    setCount(newCount);
    onChangeValue(newCount);
  }

  return (
    <CustomInput
      rightIcon={
        <Icon
          name='plus'
          type='material-community'
          size={24}
          color={theme.primaryColor}
          onPress={increment}
        />
      }
      rightIconContainerStyle={{}}
      leftIcon={
        <Icon
          name='minus'
          type='material-community'
          size={24}
          color={theme.primaryColor}
          onPress={decrement}
        />
      }
      disabled
      editable={false}
      inputContainerStyle={combinedInputContainerStyle}
      inputStyle={combinedInputStyle}
      value={(count.toString())}
      {...rest}
    />
  )
}

export default CounterInput;