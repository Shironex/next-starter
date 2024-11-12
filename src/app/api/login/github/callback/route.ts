export interface GitHubUser {
  id: string
  login: string
  avatar_url: string
  email: string
}

interface Email {
  email: string
  primary: boolean
  verified: boolean
  visibility: string | null
}
