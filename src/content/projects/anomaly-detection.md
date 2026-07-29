---
id: anomaly-detection
title: "Anomaly detection model"
description: "Flag abnormal network activity by combining different decision signals. An agentic conversational assistant to improve network interpretability with proprietary semantic understanding."
date: "Winter 2026"
readTime: "3 min read"
tags: ["multimodal data", "machine learning", "clustering",  "agentic AI"]
thumbnailBg: "#1a1a2e"
thumbnailType: "./images/thumbnail.png"
imageCaption: "Drone Swarm Tracking using AI and Sensor Fusion"
order: 2
---

I built this system during my time at Airspace Forensics, where I worked on analyzing and visualizing drone swarm behavior using LiDAR data. The goal was to enable real-time monitoring and threat assessment from aerial sensor data.


You can toggle and preview my **[Final Presentation (Screen captured)](/Net.pdf)** inline using the interactive link, or read the full embedded brief below:

![Tung Le - Technical Resume & Systems Brief](/Net.pdf)


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