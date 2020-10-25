import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Platform, Dimensions, ImageBackground, TouchableOpacity, ScrollView, Slider } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { LocationData } from 'expo-location';
import * as Permissions from 'expo-permissions';
import { SearchBar, Text, Button } from 'react-native-elements';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import * as yup from 'yup';

// @ts-ignore
import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';

// GraphQL
import { useCreateEvent } from '../graphql/bookings/mutations';

import * as messages from '../utils/messages';

import ThemeContext, { heightPercentageToDP, widthPercentageToDP } from '../context/ThemeContext';
import Rating from '../components/Rating';
import CustomDateTimeInput from '../components/CustomDateTimeInput';
import CustomSearchBar from '../components/CustomSearchBar';

interface AddEventProps {
  onSuccess: () => void
}

const AddEvent: FunctionComponent<AddEventProps> = ({ onSuccess }) => {
  const [searchValue, setSearchValue] = useState<string>(undefined);
  const [location, setLocation] = useState<LocationData>(undefined);
  const [radius, setRadius] = useState<number>(10);
  const [isSearch, setSearch] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [place, setPlace] = useState<any>(undefined);
  const [startDateTime, setStartDateTime] = useState<Date>(undefined);
  const [endDateTime, setEndDateTime] = useState<Date>(undefined);
  const [errors, setErrors] = useState<yup.ValidationError[]>([]); 

  const theme: any = useContext(ThemeContext);

  useEffect(() => {
    const searchPlaces = async () => {
      // https://maps.googleapis.com/maps/api/place/textsearch/json?query=123+main+street&location=42.3675294,-71.186966&radius=10000&key=AIzaSyBvyGlW1sM-gDFqQtOcuBL09XyGsXXClm4
      const { coords } = location;
      const { data } = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchValue}&location=${coords.latitude},${coords.longitude}&radius=${radius * 1000}&key=${GOOGLE_MAPS_API_KEY}`);
      setResults(data.results);
      setSearch(false);
    }

    if (isSearch && searchValue && searchValue !== "" && location) {
      searchPlaces();
    }
  }, [isSearch, searchValue, location, radius]);


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
  });

  const [useCreateEventFn] = useCreateEvent({
    // should authentication be successful store token and navigate to home screen
    async update(cache, { data: { creatEvent: { ok, event }} }) {      
      if (ok) {   
        /*const { events } = cache.readQuery({ query: eventsQuery });
        cache.writeQuery({
          query: eventsQuery,
          data: { events: events.concat([event]) },
        });*/
        onSuccess();
      } else {
        messages.showMessage('Failed to create Event');
      }
    }
  });     

  const startSearch = () => {
    setResults([]);
    setPlace(undefined);
    setSearch(true);
  }

  // validation schema
  const schema = yup.object().shape({
    startDateTime: yup.date().required().label("Start Time"),
    endDateTime: yup.date().required().label("End Time"),
  });     

  const createEvent = async () => {
    try {
      // validate fields
      await schema.validate(
        {
          startDateTime,
          endDateTime
        }, {abortEarly: false}
      )
      // if validation finds not errors clear errors then attempt authentication
      setErrors([]);
      try {
        await useCreateEventFn(              
          {
            variables: {
              input: {
                eventName: place.name,
                startDateTime,
                endDateTime,
                eventMetadata: JSON.stringify(place)
              }
            }
          }
        );         
        onSuccess();                    
      } catch (err) {
        // translate error
        console.log(err);
        messages.showMessage('Failed to create Event');
      }   
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors(err.inner);
      } else {
        console.error(err);
      }
    } 
  }

  const _renderSearch = () => {
    return (<React.Fragment>
      <ScrollView>
        {isSearch ?
          (Array.from({ length: 3 }, (v, i) => i)).map(
            (_, index) => <Animatable.View
              animation="fadeIn"
              duration={3000}
              useNativeDriver={true}
              iterationCount="infinite"
              style={theme.events.search.placeHolder.container}
              key={index}
            ><View
                style={theme.events.search.placeHolder.style}
              /></Animatable.View>
          ) : null}
        {results.map(
          (result, index) => {
            const ref = result.photos && result.photos[0] && result.photos[0].photo_reference;
            return (<View
              key={index}
              style={{
                flexDirection: 'row',
                backgroundColor: theme.colors.skyGrey,
                marginBottom: 20
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setPlace(result);
                  setStartDateTime(undefined);
                  setEndDateTime(undefined);
                }}
              >
                <ImageBackground
                  source={ref ?
                    { uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_MAPS_API_KEY}` } :
                    require('../assets/park.jpg')
                  }
                  style={theme.events.search.result.container}
                >
                  <View
                    style={StyleSheet.flatten([theme.events.search.result.content,{
                      top: 0,
                      backgroundColor: 'black',
                      opacity: 0.5,
                      paddingTop: 60                         
                    }])}
                  />
                  <View
                    style={theme.events.search.result.content}
                  >
                    <Text
                      style={{ 
                        color: 'white', 
                        fontFamily: 'josefin-sans-bold', 
                        fontSize: 25, 
                        margin: 0 
                      }}
                      numberOfLines={2}
                      ellipsizeMode='tail'
                    >
                      {result.name}
                    </Text>
                    <Text
                      style={{ 
                        color: 'white', 
                        fontFamily: 'josefin-sans-bold', 
                        fontSize: 16 }}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {result.formatted_address}
                    </Text>
                    <Rating
                      value={result.rating}
                      count={5}
                    />
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>);
          }
        )}
      </ScrollView>
    </React.Fragment>)
  }

  const _renderDetails = () => {
    const imageMultiplier = 3;
    const ref = place.photos && place.photos[0] && place.photos[0].photo_reference;
    return (
      <React.Fragment>
        <ImageBackground
          source={ref ?
            { uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_MAPS_API_KEY}` } :
            require('../assets/park.jpg')
          }
          style={{
            height: Dimensions.get('window').height / imageMultiplier,
            width: '100%',
          }}
        >
          <View
            style={{
              height: Dimensions.get('window').height / imageMultiplier,
              width: '100%',
              backgroundColor: 'black',
              opacity: 0.5,
              paddingLeft: 30,
              paddingRight: 30,
              paddingTop: 60,
            }}
          />
          <View
            style={{
              height: Dimensions.get('window').height / imageMultiplier,
              width: '100%',
              // top: (Dimensions.get('window').height / imageMultiplier) * -1,
              bottom: Dimensions.get('window').height / imageMultiplier - 60,
              paddingLeft: 30,
              paddingRight: 30,
              paddingTop: 60
            }}
          >
            <Text
              style={{ color: 'white', fontFamily: 'josefin-sans-bold', fontSize: 25, marginBottom: 20 }}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {place.name}
            </Text>
            <Text
              style={{ color: 'white', fontFamily: 'josefin-sans-bold', fontSize: 16, top: -15 }}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {place.formatted_address}
            </Text>
          </View>
        </ImageBackground>
        <View
          style={{
            paddingTop: 10
          }}
        >
          <CustomDateTimeInput
            label='Start Time'
            placeholder='Event Start Time'
            onDateTimeChange={setStartDateTime}
            value={startDateTime && moment(startDateTime).format('DD MMM YYYY hh:mm A')}
            error={errors.find((error) => error.path === 'startDateTime')}
          />
          <CustomDateTimeInput
            label='End Time'
            placeholder='Event End Time'
            onDateTimeChange={setEndDateTime}
            value={endDateTime && moment(endDateTime).format('DD MMM YYYY hh:mm A')}
            error={errors.find((error) => error.path === 'endDateTime')}
          />
        </View>
        <View
          style={{            
            flex: 1,
            justifyContent: 'flex-end'
          }}
        >
          <Button
            title="Save"
            buttonStyle={theme.form.button.style}
            titleStyle={theme.form.button.title}
            onPress={createEvent}
          />
        </View>
      </React.Fragment>)
  }

  return (
    <View>
      <View style={S.content}>
        <Text style={{ color: theme.colors.primary, fontFamily: 'roboto-condensed-bold', fontSize: 35, margin: 0, marginBottom: 20 }}>
          Search Events
        </Text>
        <CustomSearchBar
          platform='android'
          placeholder="Type Here..."
          onChangeText={setSearchValue}
          onSubmitEditing={startSearch}
          onBlur={startSearch}
          value={searchValue}
        />
        <View style={{ 
            flexDirection: 'row',
            paddingBottom: 20,
          }}
        >
          <Text style={{ width: 50 }}>1km</Text>
          <Slider
            minimumValue={1}
            maximumValue={50}
            value={radius}
            onSlidingComplete={(value) => {
              setRadius(value);
              startSearch();
            }}
            style={{ flex: 1 }}
          />
          <Text style={{ width: 50 }}>50km</Text>
        </View>
        {!place && _renderSearch()}
        {place && _renderDetails()}
      </View>
    </View>
  )
}

export default AddEvent;