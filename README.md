## API Documentation

### POST `/auth/register`

Registers a new user.

#### Request Body

Send a JSON object with the following fields:

```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

- `fullname` (string, required): Full name, minimum 3 characters, maximum 30.
- `email` (string, required): Valid email address.
- `password` (string, required): Minimum 6 characters.

#### Responses

- **201 Created**

  - Registration successful.
  - Example:
    ```json
    {
      "success": true,
      "data": {
        "_id": "user_id",
        "fullname": "John Doe",
        "email": "john@example.com"
        // other user fields
      },
      "message": "User registered successfully."
    }
    ```

- **400 Bad Request**

  - Validation failed or user already exists.
  - Example:
    ```json
    {
      "success": false,
      "error": {
        "message": "Invalid request body",
        "code": 400
      },
      "fields": [{ "name": "email", "message": "Invalid email format" }]
    }
    ```

- **500 Internal Server Error**
  - Server error.
  - Example:
    ```json
    {
      "success": false,
      "message": "Error message",
      "stack": "Error stack trace (not in production)"
    }
    ```

#### Example Usage

```sh
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":"John Doe","email":"john@example.com","password":"yourpassword"}'
```

---

### POST `/auth/login`

Logs in an existing user.

#### Request Body

Send a JSON object with the following fields:

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

- `email` (string, required): Valid email address.
- `password` (string, required): Minimum 6 characters.

#### Responses

- **200 OK**

  - Login successful.
  - Example:
    ```json
    {
      "success": true,
      "data": {
        "_id": "user_id",
        "fullname": "John Doe",
        "email": "john@example.com"
        // other user fields
      },
      "message": "User logged in successfully.",
      "token": "jwt_token"
    }
    ```

- **400 Bad Request**

  - Validation failed or invalid credentials.
  - Example:
    ```json
    {
      "success": false,
      "error": {
        "message": "Invalid credentials",
        "code": 400
      },
      "fields": [
        {
          "name": "email",
          "message": "User not found with this email or phone"
        },
        { "name": "password", "message": "Password is incorrect" }
      ]
    }
    ```

- **500 Internal Server Error**
  - Server error.
  - Example:
    ```json
    {
      "success": false,
      "message": "Error message",
      "stack": "Error stack trace (not in production)"
    }
    ```

#### Example Usage

```sh
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"yourpassword"}'
```

---

### GET `/auth/profile`

Retrieves the authenticated user's profile.

#### Request

- Requires authentication (JWT token in cookie or Authorization header).

#### Responses

- **200 OK**

  - Profile retrieved successfully.
  - Example:
    ```json
    {
      "success": true,
      "data": {
        "_id": "user_id",
        "fullname": "John Doe",
        "email": "john@example.com"
        // other user fields
      },
      "message": "User profile retrieved successfully."
    }
    ```

- **401 Unauthorized**

  - Missing or invalid token.
  - Example:
    ```json
    {
      "success": false,
      "message": "Authentication required."
    }
    ```

#### Example Usage

```sh
curl -X GET http://localhost:4000/auth/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

### POST `/auth/logout`

Logs out the current user and blacklists the JWT token.

#### Description

- The endpoint will blacklist the user's JWT token for 24 hours, preventing reuse.
- The token is removed from cookies and stored in the blacklist collection.

#### Request

- Requires authentication (JWT token in cookie or Authorization header).

#### Responses

- **200 OK**

  - Logout successful.
  - Example:
    ```json
    {
      "success": true,
      "message": "Logged out successfully."
    }
    ```

#### Example Usage

```sh
curl -X POST http://localhost:4000/auth/logout \
  -H "Authorization: Bearer <jwt_token>"
```

---

### POST `/captains/register`

Registers a new captains (driver).

#### Request Body

Send a JSON object with the following fields:

```json
{
  "fullname": "Jane Doe",
  "email": "jane@example.com",
  "password": "yourpassword",
  "vehicle": {
    "vehicleType": "car",
    "plateNumber": "ABC-1234",
    "color": "red",
    "capacity": 4
  }
}
```

- `fullname` (string, required): Full name, minimum 3 characters, maximum 30.
- `email` (string, required): Valid email address.
- `password` (string, required): Minimum 6 characters.
- `vehicle.vehicleType` (string, required): One of `"car"`, `"bike"`, `"truck"`, `"cng"`.
- `vehicle.plateNumber` (string, required): Unique vehicle plate number.
- `vehicle.color` (string, required): Vehicle color.
- `vehicle.capacity` (number, required): Minimum 1.

#### Responses

- **201 Created**

  - Registration successful.
  - Example:
    ```json
    {
      "success": true,
      "data": {
        "_id": "captain_id",
        "fullname": "Jane Doe",
        "email": "jane@example.com",
        "vehicle": {
          "vehicleType": "car",
          "plateNumber": "ABC-1234",
          "color": "red",
          "capacity": 4
        }
        // other captain fields
      },
      "message": "Captain registered successfully."
    }
    ```

- **400 Bad Request**

  - Validation failed or captain already exists.
  - Example:
    ```json
    {
      "success": false,
      "error": {
        "message": "Invalid request body",
        "code": 400
      },
      "fields": [{ "name": "email", "message": "Invalid email format" }]
    }
    ```

- **500 Internal Server Error**
  - Server error.
  - Example:
    ```json
    {
      "success": false,
      "message": "Error message",
      "stack": "Error stack trace (not in production)"
    }
    ```

#### Example Usage

```sh
curl -X POST http://localhost:4000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname":"Jane Doe",
    "email":"jane@example.com",
    "password":"yourpassword",
    "vehicle":{
      "vehicleType":"car",
      "plateNumber":"ABC-1234",
      "color":"red",
      "capacity":4
    }
  }'
```

---

### GET `/captain/profile`

Retrieves the authenticated captain's profile.

#### Request

- Requires authentication (JWT token in cookie or Authorization header).

#### Responses

- **200 OK**

  - Profile retrieved successfully.
  - Example:
    ```json
    {
      "success": true,
      "data": {
        "_id": "captain_id",
        "fullname": "Jane Doe",
        "email": "jane@example.com",
        "vehicle": {
          "vehicleType": "car",
          "plateNumber": "ABC-1234",
          "color": "red",
          "capacity": 4
        }
        // other captain fields
      },
      "message": "Captain profile retrieved successfully."
    }
    ```

- **401 Unauthorized**

  - Missing or invalid token.
  - Example:
    ```json
    {
      "success": false,
      "message": "Authentication required."
    }
    ```

#### Example Usage

```sh
curl -X GET http://localhost:4000/captain/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

### POST `/captain/logout`

Logs out the current captain and blacklists the JWT token.

#### Description

- The endpoint will blacklist the captain's JWT token for 24 hours, preventing reuse.
- The token is removed from cookies and stored in the blacklist collection.

#### Request

- Requires authentication (JWT token in cookie or Authorization header).

#### Responses

- **200 OK**

  - Logout successful.
  - Example:
    ```json
    {
      "success": true,
      "message": "Logged out successfully."
    }
    ```

#### Example Usage

```sh
curl -X POST http://localhost:4000/captain/logout \
  -H "Authorization: Bearer <jwt_token>"
```

---

### Blacklist Feature

- Blacklisted tokens are stored in the database for 24 hours.
- Any request with a blacklisted token will be denied.
- This prevents reuse of tokens after logout for improved security.

---
