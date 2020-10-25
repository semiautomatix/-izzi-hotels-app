import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Platform, ScrollView, Dimensions, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { LocationData } from 'expo-location';
import * as Permissions from 'expo-permissions';
import { SearchBar, Text } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

import ThemeContext from '../context/ThemeContext';

import { store } from '../store';

import { hexToRgbA } from '../utils/colors';
import Rating from '../components/Rating';
import CustomSearchBar from '../components/CustomSearchBar';

interface SearchHotelsProps {
  onSuccess: (hotel: any) => void
}

const hotels = [{
  id: 1,
  hotelName: "Vibrant Cape",
  hotelLocation: "City Town",
  hotelContact: "087 123 3456",
  hotelAddress: "12 Prmendane, Langebaan",
  hotelImage: require('../assets/example.jpg'),
  contentHeader: "Ready when you are",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
  ratings: [
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 4.5,
      user: {
        first_name: 'Janis',
        last_name: 'Joplin'
      }
    },
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 1,
      user: {
        first_name: 'Jim',
        last_name: 'Morrison'
      }
    },
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 2,
      user: {
        first_name: 'Amy',
        last_name: 'Winehouse'
      }
    },
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 3,
      user: {
        first_name: 'Jimi',
        last_name: 'Hendrix'
      }
    },
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 5,
      user: {
        first_name: 'Kurt',
        last_name: 'Cobain'
      }
    },
  ]
},
{
  id: 2,
  hotelName: "iZZi Nelspruit",
  hotelLocation: "Nelspruit",
  hotelContact: "087 123 3456",
  hotelAddress: "178 Main Rd, Nelspruit",
  hotelImage: { uri: 'https://q-cf.bstatic.com/images/hotel/max1024x768/145/145742443.jpg' },
  contentHeader: "Ready when you are",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
  ratings: [
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 4.5,
      user: {
        first_name: 'Brad',
        last_name: 'Pitt'
      }
    },
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 2.5,
      user: {
        first_name: 'Jennifer',
        last_name: 'Aniston'
      }
    },
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 3.5,
      user: {
        first_name: 'Courtney',
        last_name: 'Cox'
      }
    },
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 3,
      user: {
        first_name: 'David',
        last_name: 'Schwimmer'
      }
    },
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 5,
      user: {
        first_name: 'Lisa',
        last_name: 'Kudrow'
      }
    },
    {
      review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium.",
      rating: 1,
      user: {
        first_name: 'Matthew',
        last_name: 'Perry'
      }
    },
  ]
},]

const SearchHotels: FunctionComponent<SearchHotelsProps> = ({ onSuccess }) => {
  const [location, setLocation] = useState<LocationData>(undefined);
  const [searchValue, setSearchValue] = useState<string>(undefined);
  const [isSearch, setSearch] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  // const [hotel, setHotel] = useState<any>(undefined);  

  const theme = useContext(ThemeContext);

  // @ts-ignore
  const { state } = useContext(store);
  const { services } = state;

  const S = StyleSheet.create({
    scene: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      height: Dimensions.get('window').height / 5.5
    },
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      marginTop: 30,
      borderRadius: 30,
      padding: 30,
      flexDirection: 'column',
    },
    logoContainer: {
      paddingTop: 20,
      alignItems: 'center',
      height: Dimensions.get('window').height / 4.5,
    },
    logoStyle: {
      width: Dimensions.get('window').width / 3,
      flex: 1,
      justifyContent: 'center',
      resizeMode: 'contain',
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 30,
      margin: 5,
      marginTop: 10,
      height: 50
    },
  });

  /*useEffect(() => {
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
  }, [isSearch, searchValue, location, radius]);*/


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

  const startSearch = () => {
    setResults([]);
    // setHotel(undefined);
    setSearch(true);
  }

  const _renderSearchResults = () => {
    return (
      <React.Fragment>
        <ScrollView>
          {isSearch ?
            (Array.from({ length: 3 }, (v, i) => i)).map(
              (_, index) => <Animatable.View
                animation="fadeIn"
                duration={3000}
                useNativeDriver={true}
                iterationCount="infinite"
                style={{
                  flexDirection: 'row',
                  backgroundColor: theme.colors.skyGrey,
                  marginBottom: 20
                }}
                key={index}
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
          {hotels.map(
            (hotel, index) => {
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
                    onSuccess(hotel)
                  }}
                >
                  <ImageBackground
                    source={hotel.hotelImage}
                    style={{
                      width: Dimensions.get("window").width,
                      height: Dimensions.get("window").height / 5
                    }}
                  >
                    <View
                      style={{
                        height: Dimensions.get('window').height / 5,
                        width: Dimensions.get('window').width,
                        backgroundColor: 'black',
                        opacity: 0.5,
                        paddingLeft: 30,
                        paddingRight: 30,
                        paddingTop: 60,
                      }}
                    />
                    <View
                      style={{
                        height: Dimensions.get('window').height / 5,
                        width: Dimensions.get('window').width - 80,
                        top: (Dimensions.get('window').height / 5) * -1,
                        paddingLeft: 30,
                        paddingRight: 30,
                        paddingTop: 10
                      }}
                    >
                      <Text
                        style={{ color: 'white', fontFamily: 'josefin-sans-bold', fontSize: 25, margin: 0 }}
                        numberOfLines={2}
                        ellipsizeMode='tail'
                      >
                        {hotel.hotelName}
                      </Text>
                      <Text
                        style={{ color: 'white', fontFamily: 'josefin-sans-bold', fontSize: 16 }}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                      >
                        {hotel.hotelLocation}
                      </Text>
                      <Rating
                        value={hotel.ratings.reduce(
                          (acc: number, cur: any, idx: number) => acc + cur.rating, 0
                        ) / hotel.ratings.length}
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

  return (
    <View style={S.scene}>
      {!searchValue || searchValue === '' ? <View style={S.logoContainer}>
        <Image
          source={require('../assets/izzi-logo.png')}
          style={S.logoStyle}
        />
      </View> : null}
      <View style={S.content}>
        <Text style={{ color: theme.colors.primary, fontFamily: 'roboto-condensed-bold', fontSize: 35, margin: 0, marginBottom: 20 }}>
          Search Hotels
        </Text>
        <CustomSearchBar
          //platform='android'
          placeholder="Where Next?"
          //onChangeText={setSearchValue}
          //onSubmitEditing={startSearch}
          //onBlur={startSearch}
          value={searchValue}
        />
        <Text
          style={{
            marginBottom: 20
          }}
        >
          Search near my location
        </Text>
        {searchValue && searchValue !== "" ? _renderSearchResults() : null}
      </View>
    </View>
  )
}

export default SearchHotels;