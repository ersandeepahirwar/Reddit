import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";

import toast from "react-hot-toast";

import { LinkIcon, PhotographIcon } from "@heroicons/react/outline";

import { ADD_POST, ADD_SUBREDDIT } from "../graphql/mutations";
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from "../graphql/queries";

import client from "../apollo-client";

import Avatar from "./Avatar";

type FormData = {
  postTitle: string;
  postBody: string;
  postImage: string;
  subReddit: string;
};

type Props = {
  subReddit?: string;
};

const Publisher = ({ subReddit }: Props) => {
  const { data: session } = useSession();

  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, "getPostList"],
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);

  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (formData) => {
    const notification = toast.loading("Publishing new post");

    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subReddit || formData.subReddit,
        },
      });

      const subredditExists = getSubredditListByTopic.length > 0;

      if (!subredditExists) {
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subReddit,
          },
        });

        const image = formData.postImage || "";

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            subreddit_id: newSubreddit.id,
            image: image,
            username: session?.user?.name,
          },
        });
      } else {
        const image = formData.postImage || "";

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            title: formData.postTitle,
            body: formData.postBody,
            subreddit_id: getSubredditListByTopic[0].id,
            image: image,
            username: session?.user?.name,
          },
        });
      }

      setValue("postTitle", "");
      setValue("postBody", "");
      setValue("subReddit", "");
      setValue("postImage", "");

      toast.success("New Post has been published!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Something went wrong!", {
        id: notification,
      });
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-16 z-50 rounded-md border border-gray-300 bg-white p-2"
    >
      <div className="flex items-center space-x-3">
        <Avatar />

        <input
          {...register("postTitle", { required: true })}
          type="text"
          placeholder={
            session
              ? subReddit
                ? `Create a post in r/${subReddit}`
                : "Create a post by entering a title!"
              : "Sign in to post"
          }
          disabled={!session}
          className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
        />

        <PhotographIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-300 ${
            imageBoxOpen && "text-blue-300"
          }`}
        />

        <LinkIcon className="h-6 cursor-pointer text-gray-300" />
      </div>

      {!!watch("postTitle") && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body</p>
            <input
              {...register("postBody")}
              type="text"
              placeholder="Text ( Optional )"
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
            />
          </div>

          {!subReddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Subreddit</p>
              <input
                {...register("subReddit", { required: true })}
                type="text"
                placeholder="i.e. next.js"
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              />
            </div>
          )}

          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL</p>
              <input
                {...register("postImage")}
                type="text"
                placeholder="URL ( Optional )"
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              />
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === "required" && (
                <p className="text-sm">A Post Title is required!</p>
              )}
              {errors.subReddit?.type === "required" && (
                <p className="text-sm">A Subreddit is required!</p>
              )}
            </div>
          )}

          {!!watch("postTitle") && (
            <button className="w-full rounded-full bg-blue-400 p-2 text-white">
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default Publisher;
