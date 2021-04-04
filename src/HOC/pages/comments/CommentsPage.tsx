import { useComments } from 'fe/comment/useComments';
import { useLikeContext } from 'fe/context/like/useLikeContext';
import { useFormik } from 'formik';
import { Comment as GQLComment } from 'graphql/types.generated';
import React, { FC, useMemo, useReducer } from 'react';
import { HomeBox, MainContainer, Wrapper, WrapperCont } from 'ui/elements/Layout';
import { LoadMore } from 'ui/modules/Loadmore';
import { Comment as CommentPreview } from 'ui/modules/Previews/Comment';

export type TCommentsPage = {};

const Comment: FC<GQLComment> = props => {
  const { toggleLike } = useLikeContext(props?.id, props?.myLike, props?.likerCount, 'Comment');
  const [isDropdownOpen, toggleDropdown] = useReducer(is => !is, false);
  const toggleLikeFormik = useFormik({
    initialValues: {},
    onSubmit: toggleLike
  });

  //TODO: add flagging to dropdown

  return (
    <CommentPreview
      {...props}
      url={props.thread ? `/thread/${props.thread.id}` : ''}
      isFlagged={!!props.myFlag}
      flag={() => {}}
      toggleDropdown={toggleDropdown}
      isDropdownOpen={isDropdownOpen}
      like={{
        iLikeIt: !!props.myLike,
        totalLikes: props.likerCount || 0,
        toggleLikeFormik
      }}
    />
  );
};

export const CommentsPage: FC<TCommentsPage> = () => {
  const { commentsPage } = useComments();
  const [loadMoreComments] = commentsPage.formiks;

  const comments = useMemo(() => {
    const Comments = (
      <>
        {commentsPage.edges.map((comment, i) => {
          return <Comment key={i} {...(comment as GQLComment)} />;
        })}
      </>
    );
    return { Comments };
  }, [commentsPage]);

  return (
    <MainContainer>
      <HomeBox>
        <WrapperCont>
          <Wrapper>{comments.Comments}</Wrapper>
          {loadMoreComments && <LoadMore LoadMoreFormik={loadMoreComments} />}
        </WrapperCont>
      </HomeBox>
    </MainContainer>
  );
};
