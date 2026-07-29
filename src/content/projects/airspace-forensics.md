---
id: airspace-forensics
title: "LiDAR Point Cloud Analysis for Drone Monitoring"
description: "Advanced monitoring system for drone swarm detection and analysis using LiDAR point cloud data with real-time visualization."
date: "Summer 2025"
readTime: "3 min read"
tags: ["LiDAR", "Drone Detection", "Point Cloud", "Computer Vision"]
thumbnailBg: "#1a1a2e"
thumbnailType: "./images/thumbnail.png"
imageCaption: "3D Point Cloud Visualization & Drone Trajectory Tracking"
order: 1
---

I built this system during my time at Airspace Forensics, where I worked on analyzing and visualizing drone swarm behavior using LiDAR data. The goal was to enable real-time monitoring and threat assessment from aerial sensor data.

### What I Built

- **Frontend 3D Visualization** — Rendered 20,000+ LiDAR point clouds in real-time using Open3D and Python, with color-coded intensity and classification data.
- **Background Map Isolation** — Built a system to isolate moving objects from static background in complex point cloud scenes.
- **DBSCAN Clustering** — Applied DBSCAN to cluster point cloud data and identify individual drones within a swarm.
- **Kalman Filter Tracking** — Tracked drone trajectories and predicted future positions using Kalman filters.
- **PointNet Classification** — Used PointNet to classify drone types based on 3D shapes generated from point cloud data combined with IR camera signatures.

### Key Technologies

Python, Open3D, DBSCAN, PointNet, Kalman Filters, gRPC, Protobuf, Go, React, AWS, MySQL

### Impact

The system was designed to process 50,000 requests per second through the sensor pipeline, with gRPC latency halved through optimization. It provided real-time situational awareness for drone monitoring applications.