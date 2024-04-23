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
1. Set up project structure and install Django and Django REST framework.

   Django is a requirement, where Django REST framework was chosen because it is a powerful and flexible toolkit for building Web APIs on top of Django. It extends Django's abilities, allowing you to create APIs that can communicate with other services or power your front-end applications, particularly in a SPA (Single Page Application) architecture using frameworks like React or Angular.