const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { hashPassword } = require("../helpers/hash");
const { generateToken } = require("../helpers/jwt");
const { test } = require("@jest/globals");

let access_token;
const active_user = { id: 1, email: "kresna1@mail.com" };

beforeAll(async () => {
  // seed user
  const users = require("../data/users.json").map((user) => {
    const newPassword = hashPassword(user.password);
    user.password = newPassword;
    user.createdAt = user.updatedAt = new Date();
    return user;
  });
  await sequelize.queryInterface.bulkInsert("Users", users, {});

  // seed category
  const categories = require("../data/categories.json").map((category) => {
    category.createdAt = category.updatedAt = new Date();
    return category;
  });
  await sequelize.queryInterface.bulkInsert("Categories", categories, {});

  // seed product
  await sequelize.queryInterface.bulkInsert("Products", [
    {
      name: "Basic T-Shirt",
      description: "A comfortable and versatile basic t-shirt.",
      price: 24,
      stock: 100,
      imgUrl:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 1,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Slim-Fit Jeans",
      description: "Classic slim-fit jeans with a perfect fit.",
      price: 49,
      stock: 50,
      imgUrl:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 2,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Floral Maxi Dress",
      description: "A beautiful floral maxi dress.",
      price: 39,
      stock: 75,
      imgUrl:
        "https://images.unsplash.com/photo-1519657337289-077653f724ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 3,
      authorId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Cozy Knit Sweater",
      description: "Stay warm and stylish with this cozy knit sweater.",
      price: 59,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1604882767135-b41fac508fff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 4,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Elegant Hats",
      description: "Cool and stylish hats.",
      price: 20,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 5,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Basic Pants",
      description: "Stylish with amazing pants.",
      price: 59,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=869&q=80",
      categoryId: 6,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Basic T-Shirt A",
      description: "A comfortable and versatile basic t-shirt.",
      price: 24,
      stock: 100,
      imgUrl:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 1,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Slim-Fit Jeans A",
      description: "Classic slim-fit jeans with a perfect fit.",
      price: 49,
      stock: 50,
      imgUrl:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 1,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Floral Maxi Dress A",
      description: "A beautiful floral maxi dress.",
      price: 39,
      stock: 75,
      imgUrl:
        "https://images.unsplash.com/photo-1519657337289-077653f724ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 2,
      authorId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Cozy Knit Sweater A",
      description: "Stay warm and stylish with this cozy knit sweater.",
      price: 59,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1604882767135-b41fac508fff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 2,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Elegant Hats A",
      description: "Cool and stylish hats.",
      price: 20,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 3,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Basic Pants A",
      description: "Stylish with amazing pants.",
      price: 59,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=869&q=80",
      categoryId: 3,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Basic T-Shirt B",
      description: "A comfortable and versatile basic t-shirt.",
      price: 24,
      stock: 100,
      imgUrl:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 4,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Slim-Fit Jeans B",
      description: "Classic slim-fit jeans with a perfect fit.",
      price: 49,
      stock: 50,
      imgUrl:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 4,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Floral Maxi Dress B",
      description: "A beautiful floral maxi dress.",
      price: 39,
      stock: 75,
      imgUrl:
        "https://images.unsplash.com/photo-1519657337289-077653f724ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 5,
      authorId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Cozy Knit Sweater B",
      description: "Stay warm and stylish with this cozy knit sweater.",
      price: 59,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1604882767135-b41fac508fff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 5,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Elegant Hats B",
      description: "Cool and stylish hats.",
      price: 20,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 6,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Basic Pants B",
      description: "Stylish with amazing pants.",
      price: 59,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=869&q=80",
      categoryId: 6,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Basic T-Shirt C",
      description: "A comfortable and versatile basic t-shirt.",
      price: 24,
      stock: 100,
      imgUrl:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 1,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Slim-Fit Jeans C",
      description: "Classic slim-fit jeans with a perfect fit.",
      price: 49,
      stock: 50,
      imgUrl:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 1,
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Floral Maxi Dress C",
      description: "A beautiful floral maxi dress.",
      price: 39,
      stock: 75,
      imgUrl:
        "https://images.unsplash.com/photo-1519657337289-077653f724ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 3,
      authorId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Cozy Knit Sweater C",
      description: "Stay warm and stylish with this cozy knit sweater.",
      price: 59,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1604882767135-b41fac508fff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 3,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Elegant Hats C",
      description: "Cool and stylish hats.",
      price: 20,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1533827432537-70133748f5c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      categoryId: 5,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Basic Pants C",
      description: "Stylish with amazing pants.",
      price: 59,
      stock: 30,
      imgUrl:
        "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=869&q=80",
      categoryId: 5,
      authorId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  // seed customer
  await sequelize.queryInterface.bulkInsert(
    "Customers",
    [
      {
        username: "kresna1",
        email: "kresna1@mail.com",
        password: hashPassword("pw0909"),
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "kresna2",
        email: "kresna2@mail.com",
        password: hashPassword("pw0909"),
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "kresna3",
        email: "kresna3@mail.com",
        password: hashPassword("pw0909"),
        role: "customer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );

  // seed favorites
  await sequelize.queryInterface.bulkInsert("Favorites", [
    {
      ProductId: 1,
      CustomerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      ProductId: 2,
      CustomerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      ProductId: 3,
      CustomerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      ProductId: 3,
      CustomerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      ProductId: 4,
      CustomerId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      ProductId: 1,
      CustomerId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  access_token = generateToken(active_user);
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Favorites", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });

  await sequelize.queryInterface.bulkDelete("Customers", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });

  await sequelize.queryInterface.bulkDelete("Products", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });

  await sequelize.queryInterface.bulkDelete("Categories", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });

  await sequelize.queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });
});

describe("pub/register", () => {
  test("should response id & email user and return 201", async () => {
    const body = {
      username: "kresna999",
      email: "kresna999@mail.com",
      password: "pw0909",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", body.email);
  });

  test("should respond error message email required and return 400", async () => {
    const body = {
      username: "kresna",
      password: "pw0909",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("should respond error message password required and return 400", async () => {
    const body = {
      username: "kresna",
      email: "kresna1@mail.com",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("should respond error message email required and return 400", async () => {
    const body = {
      username: "kresna",
      email: "",
      password: "pw0909",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("should respond error message password required and return 400", async () => {
    const body = {
      username: "kresna",
      email: "kresna1@mail.com",
      password: "",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("should respond error message email must be unique and return 400", async () => {
    const body = {
      username: "kresna1",
      email: "kresna1@mail.com",
      password: "pw0909",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email must be unique");
  });

  test("should respond error message email required and return 400", async () => {
    const body = {
      username: "kresna",
      email: "kresna1mailcom",
      password: "pw0909",
    };
    const response = await request(app).post("/pub/register").send(body);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid email format");
  });
});

describe("pub/login", () => {
  test("should response access_token & user detail and return 200", async () => {
    const body = {
      email: "kresna1@mail.com",
      password: "pw0909",
    };
    const response = await request(app).post("/pub/login").send(body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("access_token");
    expect(response.body.user).toHaveProperty("email", body.email);
    expect(response.body.user).toHaveProperty("role", "customer");
  });

  test("should response error message invalid email/password and return 400", async () => {
    const body = {
      email: "kresna1@mail.com",
      password: "passwordasalasal",
    };
    const response = await request(app).post("/pub/login").send(body);

    expect(response.statusCode).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("should response error message invalid email/password and return 400", async () => {
    const body = {
      email: "kresnaxxx@mail.com",
      password: "pw0909",
    };
    const response = await request(app).post("/pub/login").send(body);

    expect(response.statusCode).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});

describe("pub/products", () => {
  test("should response list of products and return 200", async () => {
    const response = await request(app).get("/pub/products");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.length).toBe(24);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("description", expect.any(String));
    expect(response.body[0]).toHaveProperty("price", expect.any(Number));
    expect(response.body[0]).toHaveProperty("stock", expect.any(Number));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("categoryId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
  });

  test("should response list of products with filter by category and return 200", async () => {
    const response = await request(app).get(
      "/pub/products?filter[category]=1,2"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.length).toBe(8);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("description", expect.any(String));
    expect(response.body[0]).toHaveProperty("price", expect.any(Number));
    expect(response.body[0]).toHaveProperty("stock", expect.any(Number));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("categoryId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
  });

  test("should response list of products with a certain length based on pagination and return 200", async () => {
    const response = await request(app).get(
      "/pub/products?page[size]=5&page[number]=1"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.length).toBe(5);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("description", expect.any(String));
    expect(response.body[0]).toHaveProperty("price", expect.any(Number));
    expect(response.body[0]).toHaveProperty("stock", expect.any(Number));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("categoryId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("authorId", expect.any(Number));
  });

  test("should respond to an object of product details and return 200", async () => {
    const response = await request(app)
      .get("/pub/products/1")
      .set("access_token", access_token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("description", expect.any(String));
    expect(response.body).toHaveProperty("price", expect.any(Number));
    expect(response.body).toHaveProperty("stock", expect.any(Number));
    expect(response.body).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body).toHaveProperty("categoryId", expect.any(Number));
    expect(response.body).toHaveProperty("authorId", expect.any(Number));
  });

  test("should respond to an object of error message and return 404", async () => {
    const response = await request(app)
      .get("/pub/products/100")
      .set("access_token", access_token);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Data not found");
  });
});

describe("pub/favorites", () => {
  test("should response list of favorites based on login user and return 200", async () => {
    const response = await request(app)
      .get("/pub/favorites")
      .set("access_token", access_token);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.length).toBe(3);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("ProductId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("CustomerId", expect.any(Number));
  });

  test("should response to an object of new favorites detail and return 201", async () => {
    const response = await request(app)
      .post("/pub/favorites/10")
      .set("access_token", access_token);

    expect(response.statusCode).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("ProductId", expect.any(Number));
    expect(response.body).toHaveProperty("CustomerId", active_user.id);
  });

  test("should respond to an object of error message and return 404", async () => {
    const response = await request(app)
      .post("/pub/favorites/100")
      .set("access_token", access_token);

    expect(response.statusCode).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Data not found");
  });

  test("should respond to an object of error message and return 404", async () => {
    const response = await request(app).get("/pub/favorites");

    expect(response.statusCode).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("should respond to an object of error message and return 404", async () => {
    const response = await request(app)
      .get("/pub/favorites")
      .set("access_token", "rAnDOmRanDoM");

    expect(response.statusCode).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});
