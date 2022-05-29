import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import { Navbar } from '../../components'
import {
  getCategories,
  getPostsByCategories,
  getSingleCategory,
  sanityClient,
  urlFor,
} from '../../services/sanity'
import { Categories, Post } from '../../typings'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Moment from 'react-moment'

interface Props {
  posts: Post[]
  category: Categories
}

const Post = ({ posts, category }: Props) => {
  const router = useRouter()
  return (
    <main>
      <Navbar />
      <div className=" container mx-auto  w-full max-w-7xl gap-10 overflow-hidden py-4 px-2 md:py-8 md:px-5">
        <h2 className=" mb-2 py-5 text-4xl font-semibold capitalize tracking-wide">
          {router?.query?.slug}
        </h2>
        <p className=" mb-3 text-lg font-medium">{category.description}</p>
        <div className=" w-full">
          {posts.map((post) => (
            <div
              key={post._id}
              className="  mb-20 grid grid-cols-12 items-center gap-2 overflow-hidden sm:gap-5 md:gap-10"
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
  const post = await sanityClient.fetch(getPostsByCategories, {
    category: params?.slug,
  })
  const category = await sanityClient.fetch(getSingleCategory, {
    slug: params?.slug,
  })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      posts: post,
      category,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await sanityClient.fetch(getCategories)
  const paths = categories.map((category: Categories) => ({
    params: {
      slug: category.title,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}
