import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const create = async ( ctx ) => {

    console.log(ctx.headers)
    if(!ctx.headers.authorization){
        ctx.status = 401
        return
    }
    
    const [type, token ] = ctx.headers.authorization.split(" ")
    console.log({type, token})

    try {
            const data = jwt.verify( token, process.env.JWT_SECRET )
            console.log(data)
    

        if (!ctx.request.body.homeTeamScore && !ctx.request.body.awayTeamScore) {
            ctx.status = 400
            return
        }

        const { gameId } = ctx.request.body
        const homeTeamScore = parseInt( ctx.request.body.homeTeamScore )
        const awayTeamScore = parseInt( ctx.request.body.awayTeamScore )
        const userId = data.sub;
        
        const [ hunch ] = await prisma.hunch.findMany({
            where: { userId, gameId }
        });
        try {
            if ( hunch ) {
                ctx.body = await prisma.hunch.update({ 
                    where: {
                        id: hunch.id
                    },
                    data: {
                        homeTeamScore, awayTeamScore
                    }
                })
            } else {
                ctx.body = await prisma.hunch.create({
                    data: { userId, gameId, homeTeamScore, awayTeamScore }
                })
            }
        } catch( error ) {
            console.log( error )
            ctx.body = error
            ctx.status = 500
        }
    } catch (error) {
        ctx.status = 401
        console.log(error)
        return
    }

}
