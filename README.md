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

This application provides HTTP routes representing entities you can query on.

### Credentials

For the puropses of this example, you can use as credentials the client email, and the part until the "@" as password. For instance, if the email is `lorem@ipsum.com`, the password will be `lorem`. This is because the clients hadn't passwords set yet.

### Login

For the authenticated requests, you will need a [JWT Token](https://jwt.io/introduction/). You can get one on the `POST /login` route:

```sh
curl \
  -H "Content-Type: application/json" \
  -X POST -d '{"email":"manningblankenship@quotezart.com","password":"manningblankenship"}' \
  http://localhost:8080/login
```

The result is a JSON with a `token` property. This token is valid for 2 hours, after that please login again. Use this token on subsequent requests, on the Authorization header:

```
Authorization: Bearer <token>
```

Example of an authenticated request:

```sh
curl \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer JWT_TOKEN_HERE" \
  http://localhost:8080/policies
```

### Available routes

| Route                             | Roles allowed | Description                                   |
| --------------------------------- | ------------- | --------------------------------------------- |
| GET /policies                     | admin         | Get list of policies                          |
| GET /policies?clientName=`John`   | admin         | Get list of policies linked to a client name  |
| GET /policies?clientEmail=`a@a.a` | admin         | Get list of policies linked to a client email |
| GET /policies?clientId=`id`       | admin         | Get list of policies linked to a client ID    |
| GET /policies/`id`                | admin         | Get details of a policy by ID                 |
| GET /policies/`id`/client         | admin         | Get client details of a policy by ID          |
