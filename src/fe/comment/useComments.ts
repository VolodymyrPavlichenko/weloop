import { useCommentsPageQuery } from 'HOC/pages/comments/CommentsPage.generated';
import { usePage } from 'fe/lib/helpers/usePage';
import { DEFAULT_PAGE_SIZE } from 'mn-constants';
import { useMemo } from 'react';

export const useComments = () => {
  const commentsQ = useCommentsPageQuery({ variables: { limit: DEFAULT_PAGE_SIZE } });

  const commentsPage = usePage(commentsQ.data?.me?.user.comments, ({ cursor, update }) => {
    return commentsQ.fetchMore({
      variables: { ...cursor, limit: DEFAULT_PAGE_SIZE },
      updateQuery: (prev, { fetchMoreResult }) => {
        return fetchMoreResult?.me?.user?.comments && prev.me?.user?.comments
          ? {
              ...fetchMoreResult,
              user: {
                ...fetchMoreResult.me.user,
                userFollows: update({
                  prev: prev.me.user.comments,
                  fetched: fetchMoreResult.me.user.comments
                })
              }
            }
          : prev;
      }
    });
  });

  return useMemo(() => ({ commentsPage }), [commentsPage]);
};
