#!/bin/bash

# Enable error logging
set -e
exec 1> >(logger -s -t $(basename $0)) 2>&1

# Change to the project directory
cd /var/www/Portfolio-Website

# Reset and pull latest changes
git reset --hard HEAD
git clean -fd --exclude=deploy.sh
git pull origin main

# Install dependencies
sudo -u www-data composer install --no-interaction --no-dev --optimize-autoloader
# rm -rf node_modules
# sudo -u www-data npm ci

# # Build assets
# rm -rf public/build
# mkdir -p public/build
sudo -u www-data npm run build

# Verify build
if [ ! -f "public/build/manifest.json" ]; then
    echo "Error: Vite manifest not found after build"
    exit 1
fi

# Clear caches and run migrations
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
php artisan migrate --force

# Set permissions
# chown -R www-data:www-data storage bootstrap/cache public/build
# chmod -R 775 storage bootstrap/cache public/build

# Log completion
echo "Deployment completed successfully" 