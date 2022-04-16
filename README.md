## Requirements

- mongodb 5
- node 16.14.2

## Setup

Install the app dependencies:

```
npm i
```

Start mongodb via Docker _(and keep in background)_

```
docker-compose up -d

### connecting to bash
docker exec -it [mongocotainername] bash

### enter mongosh shell
mongosh -u [root]
mongosh -u <your username> -p <your password> --authenticationDatabase <your database name>

```

Start the server:

```
npm start
```

## Running the api

```
http://localhost:3000
```
