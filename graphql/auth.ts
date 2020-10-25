import { gql } from 'apollo-boost';
import { useMutation } from './graphql-utils';

const socialAuth = gql`
  mutation ($provider: String!, $accessToken: String!) {
    socialAuth(provider: $provider, accessToken: $accessToken) {
      social {
        uid
      }
      token
    }
  }
`
export const useSocialAuthMutation = (options?: any) => useMutation(socialAuth, options);

const tokenAuth = gql`
  mutation ($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`

export const useTokenAuth = (options?: any) => useMutation(tokenAuth, options);

const verifyToken = gql`
  mutation ($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`
export const useVerifyToken = (options?: any) => useMutation(verifyToken, options);