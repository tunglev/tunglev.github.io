---
id: shotgun-birb
title: "Shotgun Birb"
description: "Physics-based local multiplayer battle game where friends knock each other off platforms with shotguns."
date: "2023"
readTime: "4 min read"
tags: ["Game Dev", "Multiplayer", "Unity", "Mobile", "Physics"]
thumbnailBg: "#4a1942"
thumbnailType: "code"
imageCaption: "Shotgun Birb Multiplayer Mayhem"
order: 7
---

Shotgun Birb is a physics-based local multiplayer game where players battle friends by knocking them off platforms using a shotgun. It's fast, chaotic, and perfect for competitive family nights.

### Technical Challenges & Solutions

**Custom 3D-in-2D Rendering** — I programmed a custom rendering sorting algorithm that creates the illusion of 3D cube tiles in a 2D environment, while maintaining a 20% performance boost over true 3D rendering.

**Object-Pooling System** — Built an object-pooling system for bullets and effects, boosting FPS by 35%.

**GPU Memory Management** — Pre-loaded commonly-used assets into GPU memory on startup to reduce draw calls and eliminate in-game stuttering.

**Rapid Map Editor** — Built an in-game map editor that lets players create and share custom levels quickly.

### Technologies

Unity, C#, Custom Rendering, Object Pooling, GPU Optimization

### Platforms

Available on **Google Play**, with future updates planned for **iOS**.