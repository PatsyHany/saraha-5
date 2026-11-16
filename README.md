
# Saraha Backend App

Backend application built using Node.js and Express.js.

## Technologies
- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis
- JWT Authentication
- Multer
- Nodemailer

## Installation

1. Clone the repository:

   git clone REPOSITORY_URL

2. Navigate to the project folder:

   cd Saraha-Backend-App

3. Install dependencies:

   npm install

4. Create your development environment file:

   Copy .env.example to .env.dev

5. Configure your environment variables:
   - MongoDB Atlas connection string
   - Redis connection URL
   - JWT secrets
   - Encryption key
   - Email credentials (if email features are needed)

## Run the application

Development:

npm run start:dev

Production:

npm run start:prod

## Environment Variables

See .env.example for the required configuration variables.

Never commit real environment files or secrets.

## License

ISC
