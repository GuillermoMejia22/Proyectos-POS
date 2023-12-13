# Gestor de Usuarios

## Modulos Utilizados
1. [Express JS](https://expressjs.com/en/starter/installing.html) 
2. [File System](https://nodejs.org/api/fs.html) 

## Instrucciones

### Instalar Dependecias

```
npm install
```

### Inicializar Servidor

```
npm run dev
```

O bien:

```
node src/main.js
```

## Dirección URL del servidor

### Obtener todos los usuarios
```
curl http://localhost:8081/listaUsuarios
```

O bien, desde el navegador: `http://localhost:8081/listaUsuarios`

### Obtener un usuario
```
curl http://localhost:8081/#
```

O bien, desde el navegador: `http://localhost:8081/#`

### Agregar un usuario
```
# Ejemplo de envio de formulario mediante curl
curl -d "name=Eduardo" -d "password=eduardo112233" -d "profession=Ayudante" -X POST http://localhost:8081/nuevoUsuario
```

O bien, desde el navegador: `http://localhost:8081/nuevoUsuario.html`

### Eliminar usuario 

Desde el navegador `http://localhost:8081/eliminaUsuario.html`

