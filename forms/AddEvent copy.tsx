import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Platform, Image, Dimensions, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { LocationData } from 'expo-location';
import * as Permissions from 'expo-permissions';
import { SearchBar, Text } from 'react-native-elements';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';

import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';

import ThemeContext from '../context/ThemeContext';
import { ScrollView } from 'react-native-gesture-handler';
import Rating from '../components/Rating';

const AddEvent: FunctionComponent = () => {
  const [searchValue, setSearchValue] = useState<string>(undefined);
  const [location, setLocation] = useState<LocationData>(undefined);
  const [isSearch, setSearch] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);

  const theme = useContext(ThemeContext);

  useEffect(() => {
    const searchPlaces = async () => {
      // https://maps.googleapis.com/maps/api/place/textsearch/json?query=123+main+street&location=42.3675294,-71.186966&radius=10000&key=AIzaSyBvyGlW1sM-gDFqQtOcuBL09XyGsXXClm4
      const { coords } = location;
      const { data } = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchValue}&location=${coords.latitude},${coords.longitude}&radius=10000&key=${GOOGLE_MAPS_API_KEY}`);
      setResults(data.results);
      setSearch(false);
    }

    if (isSearch && searchValue && searchValue !== "" && location) {
      searchPlaces();
    }
  }, [isSearch, searchValue, location]);


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
      height: '100%',
    },
    inputLabelStyle: {
      fontWeight: 'normal'
    },
    inputContainer: {
      color: theme.colors.snow
    },
    inputIconContainer: {
      // marginRight: 10
    },
  });

  return (
    <View>
      <View style={S.content}>
        <SearchBar
          platform='android'
          placeholder="Type Here..."
          onChangeText={setSearchValue}
          onSubmitEditing={() => {
            setResults([]);
            setSearch(true);
          }}
          value={searchValue}
          style={{ width: '100%' }}
        />
        <ScrollView>
          {isSearch ?
            (Array.from({ length: 3 }, (v, i) => i)).map(
              () => <Animatable.View
                animation="fadeIn"
                duration={3000}
                useNativeDriver={true}
                iterationCount="infinite"
                style={{
                  flexDirection: 'row',
                  backgroundColor: theme.colors.skyGrey,
                  marginBottom: 20
                }}
              ><View
                  style={{
                    height: Dimensions.get('window').height / 5,
                    width: Dimensions.get('window').width,
                    backgroundColor: theme.colors.skyGrey,
                    //opacity: 0.6,
                    paddingLeft: 30,
                    paddingRight: 30,
                    paddingTop: 60,
                  }}
                /></Animatable.View>
            ) : null}
          {results.map(
            (result) => {
              const ref = result.photos && result.photos[0] && result.photos[0].photo_reference;
              return (<View
                style={{
                  flexDirection: 'row',
                  backgroundColor: theme.colors.skyGrey,
                  marginBottom: 20
                }}
              >
                <ImageBackground
                  source={require('../assets/example.jpg')}
                  style={{
                    width: Dimensions.get("window").width,
                    height: Dimensions.get("window").height / 5
                  }}
                >
                  
                </ImageBackground>
                }
              </View>);
            }
          )}
        </ScrollView>
      </View>
    </View>
  )
}

export default AddEvent;