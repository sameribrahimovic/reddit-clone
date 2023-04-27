import Head from "next/head";
import { getPosts } from "lib/data";
import prisma from "lib/prisma";
import timeago from "lib/timeago";
import Posts from "components/Posts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home({ posts }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";

  if (loading) {
    return null;
  }

  ///check if user has a username and if not - redirect to setup page
  if (session && !session.user.name) {
    router.push("/setup");
  }
  return (
    <div>
      <Head>
        <title>Reddit Clone</title>
        <meta name="description" content="A great social network!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-gray-700 text-white h-12 flex pt-3 px-5 pb-2">
        <p>Reddit clone</p>
        <p className="grow"></p>
        {/* <p className="mr-5 ">
          Hello <span className="font-bold">{session.user.name}</span>
        </p> */}
        <a
          className="flex-l border px-4 font-bold rounded-full mb-1"
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
        >
          {/* show login/logout btn based on if user is logen in or not */}
          {session ? "logout" : "login"}
        </a>
      </header>
      <Posts posts={posts} />
    </div>
  );
}

export async function getServerSideProps() {
  let posts = await getPosts(prisma);
  posts = JSON.parse(JSON.stringify(posts));

  return {
    props: {
      posts: posts,
    },
  };
}
