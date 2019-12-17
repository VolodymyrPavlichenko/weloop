import * as React from 'react';
import Comment from '../../components/elements/Comment/Comment';
import Loader from '../../components/elements/Loader/Loader';
// import Thread from '../../components/elements/thread';
import { HomeBox, MainContainer } from '../../sections/layoutUtils';
import { Wrapper, WrapperCont } from '../communities.all/CommunitiesAll';
import Header from './header';
import { GetThreadQueryHookResult } from '../../graphql/generated/getThread.generated';
import Empty from '../../components/elements/Empty';
import { Trans } from '@lingui/macro';
// import { Box } from 'rebass/styled-components';

export interface Props {
  threadQuery: GetThreadQueryHookResult;
}
const Component: React.FC<Props> = ({ threadQuery: thread }) => {
  const ctx =
    !!thread.data && !!thread.data.thread && thread.data.thread.context;
  const context =
    ctx &&
    (ctx.__typename === 'Resource' ||
      ctx.__typename === 'Collection' ||
      ctx.__typename === 'Community') &&
    ctx;
  return (
    <MainContainer>
      <HomeBox>
        <WrapperCont>
          <Wrapper>
            {thread.loading ? (
              <Empty alignItems="center" mt={3}>
                <Loader />
              </Empty>
            ) : thread.error || !thread.data ? (
              <Empty>
                <Trans>Is it not possible to show the thread</Trans>
              </Empty>
            ) : !thread.data ? null : (
              <>
                {context && <Header context={context} />}

                {/* {thread.data.thread ? (
                    <Box variant="inReplyTo">
                    <Comment
                    noAction
                    key={thread.data.thread.id}
                    comment={thread.data.thread}
                    />
                  </Box>
                  ) : null}
                  <Thread comment={thread.data.thread} /> */}

                {thread.data.thread &&
                  thread.data.thread.comments.edges
                    .reverse()
                    .map(
                      edge =>
                        edge &&
                        edge.node && (
                          <Comment
                            key={edge.node.thread.id}
                            comment={edge.node}
                          />
                        )
                    )}
              </>
            )}
          </Wrapper>
        </WrapperCont>
      </HomeBox>
    </MainContainer>
  );
};
export default Component;
