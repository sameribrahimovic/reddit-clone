//get single post from db
export const getPost = async (id, prisma) => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      comments: {
        where: {
          parentId: null,
        },
        orderBy: [
          {
            id: "desc",
          },
        ],
        include: {
          author: true,
        },
      },
    },
  });

  //if there are comments of post, than fetch comments to those comments!
  if (post.comments) {
    post.comments = await fetchCommentsOfComments(post.comments, prisma);
  }

  return post;
};

//single post related helper function
//This function calls getComments() that is responsible for actually fetching comments.
const fetchCommentsOfComments = async (comments, prisma) => {
  //this function is responsible to calling comments of specific comment by calling getComments()
  const fetchCommentsOfComment = async (comment, prisma) => {
    comment.comments = await getComments(comment.id, prisma);
    return comment;
  };

  return Promise.all(
    comments.map((comment) => {
      comment = fetchCommentsOfComment(comment, prisma);
      return comment;
    })
  );
};

//get comments from db
const getComments = async (parent_id, prisma) => {
  let comments = await prisma.comment.findMany({
    where: {
      parentId: parent_id,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
    include: {
      author: true,
    },
  });

  //if we have comment to a comment, then call  fetchCommentsOfComments again until last comment - recursion!
  if (comments.length) {
    comments = await fetchCommentsOfComments(comments, prisma);
  }

  return comments;
};

//to get all posts from db
export const getPosts = async (prisma) => {
  const posts = await prisma.post.findMany({
    where: {},
    orderBy: [
      {
        id: "desc",
      },
    ],
    include: {
      author: true,
    },
  });

  return posts;
};

export const getSubreddit = async (name, prisma) => {
  return await prisma.subreddit.findUnique({
    where: {
      name,
    },
  });
};

export const getPostsFromSubreddit = async (subreddit, prisma) => {
  const posts = await prisma.post.findMany({
    where: {
      subreddit: {
        name: subreddit,
      },
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
    include: {
      author: true,
    },
  });

  return posts;
};

//votes
export const getVotes = async (post, prisma) => {
  //get number of upvotes
  const upvotes = await prisma.vote.count({
    where: {
      postId: post,
      up: true,
    },
  });
  //get number of downvotes
  const downvotes = await prisma.vote.count({
    where: {
      postId: post,
      up: false,
    },
  });
  //here we get total votes!
  return upvotes - downvotes;
};

//single vote
export const getVote = async (post_id, user_id, prisma) => {
  const vote = await prisma.vote.findMany({
    where: {
      postId: post_id,
      authorId: user_id,
    },
  });

  if (vote.length === 0) return null;
  return vote[0];
};

//user related data
//get single user from db
export const getUser = async (name, prisma) => {
  const user = await prisma.user.findUnique({
    where: {
      name,
    },
  });

  return user;
};

//get user related posts!
export const getPostsFromUser = async (user_name, prisma) => {
  const posts = await prisma.post.findMany({
    where: {
      author: {
        name: user_name,
      },
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
    include: {
      author: true,
    },
  });

  return posts;
};
