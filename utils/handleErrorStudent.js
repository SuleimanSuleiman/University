module.exports.handleError = async (err) => {
    const errors = {
        fistName: '',
        lastName: '',
        email: '',
    }
    if (err.code === 11000){
        errors.email= 'pleace input with another email'
    }

    if(err.message.includes('Student validation failed')){
        Object.values(err.errors).forEach((error) =>{
            errors[error.path] = error.message
        })
    }
    if(err.message.includes('you can not delete this student because he have books !!')){
        errors.message = 'you can not delete this student because he have books !!'
    }

    return errors
}