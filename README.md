# Insurance Policies

This is an example of a application that manages some information regarding insurance policies and company clients.

## Running locally

Choose one of this methods:

#### Kubernetes with Tilt (recommended)

> Follow [Tilt](https://docs.tilt.dev/install.html) installation instructions, then run:
>
> - Start: `tilt up`
> - Stop: `tilt down`

#### Docker Compose

> If you prefer not using Tilt, just install [Docker Compose](https://docs.docker.com/compose/install/) and you are ready to go:
>
> - Start: `docker-compose up --build`
> - Stop: `docker-compose down`

## Commands

| Command       | What it does              |
| ------------- | ------------------------- |
| `npm install` | Installs api dependencies |
| `npm test`    | Runs api tests            |
| `tilt up`     | Starts all services       |
| `tilt down`   | Stops all services        |

## Conventions

- **GIT Branching:** [GIT Flow branching model](http://nvie.com/posts/a-successful-git-branching-model/)
- **Versioning:** [semantic versioning](http://semver.org/)

## REST API

Login

```sh
curl -H "Content-Type: application/json" -X POST \
  -d '{"email":"manningblankenship@quotezart.com","password":"manningblankenship"}' \
  http://localhost:8080/login
```
