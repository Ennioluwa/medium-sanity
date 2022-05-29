export interface Post {
  _id: string
  _createdAt: Date
  title: string
  author: {
    name: string
    image: string
    _id: string
    slug: string
    bio: [object]
  }
  description: string
  mainImage: {
    asset: {
      url: string
    }
  }
  slug: {
    current: string
  }
  body: [object]
  comments: Comment[]
  categories: Categories[]
}
export interface Categories {
  title: string
  _id: string
  description: string
}
export interface Authors {
  name: string
  _id: string
  slug: {
    current: string
  }
  bio: [object]
}
export interface Comment {
  approved: boolean
  comment: string
  email: string
  name: string
  post: {
    _ref: string
    _type: string
  }
  _createdAt: string
  _id: string
  _rev: string
  _type: string
  _updatedAt: string
}
