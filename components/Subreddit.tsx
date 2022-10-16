import Link from "next/link";

import { ChevronUpIcon } from "@heroicons/react/outline";

import Avatar from "./Avatar";

type Props = {
  topic: string;
  index: number;
};

const Subreddit = ({ index, topic }: Props) => {
  return (
    <div className="flex items-center space-x-2">
      <p className="text-[13px]">{index + 1}</p>
      <ChevronUpIcon className="h-3 w-3 text-green-400" />
      <Avatar seed={`/subreddit/${topic}`} />
      <p className="flex-1 truncate text-[13px] font-[500]">r/{topic}</p>
      <Link href={`/subreddit/${topic}`}>
        <div className="cursor-pointer rounded-full bg-blue-500 px-2 text-[13px] text-white">
          View
        </div>
      </Link>
    </div>
  );
};

export default Subreddit;
