import { useRouter } from "next/router";

import Avatar from "../../components/Avatar";
import Publisher from "../../components/Publisher";
import Feed from "../../components/Feed";

const Subreddit = () => {
  const {
    query: { topic },
  } = useRouter();

  return (
    <div className={`h-[50px] bg-red-500 py-[20px]`}>
      <div className="mt-[20px] bg-white">
        <div className="flex flex-col items-center justify-center space-y-3 pb-3">
          <div className="-mt-[20px]">
            <Avatar seed={topic as string} large />
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-[15px]">
              <span className="text-gray-500">Welcome to the&nbsp;</span>
              <span className="text-red-500">r/{topic}</span>
              <span className="text-gray-500">&nbsp;subreddit</span>
            </p>
            <p className="rounded-2xl bg-red-500 p-2 text-[14px] text-white">
              r/{topic}
            </p>
          </div>
        </div>
      </div>
      <div className="md:max-w-[600px mx-auto mt-5 w-[95vw] max-w-[400px] space-y-5 pb-5 sm:max-w-[500px] lg:max-w-[700px] xl:max-w-[800px]">
        <Publisher subReddit={topic as string} />
        <Feed topic={topic as string} />
      </div>
    </div>
  );
};

export default Subreddit;
