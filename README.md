# AD Products API

## Overview

This project is a backend service for managing product data. It fetches data from Contentful, inserts it into a MongoDB database, and provides both public and private endpoints for interacting with the data.

## Setup

### Prerequisites

1. **Docker**: Make sure Docker is installed on your system.
2. **Node.js**: Ensure Node.js is installed if you plan to run the application locally without Docker.

### Environment Variables

#### Run Locally

Create a file named `.env` in the root directory with the following content:

```env
# API Settings
API_PORT=

# Database
MONGODB_URI=mongodb://mongodb:27017/ad_db

# Contentful API
CONTENTFUL_URL=https://cdn.contentful.com
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_ENVIRONMENT=
CONTENTFUL_CONTENT_TYPE=

# Authentication
JWT_SECRET=a7538105-062a-43aa-b0d8-c309a1630a7e
```

Add the access needed to interact with the Contentful API, as this is a public repository no keys will be exposed here.

**Note:** Don't worry about JWT_SECRET, trust me, it's a necessary variable for the app but sharing its value doesn't compromise the information.

#### Dockerfile

You should customize the '.env.docker' file with the information mentioned above, this is a template you can use to be sure of the name of the variables, remember that for this you need to have MongoDB running on your local computer. if you don't have it check the next section.

```sh
docker run -p 5100:3000 --env-file .env.docker ad-products-api
```

#### Docker Compose

Build and Run the Application, Open a terminal and navigate to the project directory. Run the following command to build and start the services:

```sh
docker-compose up --build
```

This command starts the application and MongoDB services. The application will be available at `http://localhost:3100`.

### Populate the Database for the First Time

The application is configured to fetch data from Contentful every hour. To manually trigger data fetching and populate the database, you can use the public endpoint:

```sh
curl -X POST http://localhost:3100/api/public/products/fetch
```

**Note:** This endpoint can be used at any time not only at the beginning, its objective is to synchronize products on demand. Remember the port may vary depending on how you are running the application, please check before calling this service.

### Swagger

The API documentation is available at `http://localhost:3100/api/docs`

### Authentication

This endpoint is part of the "Internal" tag. For the purpose of this project, you don’t need a username or password. Each time you call this service, it will provide you with a JWT token that is valid for 3 hours. This token is required to access the private endpoints.

#### Sign In

`GET /api/internal/auth/sign-in`
Authenticates and returns a JWT token.

### Assumptions

For this project, the Product SKU is used as the primary identifier for products. During each synchronization with the API, products are added to the database. When a product is deleted, it is marked as deleted using its Product SKU. This approach allows us to:

- Track products that have been deleted.
- Ensure that deleted products are not included in future synchronizations.
