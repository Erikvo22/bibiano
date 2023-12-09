*** VERSIONS ***  
PHP -> 8.2 
LARAVEL -> 10  
REACT -> 18 

*** DEPLOY LOCAL *** 
- composer install
- react/ npm install
- php artisan migrate
- php artisan db:seed DatabaseSeeder
- php artisan serve
- react / npm run dev  
  
*** GENERATE JWT TOKEN ***  
- php artisan jwt:secret

VITE_API_PUBLIC_KEY=''


*** Instalar dependencias de LARAVEL ***
docker-compose run --rm composer install

*** Optimizacion y cache ***
docker-compose run --rm artisan key:generate
docker-compose run --rm artisan optimize

*** Instalar dependencias de React ***
docker-compose run --rm  --service-ports npm run dev