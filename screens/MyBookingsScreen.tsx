import React, { FunctionComponent, useState, useEffect } from 'react';
import { View, FlatList, Alert, ToastAndroid, Platform, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Overlay } from 'react-native-elements';
import moment from 'moment';

// @ts-ignore
import { GOOGLE_MAPS_API_KEY } from 'react-native-dotenv';

import * as messages from '../utils/messages';

// GraphQL
import { useBookingsQuery, useServiceBookingsQuery, serviceBookingsQuery, useEventsQuery } from '../graphql/bookings/queries';
import { useCheckInServiceBooking, useCheckOutServiceBooking, useCancelServiceBooking, useCancelEvent } from '../graphql/bookings/mutations';
import { useCurrentUserQuery } from '../graphql/users/queries';

import HotelBookingCard from '../components/HotelBookingCard';
import TopTabBarView from '../components/TopTabBarView';
import EventCard from '../components/EventCard';
import ServiceCard from '../components/ServiceCard';
import ActionableFlatList from '../components/ActionableFlatList';
import { theme } from '../context/ThemeContext';
import AddEvent from '../forms/AddEvent';
import AddServiceBooking from '../forms/AddServiceBooking';
import ViewHotelScreen from './ViewHotelScreen';
import Loading from '../components/Loading';

// mock data
// import { hotels } from '../mock_data.js'

interface MyHotelsProps {
  user: any,
  onViewHotel?: (hotel: any) => void  
}

const MyHotels: FunctionComponent<MyHotelsProps> = ({ user, onViewHotel }) => {
  const { loading, error, data } = useBookingsQuery({
    variables: {
      userId: user.id,
    },
  }); 
  

  if (loading) {
    return null;
  }

  return (
    <FlatList
      data={data.bookings.sort(
        (a: any, b: any) => {
          if (a.startDate > b.startDate) return 1;
          else if (a.startDate < b.startDate) return -1;
          return 0;
        }
      )}
      renderItem={({ item }) => (
        <HotelBookingCard
          booking={item}
          onViewHotel={onViewHotel}
        />
      )}
      keyExtractor={(item: any) => item.id}
    />
  );
}

interface MyEventsProps {
  user: any,
}

const MyItinerary: FunctionComponent<MyEventsProps> = ({ user }) => {
  const [isShowAddEvent, setShowAddEvent] = useState<boolean>(false);

  const { loading, error, data, refetch } = useEventsQuery({
    variables: {
      userId: user.id
    },
  });  

  const [useCancelEventFn] = useCancelEvent({
    async update(cache, { data: { cancelEvent: { ok }} }) {  
      if (ok) {  
        messages.showMessage('Event cancelled');
        refetch();
      } else {
        messages.showMessage('Failed to cancel event');
      }
    }
  });     

  const confirmCancel = (id: string, index: number) => {
    const event = data.events.find(
      (event: any) => event.id === id
    );
    Alert.alert(
      'Cancel Event',
      `Are you sure you want to cancel event "${event.eventName}"`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await useCancelEventFn(              
                {
                  variables: {
                    eventId: id                    
                  }
                }
              )                                 
            } catch (err) {
              // translate error
              messages.showMessage('Failed to cancel Event');
            }  
          }
        },
      ],
      { cancelable: false },
    );
  }

  if (loading) {
    return <Loading />
  } 

  return (
    <View>
      <ActionableFlatList
        data={data.events}
        renderItem={({ item, index }) => {
          const { eventName, startDateTime, endDatetime } = item;
          const eventMetadata = JSON.parse(item.eventMetadata); 
          const eventImage = eventMetadata.photo_reference ?
            { uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_MAPS_API_KEY}` } :
            require('../assets/park.jpg');  
          const eventDates = `${moment(startDateTime).format('DD MMM YYYY')} - ${moment(endDatetime).format('DD MMM YYYY')}`;     
          return (
            <EventCard
              eventName={eventName}
              eventLocation={eventMetadata.formatted_address}
              eventDates={eventDates}
              eventImage={eventImage}
              alignment={index % 2 ? 'right' : 'left'}
              onLongPress={() => confirmCancel(item.id, index)}
            />
          )
        }}
        keyExtractor={(item: any) => item.id}
        action={() => setShowAddEvent(true)}
      />
      <Overlay
        isVisible={isShowAddEvent}
        windowBackgroundColor="rgba(0, 0, 0, 0.5)"
        overlayBackgroundColor={theme.colors.snow}
        width={Dimensions.get("window").width - 50}
        height={Dimensions.get("window").height - 50}
        overlayStyle={{
          borderRadius: 30,
          position: 'absolute',
          top: 20
        }}
        onBackdropPress={() => setShowAddEvent(false)}
        onRequestClose={() => setShowAddEvent(false)}
      >
        <AddEvent
          onSuccess={() => {
            refetch();
            setShowAddEvent(false)
            if (Platform.OS === "android") {
              ToastAndroid.show('Event added', ToastAndroid.SHORT);
            } else {
              Alert.alert('', 'Event added');
            }
          }}
        />
      </Overlay>
    </View>

  )
}

interface MyServicesProps {
  user: any,
}

const MyServices: FunctionComponent<MyServicesProps> = ({ user }) => {
  const [isShowAddService, setShowAddService] = useState<boolean>(false);

  const { loading, error, data, refetch } = useServiceBookingsQuery({
    variables: {
      userId: user.id
    },
  }); 

  const [useCheckInServiceBookingFn] = useCheckInServiceBooking({
    async update(cache, { data: { checkInServiceBooking: { ok }} }) {  
      if (ok) {  
        messages.showMessage('Checked In');
      } else {
        messages.showMessage('Failed to Check In');
      }
    }
  });     

  const [useCheckOutServiceBookingFn] = useCheckOutServiceBooking({
    async update(cache, { data: { checkOutServiceBooking: { ok }} }) {  
      if (ok) {  
        messages.showMessage('Checked Out');
      } else {
        messages.showMessage('Failed to Check Out');
      }
    }
  }); 
  
  const [useCancelServiceBookingFn] = useCancelServiceBooking({
    async update(cache, { data: { cancelServiceBooking: { ok }} }) {  
      if (ok) {  
        messages.showMessage('Service Booking cancelled');
        refetch();
      } else {
        messages.showMessage('Failed to cancel Service Booking');
      }
    }
  });      

  const confirmCancel = (id: string, index: number) => {
    const serviceBooking = serviceBookings.find(
      (s: any) => s.id === id
    );
    const { service: { location, serviceType }, checkInDateTime, startDateTime } = serviceBooking;

    if (checkInDateTime || moment(startDateTime) < moment()) return;

    Alert.alert(
      'Cancel Event',
      `Are you sure you want to cancel service "${serviceType === "MEETING_ROOM" ?
        "Meeting at" : "Co-share at"} ${location}"`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await useCancelServiceBookingFn(              
                {
                  variables: {
                    serviceBookingId: id                    
                  }
                }
              )                                 
            } catch (err) {
              // translate error
              messages.showMessage('Failed to cancel Service Booking');
            }  
          }
        },
      ],
      { cancelable: false },
    );
  }

  const checkInOut = (serviceBookingId: number) => {
    const serviceBooking = serviceBookings.find(
      (s: any) => s.id === serviceBookingId
    );
    
    const { checkInDateTime } = serviceBooking;
        
    // logic here to ensure checkis is at or around meeting time
    Alert.alert(
      checkInDateTime ? 'Check Out of Meeting': 'Check In to Meeting',
      `Are you sure you want to ${checkInDateTime ? 'end' : 'begin'} this meeting?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await checkInDateTime ? useCheckOutServiceBookingFn(              
                {
                  variables: {
                    serviceBookingId
                  }
                }
              ) : useCheckInServiceBookingFn(              
                {
                  variables: {
                    serviceBookingId
                  }
                }
              );                                  
            } catch (err) {
              // translate error
              messages.showMessage('Failed to Check In');
            }  
          }
        },
      ],
      { cancelable: false },
    );  
  }

  if (loading) {
    return null;
  }

  const { serviceBookings } = data;

  return (
    <View>
      <ActionableFlatList
        data={serviceBookings}
        renderItem={({ item, index }) => (
          <ServiceCard
            serviceBooking={item}
            onLongPress={() => confirmCancel(item.id, index)}
            onButtonPress={() => checkInOut(item.id)}
          />
        )}
        keyExtractor={(item: any) => item.id}
        action={() => setShowAddService(true)}
      />
      <Overlay
        isVisible={isShowAddService}
        windowBackgroundColor="rgba(0, 0, 0, 0.5)"
        overlayBackgroundColor={theme.colors.snow}
        width={Dimensions.get("window").width - 50}
        height={Dimensions.get("window").height - 50}
        overlayStyle={{
          borderRadius: 30,
          position: 'absolute',
          top: 20,
        }}
        onBackdropPress={() => setShowAddService(false)}
        onRequestClose={() => setShowAddService(false)}
      >
        <AddServiceBooking
          onSuccess={() => {
            setShowAddService(false)
            refetch();
            if (Platform.OS === "android") {
              ToastAndroid.show('Service booked', ToastAndroid.SHORT);
            } else {
              Alert.alert('', 'Service booked');
            }
          }}
        />
      </Overlay>
    </View>
  )
}

const MyBookingsScreen: FunctionComponent = () => {
  const [hotel, setHotel] = useState<any>(undefined);
  const [isShowHotelDetails, setShowHotelDetails] = useState<boolean>(false);

  const { loading, error, data } = useCurrentUserQuery({
    fetchPolicy: 'network-only'
  });   

  if (loading) {
    return <Loading />  
  } else {
    if (isShowHotelDetails) {
      return (
        <ViewHotelScreen
          hotel={hotel}
          allowReview={true}
          onBackPress={() => setShowHotelDetails(false)}
        /> 
      )
    } 
  }

  const tabs = [
    {
      title: "Hotels",
      component: () => (<MyHotels 
        user={data.currentUser}
        onViewHotel={(hotel) => {
          setHotel(hotel);
          setShowHotelDetails(true);
        }}      
      />),
    },
    {
      title: "Itinerary",
      component: () => (<MyItinerary
        user={data.currentUser}
      />),      
    },
    {
      title: "Services",
      component: () => (<MyServices
        user={data.currentUser}
      />),
    }
  ]

  return (
    <TopTabBarView
      tabs={tabs}
    />
  );
}

export default MyBookingsScreen;