# musify
Proyecto para la gestión de música, artistas y álbums en MongoDB, NodeJS y Angular2

El proyecto se encuentra en:
 - Parte Front: /var/www/musify/client
 - Parte Back: /var/www/musify/api
 - Mongo DB: Instalar Mongo


++++++++++++++++++++++
LEVANTAR BACK CON NODE
++++++++++++++++++++++
 -En la siguiente ruta:
/var/www/musify/api
 -Lanzar el comando:
npm start
 - Para trabajar con la base de datos de mongo usaremos:
mongoose
 - Para que se refresquen los cambios en el servidor cuando hacemos algún cambio usaremos:
mongoose
 - Toda la configuración del back está en package.json y ahí configuramos el script start
 - El fichero de entrada es index.js 


+++++++++++++++++++++++++++
CREAR BASE DE DATOS MONGODB
+++++++++++++++++++++++++++
 -Instalar MongoDB
 -Para levantar el servicio ir a la consola y lanzar el comando:
mongo
 -Para levantar el demonio de mongo lanzar el comando:
mongod
 -Para crear una base de datos lanzar el comando:
use curso_node_angular2
 -Para ver las bases de datos que tenemos:
show dbs
 -Para usar una base de datos de la lista lanzar el comando:
use curso_node_angular2
 -Para crear una colección (tabla):
db.(nombreTabla).save({name: 'delafuente', description: 'el mejor artista'}
image: 'null')
 -Para buscar en una colección (tabla):
db.(nombreTabla).find
 -Para sacar registros de la base de datos:
db.bookmarks.find()
 -Para guardar registros en la base de datos:
db.bookmarks.save({id:1, title:'Curso de angular 2'})