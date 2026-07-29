---
id: blimp-showdown
title: "Blimp: Showdown"
description: "2-4 player local multiplayer strategy build & battle game for competitive family nights and parties."
date: "2023"
readTime: "4 min read"
tags: ["Game Dev", "Multiplayer", "Unity", "Mobile"]
thumbnailBg: "#2d1b69"
thumbnailType: "code"
imageCaption: "Blimp: Showdown Gameplay"
order: 5
---

Blimp: Showdown is a 2-4 player local multiplayer strategy game where each player constructs their own ship equipped with three unique weapons. The goal is to destroy all opponents' weapons to claim victory. After each round, the play area shrinks, forcing players closer together.

### Architecture & Design Patterns

I invested heavily in clean architecture for this project:

- **MVC Pattern** — For scalable, loosely coupled code
- **Observer Pattern (Event System)** — Minimized checks and draw calls, achieving ~28 FPS improvement over polling every game loop
- **State Machines** — For entity behavior controllers and weapon firing logic, modularizing over 4,000 lines of code
- **Singleton, State Machine, and Factory patterns** — Throughout the architecture

### Custom Systems

- **Unity Coroutines Animation System** — Custom system for sequencing and previewing animations via a visual editor
- **Serialization System** — Using JSON and Scriptable Objects, optimized loading time by 9%
- **Custom Shaders** — 3D water shader for the main menu, custom UI shaders, particle effects

### Technologies

Unity, C#, MVC, Observer Pattern, State Machines, JSON Serialization, Custom Shaders

### Platforms

Available on **Google Play**, with future updates planned for **iOS** and **Windows**.