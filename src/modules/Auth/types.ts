export interface IUser {
  id: number
  login: string
  passwordHash: string
  passwordSalt: string
  role: string
  name: string
  phone: string
  createdAt: string | Date | null
  updatedAt: null | Date | string
}
