import express from 'express'
const app = express()

app.get('/', () => {
    console.log('start receving request')
})

export default app
