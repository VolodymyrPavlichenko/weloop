// View a Community (with list of collections)

import * as React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Trans } from '@lingui/macro';
import { RouteComponentProps } from 'react-router';
import { graphql, QueryControls, OperationOption } from 'react-apollo';
import styled from '../../themes/styled';
import Community from '../../types/Community';
import Loader from '../../components/elements/Loader/Loader';
import '../../containers/App/basic.css';
import CollectionCard from '../../components/elements/Collection/Collection';

import Hero from './hero';
import EditCommunityModal from '../../components/elements/EditCommunityModal';
import UsersModal from '../../components/elements/UsersModal';
import CommunityPage from './Community';
import { Switch, Route } from 'react-router-dom';

import { HomeBox, MainContainer } from '../../sections/layoutUtils';
import { Wrapper, WrapperCont } from '../communities.all/CommunitiesAll';
import {
  WrapperPanel,
  Panel,
  PanelTitle,
  Nav,
  NavItem
} from '../../sections/panel';
import { Box } from 'rebass/styled-components';
const { getCommunityQuery } = require('../../graphql/getCommunity.graphql');
enum TabsEnum {
  // Overview = 'Overview',
  Collections = 'Collections',
  Discussion = 'Discussion'
}
interface Data extends QueryControls {
  community: Community;
}

type State = {
  tab: TabsEnum;
};

interface Props
  extends RouteComponentProps<{
      community: string;
    }> {
  data: Data;
  handleNewCollection: any;
  handleCollection: any;
  isOpenCollection: boolean;
  isOpen: boolean;
  editCommunity(): boolean;
  isEditCommunityOpen: boolean;
  showUsers(boolean): boolean;
  isUsersOpen: boolean;
  document: any;
  stacked: boolean;
  onStacked(boolean): boolean;
}

class CommunitiesFeatured extends React.Component<Props, State> {
  state = {
    tab: TabsEnum.Collections
  };

  render() {
    let collections;
    let community;
    if (this.props.data.error) {
      collections = (
        <span>
          <Trans>Error loading collections</Trans>
        </span>
      );
    } else if (this.props.data.loading) {
      collections = <Loader />;
    } else if (this.props.data.community) {
      community = this.props.data.community;

      if (this.props.data.community.collections.totalCount) {
        collections = (
          <Box m={2}>
            {this.props.data.community.collections.edges.map((e, i) => (
              <CollectionCard
                key={i}
                collection={e.node}
                openModal={this.props.handleCollection}
                communityId={this.props.data.community.localId}
              />
            ))}
          </Box>
        );
      } else {
        collections = (
          <OverviewCollection>
            <Trans>This community has no collections.</Trans>
          </OverviewCollection>
        );
      }
    }

    if (!community) {
      if (this.props.data.loading) {
        return (
          <WrapperCont>
            <Wrapper>
              <Loader />
            </Wrapper>
          </WrapperCont>
        );
      } else {
        // TODO better handling of no community
        return (
          <WrapperCont>
            <Wrapper>
              <span>
                <Trans>{this.props.data.error}</Trans>
              </span>
            </Wrapper>
          </WrapperCont>
        );
      }
    }

    return (
      <MainContainer>
        <HomeBox>
          <WrapperCont>
            <Wrapper>
              <Hero
                community={community}
                showUsers={this.props.showUsers}
                editCommunity={this.props.editCommunity}
              />
              <Switch>
                <Route
                  path={this.props.match.url}
                  exact
                  render={props => (
                    <CommunityPage
                      {...props}
                      collections={collections}
                      community={community}
                      fetchMore={this.props.data.fetchMore}
                      type={'community'}
                      refetch={() => this.props.data.refetch()}
                    />
                  )}
                />
                {/* <Route
                  path={`/communities/${
                    community.localId
                  }/collection/:collection`}
                  component={CollectionModal}
                /> */}
              </Switch>
            </Wrapper>
          </WrapperCont>
          <EditCommunityModal
            toggleModal={this.props.editCommunity}
            modalIsOpen={this.props.isEditCommunityOpen}
            communityId={community.localId}
            communityExternalId={community.id}
            community={community}
          />
          <UsersModal
            toggleModal={this.props.showUsers}
            modalIsOpen={this.props.isUsersOpen}
            members={community.members.edges}
          />
        </HomeBox>
        <WrapperPanel>
          <Panel>
            <PanelTitle fontSize={0} fontWeight={'bold'}>
              <Trans>Popular hashtags</Trans>
            </PanelTitle>
            <Nav>
              <NavItem mb={3} fontSize={1}>
                <Trans>#learningdesign</Trans>
              </NavItem>
              <NavItem mb={3} fontSize={1}>
                <Trans>#MPI</Trans>
              </NavItem>
              <NavItem mb={3} fontSize={1}>
                <Trans>#Youtube</Trans>
              </NavItem>
              <NavItem mb={3} fontSize={1}>
                <Trans>#models</Trans>
              </NavItem>
              <NavItem mb={3} fontSize={1}>
                <Trans>#ADDIE</Trans>
              </NavItem>
            </Nav>
          </Panel>

          <Panel>
            <PanelTitle fontSize={0} fontWeight={'bold'}>
              <Trans>Popular categories</Trans>
            </PanelTitle>
            <Nav>
              <NavItem mb={3} fontSize={1}>
                <Trans>Humanities</Trans>
              </NavItem>
              <NavItem mb={3} fontSize={1}>
                <Trans>Behavioural science</Trans>
              </NavItem>
              <NavItem mb={3} fontSize={1}>
                <Trans>English</Trans>
              </NavItem>
              <NavItem mb={3} fontSize={1}>
                <Trans>Romana</Trans>
              </NavItem>
              <NavItem mb={3} fontSize={1}>
                <Trans>Postgraduate</Trans>
              </NavItem>
            </Nav>
          </Panel>
        </WrapperPanel>
      </MainContainer>
    );
  }
}

const OverviewCollection = styled.div`
  padding: 24px;
  text-align: center;
  font-weight: 600;
  color: #000000b5;
`;

const withGetCollections = graphql<
  {},
  {
    data: {
      community: Community;
    };
  }
>(getCommunityQuery, {
  options: (props: Props) => ({
    variables: {
      limit: 15,
      context: Number(props.match.params.community)
    }
  })
}) as OperationOption<{}, {}>;

export default compose(
  withGetCollections,
  withState('isOpen', 'onOpen', false),
  withState('isOpenCollection', 'onOpenCollection', false),
  withState('isEditCommunityOpen', 'onEditCommunityOpen', false),
  withState('isUsersOpen', 'showUsers', false),
  withState('stacked', 'onStacked', false),
  withHandlers({
    handleCollection: props => () =>
      props.onOpenCollection(!props.isOpenCollection),
    handleNewCollection: props => coll => {
      props.history.push('/collections/' + coll);
    },
    editCommunity: props => () =>
      props.onEditCommunityOpen(!props.isEditCommunityOpen)
  })
)(CommunitiesFeatured);