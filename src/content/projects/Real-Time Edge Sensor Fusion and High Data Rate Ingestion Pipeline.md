---
id: rtos-firmware
title: "RealTime multi-processor SOC ingestion pipeline and batching algorithm"
description: "RTOS for deterministic temporal data fusion. SIMD for high throughput spatial fusion."
date: "Summer 2025"
readTime: "3 min read"
tags: ["RTOS", "embedded system", "firmware", "SoC", "algorithm"]
thumbnailBg: "#1a1a2e"
thumbnailType: "./images/thumbnail.png"
imageCaption: "Real-Time Edge Sensor Fusion and Ingestion Pipeline "
order: 1
---



# Real-Time Edge Sensor Fusion and Ingestion Pipeline 

## Abstract
This reading details the engineering design, trade-offs, and performance optimization of a high-throughput drone tracking system deployed at the edge. The system ingests and fuses high-frequency 3D LiDAR point clouds (200,000+ points/sec) and 2D thermal camera frames (30 FPS) on an AMD/Xilinx Zynq UltraScale+ MPSoC. By partitioning processing domains between a hard real-time Cortex-R5 core running FreeRTOS and isolated Cortex-A53 application cores running Linux, the architecture successfully decouples sub-millisecond sensor ingestion from heavy network streaming layers. Additionally, this reading presents the mathematical derivation and implementation of a network-level adaptive batching algorithm that utilizes inter-processor communication (IPC) and Go channels to systematically reduce P99 latency from 200 ms to 100 ms under dense target environments.

---

## 1. The Problem
Detecting and tracking small, fast-moving unmanned aerial vehicles (UAVs) in urban and critical airspaces requires multi-modal sensor inputs:
1. **LiDAR:** Provides high-accuracy, 3D spatial coordinate data with explicit depth perception, but lacks range and target classification metrics at distance.
2. **Thermal/IR Cameras:** Offer long-range, 2D passive tracking with thermal classification (detecting motor heat signatures), but lack direct 3D coordinate mapping.

Fusing these sensors at the edge is a difficult engineering challenge. LiDAR sensors generate an immense volume of data—exceeding 200,000 points per second over UDP packets. Standard single-threaded or naively multithreaded edge software running on traditional operating systems (like standard Linux) suffers from scheduling jitter. During high-traffic tracking windows, OS scheduler pauses cause network buffer overflows, resulting in dropped UDP packets and lost target tracks. 

Furthermore, sending fused coordinates over the network individually as they are generated creates massive network overhead. Each small coordinate update gets wrapped in HTTP/2, TCP, and IP headers, creating a scenario where the system transmits more metadata than actual telemetry. This flood of tiny packets triggers "interrupt storms" on the receiving server, driving CPU utilization to critical levels and pushing P99 tail latency to a laggy 200 ms.

---

## 2. End-to-End System Architecture

To solve these deterministic and computational bottlenecks, I chose the **Xilinx Zynq UltraScale+ MPSoC** as our edge platform. This system-on-chip features two distinct hardware processing domains on a single silicon die:
* **The Real-Time Processing Unit (RPU):** Dual ARM Cortex-R5 cores running FreeRTOS.
* **The Application Processing Unit (APU):** Quad ARM Cortex-A53 cores running embedded Linux.

![alt text](../images/soc-architecture-mini.png)

### CPU Core Allocation & Isolation on the APU
To prevent non-deterministic Linux scheduler pauses from affecting our real-time tracking loops, I configured CPU isolation on the 4 Cortex-A53 cores using the `isolcpus` Linux kernel boot arguments:
* **Core 0 (System Host):** Manages standard Linux background processes, OS kernel operations, and generic I/O.
* **Core 1 (Networking Node):** Runs our **Go-based Edge Agent**, executing the adaptive batching and gRPC streaming pipeline.
* **Cores 2 & 3 (Isolated Fusion Engine):** Form an isolated dual-core cluster dedicated exclusively to running our high-performance **C++ Spatial Fusion and Tracking Engine**. By isolating these cores, Linux background tasks cannot preempt the heavy matrix coordinate transformations.

---

## 3. Firmware Engineering on the RPU (Cortex-R5)

### Why C++ was Chosen over C for RTOS Firmware
While traditional firmware is written in C, I chose modern C++ for the FreeRTOS RPU application. My decision was guided by several critical engineering trade-offs:
1. **RAII for Thread Safety:** In an RTOS, if a thread exits prematurely due to a sensor read error without releasing a mutex, the entire system deadlocks. C++ wrappers like `std::lock_guard` guarantee that mutexes are released when they go out of scope, eliminating manual and error-prone `goto cleanup` statements.
2. **Zero-Overhead Abstractions:** C++ features like templates and `constexpr` allowed me to write clean, maintainable abstraction layers for sensor registers and coordinate math that compile down to assembly instructions with zero runtime overhead.
3. **Preventing Heap Fragmentation:** Frequent use of `malloc` and `free` in C leads to heap fragmentation, which can cause silent, critical crashes on embedded systems designed to run continuously for months. Using C++ placement `new` and fixed-size static arrays (such as `char camera_ip[16]` instead of `std::string`) allowed us to write modern, expressive code with zero dynamic memory allocation.

### Ingestion: Polling vs. Interrupts vs. DMA
During the initial design phase, I had to decide how the RPU should ingest data from the Ethernet (LiDAR) and MIPI-CSI (Camera) peripherals. I evaluated three methods:

* **Polling:** The CPU continuously loops, checking if a register has data.
  * *Decision:* Rejected. This wastes 100% of RPU cycles, preventing the execution of synchronization algorithms and causing packet drops.
* **GPIO / Basic Interrupts:** The CPU is interrupted for every single byte of incoming data.
  * *Decision:* Rejected. At 200,000 points/sec, the interrupt rate is too high, leading to "interrupt thrashing" where the CPU spends all its time entering and exiting interrupt contexts.
* **DMA-Driven Hardware Interrupts:** The peripheral hardware writes data directly into physical RAM without CPU intervention. Once a complete block is transferred, it fires a single interrupt.
  * *Decision:* **Selected.** This is the only realistic way to handle high-throughput streams.

For the **LiDAR input**, the Gigabit Ethernet MAC uses Direct Memory Access (DMA) to write incoming UDP packets directly into RPU SRAM. When a packet is fully written, a single MAC Rx interrupt fires. The ISR quickly posts a FreeRTOS Task Notification to wake up the LiDAR Ingestion Thread and immediately exits.

For the **Thermal Camera input**, the MIPI-CSI host controller writes frame buffers directly into RAM using DMA. On Frame-End, a hardware interrupt is triggered, notifying the IR Ingestion Thread.

---

## 4. Deep Dive: Sensor Fusion & Pipeline Partitioning

### The Architectural Trade-Off: Where Should the Fusion Live?
One of the most critical decisions I faced was deciding where to split our sensor fusion execution. Should the entire spatial and temporal alignment run on the Cortex-R5, or should it run on the Cortex-A53?

#### **Option 1: Execute Entire Fusion on RPU**
* *Pros:* Deterministic sub-millisecond execution; no Linux OS scheduling jitter.
* *Cons:* The Cortex-R5 lacks SIMD vector units and operates at a lower clock speed. It would be overwhelmed by the heavy matrix math required to project thousands of 3D points onto a 2D camera plane.

#### **Option 2: Execute Entire Fusion on APU**
* *Pros:* Abundant processing power, high-speed DDR4 memory, and SIMD vector instructions.
* *Cons:* Non-deterministic packet arrival on Linux. The socket buffers could overflow during high-traffic moments due to OS scheduler latency.

#### **The Decision: Split-Pipeline Architecture**
I chose a hybrid split-pipeline design. The **RPU** handles hard real-time ingestion, ground/clutter removal, and temporal synchronization. The **APU** (Cores 2 & 3) handles heavy spatial projection and networking. Here is the detailed architecture (dragable view):

```mermaid
soc-architecture.mermaid
```

### Phase 1: Ground and Clutter Removal (RPU)
The raw LiDAR stream contains points from static structures (buildings, ground, trees). To save processing cycles downstream, the RPU runs a lightweight, fast elevation-cutoff and static bounding-box filter. It immediately discards any points outside the operational airspace, reducing the data volume by up to 60% before temporal alignment occurs.

### Phase 2: Temporal Synchronization (RPU)
Sensors operate asynchronously; a LiDAR point packet and an IR camera frame never arrive at the exact same microsecond. To solve this:
1. When a LiDAR packet is received via DMA, the RPU timestamps it using the hardware **Zynq System Counter (SYS_CTR)** ($t_L$).
2. When an IR frame is received, it is stamped with the same counter ($t_T$).
3. The RPU temporal synchronization thread implements a sliding-window queue. It scans the timestamps and matches the closest LiDAR packet and IR frame in time where:
   $$|t_L - t_T| \le 15\text{ ms}$$
4. Unmatched, stale data is dropped. Matched data pointers are grouped together.

### Phase 3: Spatial Synchronization (APU Cores 2 & 3)
Once the temporally synchronized pointers are passed to the APU, the **C++ Spatial Fusion Engine** maps the 3D LiDAR coordinates to the 2D camera pixels. 

For each matched 3D point $P = [X, Y, Z, 1]^T$, the engine computes the projected pixel coordinate $p = [u, v, 1]^T$ using extrinsic and intrinsic transformation matrices:
$$p \propto K \cdot [R \mid T] \cdot P$$
Where:
* $[R \mid T]$ is the $3\times4$ Extrinsic Matrix representing the physical translation and rotation between the LiDAR and the camera.
* $K$ is the $3\times3$ Camera Intrinsic Matrix representing focal length and optical center.

To make this execution fast, I wrote this matrix multiplication loop using **ARM NEON SIMD intrinsics**. This allowed us to load multiple float coordinates into 128-bit registers and execute the coordinate projections in parallel. 

Points that project directly onto "hot" pixel clusters (the drone motors identified by a simple thermal thresholding filter) are classified as confirmed target coordinates: $(X, Y, Z, \text{Temperature}, \text{Timestamp})$.

---

## 5. RPU-to-APU IPC
To transfer the synchronized data pointers from the RPU to the APU without introducing latency or CPU polling, I used the **OpenAMP** framework running over a shared memory region.

* **VirtIO Ring Buffers:** A section of the Zynq's On-Chip Memory (OCM) is configured as a shared ring buffer. 
* **The Flow:**
  1. The RPU writes the matched sensor packet pointers into the VirtIO buffer.
  2. The RPU triggers an **Inter-Processor Interrupt (IPI)**. This is a hardware-level mailbox register that forces an immediate CPU interrupt on the Cortex-A53 cores.
  3. The APU’s Linux kernel catches the interrupt via the `rpmsg` driver and exposes the data to userspace through a virtual character device (`/dev/rpmsg0`).
  4. The userspace C++ Fusion Engine reads the pointers from `/dev/rpmsg0` instantly, achieving a zero-copy, low-overhead IPC transfer.

---

## 6. Network problem: too much data!

### The Network Bottleneck: Interrupt Storms 
Initially, our system wrote every single fused coordinate to the gRPC network stream as it was generated. Under high target densities (e.g., tracking a drone swarm), this resulted in sending over 1,000 tiny TCP packets per second. This caused two major problems:
1. **Interrupt Storms:** The receiving server’s CPU was overwhelmed by hardware NIC interrupts, causing context-switching thrashing and high latency.
2. **Nagle's and Delayed ACK Interaction:** By default, Linux TCP sockets use Nagle's algorithm to buffer small packets, while receivers use Delayed ACKs (waiting up to 200 ms to acknowledge packets). When combined, they create an artificial delay. This pushed our P99 latency up to a laggy 200 ms.

### The Two Buffers: Go Channel vs. TCP Socket
To solve this, I designed a Go-based Edge Agent running on Core 1 of the APU. This agent introduces an application-level **Go Channel Buffer (`coordQueue`)** to handle backpressure:

```
[RPU] -> [Go Buffer (Userspace)] -> [gRPC Stream] -> [TCP Buffer (Kernel)]
```

* **The Go Channel Buffer (Unsent Data):** This is fully managed by our Go code. 
* **The Linux TCP Socket Buffer:** This is managed automatically by the OS.

#### How Backpressure Propagates:
When network congestion occurs, the physical wire cannot transmit packets fast enough. The Linux TCP Socket Buffer fills up, which causes our `stream.Send()` call to block. Because the sender thread is blocked, it stops pulling coordinates out of the Go Channel Buffer. Since our RPU continues to feed coordinates through OpenAMP, the **Go Channel Buffer starts filling up**. 

By monitoring the size of our own Go Channel Buffer via `len(coordQueue)`, our code can detect network congestion before packet drops occur.

---

## 7. Adaptive Batching: When is it consider "busy"? 

When do you draw the line between busy and not busy? How do you determine that? Is it a binary decision, or is it linearly scaled? 

### Binary State Machine vs. Continuous Math
First, I have 2 parameters that decide the algorithm decision: the **batch size** ($N$) represents the exact number of fused coordinates that the Go agent consolidates into a single Protobuf payload before transmitting it over the gRPC connection [2.1]. 

The **timeout** ($T$) is the maximum duration the agent will wait for a batch to fill before executing a forced flush, ensuring that coordinates are not held in memory with indefinite delays during periods of low tracking activity.

During development, I evaluated whether to scale the batch size ($N$) and timeout ($T$) dynamically using a continuous mathematical formula (e.g., scaling $N$ proportionally with queue depth) or via a binary state machine.

I chose the **Binary State Machine with 2-out-of-3 Voting Logic**. Continuous scaling models can cause the network stack to experience "parameter thrashing," where minor oscillations in target tracking cause the packet sizes to change rapidly, introducing unpredictable network jitter. A binary state machine provides stable, predictable modes of operation.

### The 2-out-of-3 Voting Logic 
This is what we call a weak signal, which means the signal that's saying some picture but not fully saying the picture. Even though some of the parameters in this signal are hyperparameters, it's still saying something about the picture. We're trying to count the number of these weak signals to hopefully say that, with enough accumulation of the weak signal, we can say something about the big picture. 

The Go Edge Agent monitors three signals:
1. **Signal A (Filtered Point Rate):** If the sky is empty, the RPU's ground and clutter filters discard nearly 100% of the points. A surge of >1,500 non-background points/sec indicates laser reflections off physical objects (drones) in the active airspace.
2. **Signal B (Time Delta $\Delta t$):** If the rolling average time delta between incoming coordinates is $< 5\text{ ms}$ (indicating a high data rate).
3. **Signal C (Go Queue Depth):** If the Go Channel Buffer occupancy is $> 30\%$ capacity.

If any **two** of these three signals are triggered, the Go Agent transitions from *Low-Latency Mode* to *High-Throughput Mode*.

### What should the batch size be when is it "busy" then? How to choose the value for N?
To determine the optimal batch size ($N$) for the High-Throughput Mode, I conducted a network packet analysis based on **Maximum Transmission Unit (MTU)** boundaries [2.1]. 

A standard Ethernet MTU is **1500 bytes** [2.1]. If our batched payload exceeds 1500 bytes, the IP layer fragments the packet [2.1]. This fragmentation increases packet processing overhead and elevates receiver-side CPU utilization [2.1].

I calculate the protocol overhead for a single gRPC-over-TCP packet:
* Ethernet Frame Header: $18\text{ bytes}$
* IPv4 Header: $20\text{ bytes}$
* TCP Header: $20\text{ bytes}$
* HTTP/2 Frame Header (gRPC): $9\text{ bytes}$
* gRPC Frame Header: $5\text{ bytes}$
* **Total Headers ($H$):** $72\text{ bytes}$ of protocol overhead [2.1].

This leaves the available payload space ($P$) within a single unfragmented Ethernet packet as [2.1]:
$$P = \text{MTU} - H = 1500\text{ bytes} - 72\text{ bytes} = 1428\text{ bytes}$$

A single serialized Protobuf coordinate structure ($D$) is exactly **32 bytes** [2.1]. Therefore, the maximum number of coordinates ($N$) we can pack into a single unfragmented packet is [2.1]:
$$N = \left\lfloor \frac{P}{D} \right\rfloor = \left\lfloor \frac{1428\text{ bytes}}{32\text{ bytes}} \right\rfloor = \lfloor 44.625 \rfloor = \mathbf{45}$$

Setting our High-Throughput batch size to **$N = 45$** ensures that we maximize payload efficiency ($\approx 95\%$ data-to-overhead ratio) while guaranteeing that the entire batch fits into a single, unfragmented Ethernet frame, bypassing IP fragmentation [2.1].

* **Quiet Airspace (Low-Latency Mode):** $N = 1, T = 0\text{ ms}$ (Immediate push).
* **Busy Airspace (High-Throughput Mode):** $N = 45, T = 10\text{ ms}$ (Unfragmented MTU-optimized batching) [2.1].

---

## 8. Testing, Measurement, and Validation

### Latency Measurement Methodology
To measure latency without being affected by NTP clock drift, I implemented an **Loopback Timestamp (Echo) Method**:
1. The RPU stamps the outgoing coordinate with its local, high-precision **System Counter** ($T_{\text{start}}$).
2. The coordinate travels through OpenAMP, the APU, the gRPC network, and arrives at the Centralized Server.
3. The Server processes the coordinate and immediately returns a response packet carrying the original $T_{\text{start}}$ timestamp.
4. When the RPU receives this response, it reads its current System Counter ($T_{\text{end}}$).
5. The round-trip time is simply computed as:
   $$\text{RTT} = T_{\text{end}} - T_{\text{start}}$$

This approach measures the complete end-to-end processing and network transit loop using a single hardware clock, ensuring microsecond accuracy.

### Diagnostics
* **Wireshark:** Captured packet traces to monitor TCP ACK round-trip times and verify that packets did not exceed the 1500-byte MTU limit.
* **Prometheus:** A Prometheus client library was integrated into the Go Edge Agent, exposing a /metrics endpoint [1]. A separate, dedicated monitoring server ran the Prometheus database to scrape this endpoint. This ensured that telemetry logging did not consume CPU or storage I/O on the Zynq MPSoC.

### Empirical Test Bench Results
We evaluated the system under a simulated multi-drone tracking scenario with different batching configurations:

| Metric | Baseline (Unbatched) | Static Batching ($N=100$) | Adaptive Batching ($N=45$) |
| :--- | :--- | :--- | :--- |
| **Simulated Target Count** | 8 Drones | 8 Drones | 8 Drones |
| **Incoming Packet Rate** | 800 packets/sec | 8 packets/sec | 18 packets/sec |
| **Server CPU Utilization** | 42% (Interrupt Thrashing) | 3% | 5% |
| **P99 RTT Latency** | **210 ms** | **115 ms** (mostly-timeout triggered) | **45 ms** |
| **Packet Fragmentation** | None | Yes (Payload split over 2-3 packets)  | **None (Fits in single MTU)**|

### Analysis
Our testing validated the adaptive batching approach. The unbatched baseline configuration suffered from high tail latency (P99 of 210 ms) due to interrupt storms and socket buffer queues on the server. While static batching ($N=100$) reduced CPU load, it introduced unnecessary delay during periods of low activity because it spent too much time waiting for the large 100-packet buffer to fill up. 

Our **Adaptive Batching ($N=45$)** configuration hit the optimal balance: it prevented packet fragmentation, lowered server CPU usage to an efficient 5%, and reduced our P99 round-trip latency to a highly responsive **45 ms** under heavy target loads.