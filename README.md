# Running the App
The application is fully containerized using Docker. Follow these steps to run the app using Docker:
1. Clone the repository and navigate to the root directory.
2. Execute the build and deployment command:
```bash
    docker compose up --build -d
```
3. Access the API using the ports displayed on the docker container.

# Table of Contents
- [1. Introduction](#1-introduction)
  - [1.1 Current Features](#11-current-features)
  - [1.2 Upcoming Features](#12-upcoming-features)
- [2. Tech Stack](#2-tech-stack)
  - [2.1 Front-end](#21-front-end)
  - [2.2 Back-end](#22-back-end)
    - [2.2.1 Server](#221-server)
      - [2.2.1.1 OpenAPI Docs](#2211-openapi-docs)
    - [2.2.2 Database](#222-database)
        - [2.2.2.1 ER Diagram](#2221-er-diagram)
  - [2.3 Authentication and Authorization](#23-authentication-and-authorization)
    - [2.3.1 Authentication - Basic Auth](#231-authentication---basic-auth)
    - [2.3.2 Password Storage](#232-password-storage)
  - [2.4 Deployment](#24-deployment)

# 1. Introduction
This project is a Spring Boot app I made to learn Java Spring and other technologies connected to it. I learned important concepts regarding
the architecture used to develop web apps, and a great deal about dependency inversion and injection.

## 1.1 Current Features
I created some basic interaction use cases, but I wanted to focus on learning Java Spring, and not be overly encumbered by the use cases 
and their logic. Currently, the scope of the project is limited to:
- Registering/Logging in Users
- CRUD Operations for Books
- Checking in/out Books
- Admin users to moderate the library (create/update/delete).

## 1.2 Upcoming Features
In the future, I hope to work more on this and include:
- Kiosk users for checking in/out books.
- ISBN numbers and categorizing books.
- Real data imports from books

# 2. Tech Stack

React will be used for the frontend, and Java Spring Boot and Postgres are used for the backend.

## 2.1 Front-end
The frontend uses Vite along with React Router for navigating to different pages. Docs for both are linked below:
- [Vite](https://vite.dev/guide/)
- [React Router](https://reactrouter.com/start/data/routing)
- Also [Tailwind](https://tailwindcss.com/docs/installation/using-vite) is used alongside some [ShadCN components](https://ui.shadcn.com/docs/components)

## 2.2 Back-end
This project is a Spring Boot app I made to learn Java Spring and other technologies connected to it. It uses a Spring Boot API, along with
Spring Security, Spring Data JPA (Hibernate), and a Postgres Docker container for storing the data.

### 2.2.1 Server


The server is architected using the de-facto Java Spring architecture. It splits responsibilities into 4 different types of classes: Model,
Repository, Service, and Controller. This structure allows for a clean folder structure, and clear seperation of responsibilities between
different sections of the code. Additionally, with the automatic dependency injection, the structure allows for a very maintainable and testable
codebase.

#### 2.2.1.1 OpenAPI Docs
To view the api routes and openAPI docs, you may click the link at the bottom of the home page, or visit:
```
http://{server-ip}:8080/swagger-ui/index.html
```

### 2.2.2 Database
The database being used is a PostgresDB, and the server uses the Spring Data JPA with Hibernate to interact with the Database.

#### 2.2.2.1 ER Diagram
![ER Diagram of the current implementation in the database](./backend/docs/er_diagram.png)

## 2.3 Authentication and Authorization
The security posture of this API relies on Spring Security.

### 2.3.1 Authentication - Basic Auth
**JWT Access Tokens** are used within this project using a custom JwtAuthenticationFilter added on to the SecurityFilterChain. Cross-Site Request Forgery (CSRF) protection and Session Management (JSESSIONID) are intentionally disabled. The API requires the client to provide their access token on every request.

### 2.3.2 Password Storage
**Raw passwords are never stored in the database.** The system utilizes a BCryptPasswordEncoder to hash user credentials before persistence, neutralizing the threat of database leaks.

## 2.4. Deployment
TODO