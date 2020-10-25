import React, { useContext, FunctionComponent, useState } from 'react';
import { View, StyleSheet, AsyncStorage, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';

import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';

import ThemeContext from '../context/ThemeContext';

import { store } from '../store';

import DropDown from '../components/DropDown';
import MyGooglePlacesAutocomplete from '../components/MyGooglePlacesAutocomplete';

interface ProfileScreenProps {
  navigation: any
}

const ProfileScreen: FunctionComponent<ProfileScreenProps> = ({ navigation }) => {
  const [name, setName] = useState<string>(undefined);
  const [address, setAddress] = useState<string>(undefined);
  const [emailAddress, setEmailAddress] = useState<string>(undefined);
  const [nationality, setNationality] = useState<string>(undefined);
  const [ageRange, setAgeRange] = useState<string>(undefined);
  const [gender, setGender] = useState<string>(undefined);

  const theme = useContext(ThemeContext);

  // @ts-ignore
  const { state } = useContext(store);
  const { nationalities } = state;

  const S = StyleSheet.create({
    scene: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      height: Dimensions.get('window').height / 5.5
    },
    logoContainer: {
      paddingTop: 20,
      alignItems: 'center',
      height: Dimensions.get('window').height / 4.5,
    },
    profilePicture: {
      height: '100%',
      width: Dimensions.get('window').width / 3,
      flex: 1,
      justifyContent: 'center'
    },
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      marginTop: 30,
      borderRadius: 30,
      padding: 30
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 30,
      margin: 5,
      marginTop: 10,
      height: 50
    },
    inputLabelStyle: {
      fontWeight: 'normal'
    },
    inputContainer: {
      color: theme.colors.snow
    },
    inputIconContainer: {
      marginRight: 10
    },
    label: {
      fontSize: 16,
      marginLeft: 10,
      color: 'grey',
      fontWeight: 'normal'
    }
  });

  return (
    <View style={S.scene}>
      <View style={S.logoContainer}>
        <ImageBackground
          source={require('../assets/profile.jpg')}
          style={S.profilePicture}
        >
          <Icon
            name='pencil'
            type='material-community'
            size={100}
            color='rgba(255, 255, 255, 0.75)'
            onPress={() => alert('edit')}
          />
        </ImageBackground>
      </View>
      <View style={S.content}>
        <ScrollView 
          style={{ flex: 1 }}
          keyboardShouldPersistTaps='always'
        >
          <Input
            labelStyle={S.inputLabelStyle}
            label='Name'
            leftIcon={
              <Icon
                name='account'
                type='material-community'
                size={24}
                color={theme.primaryColor}
                containerStyle={S.inputIconContainer}
              />
            }
            onChangeText={setName}
            value={name}
          />
          <MyGooglePlacesAutocomplete
            label="Address"
            leftIcon={
              <Icon
                name='home-map-marker'
                type='material-community'
                size={24}
                color={theme.primaryColor}
                containerStyle={S.inputIconContainer}
              />
            }            
            placeholder='Search'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed={false}   // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data: any, details = null) => { // 'details' is provided when fetchDetails = true
              setAddress(data.description);
            }}

            getDefaultValue={address}

            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: GOOGLE_MAPS_API_KEY,
              language: 'en', // language of the results
              // types: '(cities)' // default: 'geocode'
            }}

            // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            // currentLocationLabel="Current location"
            /*nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
              type: 'cafe'
            }}

            GooglePlacesDetailsQuery={{
              // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
              fields: 'formatted_address',
            }}*/

            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            // predefinedPlaces={[homePlace, workPlace]}

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          //renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
          //renderRightButton={() => <Text>Custom text after the input</Text>}
          />
          <Input
            labelStyle={S.inputLabelStyle}
            label='Email Address'
            leftIcon={
              <Icon
                name='email'
                size={24}
                color={theme.primaryColor}
                containerStyle={S.inputIconContainer}
              />
            }
            onChangeText={setEmailAddress}
            value={emailAddress}
          />
          <DropDown
            labelStyle={S.inputLabelStyle}
            label='Nationality'
            leftIcon={
              <Icon
                name='flag'
                size={24}
                color={theme.primaryColor}
                containerStyle={S.inputIconContainer}
              />
            }
            items={nationalities.map(
              (nationality: string) => ({
                label: nationality,
                value: nationality
              })
            )}
            onValueChange={(itemValue, itemIndex) => { setNationality(itemValue) }}
            selectedValue={nationality}
            nullable={true}
          />
          <DropDown
            labelStyle={S.inputLabelStyle}
            label='Age Range'
            leftIcon={
              <Icon
                name='calendar'
                type='material-community'
                size={24}
                color={theme.primaryColor}
                containerStyle={S.inputIconContainer}
              />
            }
            items={[
              { label: '18 - 24', value: '18_24' },
              { label: '25 - 34', value: '25_34' },
              { label: '35 - 44', value: '35_44' },
              { label: '45 - 54', value: '45_54' },
              { label: '55 - 64', value: '18_24' },
              { label: '65+', value: '65' },
            ]}
            onValueChange={(itemValue, itemIndex) => { setAgeRange(itemValue) }}
            selectedValue={ageRange}
            nullable={true}
          />
          <DropDown
            labelStyle={S.inputLabelStyle}
            label='Gender'
            leftIcon={
              <Icon
                name='gender-transgender'
                type='material-community'
                size={24}
                color={theme.primaryColor}
                containerStyle={S.inputIconContainer}
              />
            }
            items={[
              { label: 'Female', value: 'female' },
              { label: 'Male', value: 'male' },
              { label: 'Non Binary', value: 'non_binary' },
            ]}
            onValueChange={(itemValue, itemIndex) => { setGender(itemValue) }}
            selectedValue={gender}
            nullable={true}
          />
        </ScrollView>
        <View style={{ flex: 1 }}>
          <Button
            title="Change Password"
            buttonStyle={S.button}
            onPress={async () => { }}
          />
          <Button
            title="Logout"
            buttonStyle={S.button}
            onPress={async () => {
              await AsyncStorage.removeItem('userToken');
              navigation.navigate('Auth');
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;