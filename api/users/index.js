import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const create = async ( ctx ) => {

    const hash = await bcrypt.hashSync(ctx.request.body.password, 10);

    const data = {
        name: ctx.request.body.name,
        username: ctx.request.body.username,
        email: ctx.request.body.email,
        password: hash
    }

    try {
        const { password, ...dadosUser } = await prisma.user.create({ data  })
    
        ctx.body = dadosUser
        ctx.status = 201;
    } catch(error) {
        console.log(error)
        ctx.body = error;
        ctx.status = 500;
    }
}

export const listUsers = async ( ctx ) => {
    try {
        const { password, ...dadosUser } = await prisma.user.findMany();
    
        ctx.body = dadosUser
        ctx.status = 200;
    } catch(error) {
        console.log(error)
        ctx.body = error;
        ctx.status = 500;
    }
}

export const login = async ( ctx ) => {
    const [ type, token ] = (ctx.headers.authorization).split(" ")
    const [email, passwordPlainText] = atob(token).split(":")
    console.log({email, passwordPlainText})

    const user  = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if( !user ){
        ctx.status = 404
        return
    }

    const passwordMatch = await bcrypt.compare( passwordPlainText, user.password )
    console.log(passwordMatch)

    if(!passwordMatch) {
        ctx.status = 403
        return
    }
    const {password, ...result } = user
    const jsonToken = jwt.sign({
        sub: user.id,
        name: user.name,
        expiresIn: "1d"
    }, process.env.JWT_SECRET)

    ctx.body = {
        user: result,
        acessToken: jsonToken
    }

}

export const listHunches = async ( ctx ) => {
    const username = ctx.request.params.username

    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if(!user) {
        ctx.status = 404
        return
    }

    const hunches = await prisma.hunch.findMany({
        where: {
            userId: user.id
        }
    })

    ctx.body = {
        name: user.name,
        hunches
    }
}