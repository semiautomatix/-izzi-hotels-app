import { gql } from 'apollo-boost';
import { useMutation } from '../graphql-utils';

const createBooking = gql`
  mutation ($input: BookingInput!) {
    createBooking (input: $input) {
      ok,
      booking {
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
        adults,
        user {
          id
        }
      }
    }
  }
`

export const useCreateBooking = (options?: any) => useMutation(createBooking, options);

const createRating = gql`
  mutation ($input: RatingInput!) {
    createRating (input: $input) {
      ok,
      rating {
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
      }
    }
  }
`

export const useCreateRating = (options?: any) => useMutation(createRating, options);

const createServiceBooking = gql`
  mutation ($input: ServiceBookingInput!) {
    createServiceBooking (input: $input) {
      ok,
      serviceBooking {
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
  }
`

export const useCreateServiceBooking = (options?: any) => useMutation(createServiceBooking, options);

const cancelServiceBooking = gql`
  mutation ($serviceBookingId: ID!) {
    cancelServiceBooking (serviceBookingId: $serviceBookingId) {
      ok,
    }
  }
`

export const useCancelServiceBooking = (options?: any) => useMutation(cancelServiceBooking, options);

const checkInServiceBooking = gql`
  mutation ($serviceBookingId: ID!) {
    checkInServiceBooking (serviceBookingId: $serviceBookingId) {
      ok,
      serviceBooking {
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
  }
`

export const useCheckInServiceBooking = (options?: any) => useMutation(checkInServiceBooking, options);

const checkOutServiceBooking = gql`
  mutation ($serviceBookingId: ID!) {
    checkOutServiceBooking (serviceBookingId: $serviceBookingId) {
      ok,
      event {
        id,
        user {
          id
        }
        eventName,
        startDateTime,
        endDateTime,
        eventMetadata
      }
    }
  }
`

export const useCheckOutServiceBooking = (options?: any) => useMutation(checkOutServiceBooking, options);

const createEvent = gql`
  mutation ($input: EventInput!) {
    createEvent (input: $input) {
      ok,
      event {
        id,
        startDateTime,
        endDateTime
        eventName,
        eventMetadata,
        user {
          id,
        },      
      }
    }
  }
`

export const useCreateEvent = (options?: any) => useMutation(createEvent, options);

const cancelEvent = gql`
  mutation ($eventId: ID!) {
    cancelEvent (eventId: $eventId) {
      ok,        
    }
  }
`

export const useCancelEvent = (options?: any) => useMutation(cancelEvent, options);