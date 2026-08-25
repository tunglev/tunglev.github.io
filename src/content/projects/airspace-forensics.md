---
id: airspace-forensics
title: "Drone swarm tracking using AI and sensor fusion"
description: "Classify drones in swarm using transfer learning. Localize using distributed system of LiDAR, IR, RF sensors."
date: "Summer 2025"
readTime: "3 min read"
tags: ["distributed system", "machine learning", "data", "embedded system"]
thumbnailBg: "#1a1a2e"
thumbnailType: "./images/a.png"
imageCaption: "Drone Swarm Tracking using AI and Sensor Fusion"
order: 1
---

I built this system during my time at Airspace Forensics, where I worked on analyzing and visualizing drone swarm behavior using LiDAR data. The goal was to enable real-time monitoring and threat assessment from aerial sensor data.

![alt text](AF-nodes.png)


### What I Built


- **Background Map Isolation** — Built a system to isolate moving objects from static background in complex point cloud scenes.
- **DBSCAN Clustering** — Applied DBSCAN to cluster point cloud data and identify individual drones within a swarm.
- **Kalman Filter Tracking** — Tracked drone trajectories and predicted future positions using Kalman filters.
- **PointNet Classification** — Used PointNet to classify drone types based on 3D shapes generated from point cloud data combined with IR camera signatures.

### Key Technologies

Python, Open3D, DBSCAN, PointNet, Kalman Filters, gRPC, Protobuf, Go, React, AWS, MySQL

### Impact

The system was designed to process 50,000 requests per second through the sensor pipeline, with gRPC latency halved through optimization. It provided real-time situational awareness for drone monitoring applications.

![Swarm Tracking](/src/assets/videos/clustering-n-tracking.mp4)

![Technique to Calibrate Multiple LiDAR in different scenarios using point cloud information](https://www.youtube.com/watch?v=i1zHdpEo8TE)

