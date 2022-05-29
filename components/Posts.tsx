import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import Moment from 'react-moment'
import { urlFor } from '../services/sanity'
import { Categories, Post } from '../typings'
interface Props {
  posts: [Post]
  categories: [Categories]
}
const Posts = ({ posts, categories }: Props) => {
  return (
    <div className=" container mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 overflow-hidden py-8 px-5 md:grid-cols-12">
      <div className="order-2 col-span-1 w-full md:order-1 md:col-span-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="  mb-20 grid grid-cols-12 items-center gap-1 overflow-hidden sm:gap-5 md:gap-10"
          >
            <div className=" col-span-8">
              <Link href={`/author/${post.author.slug}`}>
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

      <div className=" relative order-1 col-span-1 items-start self-start border-b border-b-gray-200 pb-10 md:order-2 md:col-span-4">
        <div className="sticky top-24 left-0">
          <h3 className=" mb-4 text-sm font-semibold">
            DISCOVER MORE OF WHAT MATTERS TO YOU
          </h3>
          <div className=" flex flex-wrap items-center gap-3">
            {categories.map((category) => (
              <span key={category._id}>
                <Link href={`/category/${category.title}`}>
                  <button
                    key={category._id}
                    className=" rounded border border-gray-200 px-4 py-2"
                  >
                    {category.title}
                  </button>
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Posts
