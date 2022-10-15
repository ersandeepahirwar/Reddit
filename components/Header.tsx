import Image from "next/image";
import Link from "next/link";

import { signIn, signOut, useSession } from "next-auth/react";

import { ChevronDownIcon, SearchIcon } from "@heroicons/react/solid";

import {
  BellIcon,
  ChatIcon,
  GlobeIcon,
  PlusIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";

const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-white p-2 shadow-md">
      <div className="flex items-center space-x-2">
        <div className="relative h-8 w-16 cursor-pointer">
          <Link href="/">
            <Image
              src="https://i.ibb.co/QK8BMx3/Reddit-Logo.png"
              alt="Reddit Logo"
              layout="fill"
              objectFit="contain"
            />
          </Link>
        </div>
        <form className="rounded-full border border-gray-300 p-1 sm:flex sm:items-center sm:space-x-2">
          <SearchIcon className="h-4 w-4 text-gray-700" />
          <input
            type="text"
            placeholder="Search Reddit"
            className="hidden border-none bg-transparent text-[13px] outline-none sm:inline-flex"
          />
          <button type="submit" hidden />
        </form>
      </div>
      <div className="lg:flex lg:items-center lg:space-x-5">
        <div className="hidden lg:inline-flex lg:space-x-1">
          <SparklesIcon className="h-9 cursor-pointer rounded-full text-gray-700 hover:bg-gray-100 lg:p-2" />
          <GlobeIcon className="h-9 cursor-pointer rounded-full text-gray-700 hover:bg-gray-100 lg:p-2" />
          <VideoCameraIcon className="h-9 cursor-pointer rounded-full text-gray-700 hover:bg-gray-100 lg:p-2" />
          <ChatIcon className="h-9 cursor-pointer rounded-full text-gray-700 hover:bg-gray-100 lg:p-2" />
          <BellIcon className="h-9 cursor-pointer rounded-full text-gray-700 hover:bg-gray-100 lg:p-2" />
          <PlusIcon className="h-9 cursor-pointer rounded-full text-gray-700 hover:bg-gray-100 lg:p-2" />
          <SpeakerphoneIcon className="h-9 cursor-pointer rounded-full text-gray-700 hover:bg-gray-100 lg:p-2" />
        </div>
        {session ? (
          <div
            onClick={() => signOut()}
            className="flex cursor-pointer flex-row items-center space-x-1 rounded-full border border-gray-300 py-1 px-2"
          >
            <div className="relative h-5 w-5">
              <Image
                src="https://i.ibb.co/N6vPwTp/Reddit-Icon.png"
                alt="Reddit Icon"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="truncate text-[12px]">{session?.user?.name}</p>
              <p className="flex flex-row items-center text-[10px]">
                <div className="relative h-3 w-3">
                  <Image
                    src="https://i.ibb.co/qNvQnJJ/karma-icon.png"
                    layout="fill"
                  />
                </div>
                <span>&nbsp;1 Karma</span>
              </p>
            </div>
            <ChevronDownIcon className="h-4" />
          </div>
        ) : (
          <div
            onClick={() => signIn()}
            className="flex cursor-pointer flex-row items-center space-x-1 rounded-full border border-gray-300 py-1 px-2"
          >
            <div className="relative h-5 w-5">
              <Image
                src="https://i.ibb.co/N6vPwTp/Reddit-Icon.png"
                alt="Reddit Icon"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-[12px]">Sign In</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
