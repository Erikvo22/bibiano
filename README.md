**_ VERSIONS _**  
PHP -> 8.2
LARAVEL -> 10  
REACT -> 18

**_ Requerimientos iniciales _**
--Docker
--Git

**_ Clonar proyecto _**
git clone https://github.com/Erikvo22/bibiano.git

**_ Levantar imagenes y contenedores Principales _**
docker-compose up --build -d nginx

**_ Instalar dependencias de LARAVEL _**
docker-compose run --rm composer install

**_ GENERATE JWT API_KEY TOKEN _**  
docker-compose run --rm artisan jwt:secret

**_ Migraciones y Seeders _**
docker-compose run --rm laravel-migrate-seed

**_ Optimizacion y cache _**
docker-compose run --rm artisan cache:clear

**_ Instalar dependencias de React _**
docker-compose run --rm npm install

**_ Levantar Servidor local de React _**
docker-compose run --service-ports npm run start

**_ Utilidades composer _**
docker-compose run --rm composer dump-autoload

**_ Pasos para desplegar en produccion _**
En local
-Situarnos en la rama que vamos a deployear
-docker-compose run --rm npm run start
-Agregar build a la rama
-Pushear la rama
En Produccion
Conectarse a la maquina y realizar los siguientes comandos
Primera vez

Actualizacion
-Acceder a la ruta del proyecto, donde se encuentre el fichero docker-compose.yml
-docker-compose down
-docker-compose up --build -d nginx

TIPS A SOLUCIONAR
Cada vez que se hace un deploy o cambios en los contenedores se reinicia el contenedor del cliente perdiendo la configuracion
Agregar en nginx del proxy los siguiente y lanzar a continuacion nginx -s reload

# fichaje.comercialbibiano.es

upstream fichaje.comercialbibiano.es {  
 server 172.19.0.12:80;  
}  
server {  
 server_name fichaje.comercialbibiano.es fichaje-backend.comercialbibiano.es;  
 listen 80 ;  
 access_log /var/log/nginx/access.log vhost;  
 include /etc/nginx/vhost.d/default;  
 location / {  
 proxy_pass http://Fichajes-nginx;  
 }  
}
