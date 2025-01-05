import { checkSchema } from 'express-validator'

export default checkSchema({
    email: {
        trim: true,
        errorMessage: 'Email is required!',
        notEmpty: true,
        isEmail: {
            errorMessage: 'Email should be a valid email',
        },
    },
    firstName: {
        trim: true,
        errorMessage: 'First name is required!',
        notEmpty: true,
    },
    lastName: {
        errorMessage: 'First name is required!',
        notEmpty: true,
        trim: true,
    },
    password: {
        trim: true,
        errorMessage: 'First name is required!',
        notEmpty: true,
        isLength: {
            options: {
                min: 6,
            },
            errorMessage: 'Password length should be at least 6 chars!',
        },
    },
})

// export default [body("email").notEmpty().withMessage("Email is required!")];
