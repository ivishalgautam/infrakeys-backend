CREATE DATABASE infrakeys;

CREATE TYPE user_roles as ENUM('admin', 'user');

CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(40) NOT NULL,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role user_roles DEFAULT 'user',
    address VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE banners (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    banner_url TEXT NOT NULL,
    link TEXT NOT NULL
);

CREATE TABLE categories(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL
);

CREATE TABLE sub_categories(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    category_id INT REFERENCES categories(id) NOT NULL
);

CREATE TABLE products (
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    about TEXT NOT NULL,
    image_url TEXT,
    category_id int REFERENCES categories(id)
);

CREATE TABLE product_descriptions(
    id SERIAL NOT NULL PRIMARY KEY,
    description TEXT NOT NULL,
    product_id INT NOT NULL REFERENCES products(id)
);

CREATE TABLE product_features(
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    feature TEXT NOT NULL,
    product_id INT NOT NULL REFERENCES products(id)
);

CREATE TABLE product_applications(
    id SERIAL NOT NULL PRIMARY KEY,
    application TEXT NOT NULL,
    product_id INT NOT NULL REFERENCES products(id)
);

CREATE TABLE product_used_by(
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    product_id INT NOT NULL REFERENCES products(id)
);