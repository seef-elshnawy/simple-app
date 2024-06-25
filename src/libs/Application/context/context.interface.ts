import { User } from "@src/libs/modules/user/entities/user.entity"
import { Request } from "express"

export const IContextAuthToken  = 'IContextAuthToken'

export interface IContextInterface {
  getRequestFromReqHeaders(req: Request): Promise<User>
  getAuth(request: Request): string
}

export interface AuthToken { 
    userName : string
    email : string
}