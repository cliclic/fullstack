import {Application} from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import {AccessToken, UserInstance, UserModel} from '../modules/user'
import {passwordValidate} from '../modules/common/helpers'
import {v4 as uuidv4} from 'uuid'
import {ApolloServer} from "apollo-server-express";

declare global
{
    namespace Express
    {
        export interface Request
        {
            user?: UserInstance
        }
    }
}

const urlencodedParser = bodyParser.urlencoded({extended: true});

export function createAuthServer(app: Application)
{
    app.use(cookieParser());

    app.post('/api/login', urlencodedParser, async function (req, res) {
        try
        {
            const user = await UserModel.findOne({username: new RegExp(req.body.u, 'i')})
            if (passwordValidate(req.body.c, user.password))
            {
                console.log('password is valid');
                try
                {
                    if (user.tokens.length === 0)
                    {
                        console.log('user has no token');
                        const token: AccessToken = {
                            token: uuidv4(),
                            createdAt: new Date(),
                        }
                        user.tokens = [token];
                        await user.save()
                    }
                    console.log('response', {accessToken: user.tokens[0]});
                    res.json({accessToken: user.tokens[0]});
                }
                catch (e)
                {
                    res.sendStatus(500)
                }
            } else
            {
                res.sendStatus(401)
            }
        }
        catch (e)
        {
            res.sendStatus(401)
        }
    })

    app.get('/api/logout', async function (req, res) {
        const {token} = req.cookies
        if (token)
        {
            try
            {
                const updateResult = await UserModel.updateOne(
                    {tokens: {$elemMatch: {token}}},
                    {$pull: {tokens: {token}}}
                )
                console.log(updateResult)
                res.sendStatus(200)
            }
            catch (e)
            {
                res.sendStatus(401)
            }
        }
    })

    app.use('/graphql', async function (req, res, next) {
        const {c} = req.cookies;
        if (c)
        {
            try
            {
                req.user = await UserModel.findOne({tokens: {$elemMatch: {token: c}}})
                return next();
            }
            catch (e)
            {
                console.error('Request with unknown token', req.cookies.token)
            }
        }
        next();
    })
}
