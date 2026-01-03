-- Create Lead Status enum
DROP TYPE IF EXISTS LEAD_STATUS;
CREATE TYPE LEAD_STATUS AS ENUM ('PENDING', 'IN_PROGRESS', 'WON', 'LOST');

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
    status LEAD_STATUS NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create Sales Manager Leads table
CREATE TABLE IF NOT EXISTS sales_manager_leads (
    sales_manager_id INT NOT NULL REFERENCES sales_managers(id) ON DELETE CASCADE,
    lead_id INT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    PRIMARY KEY (sales_manager_id, lead_id)
);
