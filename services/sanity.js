import { createClient, createCurrentUserHook, groq } from 'next-sanity'
import { PortableText } from '@portabletext/react'
import createImageUrlBuilder from '@sanity/image-url'
export const config = {
  /**
   * Find your project ID and dataset in `sanity.json` in your studio project.
   * These are considered “public”, but you can use environment variables
   * if you want differ between local dev and production.
   *
   * https://nextjs.org/docs/basic-features/environment-variables
   **/
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '10do3lnn',
  apiVersion: '2021-10-21', // Learn more: https://www.sanity.io/docs/api-versioning
  /**
   * Set useCdn to `false` if your application require the freshest possible
   * data always (potentially slightly slower and a bit more expensive).
   * Authenticated request (like preview) will always bypass the CDN
   **/
  useCdn: process.env.NODE_ENV === 'production',
}

export const sanityClient = createClient(config)
export const urlFor = (source) => createImageUrlBuilder(config).image(source)
export const useCurrentUser = createCurrentUserHook(config)

export const getPosts = groq`
  *[_type == "post" ] {
    _id,
    _createdAt,
    title,
    body,
    description,
    mainImage,
    categories[]->{
      _id,
      title
    },
    author->{
      _id,
      name,
      image,
      "slug": slug.current
    },
    "slug": slug.current
  }| order(_createdAt desc)
`
export const getTrendingPosts = groq`
  *[_type == "post" ] {
      _id,
    _createdAt,
    title,
    body,
    description,
    mainImage,
    categories[]->{
      _id,
      title
    },
    author->{
      _id,
      name,
      image,
      "slug": slug.current
    },
    "slug": slug.current
  } | order(_createdAt desc)[0..5]
`
export const getCategories = groq`
*[_type == "category"] {
  title,
  _id
}
`

export const getPostsByCategories = groq`
*[_type == "post" && $category in categories[]->title ] {
 _id,
    _createdAt,
    title,
    body,
    description,
    mainImage,
    categories[]->{
      _id,
      title
    },
    author->{
      _id,
      name,
      image
    },
    "slug": slug.current
}
`
export const getPostsByAuthor = groq`
*[_type == "post" && author->.slug.current == $slug  ] {
  _id,
    _createdAt,
    title,
    description,
    mainImage,
    categories[]->{
      _id,
      title
    },
    author->{
      _id,
      name,
      image,
      description
    },
    "slug": slug.current
} 
`
