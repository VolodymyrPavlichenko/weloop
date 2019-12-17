import * as React from 'react';
import { Trans } from '@lingui/macro';
import { i18nMark } from '@lingui/react';
import { Input, Textarea } from '@rebass/forms';
import { Button, Heading } from 'rebass/styled-components';
import Alert from 'ui/elements/Alert';
import Modal, {
  Actions,
  Container,
  ContainerForm,
  CounterChars,
  Header,
  Row,
  AlertWrapper
} from 'ui/modules/Modal';
import { useCreateCollectionMutationMutation } from 'graphql/generated/createCollection.generated';
import {
  BasicCreateCollectionFormValues,
  basicCreateCollectionInitialValues,
  basicCreateCollectionFormValuesSchema,
  getBasicCreateCollectionInput
} from 'common/forms/collection/basicCreate';
import { useFormik } from 'formik';
import { Community } from 'graphql/types.generated';

const tt = {
  placeholders: {
    name: i18nMark('Choose a name for the collection'),
    summary: i18nMark(
      'Please describe what the collection is for and what kind of resources it is likely to contain...'
    ),
    image: i18nMark('Enter the URL of an image to represent the collection')
  }
};

interface Props {
  communityId: Community['id'];
  closeModal: () => void;
}

const CreateCollectionModal: React.FC<Props> = ({
  closeModal,
  communityId
}) => {
  const [create /* , result */] = useCreateCollectionMutationMutation();
  const formik = useFormik<BasicCreateCollectionFormValues>({
    initialValues: basicCreateCollectionInitialValues,
    onSubmit: vals =>
      create({
        variables: {
          collection: getBasicCreateCollectionInput(vals),
          communityId
        }
      }),
    validationSchema: basicCreateCollectionFormValuesSchema
  });
  const handleCloseModal = React.useCallback(() => closeModal(), [closeModal]);
  return (
    <Modal closeModal={handleCloseModal}>
      <Container>
        <Header>
          <Heading m={2}>
            <Trans>Create a new collection</Trans>
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
          <Button variant="outline" onClick={handleCloseModal}>
            <Trans>Cancel</Trans>
          </Button>
        </Actions>
      </Container>
    </Modal>
  );
};

export default CreateCollectionModal;
