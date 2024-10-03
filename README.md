# Habit Tracker Gamification App

This is a habit tracker app that uses gamification to help users stay motivated and consistent with their habits. The app allows users to create habits, set goals, and track their progress. Users can earn points for completing habits and use those points to unlock rewards. The app also includes a social feature that allows users to connect with friends and compete with each other.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [License](#license)

## Endpoints

### Habit Endpoints
- GET /habits
- POST /habits
- GET /habits/:id
- PUT /habits/:id
- DELETE /habits/:id
- GET /habits/:id/subhabits
- POST /habits/:id/subhabits
- GET /habits/:id/subhabits/:subhabitId
- PUT /habits/:id/subhabits/:subhabitId
- DELETE /habits/:id/subhabits/:subhabitId
- GET /habits/:id/progress
- POST /habits/:id/progress

### User Endpoints
- GET /users
- POST /users
- GET /users/:id
- PUT /users/:id
- DELETE /users/:id
- GET /users/:id/friends
- POST /users/:id/friends
- DELETE /users/:id/friends/:friendId


## Features
- Create habits
- Create subhabits
- Track progress
- Get Points
- Unlock rewards
- Connect with friends

## Technologies
- Node.js
- Express
- MongoDB

## Installation
1. Clone the repository
2. Install dependencies
`npm install`
3. Start the server
`npm run start`
4. Make requests to the API using Postman or a similar tool

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
