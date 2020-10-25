import { gql } from 'apollo-boost';
import { useQuery } from '../graphql-utils';

export const allHotelServicesQuery = gql`
  query {
    allHotels {
      id,
      hotelName,    
      serviceSet {
        id,
        meetingRoom,
        serviceType
      }
    }
  }
`;

export const useAllHotelServicesQuery = (options?: any) => useQuery(allHotelServicesQuery, options);
