import React, { FC } from 'react';
import { RouteComponentProps, RouteProps } from 'react-router-dom';
import { locationHelper } from './lib/helper';
import { WithSidebarTemplate } from 'HOC/templates/WithSidebar/WithSidebar';
import { NotFoundHOC } from 'HOC/pages/not-found/NotFound';
import { CommentsPage } from 'HOC/pages/comments/CommentsPage';

interface CommentsPageRouter {}
const CommentsPageRouter: FC<RouteComponentProps<CommentsPageRouter>> = ({ match }) => {
  if (match === null) {
    return <NotFoundHOC />;
  }

  return (
    <WithSidebarTemplate>
      <CommentsPage />
    </WithSidebarTemplate>
  );
};

export const CommentsPageRoute: RouteProps = {
  exact: true,
  path: '/comments',
  component: CommentsPageRouter
};

export const commentsLocation = locationHelper<undefined, undefined>(CommentsPageRoute);
