const logger=require('./logger')
const requestLogger=(request,response,next)=>{
    logger.info('Method:',request.method)
    logger.info('Path:',request.path)
    logger.info('Body:',request.body)
    logger.info('---')
    next()
}
const tokenExtractor=(request,response,next)=>{
    const authorization=request.get('authorization')
    if(authorization && authorization.startsWith('Bearer ')){
        request.token=authorization.replace('Bearer ','')
    }else{
        request.token=null
    }
    next()
}
const jwt=require('jsonwebtoken')
const config=require('./config')
const User=require('../models/user')
const userExtractor=async(request,response,next)=>{
    const token=request.token
    if(!token){
        request.user=null
        return next()
    }
    try{
        const decodedToken=jwt.verify(token,config.SECRET)
        if(!decodedToken){
            request.user=null
            return next()
        }
        request.user=await User.findById(decodedToken.id)
    }catch(exception){
        request.user=null
    }
    next()
}

const unknownEndpoint=(request,response)=>{
    response.status(404).send({ error: 'unknown endpoint'})
}
const errorHandler=(error, request, response, next)=>{
    logger.error(error.message)
    if(error.name==='CastError'){
        return response.status(400).json({
            error:  'malformatted id'
        })
    }
    if(error.name==='ValidationError'){
        return response.status(400).json({
            error: error.message
        })
    }
    if(
        error.name==='MongoServerError' &&
        error.message.includes('E11000 duplicate key error')
    ){
        return response.status(400).json({
            error: 'expected username to be unique'
        })
    }
    next(error)
}

module.exports={
    requestLogger,
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler,
}