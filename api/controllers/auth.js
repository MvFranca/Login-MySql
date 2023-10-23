import { db } from "../connect.js";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import { resolvePackageData } from "vite";

export const login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM user WHERE email = ?",

    [email],

    async (error, data) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ msg: "Houve um problema de conexão com o servidor!" });
      } else if (data.length === 0) {
        return res.status(404).json({ msg: "O e-mail não foi encontrado." });
      }
      
      else {
        const user = data[0];
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
          res.status(422).json(checkPassword);
        } 
        
        try{
            const refreshToken = jwt.sign({
                exp: Math.floor(Date.now()/1000) + 24 * 60 * 60,
                id: user.password
            },
            process.env.REFRESH,
            {algorithm: 'HS256'}
            )

            const token = jwt.sign({
                exp: Math.floor(Date.now()/1000) + 3600,
                id: user.password
            },
            process.env.TOKEN,
            {algorithm: 'HS256'}
            )
            res.status(200).json({msg: "Usuário logado com sucesso!"}, token, refreshToken)
            console.log(data)

        } catch(error){
            console.log(error)
            return res.status(500).json({msg: "Houve um problema de conexão com o servidor!"
          })
        }

      }
    }
  );
};

export const cadastro = (req, res) => {
  const { username, email, password, confirmPassword, userImg } = req.body;

  if (!username) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }
  if (!confirmPassword) {
    return res.status(422).json({ msg: "Confirme sua senha!" });
  }
  if (password !== confirmPassword) {
    return res.status(422).json({ msg: "As senhas são diferentes" });
  }

  db.query(
    "SELECT email FROM user WHERE email = ?",

    [email],

    async (error, data) => {
      //na função query, o primeiro parametro será a solicitação, o segundo o dado a ser enviado e o terceiro será uma função callback, que poderá ser utilizada para verificar possíveis erros e dados que o db retornar.

      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({
            msg: "Aconteceu algum erro no servidor, tente novamente mais tarde1",
          });
      }
      if (data.length > 0) {
        return res.status(500).json({ msg: "Este Email já está em uso." });
      } else {
        const passwordHash = await bcrypt.hash(password, 8);
        db.query(
          "INSERT INTO user SET ?",
          {
            username,
            email,
            password: passwordHash,
            userImg: userImg,
            //pelo fato de username e email terem o mesmo nome que tem no db, não é preciso colocar os dois pontos
          },
          (error) => {
            if (error) {
              console.log(error);
              return res
                .status(500)
                .json({
                  msg: "Aconteceu algum erro no servidor, tente novamente mais tarde.",
                });
            } else {
              return res
                .status(200)
                .json({ msg: "Cadastro efetuado com sucesso!" });
            }
          }
        );
      }
    }
  );
};
