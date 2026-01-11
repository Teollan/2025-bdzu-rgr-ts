-- Create Lead Status enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
        CREATE TYPE LEAD_STATUS AS ENUM ('PENDING', 'IN_PROGRESS', 'WON', 'LOST');
    END IF;
END $$;

-- Create Companies table
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create Sales Managers table
CREATE TABLE IF NOT EXISTS sales_managers (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL
);

-- Create Customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Create Leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    status LEAD_STATUS DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create Sales Manager Leads table
CREATE TABLE IF NOT EXISTS sales_manager_leads (
    sales_manager_id INT NOT NULL REFERENCES sales_managers(id) ON DELETE CASCADE,
    lead_id INT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    PRIMARY KEY (sales_manager_id, lead_id)
);

-- Util tables for random data generation
CREATE TABLE IF NOT EXISTS first_names (
    first_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS last_names (
    last_name VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS email_domains (
    domain VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS adjectives (
    adjective VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS nouns (
    noun VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS designators (
    designator VARCHAR(50) PRIMARY KEY
);