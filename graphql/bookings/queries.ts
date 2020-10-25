import { gql } from 'apollo-boost';
import { useQuery } from '../graphql-utils';

export const allHotelsQuery = gql`
  query {
    allHotels {
      id,
      hotelName, 
    },
  }
`;

export const useAllHotelsQuery = (options?: any) => useQuery(allHotelsQuery, options);

export const hotelQuery = gql`
  query ($id: Int!){
    hotel(id: $id) {
      id,
      hotelName, 
      address,
      longitude,
      latitude,
      address,
      shortDescription,
      longDescription,
      logo,
      city,
      contactNumber,
      ratingSet {
      	rating,
        review,
        user {
        	firstName,
          lastName,
          usermetadata {
          	profilePicture  
          }
        }
      }
    },
  }
`;

export const useHotelQuery = (options?: any) => useQuery(hotelQuery, options);

export const bookingsQuery = gql`
  query ($userId: Int, $startDate: Date, $endDate: Date, $bookingStatus: BookingStatuses){
    bookings(userId: $userId, startDate: $startDate, endDate: $endDate, bookingStatus: $bookingStatus) {
      id,
      hotel {
        id,
        hotelName,
        latitude,
        longitude,
        contactNumber,
        address,
        city,
        shortDescription,
        longDescription
      },
      startDate,
      endDate,
      children,
      adults
      user {
        id
      }      
    },
  }
`;

export const useBookingsQuery = (options?: any) => useQuery(bookingsQuery, options);

export const ratingsQuery = gql`
  query ($userId: Int, $hotelId: Int){
    ratings(userId: $userId, hotelId: $hotelId) {
      id,
      rating,
      review,
      hotel {
        id
      },
      user {
        id,
        usermetadata {
          profilePicture
        }
      },
    },
  }
`;

export const useRatingsQuery = (options?: any) => useQuery(ratingsQuery, options);

export const serviceBookingsQuery = gql`
  query ($currentUser: Boolean, $userId: Int, $startDateTime: DateTime, $endDateTime: DateTime, $serviceType: ServiceTypes){
    serviceBookings(currentUser: $currentUser, userId: $userId, startDateTime: $startDateTime, endDateTime: $endDateTime, serviceType: $serviceType) {
      id,
      service {
        id,
        serviceType,
        location
        hotel {
          id,
          hotelName,
        }
      },
      startDateTime,
      endDateTime,
      checkInDateTime,
      checkOutDateTime,
      user {
        id
      }      
    }
  }
`;

export const useServiceBookingsQuery = (options?: any) => useQuery(serviceBookingsQuery, options);

export const eventsQuery = gql`
  query ($userId: Int){
    events(userId: $userId) {
      id,
      startDateTime,
      endDateTime
      eventName,
      eventMetadata,
      user {
        id,
      },
    },
  }
`;

export const useEventsQuery = (options?: any) => useQuery(eventsQuery, options);







