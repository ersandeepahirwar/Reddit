import toast from "react-hot-toast";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { LinkIcon, PhotographIcon } from "@heroicons/react/outline";
import { useMutation } from "@apollo/client";

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
      className="sticky top-16 z-50 mx-auto flex w-[95vw] max-w-[400px] flex-col space-y-5 rounded-xl bg-white p-2 shadow-lg sm:max-w-[500px] md:max-w-[600px] md:p-5 lg:max-w-[700px] xl:max-w-[800px]"
    >
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-3 md:space-y-0">
        <div className="flex justify-center">
          <Avatar />
        </div>
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
          className="w-full  rounded-full border-none bg-blue-50 p-2 text-center text-[13px] outline-none md:w-auto md:flex-1"
        />
        <div className="flex justify-center space-x-5 md:space-x-1">
          <PhotographIcon
            onClick={() => setImageBoxOpen(!imageBoxOpen)}
            className={`h-6 cursor-pointer text-gray-500 ${
              imageBoxOpen && "text-orange-500"
            }`}
          />
          <LinkIcon className="h-6 cursor-pointer text-gray-500" />
        </div>
      </div>
      {!!watch("postTitle") && (
        <div className="flex flex-col space-y-5">
          <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0">
            <p className="text-sm md:min-w-[90px]">Body</p>
            <input
              {...register("postBody")}
              type="text"
              placeholder="Text ( Optional )"
              className="w-full rounded-full border-none bg-blue-50 p-2 text-center text-[13px] outline-none md:w-auto md:flex-1"
            />
          </div>
          {!subReddit && (
            <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0">
              <p className="text-sm md:min-w-[90px]">Subreddit</p>
              <input
                {...register("subReddit", { required: true })}
                type="text"
                placeholder="i.e. next.js"
                className="w-full rounded-full border-none bg-blue-50 p-2 text-center text-[13px] outline-none md:w-auto md:flex-1"
              />
            </div>
          )}
          {imageBoxOpen && (
            <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0">
              <p className="text-sm md:min-w-[90px]">Image URL</p>
              <input
                {...register("postImage")}
                type="text"
                placeholder="URL ( Optional )"
                className="w-full rounded-full border-none bg-blue-50 p-2 text-center text-[13px] outline-none md:w-auto md:flex-1"
              />
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <div className="flex justify-center">
              {errors.postTitle?.type === "required" && (
                <p className="text-[13px] text-orange-500">
                  A Post Title is required!
                </p>
              )}
              {errors.subReddit?.type === "required" && (
                <p className="text-[13px] text-orange-500">
                  A Subreddit is required!
                </p>
              )}
            </div>
          )}
          {!!watch("postTitle") && (
            <button className="w-full rounded-full bg-orange-500 p-2 text-sm text-white">
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default Publisher;
