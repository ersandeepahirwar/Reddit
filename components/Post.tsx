import Link from "next/link";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import toast from "react-hot-toast";
import TimeAgo from "react-timeago";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookmarkIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  GiftIcon,
  ShareIcon,
} from "@heroicons/react/outline";

import { Jelly } from "@uiball/loaders";
import { useMutation, useQuery } from "@apollo/client";

import { ADD_VOTE } from "../graphql/mutations";
import { GET_ALL_VOTES_BY_POST_ID } from "../graphql/queries";

import Avatar from "./Avatar";

type Props = {
  post: Post;
};

const Post = ({ post }: Props) => {
  const [vote, setVote] = useState<boolean>();

  const { data: session } = useSession();

  const { data, loading } = useQuery(GET_ALL_VOTES_BY_POST_ID, {
    variables: {
      post_id: post?.id,
    },
  });

  const [addVote] = useMutation(ADD_VOTE, {
    refetchQueries: [GET_ALL_VOTES_BY_POST_ID, "getVotesByPostId"],
  });

  const upVote = async (isUpVote: boolean) => {
    if (!session) {
      toast("You need to sign in to vote!");
      return;
    }

    if (vote && isUpVote) return;

    if (vote == false && !isUpVote) return;

    await addVote({
      variables: {
        post_id: post.id,
        username: session.user?.name,
        upvote: isUpVote,
      },
    });
  };

  useEffect(() => {
    const votes: Vote[] = data?.getVotesByPostId;

    const vote = votes?.find(
      (vote) => vote.username == session?.user?.name
    )?.upvote;

    setVote(vote);
  }, [data]);

  const displayVotes = (data: any) => {
    const votes: Vote[] = data?.getVotesByPostId;

    const displayNumber = votes?.reduce(
      (total, vote) => (vote.upvote ? (total += 1) : (total -= 1)),
      0
    );

    if (votes?.length === 0) return 0;

    if (displayNumber === 0) {
      return votes[0]?.upvote ? 1 : -1;
    }

    return displayNumber;
  };

  if (!post) {
    return (
      <div className="flex w-full items-center justify-center p-5">
        <Jelly size={50} color="#FF4501" />
      </div>
    );
  }

  return (
    <div className="flex rounded-xl bg-white shadow-md">
      <div className="flex flex-col items-center space-y-1 rounded-xl bg-blue-50 px-1 py-2">
        <ArrowUpIcon
          onClick={() => upVote(true)}
          className={`h-6 w-6 cursor-pointer rounded-md p-1 hover:bg-blue-100 hover:text-red-500 ${
            vote && "text-red-500"
          }`}
        />
        <p className="text-[13px] font-semibold">{displayVotes(data)}</p>
        <ArrowDownIcon
          onClick={() => upVote(false)}
          className={`h-6 w-6 cursor-pointer rounded-md p-1 hover:bg-blue-100 hover:text-blue-500 ${
            vote === false && "text-blue-500"
          }`}
        />
      </div>
      <Link href={`/post/${post.id}`}>
        <div className="flex cursor-pointer flex-col space-y-4 p-2">
          <div className="flex items-center space-x-2">
            <Avatar seed={post.subreddit[0]?.topic} />
            <p className="flex flex-col sm:flex-row sm:items-center">
              <Link href={`/subreddit/${post.subreddit[0]?.topic}`}>
                <span className="cursor-pointer text-[13px] font-[500] hover:text-red-500 hover:underline">
                  r/{post.subreddit[0]?.topic}
                </span>
              </Link>
              <span className="text-[11px] text-gray-500">
                <span className="hidden sm:inline-flex">
                  &nbsp;&bull;&nbsp;
                </span>
                Posted by u/
                {post.username}&nbsp;
              </span>
              <TimeAgo date={post.created_at} className="hidden" />
            </p>
          </div>
          <div className="">
            <h2 className="text-[14px] font-semibold">{post.title}</h2>
            <p className="text-[13px] text-gray-500">{post.body}</p>
          </div>
          {post.image && (
            <img
              src={post.image}
              alt="Post Thumbnail"
              className="w-full cursor-pointer rounded-xl"
            />
          )}
          <div className="flex justify-evenly text-gray-700">
            <div className="flex cursor-pointer space-x-2 rounded-xl p-2  hover:bg-blue-50">
              <ChatAltIcon className="h-4 w-4" />
              <p className="hidden text-[12px] md:inline-flex">
                {post.comments.length} Comments
              </p>
            </div>
            <div className="flex cursor-pointer space-x-2 rounded-xl p-2 hover:bg-blue-50">
              <GiftIcon className="h-4 w-4" />
              <p className="hidden text-[12px] md:inline-flex">Award</p>
            </div>
            <div className="flex cursor-pointer space-x-2 rounded-xl p-2 hover:bg-blue-50">
              <ShareIcon className="h-4 w-4" />
              <p className="hidden text-[12px] md:inline-flex">Share</p>
            </div>
            <div className="flex cursor-pointer space-x-2 rounded-xl p-2 hover:bg-blue-50">
              <BookmarkIcon className="h-4 w-4" />
              <p className="hidden text-[12px] md:inline-flex">Save</p>
            </div>
            <div className="flex cursor-pointer space-x-2 rounded-xl p-2 hover:bg-blue-50">
              <DotsHorizontalIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Post;
