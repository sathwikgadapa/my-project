# Annapurna - Food Rescue Platform

A food redistribution platform connecting restaurants with excess food to NGOs and needy organizations via a network of delivery riders.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Setup Instructions

1.  **Install Dependencies**
    Open your terminal in the project directory and run:
    ```bash
    npm install
    ```

2.  **Environment Configuration**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    You can leave the default values for local development.

3.  **Run Development Server**
    Start the full-stack development server (Frontend + Backend):
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Structure

-   `/src`: Frontend React application
-   `/server.ts`: Express backend server
-   `/server/db.ts`: SQLite database configuration and seed data

## Features

-   **Restaurant Dashboard**: Post excess food donations.
-   **Rider App**: Accept and deliver food orders.
-   **NGO Dashboard**: View incoming donations.
-   **Real-time Simulation**: The app simulates real-time updates using polling.

## Seed Data

The database is automatically seeded with sample data on first run:
-   **Restaurants**: Spice Garden, Tandoori Nights, Curry House
-   **NGOs**: Hope Foundation, Little Hearts Orphanage, Senior Care Home
-   **Riders**: Rahul Kumar, Vikram Singh
