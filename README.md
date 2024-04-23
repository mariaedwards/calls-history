# Calls History

## Task

**Objective:**

- Part 1: Develop a RESTful API using Python (and preferably Django) that returns
dummy call history data for a given phone number.
- Part 2: Create a Next.js application that fetches call history data using the swr library
and displays it on a page.

**Part 1**
The API should expose the call history for a given phone number using dummy data.
Each record should include the time of the call, counterparty phone number, call status
('Completed Inbound', 'Missed Inbound', 'Completed Outbound', 'Missed Outbound'),
and duration in seconds (for completed calls).

You have the flexibility to design the API according to your preferences. Below is an
example to illustrate a possible approach for this endpoint:

GET `/calls/<phone_number>`

**Response:**

```json
[
{
"created_at": "2024-01-31T10:00:00Z",
"counterparty": "+13333333333",
"type": "Completed Inbound",
"duration": "37.4"
},
{
"created_at": "2024-01-31T11:00:00Z",

"counterparty": "+14444444444",
"type": "Missed Outbound"
}
]
```

**Part 2**
The Next.js application should display a page that displays the call history of a phone
number by going to /calls/<phone_number>

There’s no need for user authentication in this project.

## Implementation

### API Server

1. Set up project structure and install Django and Django REST framework.

Django is a requirement for this project. I chose to integrate the Django REST framework due to its robustness and flexibility as a toolkit for building Web APIs. It enhances Django's capabilities, facilitating the creation of APIs that can interact with other services or serve as the backend for front-end applications, especially in Single Page Application (SPA) architectures that use frameworks like React or Angular.

2. Add Docker and PostgreSQL

**Prerequisites**: Docker must be installed.

Although Docker and PostgreSQL were not explicitly required, I opted to utilize Docker to ensure a consistent, isolated environment that simplifies setup and facilitates scaling, thereby guaranteeing that the application runs seamlessly on any system. Additionally, I chose PostgreSQL for the database to bring the solution closer to production readiness, demonstrating a commitment to robust and scalable architecture.

3. Models
 To effectively manage phone numbers within the system, I've integrated the [django-phonenumber-field](https://django-phonenumber-field.readthedocs.io/en/latest/#django-phonenumber-field). This choice was driven by the library's robust handling of international phone number formats and its seamless integration with Django, ensuring that our application adheres to global standards and improves data validity.

Architecture Decision
To ensure optimal database normalization and maintainability, I designed a dedicated PhoneNumber model separate from the CallHistory model. This architectural decision helps in segregating responsibilities within the system, leading to cleaner code and easier scalability. The PhoneNumber model exclusively manages phone number details, while the CallHistory model tracks the call-related data, thereby simplifying data management and enhancing the database's performance.

Data Population
The dummy data required for initial testing and simulation purposes is generated through a script located in the `api/` folder.