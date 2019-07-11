import { Application } from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { AccessToken, User, UserModel } from '../modules/user/UserEntity'
import { passwordValidate } from '../modules/common/helpers'
import { v4 as uuidv4 } from 'uuid'

declare global {
  namespace Express {
    export interface Request {
      user?: User
    }
  }
}

const urlencodedParser = bodyParser.urlencoded()

export function createAuthServer(app: Application) {
  app.use(cookieParser())

  app.post('/login', urlencodedParser, async function(req, res) {
    try {
      const user = await UserModel.findOne({ username: new RegExp(req.body.u, 'i') })
      if (passwordValidate(req.body.c, user.password)) {
        try {
          if (user.tokens.length === 0) {
            const token: AccessToken = {
              token: uuidv4(),
              createdAt: new Date(),
            }
            user.tokens.push(token)
            await user.save()
          }
          res.json({ accessToken: user.tokens[0] })
        } catch (e) {
          res.sendStatus(500)
        }
      } else {
        res.sendStatus(401)
      }
    } catch (e) {
      res.sendStatus(401)
    }
  })

  app.get('/logout', async function(req, res) {
    const { token } = req.cookies
    if (token) {
      try {
        const updateResult = await UserModel.updateOne(
          { tokens: { $elemMatch: { token } } },
          { $pull: { tokens: { token } } }
        )
        console.log(updateResult)
        res.sendStatus(200)
      } catch (e) {
        res.sendStatus(401)
      }
    }
  })

  app.use('/graphql', async function(req, res, next) {
    const { token } = req.cookies
    if (token) {
      try {
        req.user = await UserModel.findOne({ tokens: { $elemMatch: { token } } })
      } catch (e) {
        console.error('Request with unknown token', req.cookies.token)
      }
    }
  })
}
