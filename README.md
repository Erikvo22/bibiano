*** VERSIONS ***  
PHP -> 8.2 
LARAVEL -> 10  
REACT -> 18 

*** Requerimientos iniciales ***
--Docker
--Git 

*** Clonar proyecto ***
git clone https://github.com/Erikvo22/bibiano.git

*** Levantar imagenes y contenedores Principales ***
docker-compose up --build nginx -d

*** Instalar dependencias de LARAVEL ***
docker-compose run --rm composer install

*** GENERATE JWT API_KEY TOKEN ***  
docker-compose run --rm artisan jwt:secret

*** Migraciones y Seeders ***
docker-compose run --rm laravel-migrate-seed

*** Optimizacion y cache ***
docker-compose run --rm artisan optimize
docker-compose run --rm artisan cache:clear

*** Instalar dependencias de React ***
docker-compose run --rm npm install

*** Levantar Servidor local de React ***
docker-compose run --service-ports npm run start