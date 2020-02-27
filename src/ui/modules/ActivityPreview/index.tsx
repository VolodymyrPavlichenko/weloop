// import { Trans } from '@lingui/react';
import { i18nMark, Trans } from '@lingui/react';
import { DateTime } from 'luxon';
import { clearFix } from 'polished';
import React, { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Box, Flex, Text } from 'rebass/styled-components';
import media from 'styled-media-query';
import Avatar from 'ui/elements/Avatar';
import SocialText from 'ui/modules/SocialText';
import styled from 'ui/themes/styled';
import { LocaleContext } from '../../../context/global/localizationCtx';
import Actions, { ActionProps } from './Actions';
import Preview, { Context, ContextType, InReplyToContext } from './preview';
import { Actor } from './types';

const tt = {
  placeholders: {
    name: i18nMark('Post a reply'),
    summary: i18nMark(
      'Please describe what the collection is for and what kind of resources it is likely to contain...'
    ),
    image: i18nMark('Enter the URL of an image to represent the collection')
  }
};

export enum Status {
  Loading,
  Loaded
}
export interface ActivityLoaded extends Activity {
  status: Status.Loaded;
}
export interface ActivityLoading {
  status: Status.Loading;
}

export interface Activity {
  createdAt: string;
  actor: Actor;
  context: Context;
  inReplyToCtx: InReplyToContext | null;
  actions: ActionProps | null;
  event: string;
  preview: JSX.Element;
}

export type Props = ActivityLoaded | ActivityLoading;

export const ThreadActivityPreview: FC<Props> = activity => {
  if (activity.status === Status.Loading) {
    return <Trans>loading...</Trans>;
  }
  return (
    <FeedItem>
      <ActorComp actor={activity.actor} createdAt={activity.createdAt} />
      <Contents>
        <Wrapper>
          <Preview {...activity.context} />
          {activity.actions && <Actions {...activity.actions} />}{' '}
        </Wrapper>
      </Contents>
    </FeedItem>
  );
};

export const ActivityPreview: FC<Props> = activity => {
  if (activity.status === Status.Loading) {
    return <Trans>loading...</Trans>;
  }

  return (
    <FeedItem>
      <WrapperLink
        to={
          activity.context.type === ContextType.Community
            ? activity.context.link
            : activity.context.type === ContextType.Collection
              ? activity.context.link
              : activity.context.type === ContextType.Resource
                ? activity.context.link
                : activity.context.type === ContextType.Comment
                  ? activity.context.link
                  : 'user/'
        }
      />
      {/* {activity.inReplyToCtx && <InReplyTo {...activity.inReplyToCtx} />} */}
      <ActorComp actor={activity.actor} createdAt={activity.createdAt} />
      <Contents>
        <Wrapper>
          {activity.context.type !== ContextType.Comment && (
            <Event mt={1} variant="text">
              {activity.event}
            </Event>
          )}
          <Box
            mt={2}
            sx={{
              border: '1px solid #dadada',
              borderRadius: '4px'
            }}
          >
            {activity.preview}
            {activity.actions && <Actions {...activity.actions} />}
          </Box>
        </Wrapper>
      </Contents>
    </FeedItem>
  );
};

export const BigActivityPreview: FC<Props> = activity => {
  if (activity.status === Status.Loading) {
    return <Trans>loading...</Trans>;
  }
  const { i18n } = React.useContext(LocaleContext);
  return (
    <FeedItem>
      {/* {activity.inReplyToCtx && <InReplyTo {...activity.inReplyToCtx} />} */}
      <ActorComp actor={activity.actor} createdAt={activity.createdAt} />
      <Contents>
        <Box>
          <Comment variant="text">
            {activity.context.type === ContextType.Comment
              ? activity.context.content
              : ''}
          </Comment>
          {activity.actions &&
            activity.actions.reply && (
              <Box mt={3}>
                <SocialText
                  placeholder={i18n._(tt.placeholders.name)}
                  defaultValue={''}
                  submit={msg => {
                    if (!(activity.actions && activity.actions.reply)) {
                      //FIXME: use a useCallback
                      return;
                    }
                    activity.actions.reply.replyFormik.values.replyMessage = msg;
                    activity.actions.reply.replyFormik.submitForm();
                  }}
                />
              </Box>
            )}
        </Box>
      </Contents>
    </FeedItem>
  );
};

const Event = styled(Text)``;

const WrapperLink = styled(NavLink)`
  text-decoration: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const Comment = styled(Text)`
  font-size: 32px;
`;

export interface ActorProps {
  actor: Actor;
  createdAt: string;
}
const ActorComp: FC<ActorProps> = ({ actor, createdAt }) => (
  <Member>
    <Avatar initials={actor.name} src={actor.icon} />
    <MemberInfo ml={2}>
      <Name mt={1}>
        <Link to={actor.link}>
          {actor.name}
          {/* <Username ml={2}>@{actor.name}</Username> */}
        </Link>
        <Spacer mx={2}>·</Spacer>
        <Date>{DateTime.fromSQL(createdAt).toRelative()}</Date>
      </Name>
    </MemberInfo>
  </Member>
);

const Contents = styled(Box)`
  margin-top: -30px;
  margin-left: 55px;
`;

// const Username = styled(Text)`
//   color: ${props => props.theme.colors.gray};
//   margin: 0 8px;
//   font-weight: 500;
//   font-size: 13px;

//   ${media.lessThan('1280px')`
//   display: none;
//  `};
// `;

const Spacer = styled(Text)`
  color: ${props => props.theme.colors.gray};
  margin-right: 8px;
  font-weight: 500;
//   ${media.lessThan('1280px')`
//   display: none;
//  `};
`;

const Date = styled(Text)`
  color: ${props => props.theme.colors.gray};
  font-weight: 500;
  font-size: 13px;
`;

const Name = styled(Text)`
  font-weight: 600;
  color: ${props => props.theme.colors.darkgray};
  text-decoration: none;
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 2px;
  flex-direction: row;
  a {
    font-weight: 800;
    display: flex;
    text-decoration: none;
    align-items: center;
    position: relative;
    z-index: 9;
    color: ${props => props.theme.colors.darkgray} !important;
  }
`;

const Member = styled(Flex)`
  align-items: stretch;
`;

const MemberInfo = styled(Box)`
  width: 100%;
  margin-top: -4px;
`;

const Wrapper = styled(Box)``;
const FeedItem = styled(Box)`
  min-height: 30px;
  position: relative;
  margin: 0;
  padding: 16px;
  word-wrap: break-word;
  font-size: 14px;
  // &:hover {
  //   background: #f980120a;
  // }
  ${clearFix()};
  transition: background 0.5s ease;
  margin-top: 0
  z-index: 10;
  position: relative;
  border-bottom: 1px solid  ${props => props.theme.colors.lightgray};
  a {
    text-decoration: none;
    // color: inherit !important;
    &:hover {
      text-decoration: underline
    }
  }

`;
