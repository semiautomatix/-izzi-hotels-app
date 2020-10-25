import React, { FunctionComponent, useContext, useState } from 'react';
import { View, StyleSheet, Image, AsyncStorage, Platform, ToastAndroid, Alert } from "react-native";
import Constants from 'expo-constants';
import { SocialIcon, Button, Text } from 'react-native-elements';
import * as yup from 'yup';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';

import { 
  // @ts-ignore
  GOOGLE_IOS_CLIENT_ID_FOR_EXPO,
  // @ts-ignore
  GOOGLE_ANDROID_CLIENT_ID_FOR_EXPO,
  // @ts-ignore
  GOOGLE_IOS_CLIENT_ID, 
  // @ts-ignore
  GOOGLE_ANDROID_CLIENT_ID,
  // @ts-ignore
  FACEBOOK_APP_ID
}  from 'react-native-dotenv';

// graphql
import { useSocialAuthMutation, useTokenAuth } from '../graphql/auth';

// utils
import * as messages from '../utils/messages';

import ThemeContext from '../context/ThemeContext';

import CustomInput from '../components/CustomInput';
import CustomOverlay from '../components/CustomOverlay';
import ForgotPassword from '../forms/ForgotPassword';
import Register from '../forms/Register';

interface LoginScreenProps {
  navigation: any
}

const LoginScreen: FunctionComponent<LoginScreenProps> = ({ navigation }) => {
  // get theme from context
  const theme: any = useContext(ThemeContext);

  // local state
  const [emailAddress, setEmailAddress] = useState<string>(undefined);
  const [password, setPassword] = useState<string>(undefined);
  const [isShowForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [isShowRegistration, setShowRegistration] = useState<boolean>(false);
  const [errors, setErrors] = useState<yup.ValidationError[]>([]);

  // Styles
  const styles = StyleSheet.create({
    scene: {
      flex: 1
    },
  });

  // validation schema
  const schema = yup.object().shape({
    emailAddress: yup.string().email().required().label("Email Address"),
    password: yup.string().required().label("Password"),
  });

  // GraphQL 
  const [useSocialAuthMutationFn] = useSocialAuthMutation({
    // should authentication be successful store token and navigate to home screen
    async update(cache, { data: { socialAuth } }) {      
      await AsyncStorage.setItem('userToken', socialAuth.token);
      // set username in store
      navigation.navigate('App');
    }
  });

  const [useTokenAuthFn] = useTokenAuth({
    // should authentication be successful store token and navigate to home screen
    async update(cache, { data: { tokenAuth } }) {      
      await AsyncStorage.setItem('userToken', tokenAuth.token);
      // set username in store
      navigation.navigate('App');
    }
  });  

  // functions
  const authenticate = async () => {
    try {
      // validate fields
      if (!(__DEV__ && emailAddress === 'tim')) { // ignore developmetn admin
        await schema.validate(
          {
            emailAddress,
            password
          }, {abortEarly: false}
        )
      }
      // if validation finds not errors clear errors then attempt authentication
      setErrors([]);
      try {
        await useTokenAuthFn(              
          {
            variables: {
              username: emailAddress,
              password: password
            }
          }
        );                       
      } catch (err) {
        // translate error
        onFailedLogin(err.message.includes('Please, enter valid credentials') ? 'Invalid username or password' : undefined);
      }   
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors(err.inner);
      } else {
        console.error(err);
      }
    }
  }

  const _loginWithGoogle = async () => {
    try {
      const googleConfig = {
          iosClientId: GOOGLE_IOS_CLIENT_ID_FOR_EXPO,
          androidClientId: GOOGLE_ANDROID_CLIENT_ID_FOR_EXPO,
          iosStandaloneAppClientId: GOOGLE_IOS_CLIENT_ID,
          androidStandaloneAppClientId: GOOGLE_ANDROID_CLIENT_ID,  
      };
      // First- obtain access token from Expo's Google API
      const { type, accessToken, user } = await Google.logInAsync(
        // @ts-ignore https://github.com/expo/expo/issues/6393
        googleConfig
      );

      if (type === 'success') {
        try {
          await useSocialAuthMutationFn(              
            {
              variables: {
                provider: "google-oauth2",
                accessToken
              }
            }
          );                       
        } catch (err) {
          onFailedLogin();
        }        
      } else {
        onFailedLogin();
      }
    } catch (err) {
      // console.error(err);
      onFailedLogin();
    }
  };

  const _loginWithFacebook = async () => {
    try {
      await Facebook.initializeAsync(FACEBOOK_APP_ID, 'iZZi Hotels');
      // @ts-ignore
      const { type, token, expires, permissions, declinedPermissions } = (await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      })) as Facebook.FacebookLoginResult;
      if (type === 'success') {
        try {
          await useSocialAuthMutationFn(              
            {
              variables: {
                provider: "facebook",
                accessToken: token
              }
            }
          );                       
        } catch (err) {
          onFailedLogin();
        }   
      } else {
        // type === 'cancel'
        onFailedLogin();
      }
    } catch ({ message }) {
      // alert(`Facebook Login Error: ${message}`);
      onFailedLogin();
    }    
  };

  const _loginWithTwitter = async () => {
    alert("to do")
  }

  const onFailedLogin = (message?: string) => {
    messages.showMessage(message ? message : 'Login failed');
  }

  // rendering
  return (
    <View style={[styles.scene, { backgroundColor: theme.primaryColor }]}>
      <View style={theme.scene.logo.container}>
        <Image source={require('../assets/izzi-logo.png')} style={theme.scene.logo.image}/>
      </View>
      <View style={{ backgroundColor: 'white', height: '100%', marginTop: 30, borderRadius: 30, padding: 30 }}>
        <View style={{ marginTop: 30 }}>          
          <CustomInput
            label='Email Address'
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCompleteType="email"
            error={errors.find((error) => error.path === 'emailAddress')}
          />
          <CustomInput
            label='Password'
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
            error={errors.find((error) => error.path === 'password')}
          />
        </View>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', paddingBottom: 10 }}>
          <SocialIcon
            title='Sign in with Facebook'
            type='facebook'
            onPress={_loginWithFacebook}
          />
          <SocialIcon
            title='Sign in with Twitter'
            type='twitter'
            onPress={_loginWithTwitter}
          />
          <SocialIcon
            title='Sign in with Google'
            type='google'
            onPress={_loginWithGoogle}
          />
        </View>
        <View
          style={{ paddingHorizontal: 10}}
        >
          <Button
            title="Sign in"
            buttonStyle={theme.form.button.style}
            titleStyle={theme.form.button.title}
            onPress={authenticate}
          />          
        </View>
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text
            style={theme.link}
            onPress={() => setShowRegistration(true)}
          >
            Register
          </Text>
        </View>
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text
            style={theme.link}
            onPress={() => setShowForgotPassword(true)}
          >
            Forgot Password
          </Text>
        </View>
        <Text style={{textAlign: 'center', alignItems: 'center'}}>Ver {Constants.manifest.version}</Text>
      </View>
      <CustomOverlay
        isVisible={isShowForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      >
        <ForgotPassword
          onSuccess={() => {
            setShowForgotPassword(false);
            if (Platform.OS === "android") {
              ToastAndroid.show('Password reset sent', ToastAndroid.SHORT);
            } else {
              Alert.alert('', 'Password reset sent');
            }
          }}
        />
      </CustomOverlay>
      <CustomOverlay
        isVisible={isShowRegistration}
        onClose={() => setShowRegistration(false)}
      >
        <Register
          onSuccess={() => {
            setShowRegistration(false);
            if (Platform.OS === "android") {
              ToastAndroid.show('Registration successful', ToastAndroid.SHORT);
            } else {
              Alert.alert('', 'Registration successful');
            }
          }}
        />
      </CustomOverlay>               
    </View>
  );
}


export default LoginScreen;