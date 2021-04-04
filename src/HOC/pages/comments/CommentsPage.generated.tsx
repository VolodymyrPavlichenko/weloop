import * as Types from '../../../graphql/types.generated';

import { CommentPreviewFragment } from '../../modules/previews/comment/CommentPreview.generated';
import { FullPageInfoFragment } from '../../../@fragments/misc.generated';
import gql from 'graphql-tag';
import { FullPageInfoFragmentDoc } from '../../../@fragments/misc.generated';
import { CommentPreviewFragmentDoc } from '../../modules/previews/comment/CommentPreview.generated';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';



export type CommentsPageQueryVariables = {
  limit?: Types.Maybe<Types.Scalars['Int']>,
  before?: Types.Maybe<Array<Types.Scalars['Cursor']>>,
  after?: Types.Maybe<Array<Types.Scalars['Cursor']>>
};


export type CommentsPageQuery = (
  { __typename: 'RootQueryType' }
  & { me: Types.Maybe<(
    { __typename: 'Me' }
    & { user: (
      { __typename: 'User' }
      & Pick<Types.User, 'id'>
      & { comments: Types.Maybe<(
        { __typename: 'CommentsPage' }
        & Pick<Types.CommentsPage, 'totalCount'>
        & { pageInfo: (
          { __typename: 'PageInfo' }
          & FullPageInfoFragment
        ), edges: Array<(
          { __typename: 'Comment' }
          & CommentPreviewFragment
        )> }
      )> }
    ) }
  )> }
);


export const CommentsPageDocument = gql`
    query commentsPage($limit: Int, $before: [Cursor!], $after: [Cursor!]) {
  me {
    user {
      id
      comments(limit: $limit, before: $before, after: $after) {
        totalCount
        pageInfo {
          ...FullPageInfo
        }
        edges {
          ...CommentPreview
        }
      }
    }
  }
}
    ${FullPageInfoFragmentDoc}
${CommentPreviewFragmentDoc}`;

/**
 * __useCommentsPageQuery__
 *
 * To run a query within a React component, call `useCommentsPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsPageQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsPageQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useCommentsPageQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CommentsPageQuery, CommentsPageQueryVariables>) {
        return ApolloReactHooks.useQuery<CommentsPageQuery, CommentsPageQueryVariables>(CommentsPageDocument, baseOptions);
      }
export function useCommentsPageLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CommentsPageQuery, CommentsPageQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CommentsPageQuery, CommentsPageQueryVariables>(CommentsPageDocument, baseOptions);
        }
export type CommentsPageQueryHookResult = ReturnType<typeof useCommentsPageQuery>;
export type CommentsPageLazyQueryHookResult = ReturnType<typeof useCommentsPageLazyQuery>;
export type CommentsPageQueryResult = ApolloReactCommon.QueryResult<CommentsPageQuery, CommentsPageQueryVariables>;


export interface CommentsPageQueryOperation {
  operationName: 'commentsPage'
  result: CommentsPageQuery
  variables: CommentsPageQueryVariables
  type: 'query'
}
export const CommentsPageQueryName:CommentsPageQueryOperation['operationName'] = 'commentsPage'

export const CommentsPageQueryRefetch = (
  variables:CommentsPageQueryVariables, 
  context?:any
)=>({
  query:CommentsPageDocument,
  variables,
  context
})
      
