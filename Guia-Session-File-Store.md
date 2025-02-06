1) npm i session-file-store

2) Importamos en server.js:
    import FileStore from 'express-file-store'

3) const fileStorage = new FileStore(session)

4) En el session:
    app.use(session({
    // ttl: Time to live (tiempo de vida) en segundo
    // retries: Cantidad de veces que el servidor va a intentar leer el archivo
    store: new fileStorage({path: './sessions}', ttl: 60, retries: 1}),
    secret: 'SesionSecreta',
    resave: true, // Resave permite mantener la session activa en caso de que la session se mantenga inactiva. Si se deja en false, ante cualquier inactividad, la session se cierra.
    saveUninitialized: true, // saveUninitialized permite mantener la session activa aun cuando el objeto de la session no contenga nada. Si se deja en false, y el objeto quedo vacio al finalizar la consulta, la session no se guardará.
}))

5) Creo la carpeta sessions dentro de la carpeta src

6) De esta forma al hacer el login se crea una session en la carpeta sessions.
    Al realizar el logout la session se elimina.
    La session dura un tiempo (El que le asignamos), si la session se vence, no se elimina, queda en el cementerio de sessiones. Al realizar otro login, se crea otra session.

7) Para hacer la conexion a mongoDB ver Guia Mongo Store.