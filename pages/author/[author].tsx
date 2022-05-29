import PortableText from 'react-portable-text'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import React, { useState } from 'react'
import { Navbar } from '../../components'
import { getPostsByAuthor, sanityClient, urlFor } from '../../services/sanity'
import { Authors, Post } from '../../typings'
import Link from 'next/link'
import Moment from 'react-moment'

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
        <div className=" relative mb-10 h-80 min-h-max w-80 overflow-clip rounded-xl bg-gray-100">
          <Image
            src={urlFor(posts[0].author.image).url()}
            layout="fill"
            objectFit="cover"
            objectPosition={'center'}
          />
        </div>
        <div className=" my-10 text-lg font-medium">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={posts[0].author.bio}
            serializers={{
              h1: (props: any) => (
                <h1 className=" my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className=" my-5 text-xl font-semibold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className=" ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a className=" text-blue-500 hover:underline">{children}</a>
              ),
              p: (props: any) => (
                <p className=" text-lg font-medium" {...props} />
              ),
            }}
          />
        </div>
        <div className=" w-full">
          {posts.map((post) => (
            <div
              key={post._id}
              className="  mb-20 grid grid-cols-12 items-center gap-1 overflow-hidden sm:gap-5 md:gap-10"
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
                <p className=" flex flex-wrap items-center gap-2 text-sm text-gray-400 md:gap-5">
                  <Moment format="D MMM">{post._createdAt}</Moment>
                  <span>2 mins read</span>
                  <span className=" flex items-center gap-2 md:gap-5">
                    {post.categories.map((category) => (
                      <span key={category._id}>
                        <Link href={`/category/${category.title}`}>
                          <button className=" rounded-full bg-gray-200 px-3 py-1 hover:bg-gray-300">
                            {category.title}
                          </button>
                        </Link>
                      </span>
                    ))}
                  </span>
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
