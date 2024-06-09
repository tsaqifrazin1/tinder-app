# Dating App Backend

## Overview

This is the backend service for a Dating App, similar to Tinder/Bumble. It provides functionalities for user signup, login, viewing profiles, swiping left (pass), and swiping right (like).

## ERD (Entity Relation Diagram)
![Alt text](Dealls_Tech_Test_DB_DESIGN.png?raw=true "Title")

## Features

- User sign-up and login
- Daily limit of 10 profile views/swipes for non-premium users
- Premium feature to unlock unlimited swipes
- Profiles cannot appear twice in the same day

## Tech Stack

- **Node.js**: JavaScript runtime
- **NestJs**: Web framework
- **PostgreSQL**: Database
- **TypeScript**: Static typing
- **ESLint**: Linting
- **Jest**: Testing framework
- **Docker**: Containerization

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- Docker (for containerization, optional)

### Installation

1. Clone the repository:
    ```bash
      git clone https://github.com/tsaqifrazin1/tinder-app.git
      cd dating-app-backend
    ```
2. Install dependecies
    ```
      npm install
    ```
3. Create a .env file with the following content:
    ```
    PORT=
    NODE_ENV=

    SECRET_KEY=

    DATABASE_HOST=
    DATABASE_PORT=
    DATABASE_USERNAME=
    DATABASE_PASSWORD=
    DATABASE_DB=
    DATABASE_LOGGING=
    ```
### Running Migrations file

1. Create Database
    ```
    npm run typeorm:db:create
    ```
2. Running Migrations
    ```
    npm run typeorm:run-migration
    ```
3. Running Seeders (Optional)
    ```
    npm run typeorm:run-seed
    ```

    Seeders generates 100 users with the following criteria:

    - Subscribed Users: Every 10th user is subscribed, named user10Subscribed, user20Subscribed, user30Subscribed, and so on.
    - Regular Users: All other users are named user1, user2, user3, etc.
    - Gender Assignment:
    Only user1 and user10Subscribed have gender set to Male (M).
    All other users have gender set to Female (F) by default.

### Running the services

1. Development
    ```
    npm run start:dev
    ```
2. Production
    ```
    npm run start:prod
    ```

### Linting
  ``` 
    npm run lint
  ```

  Husky is already configured in this project to run linting before each commit.  

### Testing
1. Unit test
    ```
    npm run test
    ```

2. Integration Test
    ```
    npm run test:e2e
    ```

### Deployment
The application can be deployed using Docker for containerization. Ensure that the database configurations are correctly set in the environment variables.

You can access the app's Swagger documentation to explore the API endpoints and test them using the following URL:

[Swagger Documentation](http://20.5.110.156:3100/api/docs)



