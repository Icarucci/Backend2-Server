1) npm i dotenv

2) Creamos el archivo .env

3) En el achivo .env ponemos las variables que deseamos, ej:

PORT=8080;

4) En el archivo que vamos a utilizar esa variable ponemos:

import dotenv from 'dotenv'

dotenv.config()

5) Y debemos cambiar la variable que se encuentra en el archivo por:

process.env.PORT // PORT es el nmbre que le pusimos en el .env

