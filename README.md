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
docker-compose up --build nginx -d

**_ Instalar dependencias de LARAVEL _**
docker-compose run --rm composer install

**_ GENERATE JWT API_KEY TOKEN _**  
docker-compose run --rm artisan jwt:secret

**_ Migraciones y Seeders _**
docker-compose run --rm laravel-migrate-seed

**_ Optimizacion y cache _**
docker-compose run --rm artisan cache:clear
docker-compose run --rm artisan cache:clear

**_ Instalar dependencias de React _**
docker-compose run --rm npm install

**_ Levantar Servidor local de React _**
docker-compose run --service-ports npm run start

**_ Utilidades composer _**
docker-compose run --rm composer dump-autoload
