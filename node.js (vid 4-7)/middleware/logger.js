const logger = (req, res, next) => {
    console.log("middleware");
    next();
}

module.exports = logger;