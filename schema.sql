CREATE DATABASE IF NOT EXISTS infrakeys;

CREATE TYPE user_roles as ENUM('admin', 'user');

CREATE
OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ LANGUAGE plpgsql;

CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role user_roles DEFAULT 'user',
    city VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_updated_at BEFORE
UPDATE
    ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE categories(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL
);

CREATE TABLE sub_categories(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE banners (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    banner_url TEXT NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE products (
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    about TEXT NOT NULL,
    images TEXT [],
    sub_category_id int REFERENCES sub_categories(id) ON DELETE CASCADE NOT NULL,
    keywords TEXT
);

CREATE TABLE blogs (
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    summary TEXT,
    tags JSONB DEFAULT '[]',
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_update_updated_at BEFORE
UPDATE
    ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE product_descriptions(
    id SERIAL NOT NULL PRIMARY KEY,
    description TEXT NOT NULL,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE product_features(
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    feature TEXT NOT NULL,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE product_applications(
    id SERIAL NOT NULL PRIMARY KEY,
    application TEXT NOT NULL,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE product_used_by(
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE industries(
    id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    image TEXT NOT NULL
);

CREATE TABLE viewed_products (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL
);

CREATE TABLE product_queries (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL
);

CREATE TABLE user_otps(
    phone VARCHAR(40) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)