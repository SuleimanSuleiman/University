module.exports.handleError = async (err) => {
    const errors = {
        title: '',
        price: ''
    }
    if (err.code === 11000) {
        errors.email = 'pleace input with another title'
    }

    if (err.message.includes('Book validation failed')) {
        Object.values(err.errors).forEach((error) => {
            if (error.message.includes("Cast to Decimal128 failed")) {
                    errors['price'] = "Decimal128 failed"
            }
            else {
                errors[error.path] = error.message
            }
        })
}

return errors
}