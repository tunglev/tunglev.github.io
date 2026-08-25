---
id: anomaly-detection
title: "Anomaly detection model"
description: "Flag abnormal network activity by combining different decision signals. An agentic conversational assistant to improve network interpretability with proprietary semantic understanding."
date: "Winter 2026"
readTime: "3 min read"
tags: ["multimodal data", "machine learning", "clustering",  "agentic AI"]
thumbnailBg: "#1a1a2e"
thumbnailType: "microsoft.png"
imageCaption: "C chunking pipeline"
order: 2
---

# Automating Diagnostics and Explainability in Azure Networking

This is a brief description of the work I did at Microsoft as a Software Engineer Intern for Azure for Operator, Packet Core Team. The goal is to flag abnormal network activity by combining different decision signals. Stretch goal is an agentic conversational assistant to improve network interpretability with proprietary semantic understanding.

During my internship at Microsoft, I focused on automating the analysis of complex Azure network logs. The goal was to provide Azure Networking engineers with tools to interpret routing decisions and explain system behaviors to clients, replacing a highly manual troubleshooting process.

### Two-Stage Anomaly Detection and Visualization

To detect system irregularities across more than 300,000 telemetry traces, I developed an automated baselining pipeline using Python and C++. 

Initially, utilizing Isolation Forest alone produced a high false-positive rate. By analyzing the confusion matrix, I adjusted the strategy: I used the Isolation Forest as a pre-filter to clear out simpler outliers. This prepared the data for an Autoencoder, which is well-suited for handling complex, multidimensional sequences. Together, this sequential approach improved the anomaly detection true positive rate by 22%. I integrated these results into a visualization tool that maps real-time TCP State Machine transitions and proprietary routing decisions, helping over 20 engineers identify network conflicts more efficiently.

### Bridging the Gap to Explainability with RAG

While unsupervised anomaly detection successfully flagged outliers, it could not explain *why* the system made specific decisions. Engineers still had to manually trace the source code to find the underlying logic.

To resolve this, I pivoted to a deterministic approach using a local Large Language Model (LLM) paired with a vector database. Since the C codebase exceeded the LLM's context window, I implemented a Retrieval-Augmented Generation (RAG) architecture. I chunked the C codebase by function and indexed these segments. When a telemetry trace event occurred, the system retrieved the exact code block responsible for that behavior. This enabled the local LLM to generate precise, line-by-line explanations of the system's execution path, turning a tedious manual search into an automated, reliable diagnostics tool.

![Tung Le - Technical Final Presentation](/Net.pdf)


