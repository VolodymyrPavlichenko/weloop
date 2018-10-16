export default `
  type User {
    id: Int!
    username: String!
    email: String!
    emojiId: String!
    role: String!
    location: String!
    language: String!
    languages: String[]!
    interests: String[]!
    notifications: Notification[]!
  }
  
  type Notification {
    id: Int!
    when: String!
    type: String!
    content: String!
  }
`;
