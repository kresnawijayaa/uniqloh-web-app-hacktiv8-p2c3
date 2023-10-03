# Uniqloh App Server

Uniqloh is an application to manage your clothes. This app has :

- RESTful endpoint for asset's CRUD operation
- JSON formatted response

&nbsp;

## RESTful endpoints

### POST /register

> Create account

_Request Header_

```
not needed
```

_Request Body_

```
{
    "username": "kresna",
    "email": "kresna@mail.com",
    "password": "kresna123",
    "phoneNumber": "+6280123",
    "address": "Jakarta, Indonesia"
}
```

_Response (200)_

```
{
    "id": 1,
    "email": "kresna@mail.com"
}
```

_Response (500)_

```
{
    "message": "Internal Server Error"
}
```

---

### POST /login

> Login account

_Request Header_

```
not needed
```

_Request Body_

```
{
    "email": "kresna@mail.com",
    "password": "kresna123"
}
```

_Response (200)_

```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJrcmVzbmE5OTlAbWFpbC5jb20iLCJpYXQiOjE2OTE4MjQyOTN9.k4XLx-JMoAhppDlhOA7XEqOC5_AvF_oAwp9P8UxTQRY",
    "user": {
        "id": 1,
        "username": "kresna",
        "email": "kresna123@mail.com",
        "password": "$2a$10$ZgCv8tkEHg/FOEXpSNtN.eLe6A6rHMUjN.EPYSFN7dTmJ31J5RvDG",
        "role": "admin",
        "phoneNumber": "+62801010202",
        "address": "Palmerah, Jakarta Barat",
        "createdAt": "2023-08-12T07:04:18.077Z",
        "updatedAt": "2023-08-12T07:04:18.077Z"
    }
}
```

_Response (500)_

```
{
    "message": "Internal Server Error"
}
```

---

### POST /google-login

> Login account

_Request Header_

```
{
    "google_token" : "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJrcmVzbmE5OTlAbWFpbC5jb20iLCJpYXQiOjE2OTE4MjQyOTN9.k4XLx-JMoAhppDlhOA7XEqOC5_AvF_oAwp9P8UxTQRY",
    "user": {
        "id": 1,
        "username": "kresna",
        "email": "kresna123@mail.com",
        "password": "$2a$10$ZgCv8tkEHg/FOEXpSNtN.eLe6A6rHMUjN.EPYSFN7dTmJ31J5RvDG",
        "role": "staff",
        "phoneNumber": "+62801010202",
        "address": "Palmerah, Jakarta Barat",
        "createdAt": "2023-08-12T07:04:18.077Z",
        "updatedAt": "2023-08-12T07:04:18.077Z"
    }
}
```

_Response (500)_

```
{
    "message": "Internal Server Error"
}
```

---

### GET /products

> Get all products

_Request Header_

```
{
    "access_token" : "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
    {
        "id": 1,
        "name": "Basic T-Shirt",
        "description": "A comfortable and versatile basic t-shirt.",
        "price": 25,
        "stock": 100,
        "imgUrl": "https://example.com/basic-tshirt.jpg",
        "categoryId": 1,
        "authorId": 4,
        "createdAt": "2023-08-07T10:45:57.917Z",
        "updatedAt": "2023-08-07T10:45:57.917Z"
    },
    {
        "id": 2,
        "name": "Slim-Fit Jeans",
        "description": "Classic slim-fit jeans with a perfect fit.",
        "price": 50,
        "stock": 50,
        "imgUrl": "https://example.com/slim-fit-jeans.jpg",
        "categoryId": 2,
        "authorId": 5,
        "createdAt": "2023-08-07T10:45:57.917Z",
        "updatedAt": "2023-08-07T10:45:57.917Z"
    }
]
```

_Response (500 - Internal Server Error)_

```
{
    "message": "Internal Server Error"
}
```

---

### GET /products/:id

> Get product by id

_Request Header_

```
{
    "access_token" : "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "id": 1,
    "name": "Basic T-Shirt",
    "description": "A comfortable and versatile basic t-shirt.",
    "price": 25,
    "stock": 100,
    "imgUrl": "https://example.com/basic-tshirt.jpg",
    "categoryId": 1,
    "authorId": 4,
    "createdAt": "2023-08-07T10:45:57.917Z",
    "updatedAt": "2023-08-07T10:45:57.917Z"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Product not found"
}
```

---

### POST /products

> Create new products

_Request Header_

```
{
    "access_token" : "string"
}
```

_Request Body_

```
{
    "name": "Test User 2",
    "description": "Bla bla bla",
    "price": 999,
    "stock": 100,
    "imgUrl": "http://placekitten.com/200/300",
    "categoryId": 4
}
```

_Response (201 - Created)_

```
{
    "id": 10,
    "name": "Hoodie New New",
    "description": "New new hoodie, a comfortable and versatile basic hoodie.",
    "price": 120,
    "stock": 10,
    "imgUrl": "https://example.com/basic-hoodie.jpg",
    "categoryId": 4,
    "authorId": 1,
    "updatedAt": "2023-08-08T03:46:54.281Z",
    "createdAt": "2023-08-08T03:46:54.281Z"
}
```

_Response (400 - Bad Request)_

```
{
    "message": "The minimum price is $20"
}
```

_Response (400 - Bad Request)_

```
{
    "message": "Name required."
}
```

_Response (400 - Bad Request)_

```
{
    "message": "Description required."
}
```

_Response (400 - Bad Request)_

```
{
    "message": "Price required."
}
```

---

### DELETE /products/:id

> Delete product by id

_Request Header_

```
{
    "access_token" : "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Hoodie Blekping success to delete"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Product not found"
}
```

---

### GET /categories

> Get all categories

_Request Header_

```
{
    "access_token" : "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
    {
        "id": 1,
        "name": "T-Shirt",
        "createdAt": "2023-08-07T10:45:57.907Z",
        "updatedAt": "2023-08-07T10:45:57.907Z"
    },
    {
        "id": 2,
        "name": "Jeans",
        "createdAt": "2023-08-07T10:45:57.907Z",
        "updatedAt": "2023-08-07T10:45:57.907Z"
    }
]
```

_Response (500 - Internal Server Error)_

```
{
    "message": "Internal Server Error"
}
```

---

### GET /products/history

> Get all products history

_Request Header_

```
{
    "access_token" : "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
    {
        "id": 3,
        "name": "Baju 2",
        "description": "Product status with id 10 has been updated from Archived into Active",
        "updatedBy": "kresna1@mail.com",
        "createdAt": "2023-08-14T08:50:30.703Z",
        "updatedAt": "2023-08-14T08:50:30.703Z"
    },
    {
        "id": 2,
        "name": "Baju 2",
        "description": "Product with id 10 updated",
        "updatedBy": "kresna1@mail.com",
        "createdAt": "2023-08-14T08:50:22.487Z",
        "updatedAt": "2023-08-14T08:50:22.487Z"
    },
    {
        "id": 1,
        "name": "Baju 1",
        "description": "Product status with id 10 has been updated from Active into Archived",
        "updatedBy": "kresna1@mail.com",
        "createdAt": "2023-08-14T08:49:41.477Z",
        "updatedAt": "2023-08-14T08:49:41.477Z"
    }
]
```

_Response (500 - Internal Server Error)_

```
{
    "message": "Internal Server Error"
}
```

---

### PUT /products/:id

> Get all products history

_Request Header_

```
{
    "access_token" : "string"
}
```

_Request Body_

```
{
    "name": "Baju 3",
    "description": "Baju polos dengan motif sederhana",
    "price": 99
    "stock": 100,
    "imgUrl": "http://placekitten.com/200/300",
    "categoryId": 4
}
```

_Response (200)_

```
`Product with id ${id} updated`
```

_Response (500 - Internal Server Error)_

```
{
    "message": "Internal Server Error"
}
```

---

### PATCH /products/:id

> Get all products history

_Request Header_

```
{
    "access_token" : "string"
}
```

_Request Body_

```
{
    "status" : "Archived"
}
```

_Response (200)_

```
  `Product status with id ${id} has been updated from ${oldStatus} into ${status}`
```

_Response (500 - Internal Server Error)_

```
{
    "message": "Internal Server Error"
}
```

---

### POST /pub/register

> Create account

_Request Header_

```
not needed
```

_Request Body_

```
{
    "username": "kresna",
    "email": "kresna@mail.com",
    "password": "kresna123",
}
```

_Response (200)_

```
{
    "id": 1,
    "email": "kresna@mail.com"
}
```

_Response (500)_

```
{
    "message": "Internal Server Error"
}
```

---

### POST /pub/login

> Login account

_Request Header_

```
not needed
```

_Request Body_

```
{
    "email": "kresna@mail.com",
    "password": "kresna123"
}
```

_Response (200)_

```
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJrcmVzbmE5OTlAbWFpbC5jb20iLCJpYXQiOjE2OTE4MjQyOTN9.k4XLx-JMoAhppDlhOA7XEqOC5_AvF_oAwp9P8UxTQRY",
    "user": {
        "id": 1,
        "username": "kresna",
        "email": "kresna123@mail.com",
        "password": "$2a$10$ZgCv8tkEHg/FOEXpSNtN.eLe6A6rHMUjN.EPYSFN7dTmJ31J5RvDG",
        "role": "customer",
        "createdAt": "2023-08-12T07:04:18.077Z",
        "updatedAt": "2023-08-12T07:04:18.077Z"
    }
}
```

_Response (500)_

```
{
    "message": "Internal Server Error"
}
```

---

### GET /pub/products

> Get all products

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
    {
        "id": 1,
        "name": "Basic T-Shirt",
        "description": "A comfortable and versatile basic t-shirt.",
        "price": 25,
        "stock": 100,
        "imgUrl": "https://example.com/basic-tshirt.jpg",
        "categoryId": 1,
        "authorId": 4,
        "createdAt": "2023-08-07T10:45:57.917Z",
        "updatedAt": "2023-08-07T10:45:57.917Z"
    },
    {
        "id": 2,
        "name": "Slim-Fit Jeans",
        "description": "Classic slim-fit jeans with a perfect fit.",
        "price": 50,
        "stock": 50,
        "imgUrl": "https://example.com/slim-fit-jeans.jpg",
        "categoryId": 2,
        "authorId": 5,
        "createdAt": "2023-08-07T10:45:57.917Z",
        "updatedAt": "2023-08-07T10:45:57.917Z"
    }
]
```

_Response (500 - Internal Server Error)_

```
{
    "message": "Internal Server Error"
}
```

---

### GET pub/products/:id

> Get product by id

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "id": 1,
    "name": "Basic T-Shirt",
    "description": "A comfortable and versatile basic t-shirt.",
    "price": 25,
    "stock": 100,
    "imgUrl": "https://example.com/basic-tshirt.jpg",
    "categoryId": 1,
    "authorId": 4,
    "createdAt": "2023-08-07T10:45:57.917Z",
    "updatedAt": "2023-08-07T10:45:57.917Z"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Product not found"
}
```

---

### GET pub/favorites

> Get all products

_Request Header_

```
{
    "access_token" : "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
    {
        "id": 1,
        "ProductId": 1,
        "CustomerId": 1,
        "createdAt": "2023-08-27T17:25:19.334Z",
        "updatedAt": "2023-08-27T17:25:19.334Z",
        "Product": {
            "id": 1,
            "name": "Basic T-Shirt",
            "description": "A comfortable and versatile basic t-shirt.",
            "price": 24,
            "stock": 100,
            "imgUrl": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
            "categoryId": 1,
            "authorId": 1,
            "status": "Active",
            "createdAt": "2023-08-27T16:34:27.776Z",
            "updatedAt": "2023-08-27T16:34:27.776Z"
        }
    },
    {
        "id": 2,
        "ProductId": 5,
        "CustomerId": 1,
        "createdAt": "2023-08-27T17:25:25.209Z",
        "updatedAt": "2023-08-27T17:25:25.209Z",
        "Product": {
            "id": 5,
            "name": "Elegant Hats",
            "description": "Cool and stylish hats.",
            "price": 20,
            "stock": 60,
            "imgUrl": "https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
            "categoryId": 5,
            "authorId": 3,
            "status": "Active",
            "createdAt": "2023-08-27T16:34:27.776Z",
            "updatedAt": "2023-08-27T16:34:27.776Z"
        }
    }
]
```

_Response (500 - Internal Server Error)_

```
{
    "message": "Internal Server Error"
}
```

---

### POST /favorites/:id

> Get product by id

_Request Header_

```
{
    "access_token" : "string"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "id": 3,
    "ProductId": 3,
    "CustomerId": 1,
    "updatedAt": "2023-08-27T17:37:40.650Z",
    "createdAt": "2023-08-27T17:37:40.650Z"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Product not found"
}
```

---
