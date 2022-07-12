module.exports = (error,req,res,next) => {
    const er = erMessage(error)
    er ? res.status(400).json({message: er}) :  res.status(500).json({message: "network error"})
}

const erMessage = (error) => {
    let err = {}
    if(error.status) {
        err['message'] = error.message
    } else if(error.name === 'SequelizeUniqueConstraintError') {
        const paths = error.errors.map(e => {return `${e.path} already existed`})
        err['message'] = paths
    } else if(error.name === 'SequelizeValidationError') {
        const msg = error.errors.map(e => e.message)
        err['message'] = msg
    } else if(error.name === 'SequelizeDatabaseError'){
        err['message'] = error.message
    } else {
        return false
    }
    return err['message']
}