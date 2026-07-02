---
id: 29ada46e-7108-4a81-a3ab-20f07bdb6059
blueprint: web_development
title: 'Museum of American Finance Kiosk'
featured_image: cursor_j5ta1qupko.png
description: 'Built for the Museum of American Finance, this touchscreen interactive kiosk walks visitors through the essential parts of personal finance. The attract loop features sixteen topic icons orbiting on GSAP motion paths around a morphing central figure, drawing visitors in before they explore topics, subtopics, reference content, and inline quizzes — all updatable from a remote CMS without needing to redeploy the app on the 10 physical kiosks.'
technologies:
  - gsap
  - gsap-motionpath
  - figma
platform:
  - electron-desktop-app
updated_by: 7775a028-954d-4a8d-9ab3-e09d457083cb
updated_at: 1782909105
wide_layout: true
description_secondary: |-
  - Three concentric orbital rings with gradient strokes and SVG masks keep the icons and paths in sync
  - CMS content caches locally so kiosks keep working offline; icons get materialized on device
  - GSAP handles transitions between the attract loop, topic navigation, and detail screens.
  - Shipped as an Electron app with an NSIS installer, on-site settings panel, and hardened IPC.
framework:
  - react
---
