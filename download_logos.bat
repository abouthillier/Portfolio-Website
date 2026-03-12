@echo off
setlocal enabledelayedexpansion

set "LOGOS_DIR=storage\app\public\assets\logos"
mkdir "%LOGOS_DIR%" 2>nul

curl -L -o "%LOGOS_DIR%\electron.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg"
curl -L -o "%LOGOS_DIR%\vue.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg"
curl -L -o "%LOGOS_DIR%\svelte.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg"
curl -L -o "%LOGOS_DIR%\typescript.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
curl -L -o "%LOGOS_DIR%\express.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
curl -L -o "%LOGOS_DIR%\postgres.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
curl -L -o "%LOGOS_DIR%\sqlite.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg"
curl -L -o "%LOGOS_DIR%\docker.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
curl -L -o "%LOGOS_DIR%\cloudflare.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg"
curl -L -o "%LOGOS_DIR%\caddy.svg" "https://cdn.jsdelivr.net/npm/simple-icons/icons/caddy.svg"
curl -L -o "%LOGOS_DIR%\pihole.svg" "https://cdn.jsdelivr.net/npm/simple-icons/icons/pihole.svg"
curl -L -o "%LOGOS_DIR%\raspbian.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg"
curl -L -o "%LOGOS_DIR%\tailscale.svg" "https://cdn.jsdelivr.net/npm/simple-icons/icons/tailscale.svg"
curl -L -o "%LOGOS_DIR%\arch.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/archlinux/archlinux-original.svg"
curl -L -o "%LOGOS_DIR%\cachyos.svg" "https://cdn.jsdelivr.net/npm/simple-icons/icons/cachyos.svg"
curl -L -o "%LOGOS_DIR%\handbrake.svg" "https://cdn.jsdelivr.net/npm/simple-icons/icons/handbrake.svg"
curl -L -o "%LOGOS_DIR%\androidstudio.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg"
curl -L -o "%LOGOS_DIR%\rider.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rider/rider-original.svg"
curl -L -o "%LOGOS_DIR%\jetbrains.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jetbrains/jetbrains-original.svg"
curl -L -o "%LOGOS_DIR%\atlassian.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/atlassian/atlassian-original.svg"

@REM :: Fix remaining broken logos
@REM curl -L -o "%LOGOS_DIR%\audition.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg"
@REM curl -L -o "%LOGOS_DIR%\monday.svg" "https://cdn.worldvectorlogo.com/logos/monday-1.svg"
@REM curl -L -o "%LOGOS_DIR%\spline.svg" "https://cdn.worldvectorlogo.com/logos/spline-1.svg"

@REM :: Adobe Creative Suite
@REM curl -L -o "%LOGOS_DIR%\after-effects.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/aftereffects/aftereffects-original.svg"
@REM curl -L -o "%LOGOS_DIR%\xd.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/xd/xd-plain.svg"
@REM curl -L -o "%LOGOS_DIR%\illustrator.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/illustrator/illustrator-plain.svg"
@REM curl -L -o "%LOGOS_DIR%\photoshop.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/photoshop/photoshop-plain.svg"

@REM :: 3D Software
@REM curl -L -o "%LOGOS_DIR%\blender.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/blender/blender-original.svg"
@REM curl -L -o "%LOGOS_DIR%\cinema4d.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/cinema4d.svg"

@REM :: Operating Systems
@REM curl -L -o "%LOGOS_DIR%\macos.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/apple/apple-original.svg"
@REM curl -L -o "%LOGOS_DIR%\windows.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/windows8/windows8-original.svg"

@REM :: Design Tools
@REM curl -L -o "%LOGOS_DIR%\figma.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg"

@REM :: Web Technologies
@REM curl -L -o "%LOGOS_DIR%\html5.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg"
@REM curl -L -o "%LOGOS_DIR%\css3.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg"
@REM curl -L -o "%LOGOS_DIR%\javascript.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"
@REM curl -L -o "%LOGOS_DIR%\react.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg"
@REM curl -L -o "%LOGOS_DIR%\nodejs.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg"
@REM curl -L -o "%LOGOS_DIR%\vite.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg"
@REM curl -L -o "%LOGOS_DIR%\threejs.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg"

@REM :: Backend Technologies
@REM curl -L -o "%LOGOS_DIR%\php.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg"
@REM curl -L -o "%LOGOS_DIR%\python.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg"
@REM curl -L -o "%LOGOS_DIR%\java.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"
@REM curl -L -o "%LOGOS_DIR%\bash.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/bash/bash-original.svg"
@REM curl -L -o "%LOGOS_DIR%\statamic.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/statamic.svg"
@REM curl -L -o "%LOGOS_DIR%\mysql.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg"

@REM :: Version Control & Collaboration
@REM curl -L -o "%LOGOS_DIR%\github.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg"
@REM curl -L -o "%LOGOS_DIR%\jira.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/jira/jira-original.svg"
@REM curl -L -o "%LOGOS_DIR%\slack.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/slack/slack-original.svg"

@REM :: Marketing & Analytics
@REM curl -L -o "%LOGOS_DIR%\google-analytics.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/googleanalytics.svg"
@REM curl -L -o "%LOGOS_DIR%\google-tag-manager.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/googletagmanager.svg"
@REM curl -L -o "%LOGOS_DIR%\google-search-console.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/googlesearchconsole.svg"
@REM curl -L -o "%LOGOS_DIR%\hubspot.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/hubspot.svg"

@REM :: CMS & Web Platforms
@REM curl -L -o "%LOGOS_DIR%\webflow.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/webflow/webflow-original.svg"
@REM curl -L -o "%LOGOS_DIR%\wordpress.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/wordpress/wordpress-plain.svg"

echo Done!