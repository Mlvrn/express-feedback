# Express + Sequelize (MySQL) - Feature Request System

Express.js + Sequelize Project for a feature request that features:

- User and admin registration
- Authentication & Authorization for admin and user role
- Change / forget password
- `POST` feedback
- `PUT` feedback status (admin only)
- `GET` users & feedback (admin restricted for some parts)
- `DELETE` feedback & user (admin only)

Workflow:

- User creates/sends a feedback about a certain product.
- The sent feedback's status is initially pending.
- Admin can edit the status (accept or reject the feedback).
- Admin can delete the feedback

Key technologies:

- Express
- Sequelize (MySQL2)
- Joi
- Bcryptjs
- JWT
- Nodemailer

---

# dotenv Configuration

## Environment Variables

- `PORT`: Port for server (e.g., `PORT=3000`).
- `SECRET_KEY`: For JWTs (e.g., `SECRET_KEY="av1HT#O7MeFhHrU"`).
- `EMAIL_ADDRESS`: Sender email (e.g., `EMAIL_ADDRESS="your_email@gmail.com"`).
- `PASSWORD`: Password for forget password feature (e.g., `PASSWORD="your_password"`).

**Note:** Use real values in your settings but keep them private.

## Run the server

To run the server, use the following command:

```
npm run dev
```

Make sure to have MySQL running on port 3306

## URL

_Server_

```
http://localhost:PORT
```

---

## Global Response

_Response (500 - Internal Server Error)_

```
{
  "error": "Internal Server Error"
}
```

_Response (400 - Authentication Error)_

```
{
    "error": "User is not authenticated"
}
```

_Response (403 - Admin Authorization Error)_

```
{
    "error": "Access forbidden. Admin authorization required."
}
```

---

# RESTful Endpoints

## User Endpoints

### GET /api/user/all

> Get all users

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
  <users_data>
]
 
```

---

### GET /api/user

> Get user profile

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "email": <email>,
    "username": <username>
}
```

---

### POST /api/user/register

> Register a new user

_Request Header_

```
not needed
```

_Request Body_

```
{
  "username": "<username>",
  "email": "<email>",
  "password": "<password>"
}
```

_Response (201)_

```
{
   <user_data>
}
```

_Response (400)_

```
{
   "error": "Username or email already exists"
}
```

_Response (400)_ - Joi Validation Error

```
{
    "message": "<input_field> is required"
}
{
    "message": "<input_field> must be a string"
}
{
    "message": "Username must be at least 3 characters long"
}
{
    "message": "Username cannot be more than 20 characters long"
}
{
    "message": "Username must only contain alphanumeric characters"
}
{
    "message": "Email must be a valid email"
}
{
    "message": "Password length must be at least 8 characters long"
}
```

---

### POST api/user/login

> User login

_Request Header_

```
not needed
```

_Request Body_

```
{
  "email": "<email>",
  "password": "<password>"
}
```

_Response (200)_

```
{
    "token": <token>,
    "message": "Login Successful!"
}
```

_Response (400)_

```
{
   "error": "Invalid email or password."
}
```

_Response (400)_ - Joi Validation Error

```
{
    "message": "<input_field> is required"
}
{
    "message": "Email must be a valid email"
}
```

---

### PUT api/user/profile/edit

> Edit user profile

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
{
    "username": <username>,
    "email": <email>
}
```

_Response (200)_

```
{
    "message": "Profile updated successfully",
    "user": <user_id>
}
```

_Response (400)_

```
{
    "error": "Username or email already exists"
}
```

_Response (400)_ - Joi Validation Error

```
{
    "message": "<input_field> must be a string"
}
{
    "message": "Username must be at least 3 characters long"
}
{
    "message": "Username cannot be more than 20 characters long"
}
{
    "message": "Username must only contain alphanumeric characters"
}
{
    "message": "Email must be a valid email"
}

```

---

### PUT api/user/profile/changePassword

> Change user password

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
{
    "oldPassword": <old_password>,
    "newPassword": <new_password>
}
```

_Response (200)_

```
{
    "message": "Password changed successfully"
}
```

_Response (401)_

```
{
    "error": "Old password is incorrect"
}
```

_Response (400)_ - Joi Validation Error

```
{
    "message": "<input_field> is required"
}
{
    "message": "New password must be at least 8 characters long"
}
```

---

### DELETE api/user/:userId

> Delete user by id

_Request Params_

```
<user_id>
```

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "deletedUser": {
        <user_data>
    },
    "message": "User Deleted Successfully."
}
```

_Response (404)_

```
{
    "error": "User not found.",
}
```

---

### POST api/user/forgotPassword

> Forgot password

_Request Body_

```
{
  "email" : <email>
}
```

_Request Header_

```
not needed
```

_Response (200)_

```
{
    "message": "Temporary password sent via email"
}
```

## Admin Endpoints

### POST /api/admin/register

> Register a new admin

_Request Header_

```
not needed
```

_Request Body_

```
{
  "username": "<username>",
  "email": "<email>",
  "password": "<password>"
}
```

_Response (201)_

```
{
   <admin_data>
}
```

_Response (400)_

```
{
   "error": "Username or email already exists"
}
```

_Response (400)_ - Joi Validation Error

```
{
    "message": "<input_field> is required"
}
{
    "message": "<input_field> must be a string"
}
{
    "message": "Username must be at least 3 characters long"
}
{
    "message": "Username cannot be more than 20 characters long"
}
{
    "message": "Username must only contain alphanumeric characters"
}
{
    "message": "Email must be a valid email"
}
{
    "message": "Password length must be at least 8 characters long"
}
```

---

### POST api/admin/login

> Admin login

_Request Header_

```
not needed
```

_Request Body_

```
{
  "email": "<email>",
  "password": "<password>"
}
```

_Response (200)_

```
{
    "token": <token>,
    "message": "Login Successful!"
}
```

_Response (400)_

```
{
   "error": "Invalid email or password."
}
```

_Response (400)_ - Joi Validation Error

```
{
    "message": "<input_field> is required"
}
{
    "message": "Email must be a valid email"
}
```

---

## Feedback Endpoints

### GET /api/feedback/all

> Get all feedbacks

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
  <feedbacks_data>
]
 
```

---

### GET /api/feedback/:feedbackId

> Get feedback by id

_Request Params_

```
<feedback_id>
```

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    <feedback_data>
}
```

_Response (404)_

```
{
    "error": "Feedback not found.",
}
```

---

### GET /api/feedback/myFeedbacks

> Get feedbacks by user id

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
    <feedbacks_data>
]

```

_Response (404)_

```
{
   "error": "No feedbacks found for the specified user"
}
```

---

### POST /api/feedback/create

> Create feedback

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
{
    "feedbackText": <feedback_text>,
    "details": <details>
}
```

_Response (200)_

```
{
    "createdFeedback": <feedback_data>
    "message": "Feedback created successfully!"
}
```

_Response (400)_ - Joi Validation Error

```
{
    "message": "<input_field> is required"
}
{
    "message": "Feedback must be at least 5 characters long"
}
{
    "message": "<input_field> must be a string"
}
```

---

### PUT /api/feedback/update/:feedbackId

> Update feedback status by id

_Request Params_

```
<feedback_id>
```

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
{
    "status": <status>
}
```

_Response (200)_

```
{
    <feedbacks_data>
}
```

_Response (404)_

```
{
   "error": "Feedback not found."
}
```

_Response (400)_ - Joi Validation Error

```
{
    "message": "Status is required"
}
{
    "message": "Invalid status. Allowed values: pending, accepted, rejected"
}
{
    "message": "Status must be a string"
}
```

---

### DELETE api/feedback/delete/:feedbackId

> Delete feedback by id

_Request Params_

```
<feedback_id>
```

_Request Header_

```
Authorization: Bearer <token>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "deletedFeedback" : <feedback_data>
    "message": "Feedback deleted successfully!"
}
```

_Response (404)_

```
{
   "error": "Feedback not found."
}
```

---
