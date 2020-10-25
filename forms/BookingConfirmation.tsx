import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import { Button, Text } from 'react-native-elements';
import moment from 'moment';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { LocationData } from 'expo-location';
import * as Permissions from 'expo-permissions';
// @ts-ignore
import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';

import { hexToRgbA } from '../utils/colors';

import ThemeContext from '../context/ThemeContext';

import { store } from '../store';

import { Linking } from 'expo';

interface BookingConfirmationProps {
  booking: any,
  onClose: () => void
}

const BookingConfirmation: FunctionComponent<BookingConfirmationProps> = ({ booking, onClose }) => {
  const [location, setLocation] = useState<LocationData>(undefined);

  const theme = useContext(ThemeContext);

  // @ts-ignore
  const { state } = useContext(store);

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.error('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      _getLocationAsync();
    }
  }, []);

  const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const S = StyleSheet.create({
    content: {
      backgroundColor: theme.colors.snow,
      justifyContent: 'flex-start',
      flexDirection: 'column',
      height: '100%',
      paddingTop: 50,
      paddingBottom: 5,
      paddingLeft: 30,
      paddingRight: 30
    },
    directionsButtonContainer: {
      flex: 0.5,
    },
    directionsButton: {
      backgroundColor: hexToRgbA(theme.colors.primary, 0.2),
      paddingHorizontal: 5
    },
    directionsTitle: {
      color: theme.colors.primary,
      fontFamily: 'roboto-medium',
      fontSize: 18
    },
  });

  const { startDate, hotel } = booking;
  const { address, hotelName, contactNumber, latitude, longitude, city } = hotel;

  return (
    <View style={S.content}>
      <View >
        <Text style={theme.text1}>{moment(startDate).format('DD MMMM YYYY')}</Text>
        <Text style={theme.text2}>{hotelName}</Text>
        <Text style={theme.header1}>{"You're all set we'll see you soon"}</Text>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 30,
          }}
        >
          <View
            style={{
              marginRight: 20,
              justifyContent: 'center'
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`https://maps.googleapis.com/maps/api/staticmap?center=${hotel.latitude},${hotel.longitude}&zoom=13&scale=1&size=600x300&maptype=roadmap&format=png&visual_refresh=true&key=${GOOGLE_MAPS_API_KEY}`);
              }}
            >
              <Image
                style={{
                  width: Dimensions.get("window").width / 4,
                  aspectRatio: 3 / 2
                }}
                source={{
                  uri: `https://maps.googleapis.com/maps/api/staticmap?center=${hotel.latitude},${hotel.longitude}&zoom=13&scale=1&size=600x300&maptype=roadmap&format=png&visual_refresh=true&key=${GOOGLE_MAPS_API_KEY}`
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={theme.text2}>{`${address}, ${city}`}</Text>
              <TouchableOpacity
                onPress={
                  () => {
                    Linking.openURL(`tel:${contactNumber}`);  
                  }
                }
              >
                <Text style={theme.link}>{contactNumber}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{ flexDirection: 'row', paddingBottom: 20 }}
        >
          <Button
            containerStyle={S.directionsButtonContainer}
            buttonStyle={S.directionsButton}
            titleStyle={S.directionsTitle}
            title="Hotel Directions"
            onPress={() => {
              if (location) {
                const { coords } = location;
                Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${coords.latitude},${coords.longitude}&destination=${hotel.latitude},${hotel.longitude}&travelmode=driving`);
              }
            }}
          />
        </View>
      </View>
      <Text style={theme.text1}>{'Here are the details of your city'}</Text>
      <View style={{
        flex: 1,
        justifyContent: 'flex-end',
      }}>
        <Button
          title="New Booking"
          buttonStyle={theme.form.button.style}
          titleStyle={theme.form.button.title}
          onPress={() => { 
            onClose();
          }}
        />
      </View>
    </View>
  )
}

export default BookingConfirmation;