import { GetCommunityQueryQuery } from 'graphql/generated/getCommunity.generated';

export const basicGetCommunityQuery: GetCommunityQueryQuery = {
  community: {
    __typename: 'Community',
    name: 'name',
    summary: 'summary',
    image: 'image',
    collections: {
      __typename: 'CollectionsEdges',
      totalCount: 0,
      edges: [],
      pageInfo: null
    },
    createdAt: '',
    creator: { __typename: 'User', id: '' },
    followers: {
      __typename: 'FollowsEdges',
      totalCount: 0,
      edges: [],
      pageInfo: null
    },
    id: '',
    isDisabled: false,
    isPublic: false,
    isLocal: false,
    outbox: { __typename: 'ActivitiesEdges', edges: [], pageInfo: null },
    preferredUsername: '',
    updatedAt: '',
    lastActivity: '',
    myFollow: null,
    canonicalUrl: null,
    icon: null
  }
};
