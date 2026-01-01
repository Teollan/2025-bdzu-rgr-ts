-- Create Companies table
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create Sales Managers table
CREATE TABLE IF NOT EXISTS sales_managers (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100)
);

-- Create Customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(15),
    email VARCHAR(255)
);

-- Create Leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Sales Manager Leads table
CREATE TABLE IF NOT EXISTS sales_manager_leads (
    sales_manager_id INT REFERENCES sales_managers(id) ON DELETE CASCADE,
    lead_id INT REFERENCES leads(id) ON DELETE CASCADE,
    PRIMARY KEY (sales_manager_id, lead_id)
);
