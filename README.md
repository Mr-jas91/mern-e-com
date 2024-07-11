


# E-Commerce Project

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributors](#contributors)
- [License](#license)

## Project Description

This is an e-commerce application built using Vite with React for the frontend and Express for the backend. The application has separate interfaces for users and admins. The frontend is split into two parts, one for users and one for admins. 

- The user interface can be accessed at `localhost:3000`.
- The admin interface can be accessed at `admin.localhost:3000`.

The backend handles authentication using JWT for token generation and bcrypt for password hashing. The application includes login, logout, and signup functionalities.

## Features

- User authentication (signup, login, logout)
- Password hashing using bcrypt
- Token-based authentication using JWT
- Separate interfaces for users and admins

## Technologies Used

- Frontend:
  - Vite
  - React
- Backend:
  - Express
  - JWT (JSON Web Tokens)
  - bcrypt

## Setup and Installation

### Prerequisites

- Node.js (v14.x or later)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-directory>

2. Install dependencies for both frontend and backend:
- For the frontend:

```sh
cd frontend
npm install

```
- for backend
```shcd backend
npm install
```

## Running the Project

1. Start the backend server:
```sh
cd backend
npm start
```
The backend server will be running on http://localhost:5000.

2. Start the frontend server:

```sh
cd frontend
npm start
```
The user interface will be running on http://localhost:3000.

## Usage
### User Interface
Visit http://localhost:3000 to access the user interface.
Users can sign up, log in, and log out using the provided functionalities.
### Admin Interface
Visit http://admin.localhost:3000 to access the admin interface.
Admins can manage the e-commerce platform through this interface.
### Contributors
Jasvant maddheshiya

## License
This project is licensed under the MIT License. See the LICENSE file for details.