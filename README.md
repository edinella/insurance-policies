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
All requests and responses content are in JSON format, utf8.

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

| Route                             | Roles allowed    | Description                                          |
| --------------------------------- | ---------------- | ---------------------------------------------------- |
| POST /login                       | _not applicable_ | Get a token                                          |
| GET /policies                     | `admin`          | Get list of policies                                 |
| GET /policies?clientName=NAME     | `admin`          | Get list of policies linked to a client name         |
| GET /policies?clientNameLike=NAME | `admin`          | Get list of policies linked to a client partial name |
| GET /policies?clientEmail=EMAIL   | `admin`          | Get list of policies linked to a client email        |
| GET /policies?clientId=ID         | `admin`          | Get list of policies linked to a client ID           |
| GET /policies/ID                  | `admin`          | Get details of a policy by ID                        |
| GET /policies/ID/client           | `admin`          | Get client details of a policy by ID                 |
| GET /clients/ID                   | `admin`, `user`  | Get client details by ID                             |
| GET /clients                      | `admin`, `user`  | Get list of clients                                  |
| GET /clients?name=NAME            | `admin`, `user`  | Get list of clients filtered by name                 |
| GET /clients?nameLike=NAME        | `admin`, `user`  | Get list of clients filtered by partial name         |

> The "name" filters are exact-matching. If you prefer, use the "like" variation, for partial and case-tolerant matching.

### List pagination

All lists are limited by default on 1000 items. You can paginate more items using the [Range Header](http://otac0n.com/blog/2012/11/21/range-header-i-choose-you.html). Please note that the first item is zero.

#### Getting the first 1000 items

Request:

```
GET /policies
```

Response:

```
200 OK
Accept-Ranges: items
Content-Range: items 0-999/*
```

#### Getting the next 1000 items

Request:

```
GET /policies
Range: items=1000-1999
```

Response:

```
206 Partial Content
Accept-Ranges: items
Content-Range: items 1000-1999/*
```
