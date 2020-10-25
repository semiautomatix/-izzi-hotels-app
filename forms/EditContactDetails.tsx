import React, { useContext, FunctionComponent, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';

import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';

import ThemeContext from '../context/ThemeContext';

import { store } from '../store';

import MyGooglePlacesAutocomplete from '../components/MyGooglePlacesAutocomplete';
import CustomInput from '../components/CustomInput';

interface EditContactDetailsProps {
  onSuccess: () => void
}

const EditContactDetails: FunctionComponent<EditContactDetailsProps> = ({ onSuccess }) => {
  const [firstName, setFirstName] = useState<string>(undefined);
  const [middleName, setMiddleName] = useState<string>(undefined);
  const [surname, setSurname] = useState<string>(undefined);
  const [address, setAddress] = useState<string>(undefined);
  const [emailAddress, setEmailAddress] = useState<string>(undefined);
  const [showPlacesList, setShowPlacesList] = useState<boolean>(false);

  const theme = useContext(ThemeContext);

  // @ts-ignore
  const { state } = useContext(store);

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
    <View style={S.content}>
      <Text style={S.header}>
        Contact Details
      </Text>  
      <View
        style={{ flex: 1 }}
        // keyboardShouldPersistTaps='always'
      >
        <CustomInput
          label='First Name'
          onChangeText={setFirstName}
          value={firstName}
        />
        <CustomInput
          label='Middle Name'
          onChangeText={setMiddleName}
          value={middleName}
        />
        <CustomInput
          label='Surname'
          onChangeText={setSurname}
          value={surname}
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
          listViewDisplayed={showPlacesList}   // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data: any, details = null) => { // 'details' is provided when fetchDetails = true
            setAddress(data.description);
            setShowPlacesList(false);
          }}
          textInputProps={{
            onFocus: () => setShowPlacesList(true),
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
        <CustomInput
          label='Email Address'
          onChangeText={setEmailAddress}
          value={emailAddress}
        />
      </View>
      <View style={{ 
        flex: 1,
        justifyContent: 'flex-end',
      }}>
        <Button
          title="Save"
          buttonStyle={theme.form.button.style}
          titleStyle={theme.form.button.title}
          onPress={onSuccess}
        />
      </View>
    </View>
  );
};

export default EditContactDetails;