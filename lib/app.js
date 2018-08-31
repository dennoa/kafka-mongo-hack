import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import favicon from 'serve-favicon'
import path from 'path'

const app = express()

app.use(cors())
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'landing-page/views'))
app.use(express.static(path.join(__dirname, 'landing-page/assets')))
app.use(favicon(path.join(__dirname, 'landing-page/assets', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())

export default app
