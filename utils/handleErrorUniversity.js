module.exports.handleError = async (err) => {
    const errors = {
        name: '',
    }
    if (err.code === 11000){
        errors.name= 'pleace input with another name'
    }

    if(err.message.includes('University validation failed')){
        Object.values(err.errors).forEach((error) =>{
            errors[error.path] = error.message
        })
    }
    if(err.message.includes('you can not delete this student because he have students !!')){
        errors.message = 'you can not delete this student because he have students !!'
    }

    return errors
}