//dynamic page that receives the name of a subreddit as the parameter
import prisma from "lib/prisma";
import { getSubreddit, getPostsFromSubreddit } from "lib/data.js";
import Link from "next/link";
import Posts from "components/Posts";

export default function Subreddit({ subreddit, posts }) {
  if (!subreddit)
    return <p className="text-center p-5">Subreddit does not exist 😞</p>;

  return (
    <>
      <header className="bg-gray-700 text-white h-12 flex pt-3 px-5 pb-2">
        <Link href={`/`}>
          <a className="underline">Home</a>
        </Link>
        <p className="grow"></p>
      </header>
      <header className="bg-gray-700 text-white h-12 flex pt-3 px-5 pb-2">
        <p className="text-center">/r/{subreddit.name}</p>
        <p className="ml-4 text-left grow">{subreddit.description}</p>
      </header>
      <Posts posts={posts} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const subreddit = await getSubreddit(params.subreddit, prisma);
  let posts = await getPostsFromSubreddit(params.subreddit, prisma);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      subreddit,
      posts,
    },
  };
}
