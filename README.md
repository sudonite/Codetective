# Codetective

## Requirements

[**Git**](https://git-scm.com/downloads)
[**Docker**](https://docs.docker.com/get-docker/)
[**Docker Compose**](https://docs.docker.com/compose/install/)

> **Docker Desktop** includes **Docker Compose** along with Docker Engine and Docker CLI which are Compose prerequisites.

## Setup

```bash
# Clone repository
$ git clone https://github.com/sudonite/Codetective

# Change dir
$ cd Codetective

# Copy example env
$ cp .env.example .env

# Generate random jwt secret key
$ sed -i "s/JWT_PLACE/$(uuidgen | tr -d '-')/g" .env
```

## Start

```bash
# Start containers
$ sudo docker compose up -d

# Run database seeding (optional)
$ sudo docker exec codetective-backend make seed <new_admin_passwd>

# Visit http://127.0.0.1
```

## Stop

```bash
# Stop containers
$ sudo docker compose down

# Remove images
$ sudo docker rmi -f $(sudo docker images -q -f "reference=codetective-*")
```
