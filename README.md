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

| Command       | What it does                 |
| ------------- | ---------------------------- |
| `npm install` | Installs all microservices   |
| `tilt up`     | Starts all microservices     |
| `tilt down`   | Stops all microservices      |
| `npm test`    | Runs all microservices tests |

## Conventions

- **GIT Branching:** [GIT Flow branching model](http://nvie.com/posts/a-successful-git-branching-model/)
- **Versioning:** [semantic versioning](http://semver.org/)
- **Microservices:** [Protocol Buffers and gRPC](./protos)
