import React, { useContext, FunctionComponent, useState } from 'react';
import { View, StyleSheet, Platform, ToastAndroid, Alert } from 'react-native';
import { Button, Text } from 'react-native-elements';
import axios from 'axios';

import ThemeContext from '../context/ThemeContext';

import { store } from '../store';
import CustomInput from '../components/CustomInput';

interface ForgotPasswordProps {
  onSuccess: () => void
}

const ForgotPassword: FunctionComponent<ForgotPasswordProps> = ({ onSuccess }) => {
  const [emailAddress, setEmailAddress] = useState<string>(undefined);

  const theme = useContext(ThemeContext);

  // @ts-ignore
  const { state } = useContext(store);

  const resetPassword = async () => {
    alert("test for email password")
    try {
      const instance = await axiosHelper.getInstance();
      await instance.post('http://192.168.1.91:8000/rest-auth/password/reset/', {
        email: emailAddress,
      });
      onSuccess();
    } catch (err) {      
      if (Platform.OS === "android") {
        ToastAndroid.show('Reset password failed', ToastAndroid.SHORT);
      } else {
        Alert.alert('', 'Reset password failed');
      }       
    }
  }

  const S = StyleSheet.create({
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      paddingTop: 30,
      borderRadius: 30,
    },
    header: {
      color: theme.form.header.color, 
      fontFamily: theme.form.header.fontFamily, 
      fontSize: theme.form.header.fontSize, 
      margin: 0, 
      marginBottom: 20
    },
  });

  return (
    <View style={S.content}>
      <Text style={S.header}>
        Forgot Password
      </Text>       
      <View
        style={{ flex: 1 }}
        // keyboardShouldPersistTaps='always'
      >
        <CustomInput
          label='Email Address'
          value={emailAddress}
          onChangeText={setEmailAddress}
          autoCompleteType="email"
        />       
      </View>
      <View style={{ 
        flex: 1,
        justifyContent: 'flex-end',
      }}>
        <Button
          title="Submit"
          buttonStyle={theme.form.button.style}
          titleStyle={theme.form.button.title}
          onPress={resetPassword}
        />
      </View>
    </View>
  );
};

export default ForgotPassword;