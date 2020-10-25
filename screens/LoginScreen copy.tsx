import React, { FunctionComponent, useContext, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, AsyncStorage } from "react-native";
import { Input, Icon, SocialIcon, Button, Text } from 'react-native-elements';
import * as yup from 'yup';

import ThemeContext from '../context/ThemeContext';
import { StatusBarHeight } from '../utils/dimensions';

interface LoginScreenProps {
  navigation: any
}

const LoginScreen: FunctionComponent<LoginScreenProps> = ({ navigation }) => {
  const theme = useContext(ThemeContext);

  const [emailAddress, setEmailAddress] = useState<string>(undefined);
  const [password, setPassword] = useState<string>(undefined);

  const loginSchema = yup.object().shape({
    emailAddress: yup.string().required().strict(true),
    password: yup.string().required().strict(true)
  });

  const authenticate = async () => {
    try {
      /*await loginSchema.validate({
        value: {
          emailAddress,
          password
        }, options: {
          abortEarly: false
        }
      })*/
      await AsyncStorage.setItem('userToken', '1');
      navigation.navigate('App');
    } catch ({ errors }) {
      console.log(errors)
    }
  }

  return (
    <View style={[styles.scene, { backgroundColor: theme.primaryColor }]}>
      <View style={{ marginTop: StatusBarHeight + 50, alignItems: 'center' }}>
        <Image source={require('../assets/izzi-logo.png')} />
      </View>
      <View style={{ backgroundColor: 'white', height: '100%', marginTop: 30, borderRadius: 30, padding: 30}}>
        <View style={{ marginTop: 30 }}>
          <Input
            labelStyle={{ fontWeight: 'normal', }}
            label='Email Address'
            leftIcon={
              <Icon            
                name='email'
                size={24}
                color={theme.primaryColor}
                containerStyle={{ marginRight: 10 }}
              />
            }
            inputStyle={{ color: '#000000' }}
            onChangeText={setEmailAddress}
          />
          <Input
            labelStyle={{ fontWeight: 'normal', }}
            label='Password'
            leftIcon={
              <Icon            
                name='lock'
                size={24}
                color={theme.primaryColor}
                containerStyle={{ marginRight: 10 }}
              />
            }
            inputStyle={{ color: '#000000' }}
            secureTextEntry={true}
            onChangeText={setPassword}
          />        
        </View>
        <View style={{ marginTop: 30,  width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
          <SocialIcon
            title='Sign in with Facebook'          
            type='facebook'
          />    
          <SocialIcon
            title='Sign in with Twitter'          
            type='twitter'
          />        
          <SocialIcon
            title='Sign in with Google'          
            type='google'
          />    
        </View>  
        <View style={{ marginTop: 30 }}>
          <Button
            title="Sign in"
            buttonStyle={{
              backgroundColor: theme.primaryColor,
              borderRadius: 30,
              margin: 5,
              marginTop: 10,
              height: 50          
            }}
            onPress={authenticate}
          />   
        </View>
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={{ color: theme.font.secondaryColor }}>Register</Text>  
        </View>  
      </View>            
    </View>
  );
}
const styles = StyleSheet.create({
  scene: {
    flex: 1
  },
});

export default LoginScreen;