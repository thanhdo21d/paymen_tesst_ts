import { IRole } from './role.type'

export interface IUser {
  _id?: string
  googleId?: string
  twitterId?: string
  githubId?: string
  facebookId?: string
  username?: string
  account?: string
  avatar?: string
  password?: string
  address?: string
  products?: string[]
  order?: string[]
  role: IRole
  email?: string
  status?: string
  deleted?: boolean
  accessToken?: string
  refreshToken?: string
  birthday?: Date
  grade?: number
  gender?: string
}

export interface responseUser {
  user: IUser
}

export interface IUserDocs {
  docs: IUser[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
