import express from 'express'
import authRouter from './routes/auth.js'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(express.json())

//permite utilizar diversos tipos de requisição no postman, não somente em json
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())
app.use('/', authRouter) //rota base


app.listen(8000, ()=> {
    try{
        console.log("Servidor rodando na porta 8000!")

    } catch(err){
        console.log(err.message)
    }
})