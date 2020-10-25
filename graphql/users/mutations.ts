import { gql } from 'apollo-boost';
import { useMutation } from '../graphql-utils';

const changePassword = gql`
  mutation ($oldPasword: String!, $newPassword: String!, $confirmPassword: String!) {
    changePassword (oldPassword: $oldPasword, newPassword: $newPassword, confirmPassword: $confirmPassword) {
      ok
    }
  }
`

export const useChangePassword = (options?: any) => useMutation(changePassword, options);

const register = gql`
  mutation ($emailAddress: String!, $firstName: String!, $lastName: String!) {
    register (emailAddress: $emailAddress, firstName: $firstName, lastName: $lastName) {
      ok
    }
  }
`

export const useRegister = (options?: any) => useMutation(register, options);