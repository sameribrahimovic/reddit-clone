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
