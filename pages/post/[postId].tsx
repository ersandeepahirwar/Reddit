import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";

import toast from "react-hot-toast";
import Timeago from "react-timeago";

import { useMutation, useQuery } from "@apollo/client";

import { GET_POST_BY_POST_ID } from "../../graphql/queries";
import { ADD_COMMENT } from "../../graphql/mutations";

import Post from "../../components/Post";
import Avatar from "../../components/Avatar";

type FormData = {
  comment: string;
};

const PostPage = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_POST_ID, "getPostListByPostId"],
  });

  const { data } = useQuery(GET_POST_BY_POST_ID, {
    variables: {
      post_id: router.query.postId,
    },
  });

  const post: Post = data?.getPostListByPostId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const notification = toast.loading("Posting you comment");

    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        text: data.comment,
      },
    });

    setValue("comment", "");

    toast.success("Comment has been posted!", {
      id: notification,
    });
  };

  return (
    <div className="md:max-w-[600px my-5 mx-auto w-[95vw] max-w-[400px] sm:max-w-[500px] lg:max-w-[700px] xl:max-w-[800px]">
      <Post post={post} />
      <div className="mt-2 space-y-2 rounded-xl bg-white p-2">
        <p className="text-[13px]">
          <span>Comment as&nbsp;</span>
          <span className="font-[500] text-red-500">
            @{session?.user?.name}
          </span>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <textarea
            {...register("comment")}
            disabled={!session}
            className="h-20 w-full rounded-xl border border-red-500 p-2 text-[13px] outline-none disabled:bg-red-50"
            placeholder={
              session ? "What are your thoughts?" : "Please Sign in to comment!"
            }
          />
          <button
            disabled={!session}
            type="submit"
            className="rounded-full bg-red-500 py-1 px-2 text-[13px] text-white disabled:bg-blue-200"
          >
            Comment
          </button>
        </form>
      </div>
      <div className="mt-2 rounded-xl bg-white">
        {post?.comments.map((comment) => (
          <div
            className="relative flex items-center space-y-1 space-x-2 p-1"
            key={comment.id}
          >
            <div className="z-50">
              <Avatar seed={comment.username} />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px]">
                <span className="font-[500] text-red-500">
                  @{comment.username}
                </span>
                <span className="text-gray-500">&nbsp;&#8226;&nbsp;</span>
                <Timeago date={comment.created_at} className="text-gray-500" />
              </p>
              <p className="text-[13px]">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostPage;
