import type { NextPage } from "next";

import Head from "next/head";

import Publisher from "../components/Publisher";
import Feed from "../components/Feed";
import { useQuery } from "@apollo/client";
import { GET_SUBREDDITS_WITH_LIMITS } from "../graphql/queries";
import Subreddit from "../components/Subreddit";

const Home: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDITS_WITH_LIMITS, {
    variables: {
      limit: 10,
    },
  });

  const subreddits: Subreddit[] = data?.getSubredditListLimit;
  console.log(subreddits);

  return (
    <div className="my-7 mx-auto max-w-5xl">
      <Head>
        <title>Reddit</title>
        <link rel="icon" href="favicon.ico" />
      </Head>
      <Publisher />
      <div className="flex">
        <Feed />
        <div className="sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
          <p className="text-md mb-1 p-4 pb-3 font-bold">Top Communities</p>
          <div>
            {subreddits?.map((subreddit, index) => (
              <Subreddit
                key={subreddit.id}
                topic={subreddit.topic}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
