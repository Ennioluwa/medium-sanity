import type { NextPage } from 'next'
import Head from 'next/head'
import {
  getCategories,
  getPosts,
  getTrendingPosts,
  sanityClient,
} from '../services/sanity'
import { Header, Navbar, Posts, Trending } from '../components'
import { Categories, Post } from '../typings'
interface Props {
  posts: [Post]
  trending: [Post]
  categories: [Categories]
}

const Home = ({ posts, trending, categories }: Props) => {
  return (
    <div className="relative">
      <Head>
        <title>Medium</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Header />
      <Trending posts={trending} />
      <Posts posts={posts} categories={categories} />
    </div>
  )
}

export default Home

export const getStaticProps = async () => {
  const posts = await sanityClient.fetch(getPosts)
  const trendingPosts = await sanityClient.fetch(getTrendingPosts)
  const categories = await sanityClient.fetch(getCategories)

  return {
    props: {
      posts,
      trending: trendingPosts,
      categories,
    },
  }
}
