module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next); //this function executes what was passed in the catchAsync,  catches errors and pass to next
    }
}