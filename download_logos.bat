@echo off
setlocal enabledelayedexpansion

set "LOGOS_DIR=storage\app\public\assets\logos"
mkdir "%LOGOS_DIR%" 2>nul

:: Fix remaining broken logos
curl -L -o "%LOGOS_DIR%\audition.svg" "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg"
curl -L -o "%LOGOS_DIR%\monday.svg" "https://cdn.worldvectorlogo.com/logos/monday-1.svg"
curl -L -o "%LOGOS_DIR%\spline.svg" "https://cdn.worldvectorlogo.com/logos/spline-1.svg"

:: Adobe Creative Suite
curl -L -o "%LOGOS_DIR%\after-effects.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/aftereffects/aftereffects-original.svg"
curl -L -o "%LOGOS_DIR%\xd.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/xd/xd-plain.svg"
curl -L -o "%LOGOS_DIR%\illustrator.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/illustrator/illustrator-plain.svg"
curl -L -o "%LOGOS_DIR%\photoshop.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/photoshop/photoshop-plain.svg"

:: 3D Software
curl -L -o "%LOGOS_DIR%\blender.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/blender/blender-original.svg"
curl -L -o "%LOGOS_DIR%\cinema4d.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/cinema4d.svg"

:: Operating Systems
curl -L -o "%LOGOS_DIR%\macos.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/apple/apple-original.svg"
curl -L -o "%LOGOS_DIR%\windows.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/windows8/windows8-original.svg"

:: Design Tools
curl -L -o "%LOGOS_DIR%\figma.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg"

:: Web Technologies
curl -L -o "%LOGOS_DIR%\html5.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg"
curl -L -o "%LOGOS_DIR%\css3.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg"
curl -L -o "%LOGOS_DIR%\javascript.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"
curl -L -o "%LOGOS_DIR%\react.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg"
curl -L -o "%LOGOS_DIR%\nodejs.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg"
curl -L -o "%LOGOS_DIR%\vite.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/vitejs/vitejs-original.svg"
curl -L -o "%LOGOS_DIR%\threejs.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/threejs/threejs-original.svg"

:: Backend Technologies
curl -L -o "%LOGOS_DIR%\php.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg"
curl -L -o "%LOGOS_DIR%\python.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg"
curl -L -o "%LOGOS_DIR%\java.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"
curl -L -o "%LOGOS_DIR%\bash.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/bash/bash-original.svg"
curl -L -o "%LOGOS_DIR%\statamic.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/statamic.svg"
curl -L -o "%LOGOS_DIR%\mysql.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg"

:: Version Control & Collaboration
curl -L -o "%LOGOS_DIR%\github.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg"
curl -L -o "%LOGOS_DIR%\jira.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/jira/jira-original.svg"
curl -L -o "%LOGOS_DIR%\slack.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/slack/slack-original.svg"

:: Marketing & Analytics
curl -L -o "%LOGOS_DIR%\google-analytics.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/googleanalytics.svg"
curl -L -o "%LOGOS_DIR%\google-tag-manager.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/googletagmanager.svg"
curl -L -o "%LOGOS_DIR%\google-search-console.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/googlesearchconsole.svg"
curl -L -o "%LOGOS_DIR%\hubspot.svg" "https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/hubspot.svg"

:: CMS & Web Platforms
curl -L -o "%LOGOS_DIR%\webflow.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/webflow/webflow-original.svg"
curl -L -o "%LOGOS_DIR%\wordpress.svg" "https://raw.githubusercontent.com/devicons/devicon/master/icons/wordpress/wordpress-plain.svg"

echo Done!