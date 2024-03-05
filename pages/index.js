import { Fragment } from 'react';
import Head from 'next/head';

import FeaturedPosts from '../components/featured-posts/featured-posts';
import Hero from '../components/hero/hero';
import { getAllPosts } from '../lib/posts-util';
import AllPosts from "../components/posts/all-posts";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>博客预览版-昔我往矣</title>
        <meta
          name='description'
          content='个人博客'
        />
      </Head>
      <AllPosts posts={props.posts} />
    </Fragment>
  );
}

export function getStaticProps() {
  const allPosts = getAllPosts();

  return {
    props: {
      posts: allPosts,
    },
  };
}

export default HomePage;
