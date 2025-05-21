1) npm i connect-mongo

2) importo en server.js
    import MongoStore from 'connect-mongo'

3) en el app.use session editamos el store para conexion por mongoDB:

    app.use(session({
    // ttl: Time to live (tiempo de vida) en segundo
    // retries: Cantidad de veces que el servidor va a intentar leer el archivo

    // Comentamos el store: ya que la nueva conexion sera por Mongo
    // store: new fileStorage({path: './src/sessions', ttl: 60, retries: 1}),
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://ignaciocarucci:EMR0Q9b3rZGViZbd@backend2.y4q03.mongodb.net/?retryWrites=true&w=majority&appName=Backend2',
        ttl: 15
    }),
    secret: 'SesionSecreta',
    resave: true, // Resave permite mantener la session activa en caso de que la session se mantenga inactiva. Si se deja en false, ante cualquier inactividad, la session se cierra.
    saveUninitialized: true, // saveUninitialized permite mantener la session activa aun cuando el objeto de la session no contenga nada. Si se deja en false, y el objeto quedo vacio al finalizar la consulta, la session no se guardará.
}))

4) De esta forma, al hacer el login se crea la session por el tiempo que yo le asigné en nuestro cluster de mongoDB, pero luego de ese tiempo la session se borra.
