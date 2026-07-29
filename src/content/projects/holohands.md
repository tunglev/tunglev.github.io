---
id: holohands
title: "HoloHands - Gesture 3D Navigation & Computer Control"
description: "Using standard webcams to enable intuitive hand-gesture-based control of computers and 3D environments."
date: "2024"
readTime: "4 min read"
tags: ["Computer Vision", "AI", "Gesture Recognition", "YOLO", "MediaPipe"]
thumbnailBg: "#0d1b2a"
thumbnailType: "code"
imageCaption: "HoloHands Gesture Recognition System"
order: 14
---

Inspired by Tony Stark's holographic interface in Iron Man, HoloHands aims to make futuristic interaction accessible using just a standard webcam — no VR hardware required.

### How It Works

The system uses MediaPipe for hand pose estimation, extracting finger landmark coordinates, then feeds them into a YOLOv8 model trained on a custom dataset for gesture detection.

### Key Achievements

- **87% mAP50 Score** on gesture detection using YOLOv8
- Custom gesture recognition logic by comparing landmark coordinates to detect finger states
- Method to estimate hand orientation and convert 2D coordinates to 3D space using perspective projection
- Real-time data transmission to Unity via UDP for 3D environment interaction
- Desktop UI built with Python Tkinter

### Technologies

MediaPipe, YOLOv8, Roboflow, Python, Unity, UDP, OpenCV

### What I Built

The system can recognize custom gestures and use them to control both desktop applications and 3D environments, bridging the gap between natural human interaction and digital interfaces.