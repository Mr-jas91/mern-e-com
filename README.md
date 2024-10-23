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

This is an e-commerce application built using Vite with React for the frontend and Express for the backend. The application provide feature to make a order and track the order.

The backend handles authentication using JWT for token generation and bcrypt for password hashing. The application includes login, logout, and signup functionalities.

## Features

- User authentication (signup, login, logout, currentuser)
- Password hashing using bcrypt
- Token-based authentication using JWT

## Technologies Used

- Frontend:
  - Vite
  - React
- Backend:
  - Express
  - JWT (JSON Web Tokens)
  - bcrypt

## Setup and Installation

### backend .env sample

```sh
PORT = "5000"
ACCESS_TOKEN_SECRET = "YOUR SECRET TOKEN"
ACCESS_TOKEN_EXPIRY= "1d"
REFRESH_TOKEN_SECRET = "YOUR SECRET TOKEN"
REFRESH_TOKEN_EXPIRY = "10d"
MONGODB_URI = "YOUR MONGODB URL"
allowedOrigin = "http://localhost:5173"
CLOUDINARY_CLOUD_NAME = "YOUR CLOUDINARY UNIQUE NAME"
CLOUDINARY_API_KEY = "YOUR CLOUDINARY API KEY"
CLOUDINARY_API_SECRET = "YOUR CLOUDINARY API SECRET TOKEN"
```

### backend .env sample

```sh
VITE_REDUX_DEVTOOLS = development
VITE_API_URL= "http://localhost:8000/api"
```

### Prerequisites

- Node.js (v14.x or later)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Mr-jas91/mern-e-com.git
   cd mern-e-com

   ```

2. Install dependencies for both frontend and backend:

- For the frontend:

```sh
cd frontend
npm install

```

- for backend

```sh
cd backend
npm install
```

## Run the Project

1. Start the backend server:

```sh
cd backend
npm start
```

2. Start the frontend server:

```sh
cd frontend
npm run dev
```

The user interface will be running on http://localhost:5173.

## Usage

### User Interface

Visit http://localhost:5173 to access the user interface.
Users can sign up, log in, and log out using the provided functionalities.

<!-- ### Admin Interface
Visit http://admin.localhost:3000 to access the admin interface.
Admins can manage the e-commerce platform through this interface. -->

### Project admin

Jasvant maddheshiya

## License

This project is licensed under the MIT License. See the LICENSE file for details.
