import React from 'react';
import { compose } from 'recompose';
import { graphql, QueryControls, OperationOption } from 'react-apollo';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const getFeaturedCommunities = require('../../graphql/getFeaturedCommunities.graphql');
import Loader from '../elements/Loader/Loader';
import { Trans } from '@lingui/macro';
import CommunitySmall from '../elements/Community/CommunitySmall';
import styled from '../../themes/styled';
import { ChevronLeft, Right } from '../elements/Icons';
import { GRAPHQL_ENDPOINT } from '../../constants';

export const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  padding: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.lightgray};
  margin: 0;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.darkgray};
  & h5 {
    margin: 0;
    color: ${props => props.theme.colors.darkgray};
    display: inline-block;
    padding: 0;
    font-size: 12px;
    text-transform: uppercase;
    height: 30px;
    font-weight: 500;
    line-height: 30px;
  }
`;

export const RightContext = styled.div`
  & span {
    cursor: pointer;
    display: inline-block;
    height: 30px;
    & svg {
      color: ${props => props.theme.colors.darkgray} !important;
      vertical-align: middle;
      height: 30px;
    }
    &:hover {
      & svg {
        color: ${props => props.theme.colors.darkgray} !important;
      }
    }
  }
  float: right;
`;

interface Data extends QueryControls {
  one: any;
  two: any;
  three: any;
  four: any;
  five: any;
  six: any;
  seven: any;
}

interface Props {
  data: Data;
}
class MultipleItems extends React.Component<Props> {
  private slider: any;

  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }
  render() {
    const settings = {
      dots: false,
      arrows: false,
      infinite: true,
      autoplay: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
      <>
        <Title>
          <h5>
            <Trans>Featured communities</Trans>{' '}
          </h5>
          <RightContext>
            <span onClick={this.previous}>
              <ChevronLeft
                width={26}
                height={26}
                strokeWidth={1}
                color={'#333'}
              />
            </span>
            <span onClick={this.next}>
              <Right width={26} height={26} strokeWidth={1} color={'#333'} />
            </span>
          </RightContext>
        </Title>
        {this.props.data.error ? (
          <span>
            <Trans>{/* Error loading featured communities */}</Trans>
          </span>
        ) : this.props.data.loading ? (
          <Loader />
        ) : (
          <Slider ref={c => (this.slider = c)} {...settings}>
            {this.props.data.one ? (
              <CommunitySmall community={this.props.data.one} />
            ) : null}
            {this.props.data.two ? (
              <CommunitySmall community={this.props.data.two} />
            ) : null}
            {this.props.data.three ? (
              <CommunitySmall community={this.props.data.three} />
            ) : null}
            {this.props.data.four ? (
              <CommunitySmall community={this.props.data.four} />
            ) : null}
            {this.props.data.five ? (
              <CommunitySmall community={this.props.data.five} />
            ) : null}
            {this.props.data.six ? (
              <CommunitySmall community={this.props.data.six} />
            ) : null}
            {this.props.data.seven ? (
              <CommunitySmall community={this.props.data.seven} />
            ) : null}
          </Slider>
        )}
      </>
    );
  }
}

const is_home =
  GRAPHQL_ENDPOINT == 'https://home.moodle.net/api/graphql' ? true : false;

const withGetInbox = graphql<
  {},
  {
    data: any;
  }
>(getFeaturedCommunities, {
  options: {
    variables: {
      one: is_home
        ? '29443e0a-8091-48c3-8617-9bc91810e0d4'
        : '4f59c147-37c2-4c56-9736-beb6b09792cf',
      two: is_home
        ? '47d994da-cd9c-4d05-b3b7-1363b54bdd5f'
        : '4f59c147-37c2-4c56-9736-beb6b09792cf',
      three: is_home
        ? 'f546ae02-654c-4532-877f-de07fef9aa98'
        : '4f59c147-37c2-4c56-9736-beb6b09792cf',
      four: is_home
        ? '24f47162-19e8-4044-863e-6e8b15e5658b'
        : '4f59c147-37c2-4c56-9736-beb6b09792cf',
      five: is_home
        ? '24f47162-19e8-4044-863e-6e8b15e5658b'
        : '4f59c147-37c2-4c56-9736-beb6b09792cf',
      six: is_home
        ? '24f47162-19e8-4044-863e-6e8b15e5658b'
        : '4f59c147-37c2-4c56-9736-beb6b09792cf',
      seven: is_home
        ? '24f47162-19e8-4044-863e-6e8b15e5658b'
        : '4f59c147-37c2-4c56-9736-beb6b09792cf'
    }
  }
}) as OperationOption<{}, {}>;

export default compose(withGetInbox)(MultipleItems);
