import { urlFor } from '../services/sanity'
import { Post } from '../typings'
import { IoIosTrendingUp } from 'react-icons/io'
import Link from 'next/link'
import Image from 'next/image'
interface Props {
  posts: [Post]
}
const Trending = ({ posts }: Props) => {
  return (
    <div className=" border-b border-gray-200">
      <div className="container mx-auto max-w-7xl p-5">
        <div className="mb-5 flex items-center gap-3">
          <IoIosTrendingUp />
          <h3 className=" text-sm font-semibold text-black">
            TRENDING ON MEDIUM
          </h3>
        </div>

        <div className=" grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
          {posts.map((post, index) => {
            const { title, _id, mainImage, description, author, _createdAt } =
              post
            return (
              <div
                key={_id}
                className=" col-span-1 flex items-start justify-start"
              >
                <h2 className=" text-3xl font-black text-gray-200">
                  0{index + 1}
                </h2>
                <div className="flex flex-col gap-3 p-3">
                  <Link href={`/author/${author.slug}`}>
                    <div className="flex w-fit cursor-pointer items-center gap-2">
                      <div className=" relative h-6 w-6 overflow-clip rounded-full">
                        <Image
                          layout="fill"
                          src={urlFor(author.image).url()}
                          alt="author"
                        />
                      </div>

                      <p className=" text-sm">{author.name}</p>
                    </div>
                  </Link>
                  <Link href={`/post/${post.slug}`}>
                    <h3 className=" cursor-pointer text-lg font-semibold">
                      {post.title}
                    </h3>
                  </Link>
                  <p>{new Date(_createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Trending
