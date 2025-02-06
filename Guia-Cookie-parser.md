Cookies

1) npm i express cookie-parser

2) En server.js importamos cookie-parser:
    import cookieParser from 'cookie-parser'

3) Y activamos con un app.use:
    // Creacion de cookie
    app.use(cookieParser())

4) Ruteamos:
    app.get('/setCookie', (req, res) => {
    //Devuelve como resultado una cookie
res.status(200).cookie('cookieCoder', 'Esta es mi primera cookie', { maxAge: 10000}).send("Cookie creada")
})

5) Para consultar una cookie:
    // Consultar una cookie
app.get('/getCookie', (req, res) => {
res.status(200).send(req.cookies)})// Devuelvo todas las cookies presentes en el navegador

6) Para borrar una cookie:
    // Eliminar una cookie
app.get('/deleteCookie', (req, res) => {
    res.clearCookie('cookieCoder').send("Cookie eliminada")
})

7) Para agregarle contraseña y "firmar la cookie"
    app.use(cookieParser("CookieConPassword"))// Si agrego contraseña, la cookie pasa a estar firmada

8) Para crear una cookie firmada (recordar agregar el signed: true):
    // Crear una cookie firmada
app.get('/setSignedCookie', (req, res) => {
    //Devuelve como resultado una cookie firmada
res.status(200).cookie('cookieCoderSigned', 'Esta es mi primera cookie firmada', { maxAge: 10000, signed: true}).send("Cookie firmada creada")
})

9) Para Consultar una cookie firmada (se utiliza req.signedCookies):
    // Consultar una cookie firmada
app.get('/getSignedCookie', (req, res) => {
    res.status(200).send(req.signedCookies)//Devuelve como resultado una cookie firmada
})