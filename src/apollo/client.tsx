import * as AbsintheSocket from '@absinthe/socket';
import { createAbsintheSocketLink } from '@absinthe/socket-apollo-link';
import { hasSubscription } from '@jumpn/utils-graphql';
import { i18nMark } from '@lingui/react';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
// import { createHttpLink } from 'apollo-link-http';
import apolloLogger from 'apollo-link-logger';
import { Socket as PhoenixSocket } from 'phoenix';
import {
  GRAPHQL_ENDPOINT,
  IS_DEV,
  PHOENIX_SOCKET_ENDPOINT
} from '../constants';
import { UsernameAvailableQueryOperation } from '../graphql/generated/checkUsername.generated';
import { ConfirmEmailMutationMutationOperation } from '../graphql/generated/confirmEmail.generated';
import { CreateUserMutationMutationOperation } from '../graphql/generated/createUser.generated';
import { LoginMutationMutationOperation } from '../graphql/generated/login.generated';
import {
  getOpType,
  Name,
  getOperationNameAndType
} from '../util/apollo/operation';
import { RootMutationType, RootQueryType } from '../graphql/types.generated';
import { createUploadLink } from './uploadLink.js';
import { KVStore } from '../util/keyvaluestore/types';
import { LogoutMutationMutationOperation } from '../graphql/generated/logout.generated';
const introspectionQueryResultData = require('../fragmentTypes.json');

export type MutationName = keyof RootMutationType;
export type QueryName = keyof RootQueryType;
export type OperationName = QueryName | MutationName;

// const { meQuery } = require('../../../graphql/me.graphql');
interface Cfg {
  localKVStore: KVStore;
  appLink: ApolloLink;
}

const AUTH_TOKEN_KEY = 'AUTH_TOKEN';

export default async function initialise({ localKVStore, appLink }: Cfg) {
  let authToken = localKVStore.get(AUTH_TOKEN_KEY);
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
  });

  const cache = new InMemoryCache({ fragmentMatcher });

  const setTokenLink = new ApolloLink((operation, nextLink) => {
    const createSessionOpName: OperationName = 'createSession';
    const deleteSessionOpName: OperationName = 'deleteSession';

    const [opName] = getOperationNameAndType<OperationName>(operation.query);

    if (opName === deleteSessionOpName) {
      authToken = undefined;
      localKVStore.del(AUTH_TOKEN_KEY);
    }

    return nextLink(operation).map(resp => {
      if (opName === createSessionOpName) {
        const authPyload = resp.data && resp.data[opName];
        authToken =
          authPyload && authPyload.token ? authPyload.token : undefined;
        authToken
          ? localKVStore.set(AUTH_TOKEN_KEY, authToken)
          : localKVStore.del(AUTH_TOKEN_KEY);
      }
      return resp;
    });
  });

  /**
   * This context link is used to assign the necessary Authorization header
   * to all HTTP requests to the GraphQL backend. In the case that the user
   * is authenticated it sets their access token as the value, otherwise null.
   */
  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : null
      }
    };
  });

  function handleError(message) {
    //  alert(message); //TODO: nicer display of errors
  }

  function handleErrorGraphQL(message, locations, path) {
    console.log(
      `! GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
    );

    if (!message.includes('You need to log in first')) {
      // don't display this error - we redirect to login screen instead
      handleError(message);
    }
  }

  const errorLink = onError(
    ({ operation, response, graphQLErrors, networkError }) => {
      // console.log( 'errorLink', operation, response );

      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          handleErrorGraphQL(message, locations, path)
        );
      }

      if (networkError) {
        console.log(`! Network error: ${networkError}`);
        handleError(networkError);
      }
    }
  );

  const clientAwarenessHeadersLinkForNonApollo3Server = setContext((_, ctx) => {
    const { headers } = ctx;
    return {
      ...ctx,
      clientAwareness: undefined,
      headers: {
        ...headers
      }
    };
  });

  const ALLOWED_ANONYMOUS_MUTATIONS: Name<
    | CreateUserMutationMutationOperation
    | LoginMutationMutationOperation
    | LogoutMutationMutationOperation
    | ConfirmEmailMutationMutationOperation
    | UsernameAvailableQueryOperation
  >[] = [
    'confirmEmailMutation',
    'createUserMutation',
    'loginMutation',
    'logoutMutation',
    'usernameAvailable'
  ];
  const alertBlockMutationsForAnonymousLink = new ApolloLink(
    (operation, nextLink) => {
      if (!authToken) {
        const optype = getOpType(operation);
        if (
          optype === 'mutation' &&
          //@ts-ignore
          !ALLOWED_ANONYMOUS_MUTATIONS.includes(operation.operationName)
        ) {
          alert(i18nMark('You should log in for performing this operation!'));
          return null;
        }
      }

      return nextLink(operation);
    }
  );
  // used for graphql query and mutations
  const httpLink = ApolloLink.from(
    [
      IS_DEV ? apolloLogger : null,
      alertBlockMutationsForAnonymousLink,
      errorLink,
      authLink,
      clientAwarenessHeadersLinkForNonApollo3Server,
      setTokenLink,
      appLink,
      createUploadLink({ uri: GRAPHQL_ENDPOINT!! })
    ].filter(Boolean)
  );

  // used for graphql subscriptions
  const absintheSocket = createAbsintheSocketLink(
    AbsintheSocket.create(new PhoenixSocket(PHOENIX_SOCKET_ENDPOINT))
  );
  // if the operation is a subscription then use
  // the absintheSocket otherwise use the httpLink
  const link = ApolloLink.split(
    operation => hasSubscription(operation.query),
    absintheSocket,
    httpLink
  );

  const client = new ApolloClient({
    cache,
    link,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore'
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
  });
  return {
    client
  };
}
