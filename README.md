# Codetective

## Requirements

[**Git**](https://git-scm.com/downloads)
[**Docker**](https://docs.docker.com/get-docker/)
[**Docker Compose**](https://docs.docker.com/compose/install/)

> **Docker Desktop** includes **Docker Compose** along with Docker Engine and Docker CLI which are Compose prerequisites.

## Setup

    # Clone repository
    $ git clone https://github.com/sudonite/Codetective

    # Change dir
    $ cd Codetective

    # Copy example env
    $ cp .env.example .env

    # Generate random jwt secret key
    $ sed -i 's/^JWT_SECRET=.*$/JWT_SECRET='"$(uuidgen | tr -d '-')"'/' .env

    # Generate random admin password
    $ sed -i 's!^ADMIN_PASSWORD=.*$!ADMIN_PASSWORD='"$(openssl rand -base64 20 | tr -d '\n=/')"'!' .env

## Start

    # Start containers
    $ sudo docker compose up -d

    # Run database seeding (optional)
    $ sudo docker exec codetective-backend make seed

## Stop

    # Stop containers
    $ sudo docker compose down

    # Remove images
    $ sudo docker rmi -f $(sudo docker images -q -f "reference=codetective-*")
