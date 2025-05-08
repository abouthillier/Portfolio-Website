#!/bin/bash

# Enable error logging
set -e
exec 1> >(logger -s -t $(basename $0)) 2>&1

# Change to the project directory
cd /var/www/Portfolio-Website

# Reset any local changes that would conflict with the pull
git reset --hard HEAD
git clean -fd --exclude=deploy.sh

# Pull the latest changes
git pull origin main

# Set proper permissions for composer cache
mkdir -p /var/www/.cache/composer
chown -R www-data:www-data /var/www/.cache/composer

# Remove Statamic CMS directory to force re-download
rm -rf vendor/statamic/cms

# Install/update Composer dependencies with plugins enabled
sudo -u www-data composer install --no-interaction --no-dev --optimize-autoloader

# Ensure node_modules directory exists and has correct permissions
mkdir -p node_modules
chown -R www-data:www-data .
chmod -R 775 .

# Remove old node_modules and reinstall
rm -rf node_modules
sudo -u www-data npm ci

# Clear any previous build artifacts
rm -rf public/build

# Ensure build directory exists with correct permissions
mkdir -p public/build
chown -R www-data:www-data public/build
chmod -R 775 public/build

# Build assets with production flag
sudo -u www-data npm run build

# Verify the manifest file exists
if [ ! -f "public/build/manifest.json" ]; then
    echo "Error: Vite manifest not found after build"
    exit 1
fi

# Clear Laravel caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear

# Ensure proper permissions for all public directories
chown -R www-data:www-data public
chmod -R 775 public

# Run migrations
php artisan migrate --force

# Set proper permissions
chown -R www-data:www-data storage bootstrap/cache public/build
chmod -R 775 storage bootstrap/cache public/build

# Log completion
echo "Deployment completed successfully" 