import React, { FunctionComponent, useContext, useState } from 'react';
import { StyleSheet, View, Dimensions, Image, ScrollView, Platform, ToastAndroid, Alert } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { Overlay, Text } from 'react-native-elements';
import { FAB } from 'react-native-paper';

import ThemeContext from '../context/ThemeContext';

import { store } from '../store';

import SearchHotels from '../forms/SearchHotels';
import HotelCard from '../components/HotelCard';
import TopTabBarView from '../components/TopTabBarView';
import Review from '../components/Review';
import MakeBooking from '../forms/MakeBooking';

interface HotelsScreenProps {
  navigation: NavigationStackProp<{ userId: string }>;
}

const HotelsScreen: FunctionComponent<HotelsScreenProps> = ({ navigation }) => {
  const [hotel, setHotel] = useState<any>(undefined);
  const [isShowSearchHotels, setShowSearchHotels] = useState<boolean>(true);
  const [isShowMakeBooking, setShowMakeBooking] = useState<boolean>(false);

  const theme = useContext(ThemeContext);

  // @ts-ignore
  const { state } = useContext(store);

  const S = StyleSheet.create({
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      justifyContent: 'flex-start',
      flexDirection: 'column'
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 30,
      margin: 5,
      marginTop: 10,
      height: 50
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary
    },
  });

  const closeSearchHotelsOverlay = () => {
    if (hotel) { // if we already have previously searched hotels
      setShowSearchHotels(false);
    } else { // otherwise navigate back
      setShowSearchHotels(false);
      // navigation.goBack();
    }
  }

  const _renderDetails = () => {
    return (
      <View style={S.content}>
        {hotel ?
          <HotelCard
            hotelName={hotel.hotelName}
            hotelLocation={hotel.hotelLocation}
            rating={hotel.ratings.reduce(
              (acc: number, cur: any, idx: number) => acc + cur.rating, 0
            ) / hotel.ratings.length}
            hotelContact={hotel.hotelContact}
            hotelAddress={hotel.hotelAddress}
            hotelImage={hotel.hotelImage}
            contentHeader="Ready when you are"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin placerat eros quam, eleifend luctus nunc convallis in. Nulla tincidunt risus sit amet urna placerat, vel pellentesque est pretium."
            showBooking={true}
            onShowBookingPress={() => setShowMakeBooking(true)}
          /> :
          null
        }
        <Overlay
          isVisible={isShowSearchHotels}
          windowBackgroundColor="rgba(0, 0, 0, 0.5)"
          overlayBackgroundColor={theme.colors.snow}
          width={Dimensions.get("window").width - 50}
          height={Dimensions.get("window").height - 50}
          overlayStyle={{
            borderRadius: 30,
            position: 'absolute',
            top: 20,
          }}
          onBackdropPress={closeSearchHotelsOverlay}
          onRequestClose={closeSearchHotelsOverlay}
        >
          {isShowSearchHotels ? <SearchHotels
              onSuccess={(hotel) => {
                setHotel(hotel);
                closeSearchHotelsOverlay();
              }}           
            /> : null
          }
        </Overlay>
        <Overlay
          isVisible={isShowMakeBooking}
          windowBackgroundColor="rgba(0, 0, 0, 0.5)"
          overlayBackgroundColor={theme.colors.snow}
          width={Dimensions.get("window").width - 50}
          height={Dimensions.get("window").height - 50}
          overlayStyle={{
            borderRadius: 30,
            position: 'absolute',
            top: 20,
          }}
          onBackdropPress={() => setShowMakeBooking(false)}
          onRequestClose={() => setShowMakeBooking(false)}
        >
          <MakeBooking
            onSuccess={() => {
              setShowMakeBooking(false);
              if (Platform.OS === "android") {
                ToastAndroid.show('Booking created', ToastAndroid.SHORT);
              } else {
                Alert.alert('', 'Booking created');
              }              
            }}
            hotel={hotel}
          />
        </Overlay>
        <FAB
          style={S.fab}
          icon="magnify"
          onPress={() => setShowSearchHotels(true)}
        />
      </View>
    )
  }

  const _renderReviews = () => {
    const combinedStyle = StyleSheet.flatten([S.content, {
      paddingTop: 50
    }]);
    return (
      <View style={combinedStyle}>
        <ScrollView>
          {hotel && hotel.ratings && hotel.ratings.map(
            (rating: any, index: number) => {
              return (
                <Review
                  key={index}
                  rating={rating}
                />
              )
            }
          )}
        </ScrollView>
        <FAB
          style={S.fab}
          icon="plus"
          onPress={() => alert('To do')}
        />
      </View>
    );
  }

  const tabs = [
    {
      title: "Details",
      component: () => _renderDetails(),
    },
    {
      title: "Reviews",
      component: () => _renderReviews(),
    },
  ]

  if (hotel) return (
    <TopTabBarView
      tabs={tabs}
    />
  );
  else return (
    <View style={S.content}>
      {_renderDetails()}
    </View>
  )

}

export default HotelsScreen;