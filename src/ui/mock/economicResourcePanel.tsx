import { getActor } from './actor';

export const economicResourceProps = () => {
  return {
    name: 'Some economic resource title',
    media: 'url/to/media',
    tags: ['tag1', 'tag2'],
    history: ['some', 'history'],
    actor: getActor(),
    createdAt: 'created',
    event: 'event',
    communityName: 'communityName',
    communityLink: 'communityLink'
  };
};
