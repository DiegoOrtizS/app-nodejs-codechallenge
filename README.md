# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

# Tech Stack

<ol>
  <li>Node. You can use any framework you want (i.e. Nestjs with an ORM like TypeOrm or Prisma) </li>
  <li>Any database</li>
  <li>Kafka</li>    
</ol>

We do provide a `Dockerfile` to help you get started with a dev environment.

You must have two resources:

1. Resource to create a transaction that must containt:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```

## Optional

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

You can use Graphql;

# Send us your challenge

When you finish your challenge, after forking a repository, you **must** open a pull request to our repository. There are no limitations to the implementation, you can follow the programming paradigm, modularization, and style that you feel is the most appropriate solution.

If you have any questions, please let us know.

# Candidate Name: Diego Ortiz

## Execution
### Running the Application
```bash
docker-compose up -d --build
```
### Creating a Transaction
#### Execute approved transaction use case
```bash
docker exec -it app-nodejs-codechallenge-transaction-service-1 curl -X POST http://localhost:3000/transactions \
     -H "Content-Type: application/json" \
     -d '{
           "accountExternalIdDebit": "ab865bf7-079d-43b3-80f8-cd6dc35ba33b",
           "accountExternalIdCredit": "fe219ec9-3e32-4d41-9add-66bef431179c",
           "tranferTypeId": 1,
           "value": 100
         }'
```
#### Execute approved transaction use case
```bash
docker exec -it app-nodejs-codechallenge-transaction-service-1 curl -X POST http://localhost:3000/transactions \
     -H "Content-Type: application/json" \
     -d '{
           "accountExternalIdDebit": "ab865bf7-079d-43b3-80f8-cd6dc35ba33b",
           "accountExternalIdCredit": "fe219ec9-3e32-4d41-9add-66bef431179c",
           "tranferTypeId": 1,
           "value": 1001
         }'
```
### Retrieving a Transaction
#### Execute get transaction use case
```bash
docker exec -it app-nodejs-codechallenge-transaction-service-1 curl -X GET http://localhost:3000/transactions/{transactionExternalId}
```

## 🧰 Technologies Used

The project was built using modern backend technologies to ensure scalability, maintainability, and performance:

- **NestJS** – Progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript** – Adds static typing and better developer tooling for JavaScript.
- **Kafka** – Message broker used to communicate between the transaction service and the anti-fraud microservice asynchronously.
- **PostgreSQL** – Relational database used to persist transaction records.
- **Prisma** – Type-safe ORM used for database access and migrations.
- **Fastify** – Fast and low-overhead HTTP server, used as the NestJS platform adapter.
- **Swagger** – Used to automatically generate API documentation. Accessible at `http://localhost:3000/docs`.
- **Docker** – Used to containerize the app and run all services locally via `docker-compose`.

---

## 📁 Project Structure

The project follows a modular and layered architecture inspired by Clean Architecture and Domain-Driven Design. Here's a breakdown:

```plaintext
src/
├── application/               # Business logic (services)
├── domain/                    # Entities and domain models
│   ├── entities/
│   └── value-objects/
├── dto/                       # Data Transfer Objects
├── infrastructure/            # External layers (DB, Kafka)
│   └── repositories/          # Repositories using Prisma
├── interface/                 # Controllers and transport logic
│   └── controllers/
├── main.ts                    # App bootstrap and setup
└── app.module.ts              # Root application module
```

## 🧠 Architecture

The application follows a layered architecture inspired by **Clean Architecture** and **Domain-Driven Design** principles:

- **Domain Layer**: Contains the core business logic in the form of entities, enums, and interfaces. It’s isolated and has no external dependencies.
- **Application Layer**: Implements the use cases of the system. It coordinates between the domain and infrastructure layers.
- **Infrastructure Layer**: Responsible for external concerns such as Kafka messaging and database persistence.
- **Presentation Layer**: The REST API (controllers) that handles HTTP requests and responses.

```plaintext
[ Controller Layer (interface) ]
           |
[ Application Layer (services) ]
           |
[ Domain Layer (entities, value objects) ]
           |
[ Infrastructure Layer (DB, Kafka, Prisma) ]
```

## 📌 Noteworthy Features

- **Validation**: Input data is validated using `class-validator` and NestJS’s `ValidationPipe`, ensuring proper error handling and 400 responses for malformed requests.
- **Microservice Integration**: Kafka is used to asynchronously send transaction creation events to the anti-fraud service and receive status updates.
- **Status Management**: Transaction status is initially set to `pending`, and updated based on messages from the anti-fraud service.
- **Scalability Considerations**: The system is designed with scalability in mind—Kafka for decoupling services, PostgreSQL for reliable storage, and Fastify for efficient HTTP handling.