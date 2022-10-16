import Head from "next/head";

import type { NextPage } from "next";

import { useQuery } from "@apollo/client";

import { GET_SUBREDDITS_WITH_LIMITS } from "../graphql/queries";

import Publisher from "../components/Publisher";
import Feed from "../components/Feed";
import Subreddit from "../components/Subreddit";

const Home: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDITS_WITH_LIMITS, {
    variables: {
      limit: 10,
    },
  });

  const subreddits: Subreddit[] = data?.getSubredditListLimit;

  return (
    <div className="md:max-w-[600px mx-auto my-5 w-[95vw] max-w-[400px] sm:max-w-[500px] lg:max-w-[700px] xl:max-w-[800px]">
      <Head>
        <title>Reddit</title>
        <link rel="icon" href="favicon.ico" />
        <meta
          name="description"
          content="Reddit 2.0 built with Next.js by Codey Sandeep"
        />
      </Head>
      <Publisher />
      <div className="mt-5 lg:flex lg:flex-row lg:space-x-5">
        <Feed />
        <div className="sticky top-40 hidden h-fit flex-col space-y-3 rounded-xl bg-white p-3 lg:inline-flex">
          <p className="rounded-2xl bg-red-500 py-2 text-center text-[15px] text-white">
            Top Communities
          </p>
          <div className="min-w-[220px] space-y-3">
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
