import React, { FunctionComponent, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import * as yup from 'yup';

// GraphQL
import { useCreateBooking } from '../graphql/bookings/mutations';

import ThemeContext from '../context/ThemeContext';

import * as messages from '../utils/messages';

import SearchHotels from '../forms/SearchHotels';
import BookingConfirmation from '../forms/BookingConfirmation';
import ViewHotelScreen from './ViewHotelScreen';
import { bookingsQuery } from '../graphql/bookings/queries';
import { useCurrentUserQuery } from '../graphql/users/queries';

interface HotelsScreenProps {
  navigation: NavigationStackProp<{ userId: string }>;
}

const HotelsScreen: FunctionComponent<HotelsScreenProps> = ({ navigation }) => {
  const [hotel, setHotel] = useState<any>(undefined);
  const [startDate, setStartDate] = useState<Date>(undefined);
  const [endDate, setEndDate] = useState<Date>(undefined);
  const [numberOfRooms, setNumberOfRooms] = useState<number>(1);
  const [numberOfAdults, setNumberOfAdults] = useState<number>(1);
  const [numberOfChildren, setNumberOfChildren] = useState<number>(0);  
  const [booking, setBooking] = useState<any>(undefined);
  const [errors, setErrors] = useState<yup.ValidationError[]>([]);    

  const [isShowHotelDetails, setShowHotelDetails] = useState<boolean>(false);
  const [isShowBookingConfirmation, setShowBookingConfirmation] = useState<boolean>(false);
  
  const { loading, error, data } = useCurrentUserQuery({
    fetchPolicy: 'network-only'
  });  
    
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

  // GraphQL 
  const [useCreateBookingMutationFn] = useCreateBooking({
    // should authentication be successful store token and navigate to home screen
    async update(cache, { data: { createBooking: { ok, booking }} }) {       
      if (ok) {
        /*const { bookings } = cache.readQuery({ 
          query: bookingsQuery,
          variables: { userId: data.currentUser.id }
        });
        cache.writeQuery({
          query: bookingsQuery,
          data: { bookings: bookings.concat([booking]) },
        });  */
        setBooking(booking);
        setShowBookingConfirmation(true);
      } else {
        onFailedBooking('Booking failed');
      }
    }
  });    
  
  // validation schema
  const schema = yup.object().shape({
    hotelId: yup.number().required().label("Hotel"),
    startDate: yup.date().required().label("Arrival Date"),
    endDate: yup.date().required().label("Departure Date"),
  });  

  const createBooking = async () => {
    try {
      // validate fields
      await schema.validate(
        {
          hotelId: hotel.id,
          startDate,
          endDate
        }, {abortEarly: false}
      )
      // if validation finds not errors clear errors then attempt authentication
      setErrors([]);
      try {
        await useCreateBookingMutationFn(              
          {
            variables: {
              input: {
                hotelId: hotel.id,
                startDate: startDate,
                endDate: endDate,
                adults: numberOfAdults,
                children: numberOfChildren,
                rooms: numberOfRooms
              }
            },
            refetchQueries: [ // this is what is need to force cache update!
              {
                query: bookingsQuery,
                variables: { userId: data.currentUser.id }
              }
            ]
          }
        );                                  
      } catch (err) {
        // translate error
        onFailedBooking();
      }   
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors(err.inner);
      } else {
        console.error(err);
      }
    }      
  }

  const onFailedBooking = (message?: string) => {
    messages.showMessage(message ? message : 'Booking failed');
  }  

  const _renderBookingConfirmation = () => {
    if (!booking) return null;
    return (
      <BookingConfirmation
        booking={booking}
        onClose={() => {
          setShowHotelDetails(false);  
          setShowBookingConfirmation(false);
        }}
      />
    )
  }

  return (
    <React.Fragment>
      {!isShowHotelDetails ? <View style={S.content}>
        <SearchHotels          
          onSearchClick={(hotel: any, startDate: Date, endDate: Date, numberOfRooms: number, numberOfAdults: number, numberOfChildren: number) => {
            setHotel(hotel);
            setStartDate(startDate);
            setEndDate(endDate);
            setNumberOfRooms(numberOfRooms);
            setNumberOfAdults(numberOfAdults); 
            setNumberOfChildren(numberOfChildren);
            setShowHotelDetails(true);
          }}
        />
        </View> :
        <React.Fragment>
          {!isShowBookingConfirmation ? 
            <ViewHotelScreen
              hotel={hotel}
              showSearch={true}
              showConfirm={true}
              onSearchPress={() => setShowHotelDetails(false)}
              onConfirmPress={() => createBooking()}
            /> : _renderBookingConfirmation()
          }
        </React.Fragment>
      }
    </React.Fragment>
  )

}

export default HotelsScreen;