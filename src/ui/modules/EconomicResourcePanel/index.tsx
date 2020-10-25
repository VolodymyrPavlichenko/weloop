import React, { FC } from 'react';
import { Container, Header } from 'ui/modules/Modal';
import { Heading } from 'rebass/styled-components';
import { ActorComp, ActorProps } from '../ActivityPreview';
import Modal from 'ui/modules/Modal';
import { action } from '@storybook/addon-actions';

export type Props = {
  name: string;
} & ActorProps;

export const EconomicResourcePanel: FC<Props> = props => {
  return (
    <Modal closeModal={action('close modal')}>
      <Container>
        <ActorComp {...props} />
        <Header>
          <Heading m={2}>{props.name}</Heading>
        </Header>
      </Container>
    </Modal>
  );
};
