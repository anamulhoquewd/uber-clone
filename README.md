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
