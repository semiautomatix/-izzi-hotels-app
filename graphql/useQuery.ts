import { useQuery as useQueryApolloHooks } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';

const useQuery = (query: DocumentNode, variables?: any) => {
  // when we use queries from AWS amplify when can have a switch
  // https://aws-amplify.github.io/docs/js/api#simple-query
  return useQueryApolloHooks(query, variables);
}

export default useQuery;