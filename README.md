# Fullstack Java Project

## Kian Van Dyck (3AONC)
Change the name and Class in the title above

## Folder structure

- Readme.md
- _architecture_: this folder contains documentation regarding the architecture of your system.
- `docker-compose.yml` : to start the backend (starts all microservices)
- _backend-java_: contains microservices written in java
- _demo-artifacts_: contains images, files, etc that are useful for demo purposes.
- _frontend-web_: contains the Angular webclient

Each folder contains its own specific `.gitignore` file.  
**:warning: complete these files asap, so you don't litter your repository with binary build artifacts!**

## How to setup and run this application
###Frontend
In frontend: 
* docker build -t NAME
* docker run -d -p PORT:80 NAME

### Backend
Run dockerfile for databases
Startup
  - Config service
  - Discovery service
  - Gateway service
  - Review service
  - Post service
  - Comment service
