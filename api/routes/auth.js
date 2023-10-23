//pagina que terá os dados de autentificacao do login e cadastro
import express from 'express'

import { cadastro, login } from '../controllers/auth.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).json({msg: "pagina inicial"})
})

router.post('/auth/login', login)

router.post('/auth/cadastrar', cadastro)

export default router