# Proposal: Using HAPI FHIR JPA Server

## Why HAPI FHIR JPA Server instead of a natively built FHIR server?

- **Rapid development:** The Hapi FHIR JPA server provides a pre-built server that can be easily configured to serve FHIR resources, reducing the development time required to build a native FHIR server.

- **FHIR compliance:** The Hapi FHIR JPA server is fully compliant with the FHIR standard, which ensures interoperability with other FHIR-compliant systems.

- **Maturity and stability:** The Hapi FHIR JPA server is a mature and stable platform that has been used in production for many years. It has a large community of users and contributors, which means that bugs are quickly identified and fixed.

- **Schemas pre-built:** The Hapi FHIR JPA server provides pre-built schemas for common FHIR resources, which reduces the development time required to build a native FHIR server.

- **Available as a Docker image**

- **Active community, well maintained**

## Why is PostgreSQL (or any SQL) preferred instead of MongoDB (or any NoSQL), in the context of FHIR?

- **Data Structure**
FHIR data is structured as a set of resources, where each resource represents a clinical concept such as a patient, medication, or diagnostic report. PostgreSQL is better suited for structured data with complex relationships, as it has support for relational data modeling and transaction management, whereas MongoDB is a document-oriented database that stores data as JSON-like documents, which may not be as suitable for complex relationships between resources.

- **Query Flexibility**
PostgreSQL provides a flexible query language with a wide range of features, such as joins, subqueries, and window functions, which can be useful for complex queries on FHIR data. MongoDB also provides a flexible query language, but its features are more geared towards document-oriented data modeling and may not be as suitable for complex joins and aggregations.

- **HAPI FHIR Support**
HAPI FHIR provides built-in support for PostgreSQL as a storage backend, which simplifies implementation and reduces the risk of compatibility issues between the framework and the database. Although HAPI FHIR also supports MongoDB as a backend, this support is not as well-developed as the PostgreSQL support. FHIR community support for MongoDB is also not strong unlike for PostgreSQL, which may make it more difficult to find answers to questions or resolve issues.

## Why use fhir-kit-client

- **NPM package health:** Nearly 6k weekly downloads, 73% health score on Snyk, active community, and 0 vulnerabilities.

- **Ease of use:** fhir-kit-client is a simple, lightweight, and easy-to-use client library for the HAPI FHIR JPA server. It provides a simple API for interacting with the server, which makes it easy to build applications that use FHIR resources.

- **TypeScript support**

- **Supports all FHIR REST operations**

- **Support for absolute, in-bundle, and contained references**

- **Pagination support**
