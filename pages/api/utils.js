import prisma from "lib/prisma";
import { faker } from "@faker-js/faker";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.end();

  if (req.body.task === "generate_users") {
    let count = 0;

    while (count < 10) {
      await prisma.user.create({
        data: {
          name: faker.internet.userName().toLowerCase(),
          email: faker.internet.email().toLowerCase(),
        },
      });
      count++;
    }
  }

  if (req.body.task === "generate_subreddits") {
    let count = 0;

    while (count < 10) {
      await prisma.subreddit.create({
        data: {
          name: faker.word.noun().toLowerCase(),
          description: faker.lorem.paragraph(1).toLowerCase(),
        },
      });
      count++;
    }
  }

  if (req.body.task === "add_fake_content") {
    //first find all subreddits
    const subreddits = await prisma.subreddit.findMany();

    //find all users
    const users = await prisma.user.findMany();

    //helper function to get random user
    const getRandomUser = () => {
      const randomIndex = Math.floor(Math.random() * users.length);
      return users[randomIndex];
    };

    const createPostFromRandomUser = async (subreddit) => {
      const user = getRandomUser();

      //Once we have the random user, create a post with some fake content
      // and connect it to the user and to the subreddit
      return await prisma.post.create({
        data: {
          title:
            faker.hacker.adjective() +
            " " +
            faker.hacker.verb() +
            " " +
            faker.hacker.noun(),
          content: faker.hacker.phrase(),
          subreddit: {
            connect: {
              name: subreddit.name,
            },
          },
          author: {
            connect: { id: user.id },
          },
        },
      });
    };

    // return created post, so it can be used after to create comments to it
    const createCommentsToPost = async (post) => {
      let count = 0;
      const commentsNumber = Math.floor(Math.random() * 5);

      while (count < commentsNumber) {
        const user = getRandomUser();

        await prisma.comment.create({
          data: {
            content: faker.hacker.phrase(),
            post: {
              connect: { id: post.id },
            },
            author: {
              connect: { id: user.id },
            },
          },
        });
        count++;
      }
    };

    //for each subreddit - add a post
    subreddits.forEach(async (subreddit) => {
      const post = await createPostFromRandomUser(subreddit);
      await createCommentsToPost(post);
    });
  }

  //to delete all db data
  if (req.body.task === "clean_database") {
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.subreddit.deleteMany({});
    await prisma.user.deleteMany({});
  }

  res.end();
}
