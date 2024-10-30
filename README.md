<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

# E-Commerce Cart Functionality

## Overview

This application provides a comprehensive cart functionality for an e-commerce platform, allowing users to sign in, sign up, manage their cart, and confirm orders. The backend is hosted at [https://ecomm-bkend-1.onrender.com](https://ecomm-bkend-1.onrender.com) and a description link is added below each request which can be tested on postman.

## Features

- **User Authentication**:
  - **Sign Up**: Users can create an account.
  - **Sign In**: Users can log into their account.

- **Cart Management**:
  - **Add Items to Cart**: Users can add items to their cart.
  - **Remove Items from Cart**: Users can remove specific items from their cart.
  - **View Cart**: Users can retrieve and view their current cart contents.
  - **Clear Cart**: (Optional) Functionality to clear the entire cart can be added.

- **Order Confirmation**:
  - **Confirm Orders**: Users can confirm their cart as an order after ensuring everything is in order.

## API Endpoints

### Authentication Endpoints

- **Sign Up**
  - **Endpoint**: `POST /auth/signup`
  - **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response**: 
    - Status: `201 Created`
    - Body: `{"message": "User registered successfully."}`
  - **URL**: [https://ecomm-bkend-1.onrender.com/auth/signup](https://ecomm-bkend-1.onrender.com/auth/signup)

- **Sign In**
  - **Endpoint**: `POST /auth/signin`
  - **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response**: 
    - Status: `200 OK`
    - Body: `{"accessToken": "string"}`
  - **URL**: [https://ecomm-bkend-1.onrender.com/auth/signin](https://ecomm-bkend-1.onrender.com/auth/signin)

### Cart Endpoints

- **Get Cart**
  - **Endpoint**: `GET /cart`
  - **Response**: 
    - Status: `200 OK`
    - Body: 
    ```json
    {
      "message": "Cart retrieved successfully.",
      "cart": {
        // Cart object structure
      }
    }
    ```
  - **URL**: [https://ecomm-bkend-1.onrender.com/cart](https://ecomm-bkend-1.onrender.com/cart)

- **Add Item to Cart**
  - **Endpoint**: `POST /cart/add-item`
  - **Request Body**:
    ```json
    {
      "itemId": "number",
      "quantity": "number"
    }
    ```
  - **Response**: 
    - Status: `200 OK`
    - Body: 
    ```json
    {
      "message": "Item added to cart successfully.",
      "cart": {
        // Updated cart object structure
      }
    }
    ```
  - **URL**: [https://ecomm-bkend-1.onrender.com/cart/add-item](https://ecomm-bkend-1.onrender.com/cart/add-item)

- **Remove Item from Cart**
  - **Endpoint**: `DELETE /cart/remove-item/:id`
  - **Response**: 
    - Status: `200 OK`
    - Body: 
    ```json
    {
      "message": "Item removed from cart successfully.",
      "cart": {
        // Updated cart object structure
      }
    }
    ```
  - **URL**: [https://ecomm-bkend-1.onrender.com/cart/remove-item/:id](https://ecomm-bkend-1.onrender.com/cart/remove-item/:id)

- **Confirm Order**
  - **Endpoint**: `POST /cart/confirm`
  - **Authentication**: Requires JWT token in headers.
  - **Response**: 
    - Status: `200 OK`
    - Body: 
    ```json
    {
      "message": "Order confirmed successfully."
    }
    ```
  - **URL**: [https://ecomm-bkend-1.onrender.com/cart/confirm](https://ecomm-bkend-1.onrender.com/cart/confirm)

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ecommerce-cart.git
