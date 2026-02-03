# Vortex Genesis - Real-Time Dashboard

This is the implementation of the **Real-Time Dashboard** for the Vortex Genesis Bio-Digital Organism. It visualizes the live metrics of the immune system, including Healing Operations, LivenessToken generation, and Security Threat blocking.

## 🚀 How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Server**:
    ```bash
    npm start
    ```

3.  **Access the Dashboard**:
    Open your browser and navigate to:
    [http://localhost:3000/dashboard.html](http://localhost:3000/dashboard.html)

## 🏗️ Architecture

-   **Backend**: Node.js + Express + WebSocket (`ws`)
    -   `src/server.ts`: Hosts the HTTP server and WebSocket broadcaster.
    -   `MockMetricGenerator`: Simulates the internal state of the Vortex "Brain" (Healing Nexus, Apoptosis, etc.).
-   **Frontend**: HTML5 + CSS3 (Glassmorphism) + JavaScript
    -   `public/dashboard.html`: The visual interface.
    -   `public/app.js`: Connects to WebSocket and updates the UI in real-time.
    -   **Chart.js**: Used for rendering live metrics charts.

## 📊 Features

-   **Real-Time WebSocket Updates**: Metrics update every 2 seconds.
-   **Visual Proof of Work**:
    -   System Health Status
    -   Active Module Count & Entropy Score
    -   Consensus Protocol Rate
    -   LivenessToken Issuance Counter
-   **Security Matrix**: Visual indication of active security protections (HMAC, Replay, Spoofing).
-   **Live Charts**:
    -   Healing Operations Duration Stream
    -   Vitality Distribution (Healthy vs Recovering vs Critical)

## 🎨 Design

The dashboard features a "Premium" aesthetic with:
-   **Glassmorphism**: Frosted glass cards.
-   **Particle Background**: Dynamic background animation.
-   **Vortex Branding**: Custom ASCII art and color palette (`#a855f7` Purple, `#06b6d4` Cyan).
