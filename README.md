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
