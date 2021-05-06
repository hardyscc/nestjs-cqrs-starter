# NestJS CQRS Microservices Starter

## Description

A starter project which featuring advanced microservice pattern with GraphQL, based on Domain-Driven Design (DDD) using the command query responsibility segregation (CQRS) design pattern.

## Technologies

- [GraphQL](https://graphql.org/)
- [Apollo Federation](https://www.apollographql.com/docs/apollo-server/federation/introduction/)
- [NestJS](https://docs.nestjs.com/)
- [NestJS GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [NestJS Federation](https://docs.nestjs.com/graphql/federation)
- [NestJS TypeORM](https://docs.nestjs.com/techniques/database)
- [NestJS CQRS](https://docs.nestjs.com/recipes/cqrs)
- [NestJS Event Store](https://github.com/juicycleff/nestjs-event-store)

## Installation

```bash
git clone https://github.com/hardyscc/nestjs-cqrs-starter.git <Your_Project_Name>
cd <Your_Project_Name>

npm install
```

## Usage

### Start MySQL

Start MySQL docker instance.

```bash
docker run -d -e "MYSQL_ROOT_PASSWORD=Admin12345" -e "MYSQL_USER=usr" -e "MYSQL_PASSWORD=User12345" -e "MYSQL_DATABASE=development" -e "MYSQL_AUTHENTICATION_PLUGIN=mysql_native_password" -p 3306:3306 --name some-mysql bitnami/mysql:8.0.19
```

Connect using MySQL docker instance command line.

```bash
docker exec -it some-mysql mysql -uroot -p"Admin12345"
```

Create the Databases for testing

```sql
CREATE DATABASE service_user;
GRANT ALL PRIVILEGES ON service_user.* TO 'usr'@'%';

CREATE DATABASE service_account;
GRANT ALL PRIVILEGES ON service_account.* TO 'usr'@'%';
FLUSH PRIVILEGES;
```

Clean-up all data if need to re-testing again

```sql
DELETE FROM service_account.ACCOUNT;
DELETE FROM service_user.USER;
```

### Start EventStore

```bash
docker run --name some-eventstore -d -p 2113:2113 -p 1113:1113 eventstore/eventstore:release-5.0.9
```

Create the Persistent Subscriptions

```bash
curl -L -X PUT "http://localhost:2113/subscriptions/%24svc-user/account" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46Y2hhbmdlaXQ=" \
  -d "{}"

curl -L -X PUT "http://localhost:2113/subscriptions/%24svc-account/user" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46Y2hhbmdlaXQ=" \
  -d "{}"
```

### Start the microservices

```bash
# Start the user service
nest start service-user

# Start the account service
nest start service-account

# start the gateway
nest start gateway
```

## Testing

Goto GraphQL Playground - http://localhost:3000/graphql

### Create user with a default saving account

```graphql
mutation {
  createUser(input: { name: "John" }) {
    id
    name
  }
}
```

OR

```bash
curl -X POST -H 'Content-Type: application/json' \
-d '{"query": "mutation { createUser(input: { name: \"John\" }) { id name } }"}' \
http://localhost:3000/graphql
```

You should see something like this

1. Under `service-user` console

   ```sql
   Async CreateUserHandler... CreateUserCommand
   query: START TRANSACTION
   query: INSERT INTO `USER`(`id`, `name`, `nickName`, `status`) VALUES (?, ?, DEFAULT, DEFAULT) -- PARAMETERS: ["4d04689b-ef40-4a08-8a27-6fa420790ddb","John"]
   query: SELECT `User`.`id` AS `User_id`, `User`.`status` AS `User_status` FROM `USER` `User` WHERE `User`.`id` = ? -- PARAMETERS: ["4d04689b-ef40-4a08-8a27-6fa420790ddb"]
   query: COMMIT
   Async ActivateUserHandler... ActivateUserCommand
   query: UPDATE `USER` SET `status` = ? WHERE `id` IN (?) -- PARAMETERS: ["A","4d04689b-ef40-4a08-8a27-6fa420790ddb"]
   ```

1. under `service-account` console

   ```sql
   Async CreateAccountHandler... CreateAccountCommand
   query: START TRANSACTION
   query: INSERT INTO `ACCOUNT`(`id`, `name`, `balance`, `userId`) VALUES (?, ?, DEFAULT, ?) -- PARAMETERS: ["57c3cc9e-4aa9-4ea8-8c7f-5d4653ee709f","Saving","4d04689b-ef40-4a08-8a27-6fa420790ddb"]
   query: SELECT `Account`.`id` AS `Account_id`, `Account`.`balance` AS `Account_balance` FROM `ACCOUNT` `Account` WHERE `Account`.`id` = ? -- PARAMETERS: ["57c3cc9e-4aa9-4ea8-8c7f-5d4653ee709f"]
   query: COMMIT
   ```

### Query the users

```graphql
query {
  users {
    id
    name
    accounts {
      id
      name
      balance
    }
  }
}
```

OR

```bash
curl -X POST -H 'Content-Type: application/json' \
-d '{"query": "query { users { id name accounts { id name balance } } }"}' \
http://localhost:3000/graphql
```

Output :

```json
{
  "data": {
    "users": [
      {
        "id": "4d04689b-ef40-4a08-8a27-6fa420790ddb",
        "name": "John",
        "accounts": [
          {
            "id": "57c3cc9e-4aa9-4ea8-8c7f-5d4653ee709f",
            "name": "Saving",
            "balance": 0
          }
        ]
      }
    ]
  }
}
```
