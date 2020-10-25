
import React, { FunctionComponent, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { hexToRgbA } from '../utils/colors';

import ThemeContext from '../context/ThemeContext';

const MyGooglePlacesAutocomplete: FunctionComponent<any> = ({ label, labelStyle, leftIcon, ...rest }) => {
  const theme = useContext(ThemeContext); 
  
  const S = StyleSheet.create({
    container: {
      marginLeft: 10,
      marginRight: 10,
      borderBottomWidth: 0,
      borderBottomColor: 'silver'
    },
    label: {
      fontSize: theme.form.input.label.fontSize,      
      color: theme.form.input.label.color,
      fontWeight: theme.form.input.label.fontWeight,
      paddingBottom: 5,
      marginBottom: 5,
      zIndex: 9999,
    },
    leftIconStyle: {
      paddingTop: 15,
      paddingLeft: 15,
      zIndex: 9999
    },
  });

  const combinedStyles = StyleSheet.flatten([S.label, labelStyle]);

  return (
    <View style={S.container}>
      <Text style={combinedStyles}>{label}</Text>
      <View style={{ flexDirection: 'row' }}>
        <GooglePlacesAutocomplete
          styles={{
            textInputContainer: {
              backgroundColor: hexToRgbA(theme.colors.primary, 0.2),
              borderTopWidth: 0,
              borderBottomWidth: 0,
              borderRadius: 10,
              height: 50,
              paddingLeft: 0,
              paddingRight: 20, 
              marginBottom: 10,
              zIndex: 0,
              // width: '100%',
            },
            textInput: {
              height: '100%',
              width: '100%',
              backgroundColor: 'transparent',
              fontSize: 18,
              marginTop: 0,
              marginLeft: 10,
              color: theme.colors.primary,  
            },
            description: {
              fontWeight: 'bold'
            },
            predefinedPlacesDescription: {
              color: '#1faadb'
            },

          }}        
          {...rest}
        />
      </View>
    </View>
  )
}

export default MyGooglePlacesAutocomplete;