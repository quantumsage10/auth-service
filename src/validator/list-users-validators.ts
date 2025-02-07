import { checkSchema } from 'express-validator'

// Pagination - Get Requset - 4 query param

export default checkSchema(
    {
        q: {
            // saerch query
            trim: true,
            customSanitizer: {
                options: (value: unknown) => {
                    return value ?? ''
                },
            },
        },
        role: {
            customSanitizer: {
                options: (value: unknown) => {
                    return value ?? ''
                },
            },
        },
        // starting from page one 1
        currentPage: {
            customSanitizer: {
                options: (value) => {
                    // 2, '2', undefined, 'text' -> NaN
                    const parsedValue = Number(value)
                    return Number.isNaN(parsedValue) ? 1 : parsedValue
                },
            },
        },
        // page size - 6 records
        perPage: {
            customSanitizer: {
                options: (value) => {
                    // 2, '2', undefined, 'text' -> NaN
                    const parsedValue = Number(value)
                    return Number.isNaN(parsedValue) ? 6 : parsedValue
                },
            },
        },
    },
    ['query'], // data coming in query always coming in string format even numbers - '2', 'true'
)
