import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, BackHandler, Platform, ToastAndroid, Alert } from 'react-native';
import { FAB } from 'react-native-paper';
// @ts-ignore
import { PYTHON_SERVER_BASE_URL } from 'react-native-dotenv';

import ThemeContext from '../context/ThemeContext';

// GraphQL
import { useHotelQuery, useRatingsQuery } from '../graphql/bookings/queries';

import HotelCard from '../components/HotelCard';
import TopTabBarView from '../components/TopTabBarView';
import Review from '../components/Review';
import CustomOverlay from '../components/CustomOverlay';
import AddReview from '../forms/AddReview';

interface ViewHotelScreenProps {
  hotel: any,
  showSearch?: boolean,
  showConfirm?: boolean,
  allowReview?: boolean,
  onSearchPress?: () => void,
  onConfirmPress?: () => void
  onBackPress?: () => void
}

interface ReviewsProps {
  hotel: any,
  allowReview?: boolean
}

const Reviews: FunctionComponent<ReviewsProps> = ({ hotel, allowReview = false }) => {
  const [isShowAddReview, setShowAddReview] = useState<boolean>(false);

  const theme = useContext(ThemeContext);

  const S = StyleSheet.create({
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      justifyContent: 'flex-start',
      flexDirection: 'column'
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary
    },
  });

  const combinedStyle = StyleSheet.flatten([S.content, {
    paddingTop: 50
  }]);

  const { loading, error, data } = useRatingsQuery({
    variables: {
      hotelId: hotel.id
    }
  }); 

  if (!data) return null;

  return (
    <React.Fragment>
      <View style={combinedStyle}>
        <ScrollView>
          {data.ratings.map(
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
        {allowReview ? <FAB
          style={S.fab}
          icon="plus"
          onPress={() => setShowAddReview(true)}
        /> : null}       
      </View>
      <CustomOverlay
        isVisible={isShowAddReview}
        onClose={() => setShowAddReview(false)}
      >
        <AddReview 
          hotel={hotel}
          onSuccess={() => {
            setShowAddReview(false);
            if (Platform.OS === "android") {
              ToastAndroid.show('Review submitted', ToastAndroid.SHORT);
            } else {
              Alert.alert('', 'Review submitted');
            }                  
          }}
        />
      </CustomOverlay>
    </React.Fragment>
  );
}

const ViewHotelScreen: FunctionComponent<ViewHotelScreenProps> = ({ 
  hotel, 
  showSearch = false, 
  showConfirm = false, 
  allowReview = false,
  onSearchPress = () => {}, 
  onConfirmPress = () => {},
  onBackPress = () => {}
}) => {
  const theme = useContext(ThemeContext);

  const { loading, error, data } = useHotelQuery({
    variables: {
      id: hotel.id
    }
  }); 

  const S = StyleSheet.create({
    content: {
      backgroundColor: theme.colors.snow,
      height: '100%',
      justifyContent: 'flex-start',
      flexDirection: 'column'
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.primary
    },
  });

  const backButtonHandler = () => {
    onBackPress();
    return true;    
  } 

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler); 
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    } 
  }, [backButtonHandler]);  

  const _renderDetails = () => {
      const { hotelName, hotelLocation, ratingSet, hotelContact, hotelAddress,
        hotelImage, shortDescription, longDescription } = data.hotel;
      return (
        <View style={S.content}>
          <ScrollView>
            <HotelCard
              hotelName={hotelName}
              hotelLocation={hotelLocation}
              rating={ratingSet.reduce(
                (acc: number, cur: any, idx: number) => acc + cur.rating, 0
              ) / ratingSet.length}
              hotelContact={hotelContact}
              hotelAddress={hotelAddress}
              // hotelImage={`${PYTHON_SERVER_BASE_URL}${hotelImage}`}
              hotelImage={require('../assets/example.jpg')} // TO DO, images from gallery
              contentHeader={shortDescription}
              content={longDescription}
              showConfirm={showConfirm}
              onShowConfirmPress={onConfirmPress}
            />
          </ScrollView>
          {showSearch ? <FAB
              style={S.fab}
              icon="magnify"
              onPress={onSearchPress}
            /> : null
          }          
        </View>
    )
  }

  const tabs = [
    {
      title: "Details",
      component: () => _renderDetails(),
    },
    {
      title: "Reviews",
      component: () => <Reviews 
        hotel={hotel}
        allowReview={allowReview}
      />,
    },
  ]

  if (loading) return null; // should have a place holder

  return (
    <TopTabBarView
      tabs={tabs}
    />
  )
}

export default ViewHotelScreen;