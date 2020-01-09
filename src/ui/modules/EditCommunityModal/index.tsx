import { Trans } from '@lingui/macro';
import { i18nMark } from '@lingui/react';
import { Input, Textarea } from '@rebass/forms';
import { Community } from 'graphql/types.generated';
import * as React from 'react';
import { Button, Heading } from 'rebass/styled-components';
import Alert from 'ui/elements/Alert';
import Modal, {
  Actions,
  AlertWrapper,
  Container,
  ContainerForm,
  CounterChars,
  Header,
  Row
} from 'ui/modules/Modal';
import { FormikHook } from 'common/types';
import { throwUnimplementedFn } from 'common/util/ctx-mock/throwUnimplementedFn';

const tt = {
  placeholders: {
    name: i18nMark('Choose a name for the community'),
    summary: i18nMark(
      'Please describe who might be interested in this community and what kind of collections it is likely to contain...'
    ),
    image: i18nMark('Enter the URL of an image to represent the community')
  }
};

interface Props {
  communityId: Community['id'];
  closeModal: () => void;
}

export interface EditCommunityFormValues {
  name: string;
  summary: string;
  image: string;
}

export interface EditCommunityContextCfg {
  communityId: Community['id'];
}
export type EditCommunityContext = (
  cfg: EditCommunityContextCfg
) => {
  formik: FormikHook<EditCommunityFormValues>;
};
export const EditCommunityContext = React.createContext<EditCommunityContext>(
  throwUnimplementedFn<EditCommunityContext>('EditCommunityFormContext')
);

export const EditCommunityModal: React.FC<Props> = ({
  closeModal,
  communityId
}) => {
  const servizioContext = React.useContext(EditCommunityContext);
  const { formik } = servizioContext({ communityId });

  return (
    <Modal closeModal={closeModal}>
      <Container>
        <Header>
          <Heading m={2}>
            <Trans>Edit the community details</Trans>
          </Heading>
        </Header>
        <Row>
          <label>Name</label>
          <ContainerForm>
            <Input
              placeholder={tt.placeholders.name}
              disabled={formik.isSubmitting}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <CounterChars>{60 - formik.values.name.length}</CounterChars>
            {formik.errors.name && (
              <AlertWrapper>
                <Alert variant="bad">{formik.errors.name}</Alert>
              </AlertWrapper>
            )}
          </ContainerForm>
        </Row>
        <Row big>
          <label>
            <Trans>Description</Trans>
          </label>
          <ContainerForm>
            <Textarea
              placeholder={tt.placeholders.summary}
              disabled={formik.isSubmitting}
              name="summary"
              value={formik.values.summary}
              onChange={formik.handleChange}
            />
            <CounterChars>{500 - formik.values.summary.length}</CounterChars>
            {formik.errors.summary && (
              <AlertWrapper>
                <Alert variant="bad">{formik.errors.summary}</Alert>
              </AlertWrapper>
            )}
          </ContainerForm>
        </Row>
        <Row>
          <label>
            <Trans>Image</Trans>
          </label>
          <ContainerForm>
            <Input
              placeholder={tt.placeholders.image}
              disabled={formik.isSubmitting}
              name="image"
              value={formik.values.image}
              onChange={formik.handleChange}
            />
            {formik.errors.image && (
              <AlertWrapper>
                <Alert variant="bad">{formik.errors.image}</Alert>
              </AlertWrapper>
            )}
          </ContainerForm>
        </Row>
        <Actions>
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            style={{ marginLeft: '10px' }}
            onClick={formik.submitForm}
          >
            <Trans>Create</Trans>
          </Button>
          <Button variant="outline" onClick={closeModal}>
            <Trans>Cancel</Trans>
          </Button>
        </Actions>
      </Container>
    </Modal>
  );
};

export default EditCommunityModal;
