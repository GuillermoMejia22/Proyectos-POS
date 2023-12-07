import express from 'express';
import { readFile } from "fs";
import path from 'path';


const app = express();
const port = 8081;
app.use( express.static( path.join( process.cwd() , "public" ) ) );
app.use( express.json());

app.get('/listarUsuarios', function (req, res) 
{
   readFile( "databases/users.json", 'utf8', function (err, data) 
   {
      console.log( data );
      res.end( data );
   });
})


 app.post('/addUser', function (req, res) {

    const usuario = req.body;
    console.log(usuario);

    readFile( "databases/users.json", 'utf8', function (err, data) 
    {
       data = JSON.parse( data );
       data["user4"] = usuario;
       console.log( data );
       res.json(data);
    });
 })

 app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}!`));