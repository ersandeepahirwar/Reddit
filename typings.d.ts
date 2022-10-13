type Subreddit = {
  id: number;
  topic: string;
  created_at: string;
};

type Comments = {
  id: number;
  post_id: number;
  username: string;
  text: string;
  created_at: string;
};

type Vote = {
  id: number;
  post_id: number;
  username: string;
  upvote: boolean;
  created_at: string;
};

type Post = {
  id: number;
  title: string;
  body: string;
  subreddit_id: number;
  username: string;
  image: string;
  created_at: string;
  votes: Vote[];
  comments: Comments[];
  subreddit: Subreddit[];
};
