En la pagina de Github:
Derecha en el perfil
Settings
Abajo a la izq developer settings
Githubapp
New githubapp
Agregamos nombre a la app
Agregamos una descripción 
En homepage url ponemos http://localhost:8080
En callback URL ponemos http://localhost:8080/api/sessions/githubcallback
Webhook active (desactivado)
En permisos donde dice Account permisos
Activamos acceso a email y perfil
Where can this Github App indtalled? Esta cuenta
Create githubb app

Luego copio:
App ID (App ID: 1136784)
Client ID (Client ID: Iv23liikt0uEh0h4TsQy)
Generarte new client secret
Copio también el código del cliente (e30aeccbc48ca3aa5b8aaea300c5160e2b5bff41)
Save changes

1) Instalamos passport-github2

    npm i passport-github2

2) En el login.handlebars:

    <h1>
    <a href="/api/sessions/github">Ingresar con GitHub</a>
    </h1>

3) Agregamos en el passport-config

    //Passport gitHub
passport.use('github', new GithubStrategy({
    clientID: 'Client ID: Iv23liikt0uEh0h4TsQy',
    clientSecret: '',
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
    
}, async (accesToken, refreshToken, profile, done) => {
    try {
        console.log(profile)
        console.log(accesToken)
        console.log(refreshToken)

        let user = await userModel.findOne({email: profile._json.email})
        if(!user) {
            let newUser = {

            }
            done(null, true)
        } else {
            done(null, user)
        }
    } catch (e) {
        console.error(e);
    }
})) 

4) Agrego al session.controller

    export const gitHub = (req, res) => {
        
    try {
            req.session.user = {
                email: req.user.email,
                first_name: req.user.first_name
            }
            res.status(200).redirect('/');
    } catch (e) {
        console.log(e);
        res.status(500).send("Error al loguear usuario");
    }
}

5) Agrego al server.js

