module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next); //catches erros and pass to next
    }
}