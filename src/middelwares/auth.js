import mongoose from 'mongoose'
import {UserModel}  from '../../DB/models/user.model.js'
import { asyncHandler } from '../utils/erroHandling.js'
import { generateToken, verifyToken } from '../utils/tokenFunctions.js'

export const isAuth = asyncHandler(async (req, res, next) => {
    try {
    
    const { authorization } = req.headers
    if (!authorization ) {
        return next(new Error('Please login first', { cause: 400 }))
    }

    if (!authorization.startsWith('Ecommerce')) {
        return next(new Error('invalid token prefix', { cause: 400 }))
    }

    const splitedToken = authorization.split(' ')[1]
    

    try {
        const decodedData = verifyToken({
        token: splitedToken,
        signature: process.env.SIGN_IN_TOKEN_SECRET,
        })

            
    if (!mongoose.Types.ObjectId.isValid(decodedData._id)) {
        return next(new Error('invalid UserId', { cause: 400 }))
    }
        const findUser = await UserModel.findById(
        decodedData._id,
        'email userName role',
        )
        if (!findUser) {
        return next(new Error('Please SignUp', { cause: 400 }))
        }
        req.user = findUser
        next()
    } catch (error) {
        // token  => search in db
        if (error == 'TokenExpiredError: jwt expired') {
          // refresh token
        const user = await UserModel.findOne({ token: splitedToken })
        if (!user) {
            return next(new Error('Wrong token', { cause: 400 }))
        }
          // generate new token
        const userToken = generateToken({
            payload: {
            email: user.email,
            _id: user._id,
            },
            signature: process.env.SIGN_IN_TOKEN_SECRET,
            expiresIn: '2h',
        })

        if (!userToken) {
            return next(
            new Error('token generation fail, payload canot be empty', {
                cause: 400,
            }),
            )
        }

        user.token = userToken
        await user.save()
        return res.status(200).json({ message: 'Token refreshed', userToken })
        }
        return next(new Error('invalid token', { cause: 500 }))
    }
    } catch (error) {
    console.log(error)
    next(new Error('catch error in auth', { cause: 500 }))
    }
})
