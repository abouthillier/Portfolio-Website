#!/bin/bash

# Enable error logging
set -e
exec 1> >(logger -s -t $(basename $0)) 2>&1

# Change to the project directory
cd /var/www/Portfolio-Website

# Reset and pull latest changes
git reset --hard HEAD
git clean -fd --exclude=deploy.sh --exclude=storage/forms/contact_me
git pull origin main

# Install dependencies
sudo composer install --no-interaction --no-dev --optimize-autoloader

# Build assets
sudo -u www-data npm run build

# Verify build
if [ ! -f "public/build/manifest.json" ]; then
    echo "Error: Vite manifest not found after build"
    exit 1
fi

# Statamic CP writes flat-file content and blueprints as www-data
for dir in content users storage resources/blueprints; do
  chown -R www-data:www-data "$dir"
  find "$dir" -type d -exec chmod 775 {} \;
  find "$dir" -type f -exec chmod 664 {} \;
done

# Clear caches and run migrations
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
php artisan migrate --force

# Log completion
echo "Deployment completed successfully" 