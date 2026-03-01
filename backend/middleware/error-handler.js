const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)

  let customError = {
    // SET default custom error
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message:err.message || 'Something went wrong try again later'
  }
  
  // NO NEED - customError can handle 
        // if (err instanceof CustomAPIError) {
        //   return res.status(err.statusCode).json({ msg: err.message })
        // }

  // Mangoose Validation Error
  if(err.name === 'ValidationError'){
    customError.message = Object.values(err.errors).map(item => item.message).join(', ')
    customError.statusCode = 400
  }

  // Mangoose Duplicate Error
  if(err.code && err.code === 11000){
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = 400
  }

    // Mangoose Cast Error
  if(err.name === 'CastError'){
    customError.message = `No Item found with id: ${err.value}`,
    customError.statusCode = 404
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ message:customError.message })
}

module.exports = errorHandlerMiddleware
