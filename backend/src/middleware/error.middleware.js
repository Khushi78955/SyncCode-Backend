const errorMiddleware = function(err, req, res, next){
    res.status(400).json({
        message: err.message
    })
}

module.exports = errorMiddleware