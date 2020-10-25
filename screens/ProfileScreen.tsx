import React, { useContext, FunctionComponent, useState } from 'react';
import { View, StyleSheet, AsyncStorage, ImageBackground, Platform, ToastAndroid, Alert, KeyboardAvoidingView } from 'react-native';
import { Button, Icon, Overlay } from 'react-native-elements';

import ThemeContext from '../context/ThemeContext';

import { store } from '../store';

import EditContactDetails from '../forms/EditContactDetails';
import EditProfileDetails from '../forms/EditProfileDetails';
import ChangePassword from '../forms/ChangePassword';
import SupportRequest from '../forms/SupportRequest';
import CustomOverlay from '../components/CustomOverlay';

interface ProfileScreenProps {
  navigation: any
}

const ProfileScreen: FunctionComponent<ProfileScreenProps> = ({ navigation }) => {
  const [isShowEditContactDetails, setShowEditContactDetails] = useState<boolean>(false);
  const [isShowEditProfileDetails, setShowEditProfileDetails] = useState<boolean>(false);
  const [isShowChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [isShowSupportRequest, setShowSupportRequest] = useState<boolean>(false);

  const theme: any = useContext(ThemeContext);

  // @ts-ignore
  const { state } = useContext(store);
  const { nationalities } = state;

  const S = StyleSheet.create({
    scene: {
      flex: 1,
      backgroundColor: theme.scene.backgroundColor,
    },
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      marginTop: 30,
      borderRadius: 30,
      padding: 30,
      flexDirection: 'column',
    },
  });

  return (
    <View style={S.scene}>
      <View style={theme.scene.logo.container}>
        <ImageBackground
          source={require('../assets/profile.jpg')}
          style={theme.scene.logo.image}
        >
          <Icon
            name='pencil'
            type='material-community'
            size={100}
            color='rgba(255, 255, 255, 0.75)'
            onPress={() => alert('to do')}
          />
        </ImageBackground>
      </View>
      <View style={S.content}>
        <View
          style={{}}
        >
          <Button
            containerStyle={{
              marginBottom: 10
            }}
            buttonStyle={{
              backgroundColor: theme.colors.snow,
              borderColor: theme.colors.primary,
              height: 50,
              width: '100%',
            }}
            titleStyle={{
              color: theme.colors.primary,
              fontFamily: 'roboto-condensed-regular'
            }}
            type='outline'
            title='Contact Details >'
            onPress={
              () => setShowEditContactDetails(true)
            }
          />
          <Button
            containerStyle={{
              marginBottom: 10
            }}
            buttonStyle={{
              backgroundColor: theme.colors.snow,
              borderColor: theme.colors.primary,
              height: 50,
              width: '100%',
            }}
            titleStyle={{
              color: theme.colors.primary,
              fontFamily: 'roboto-condensed-regular'
            }}
            type='outline'
            title='Profile >'
            onPress={
              () => setShowEditProfileDetails(true)
            }
          />
          <Button
            containerStyle={{
              marginBottom: 10
            }}
            buttonStyle={{
              backgroundColor: theme.colors.snow,
              borderColor: theme.colors.primary,
              height: 50,
              width: '100%',
            }}
            titleStyle={{
              color: theme.colors.primary,
              fontFamily: 'roboto-condensed-regular'
            }}
            type='outline'
            title='Change Password >'
            onPress={
              () => setShowChangePassword(true)
            }
          />
          <Button
            buttonStyle={{
              backgroundColor: theme.colors.snow,
              borderColor: theme.colors.primary,
              height: 50,
              width: '100%',
            }}
            titleStyle={{
              color: theme.colors.primary,
              fontFamily: 'roboto-condensed-regular'
            }}
            type='outline'
            title='Submit Support Request >'
            onPress={
              () => setShowSupportRequest(true)
            }
          />
        </View>
        <View
          style={theme.form.button.container}
        >
          <Button
            title="Logout"
            buttonStyle={theme.form.button.style}
            titleStyle={theme.form.button.title}
            onPress={async () => {
              await AsyncStorage.removeItem('userToken');
              navigation.navigate('Auth');
            }}
          />
        </View>
      </View>
      <CustomOverlay
        isVisible={isShowEditContactDetails}
        onClose={() => setShowEditContactDetails(false)}
      >
        <EditContactDetails
          onSuccess={() => {
            setShowEditContactDetails(false);
            if (Platform.OS === "android") {
              ToastAndroid.show('Contact details saved', ToastAndroid.SHORT);
            } else {
              Alert.alert('', 'Contact details saved');
            }
          }}
        />
      </CustomOverlay>
      <CustomOverlay
        isVisible={isShowEditProfileDetails}
        onClose={() => setShowEditProfileDetails(false)}
      >
        <EditProfileDetails
          onSuccess={() => {
            setShowEditProfileDetails(false);
            if (Platform.OS === "android") {
              ToastAndroid.show('Profile details saved', ToastAndroid.SHORT);
            } else {
              Alert.alert('', 'Profile details saved');
            }
          }}
        />
      </CustomOverlay>
      <CustomOverlay
        isVisible={isShowChangePassword}
        onClose={() => setShowChangePassword(false)}
      >
        <ChangePassword
          onSuccess={() => {
            setShowChangePassword(false);
            if (Platform.OS === "android") {
              ToastAndroid.show('Password updated', ToastAndroid.SHORT);
            } else {
              Alert.alert('', 'Password updated');
            }
          }}
        />
      </CustomOverlay>
      <CustomOverlay
        isVisible={isShowSupportRequest}
        onClose={() => setShowSupportRequest(false)}
      >
        <SupportRequest
          onSuccess={() => {
            setShowSupportRequest(false);
            if (Platform.OS === "android") {
              ToastAndroid.show('Support Request submitted', ToastAndroid.SHORT);
            } else {
              Alert.alert('', 'Support Request submitted');
            }
          }}
        />
      </CustomOverlay>
    </View>
  );
};

export default ProfileScreen;