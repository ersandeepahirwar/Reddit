import { gql } from "@apollo/client";

export const ADD_COMMENT = gql`
  mutation MyMutation($post_id: ID!, $username: String!, $text: String!) {
    insertComment(post_id: $post_id, text: $text, username: $username) {
      id
      post_id
      text
      username
      created_at
    }
  }
`;

export const ADD_VOTE = gql`
  mutation MyMutation($post_id: ID!, $username: String!, $upvote: Boolean!) {
    insertVote(post_id: $post_id, username: $username, upvote: $upvote) {
      id
      post_id
      upvote
      username
      created_at
    }
  }
`;

export const ADD_POST = gql`
  mutation MyMutation(
    $title: String!
    $body: String!
    $subreddit_id: ID!
    $image: String!
    $username: String!
  ) {
    insertPost(
      title: $title
      body: $body
      subreddit_id: $subreddit_id
      image: $image
      username: $username
    ) {
      id
      title
      body
      subreddit_id
      image
      username
      created_at
    }
  }
`;

export const ADD_SUBREDDIT = gql`
  mutation MyMutation($topic: String!) {
    insertSubreddit(topic: $topic) {
      id
      topic
      created_at
    }
  }
`;
