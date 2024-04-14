import React from 'react';
import Post from './Post';

const Posts = ({ posts }) => {
  return (
    <div className="posts">
      {posts && posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;