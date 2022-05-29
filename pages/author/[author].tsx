import PortableText from 'react-portable-text'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import React, { useState } from 'react'
import { Navbar } from '../../components'
import { getPostsByAuthor, sanityClient, urlFor } from '../../services/sanity'
import { Authors, Post } from '../../typings'
import Link from 'next/link'

interface Props {
  posts: Post[]
}

const Post = ({ posts }: Props) => {
  return (
    <main>
      <Navbar />
      <div className=" container mx-auto  w-full max-w-7xl gap-10 overflow-hidden py-8 px-5">
        <h2 className=" mb-5 py-5 text-4xl font-semibold tracking-wide">
          {posts[0].author.name}
        </h2>
        <div className=" w-full">
          {posts.map((post) => (
            <div
              key={post._id}
              className="  mb-20 grid grid-cols-12 items-center gap-5 overflow-hidden md:gap-10"
            >
              <div className=" col-span-8">
                <Link href={`/author`}>
                  <div className="flex w-fit cursor-pointer items-center gap-2">
                    <div className=" relative h-6 w-6 overflow-clip rounded-full">
                      <Image
                        layout="fill"
                        src={urlFor(post.author.image).url()}
                        alt="author"
                      />
                    </div>

                    <p className=" text-sm">{post.author.name}</p>
                  </div>
                </Link>
                <Link href={`/post/${post.slug}`}>
                  <h3 className=" cursor-pointer text-lg font-semibold">
                    {post.title}
                  </h3>
                </Link>
                <h4 className="hidden sm:block">{post.description}</h4>
                <p className=" flex items-center gap-2 text-sm text-gray-400 md:gap-5">
                  <span>date</span>
                  <span>2 mins read</span>
                  <span className=" flex flex-wrap items-center gap-2 md:gap-5">
                    {post.categories.map((category) => (
                      <Link href={`/category/${category.title}`}>
                        <button className=" rounded-full bg-gray-200 px-3 py-1 hover:bg-gray-300">
                          {category.title}
                        </button>
                      </Link>
                    ))}
                  </span>

                  <button>b</button>
                </p>
              </div>
              <div className=" col-span-4 h-full w-full">
                <div className=" relative h-[120px] w-full min-w-[100px] lg:h-40">
                  <Image
                    src={urlFor(post.mainImage.asset).url()}
                    className="rounded"
                    layout="fill"
                    alt="main image"
                    objectFit="cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Post

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await sanityClient.fetch(getPostsByAuthor, {
    slug: params?.author,
  })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      posts: post,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "author"] {
        _id,
        slug {
            current
        }
    }`
  const authors = await sanityClient.fetch(query)
  const paths = authors.map((author: Authors) => ({
    params: {
      author: author.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}
