export interface IResponse<T> {
  code: number
  data: T
  message: string
}
export enum Roles {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  SALESMAN = 'Salesman',
}
