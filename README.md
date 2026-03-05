# Library System API

## Table of Contents
TODO

---

## Run the app
The application is fully containerized using Docker. Follow these steps to run the app using Docker:
1. Clone the repository and navigate to the root directory.
2. Execute the build and deployment command:
```bash
    docker compose up --build -d
```
3. Access the api using the ports displayed on the docker container

## 1. Introduction
This project is a Spring Boot app I made to learn Java Spring and other technologies connected to it. I learned important concepts regarding
the architecture used to develop web apps, and a great deal about dependency inversion and injection.

### 1.1 Current Features
I created some basic interaction use cases, but I wanted to focus on learning Java Spring, and not be overly encumbered by the use cases 
and their logic. Currently, the scope of the project is limited to:
- Registering/Logging in Users
- CRUD Operations for Books
- Checking in/out Books

### 1.2 Upcoming Features
In the future, I hope to work more on this and include:
- Kiosk users for checking in/out books.
- Admin users to moderate the library.
- ISBN numbers and categorizing books.
- Real data imports from books

## 2. Tech Stack

React is used for the frontend, and Java Spring Boot and Postgres are used for the backend.

### 2.1 Front-end
TBD

### 2.2 Back-end

This project is a Spring Boot app I made to learn Java Spring and other technologies connected to it. It uses a Spring Boot API, along with
Spring Security, Spring Data JPA (Hibernate), and a Postgres Docker container for storing the data.

#### 2.2.1 Server
TBD

#### 2.2.2 Database
TBD

### 2.3 Authentication and Authorization
The security posture of this API relies on Spring Security.

#### 2.3.1 Authentication - Basic Auth
**Stateless Basic Auth** is used within this project currently as the main auth mechanism. Cross-Site Request Forgery (CSRF) protection and Session Management (JSESSIONID) are intentionally disabled. The API requires the client to pass standard HTTP Basic Authentication headers on every secured request, preventing session hijacking vulnerabilities.

#### 2.3.2 Password Storage
**Raw passwords are never stored in the database.** The system utilizes a BCryptPasswordEncoder to hash user credentials before persistence, neutralizing the threat of database leaks.

### 2.4. Deployment
TODO