import React, { FunctionComponent, useContext } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import ThemeContext from '../context/ThemeContext';
import { View } from 'react-native-animatable';

interface LoadingProps {
  style?: any
  color?: any
}

const Loading: FunctionComponent<LoadingProps> = ({ style, color }) => { 

  const theme: any = useContext(ThemeContext);
  
  const S = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
  });

  const combinedContainerStyle = StyleSheet.flatten([S.container, style]);

  return (
    <View style={combinedContainerStyle}>
      <ActivityIndicator size="large" color={color || theme.colors.primary}/>
    </View>
  );
}

export default Loading;