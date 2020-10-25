import { gql } from 'apollo-boost';
import { useQuery } from '../graphql-utils';

export const currentUserQuery = gql`
  query {
    currentUser {
      id,
      firstName,
      lastName,
      usermetadata {
        middleName
      }
    }
  }
`;

export const useCurrentUserQuery = (options?: any) => useQuery(currentUserQuery, options);