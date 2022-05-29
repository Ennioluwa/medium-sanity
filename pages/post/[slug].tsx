import PortableText from 'react-portable-text'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import React, { useState } from 'react'
import { Header, Navbar } from '../../components'
import { sanityClient, urlFor } from '../../services/sanity'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Post } from '../../typings'

interface Props {
  post: Post
}
interface FormInput {
  _id: string
  name: string
  email: string
  comment: string
}

const Post = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>()
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true)
      })
      .catch((err) => {
        console.log(err)
        setSubmitted(false)
      })
  }
  return (
    <main>
      <Navbar />
      <div className=" relative h-80 w-full bg-gray-100">
        <Image
          src={urlFor(post.mainImage.asset).url()}
          layout="fill"
          objectFit="cover"
          objectPosition={'top'}
        />
      </div>
      <article className=" mx-auto max-w-3xl p-5 sm:px-10">
        <h1 className=" mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className=" mb-3 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center gap-2">
          <div className=" relative h-10 w-10 overflow-clip rounded-full">
            <Image src={urlFor(post.author.image).url()} layout="fill" />
          </div>
          <p className=" text-sm font-extralight">
            Blog post by{' '}
            <span className=" text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className=" mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
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
            }}
          />
        </div>
      </article>
      <div className="p-5 sm:p-10">
        <hr className="  my-5 mx-auto max-w-2xl border border-yellow-500" />
        {submitted ? (
          <div className=" my-10 mx-auto flex  max-w-2xl flex-col rounded bg-yellow-500 p-5 py-10 text-white">
            <h3 className=" text-3xl font-bold">
              Thank you for submitting your comment!
            </h3>
            <p>Once it has been approved, it will appear below!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mb-10 flex max-w-2xl flex-col"
          >
            <h3 className=" text-sm text-yellow-500">Enjoyed this article?</h3>
            <h3 className=" text-3xl font-bold">Leave a comment below!</h3>
            <hr className=" mt-2 py-3" />
            <input
              {...register('_id')}
              type="hidden"
              name="_id"
              value={post._id}
            />
            <label className=" mb-5 block">
              <span className=" text-gray-700">Name</span>
              <input
                {...register('name', { required: true })}
                className=" form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring-[1px] "
                type="text"
                placeholder="John Appleseed"
              />
            </label>
            <label className=" mb-5 block">
              <span className=" text-gray-700">Email</span>
              <input
                {...register('email', { required: true })}
                className=" form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring-[1px] "
                type="email"
                placeholder="John Appleseed"
              />
            </label>
            <label className=" mb-5 block">
              <span className=" text-gray-700">Comment</span>
              <textarea
                {...register('comment', { required: true })}
                className=" form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring-[1px] "
                rows={8}
                placeholder="John Appleseed"
              />
            </label>
            <div className=" flex flex-col gap-1 p-5">
              {errors.name && (
                <span className=" text-red-500">
                  - The Name Field is required
                </span>
              )}
              {errors.email && (
                <span className=" text-red-500">
                  - The Email Field is required
                </span>
              )}
              {errors.comment && (
                <span className=" text-red-500">
                  - The Comment Field is required
                </span>
              )}
            </div>
            <button className=" focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none">
              Submit
            </button>
          </form>
        )}
        <div className=" mx-auto mb-10 flex max-w-2xl flex-col gap-2 rounded p-10 shadow ">
          <h3 className=" text-xl font-medium">Comments</h3>
          <hr className=" pb-2" />
          {post.comments.map((comment) => (
            <div key={comment._id}>
              <p>
                <span className=" text-yellow-500">{comment.name}</span>:{' '}
                {comment.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Post

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post' && slug.current == $slug][0] {
    _id, 
    _createdAt,
        title,
        author-> {
            name,
            image
        },
        'comments': *[
            _type == "comment" && 
            post._ref == ^._id && 
            approved == true
        ],
        description, 
        mainImage,
        slug,
        body
        
    } `
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })
  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"] {
        _id,
        slug {
            current
        }
    }`
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}
