import React, { FunctionComponent, useContext } from 'react';
import { View, StyleSheet } from "react-native";
import { Icon } from 'react-native-elements'
import ThemeContext from '../context/ThemeContext';

interface IProps {
  value: number,
  count: number,
  imageSize?: number,
  iconColor?: string,
  containerStyle?: any 
}

const Rating: FunctionComponent<IProps> = ({ 
  value,
  count,
  imageSize = 30,
  iconColor = 'yellow',
  containerStyle = {}
}) => {
  const S = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingTop: 5
    },
  });

  const combinedStyles = StyleSheet.flatten([S.container, containerStyle]);  

  let val = value;

  return (
    <View
      style={combinedStyles}
    >      
      {(Array.from({length: count}, (v, i) => i)).map(
        (_, index) => {
          let name = 'star';
          if (val <= 0) name = 'star-outline';
          else if (val > 0 && val < 1) name = 'star-half';
          val--;
          return (
            <Icon
              key={index}
              name={name}
              type='material-community'
              size={imageSize}
              color={iconColor}
            />            
          );
        } 
      )}
    </View>
  );
}

export default Rating;