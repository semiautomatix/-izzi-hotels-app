import { useMutation as useMutationApolloHooks } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';

const useMutation = <T extends {}>(mutation: DocumentNode, options?: any) => {
  // when we use queries from AWS amplify when can have a switch
  // https://aws-amplify.github.io/docs/js/api#simple-query
  return useMutationApolloHooks<T>(mutation, options);
}

export default useMutation;