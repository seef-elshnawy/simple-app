import { User } from "@src/libs/modules/user/entities/user.entity"
import { Request, Response } from "express"

export const IContextAuthToken  = 'IContextAuthToken'

export interface IContextInterface {
  getRequestFromReqHeaders(req: Request, res: Response): Promise<User>
  getAuth(request: Request): {accessToken: string , refreshToken: string}
}

export interface AuthToken { 
    userName : string
    email : string
}