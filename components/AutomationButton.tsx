
import React, { FunctionComponent, useContext } from 'react';
import { StyleSheet, Color } from 'react-native';
import { InputProps, Input, ButtonProps, Button, IconProps, Text, Icon } from 'react-native-elements';

import ThemeContext, { widthPercentageToDP, heightPercentageToDP } from '../context/ThemeContext';
import { hexToRgbA } from '../utils/colors';
import { View } from 'react-native-animatable';

interface AutomationButtonProps extends ButtonProps {
  label: string,
  iconName: string,
  iconColorOn?: any, 
  iconColorOff?: any, 
  iconType?: string,  
  iconSize?: number,
  on?: boolean
  onPress?: () => void
}

const AutomationButton: FunctionComponent<AutomationButtonProps> = ({ 
  onPress = () => {},
  label,
  iconName,
  iconColorOn, 
  iconColorOff, 
  iconType,
  iconSize,
  on = false,
  ...rest
}) => {
  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
    container: {
      width: widthPercentageToDP(35),  
      marginLeft: widthPercentageToDP(5),
      flexDirection: 'column',
      alignItems: 'center'
    },
    containerView: {
      borderRadius: 30
    },
    button: {
      height: widthPercentageToDP(35),
      width: widthPercentageToDP(35),  
      borderRadius: 30,
      borderColor: theme.colors.primary,
      backgroundColor: !on ? iconColorOn || theme.colors.snow : iconColorOff || theme.colors.primary
    },
    label: {
      color: theme.colors.ebony,
      fontSize: heightPercentageToDP(2.5), 
      marginVertical: heightPercentageToDP(3), 
      fontFamily: 'roboto-bold',
    },
    icon: {
    }    
  });

  return (
    <View style={S.container}>
      <Button 
        // @ts-ignore // this property does exist
        containerViewStyle={S.containerView}
        buttonStyle={S.button}
        icon={<Icon
          name={iconName}
          type={iconType || 'material'}
          color={on ? iconColorOn || theme.colors.snow : iconColorOff || theme.colors.primary}
          iconStyle={S.icon}
          size={iconSize || heightPercentageToDP(10)}
        />}       
        type={on ? 'solid' : 'outline'}
        raised
        onPress={onPress}
        {...rest}
      />

      <Text style={S.label}>
        {label}
      </Text>
    </View>
  )
}

export default AutomationButton;