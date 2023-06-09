Reddit clone project

Main features

- letting people signup/login to the website and pick a username,
- a user has a profile,
- after login, the user will be able to interact with content by upvoting or downvoting posts,
- a user can add posts to a subreddit,
- a user can add images to a post,
- a user can add comments to a post,
- comments can be nested (you can comment another comment)
- isolated communities (subreddits),
- nested comments,
- a upvote/downvote mechanism,
- uploading images to AWS S3...

2. Utils page - to create sample data for simulation

- create /pages/utils.js
- create /pages/api/utils.js endpoint
- npm install -D @faker-js/faker

3. Show posts on homepage

- npm install javascript-time-ago
- create Post and Posts component and show posts into Index page

4. Implement authentication

- add header with login/logout button to home page,
- after login, user must choose username,
- setup page and setup endpoint to set user name after successtull login

5. Create the single subreddit view

- create /pages/r/[subreddit].js - dynamic page that receives the name of a subreddit as the parameter
- in lib.data.js make 2 functions :
  - `getSubreddit()` to get the details of a subreddit (so we can check if it actually exists)
  - `getPostsFromSubreddit()` to get the posts of a specific subreddit.
  - on home page add link to the subreddit, and on the subreddit view add link to back as to home page

6. Create the single post view

- create r/[subreddit]/comments/[id].js file to build the single post view,
- add getPost() method to lib/data.js
- add links on home page that direct us on single post page

7. User can add comments

- /components/NewComment.js - add a form to let people comment,

8. Show user comments under the post

- crete Comments component that contains Comment component,
- include Comments component into comments/[id].js

9. Upvote/downvote posts

- add arrows(send a request to make vote or upvote) and numbers on [id] page and make them dynamic,
- use the upsert() method provided by Prisma to update or insert a value if it’s not there

10. Crete new post by user

- create submit.js that contains form to send POST request to /api/post,
- add link to the new post form page from the subreddit page,
- show create new post form only if user are logged in

11. User can comment to other comments

- make a change into schema - Comments add :
  parentId Int?
  parent Comment? @relation("ParentComment", fields: [parentId], references: [id])
  Comment Comment[] @relation("ParentComment")

- put a “reply” text/link below each comment, and on click show reply form,
- reuse NewComment component, and if reply button is clicked then show this component
  so that user can reply on existing comment,
- change data.js file in getPost method to be able to fetch comments made to comments,
- introduce two new helper functions fetchCommentsOfComments - calls getComments() that is responsible for actually fetching commentsfrom db,
- in getComments() we check if there is a comment to a comment and call fetchCommentsOfComments again wich is recursion!

12. Uploade image ?

13. User profile

- proposals to improve the app :

* Let users create new subreddits
* Let users vote comments
* Check the files size and type (only images) in the backend too
* Also show comments in user profile
* Handle if user chooses same username as another user
* Let people join subreddits and influence what they see on the homepage
* Implement pagination in lists
* Prompt users to login when they try to upvote a post
