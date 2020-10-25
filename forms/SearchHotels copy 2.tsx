import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Platform, ScrollView, Image } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { LocationData } from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Text, Button } from 'react-native-elements';
import { getDistance } from 'geolib';

import ThemeContext from '../context/ThemeContext';

// GraphQL
import { useAllHotelsQuery } from '../graphql/bookings/queries';

import CustomDateTimeInput from '../components/CustomDateTimeInput';
import moment from 'moment';
import CounterInput from '../components/CounterInput';
import CustomAutocomplete from '../components/CustomAutocomplete';

// mock data
// import { hotels } from '../mock_data.js'

interface SearchHotelsProps {
  onSearchClick: (hotel: any, startDate: Date, endDate: Date, numberOfRooms: number, numberOfAdults: number, numberOfChildren: Number) => void
}

const SearchHotels: FunctionComponent<SearchHotelsProps> = ({ onSearchClick }) => {
  const [location, setLocation] = useState<LocationData>(undefined);
  const [hotel, setHotel] = useState<any>(undefined);  
  const [startDate, setStartDate] = useState<Date>(undefined);
  const [endDate, setEndDate] = useState<Date>(undefined);
  const [numberOfRooms, setNumberOfRooms] = useState<number>(1);
  const [numberOfAdults, setNumberOfAdults] = useState<number>(0);
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);  

  const theme: any = useContext(ThemeContext);

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
    header: {
      color: theme.form.header.color, 
      fontFamily: theme.form.header.fontFamily, 
      fontSize: theme.form.header.fontSize, 
      margin: 0, 
      marginBottom: 20
    },
  });

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.error('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      _getLocationAsync();
    }
  }, []);

  const { loading, error, data } = useAllHotelsQuery(); 

  const _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const calculateDistance = (latitude: number, longitude: number) => {
    if (!location) return 0;
    const { coords } = location;
    return getDistance(
      { latitude: coords.latitude, longitude: coords.latitude },
      { latitude, longitude }
    );
  }

  return (
      <View style={S.scene}>
        <View style={theme.scene.logo.container}>
          <Image
            source={require('../assets/izzi-logo.png')}
            style={theme.scene.logo.image}
          />
        </View>
          {!loading ? <View style={S.content}>
            <Text style={S.header}>
              Search Hotels
            </Text>
            <ScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="always"
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}  >
                  <CustomAutocomplete 
                    initialValue={hotel && hotel.hotelName}
                    label="Location"
                    // @ts-ignore              
                    data={data.allHotels} 
                    valueExtractor={(item: any) => item.hotelName}
                    handleSelectItem={(item: any) => setHotel(item)}
                    noDataText="No results"
                    placeholder="Where Next?"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <CounterInput 
                    label='Rooms'
                    value={numberOfRooms}
                    onChangeValue={setNumberOfRooms}
                    minimum={1}
                  />        
                </View>     
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <CustomDateTimeInput              
                    label='Arrival'
                    placeholder='Arrival'
                    onDateTimeChange={setStartDate}
                    value={startDate && moment(startDate).format('DD MMM YYYY hh:mm A')}
                    inputStyle={{ fontSize: theme.form.input.dateTimeInput.fontSize }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <CustomDateTimeInput
                    label='Departure'
                    placeholder='Departure'
                    onDateTimeChange={setEndDate}
                    value={endDate && moment(endDate).format('DD MMM YYYY hh:mm A')}
                    inputStyle={{ fontSize: theme.form.input.dateTimeInput.fontSize }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <CounterInput 
                    label='Adults'
                    value={numberOfAdults}
                    onChangeValue={setNumberOfAdults}
                    minimum={1}
                  /> 
                </View> 
                <View style={{ flex: 1 }}>
                  <CounterInput 
                    label='Children'
                    value={numberOfChildren}
                    onChangeValue={setNumberOfChildren}
                    minimum={0}
                  />        
                </View>     
              </View>
            </ScrollView>
            <View         
              style={{
                justifyContent: 'flex-end',
                marginBottom: 170,
                marginTop: 20,
              }}
            >
              <Button
                title="Search"
                buttonStyle={theme.form.button.style}
                titleStyle={theme.form.button.title}
                disabled={!hotel || !startDate || !endDate}
                onPress={() => onSearchClick(hotel, startDate, endDate, numberOfRooms, numberOfAdults, numberOfChildren)}
              />
            </View>        
          </View> : null}          
      </View>
    )
  }

export default SearchHotels;