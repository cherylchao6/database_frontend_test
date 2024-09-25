# Database Frontend Project

This is a **Next.js** project with Docker support. Follow the steps below to get started with development or running the project in Docker.

## Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or later)
- **Docker** (for running with Docker)
- **npm** (comes with Node.js)
## cd into database_frontend folder first ! 
## Available Scripts

The scripts are defined in the `package.json` file under `"scripts"`. Here's what each script does:

- **`npm run dev`**: Runs the app in development mode. Available at [http://localhost:3000](http://localhost:3000).
- **`npm run build`**: Builds the app for production (compiles TypeScript, optimizes for deployment).
- **`npm run start`**: Starts the production build of the app.
- **`npm run lint`**: Lints the code to ensure there are no errors or violations of coding standards.

## Running with Docker

This project supports Docker using **docker-compose**.

1. Ensure **Docker** is installed and running.
2. To start the project with Docker, run:
   ```bash
   docker-compose up
   ```
3. To stop the Docker container:
  ```bash
   docker-compose down
   ```
## Local Testing with Docker Before Pushing

Before pushing changes, make sure Docker builds and runs the project correctly:

1. Build the Docker image:
  ```bash
   docker-compose build
   ```
2. Run the container locally to verify functionality:
  ```bash
   docker-compose up
   ```
3. Once everything works, you can push your changes to your branch.
  
