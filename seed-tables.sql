-- Seed Companies
INSERT INTO companies (name) VALUES
    ('Acme Corporation'),
    ('TechStart Inc'),
    ('Global Solutions'),
    ('Innovate Labs'),
    ('Prime Services');

-- Seed Customers
INSERT INTO customers (first_name, last_name, phone_number, email) VALUES
    ('John', 'Smith', '+1234567890', 'john.smith@email.com'),
    ('Emily', 'Johnson', '+1234567891', 'emily.johnson@email.com'),
    ('Michael', 'Brown', '+1234567892', 'michael.brown@email.com'),
    ('Sarah', 'Davis', '+1234567893', 'sarah.davis@email.com'),
    ('David', 'Wilson', '+1234567894', 'david.wilson@email.com'),
    ('Jessica', 'Martinez', '+1234567895', 'jessica.martinez@email.com'),
    ('Daniel', 'Anderson', '+1234567896', 'daniel.anderson@email.com'),
    ('Ashley', 'Taylor', '+1234567897', 'ashley.taylor@email.com'),
    ('James', 'Thomas', '+1234567898', 'james.thomas@email.com'),
    ('Amanda', 'Garcia', '+1234567899', 'amanda.garcia@email.com');

-- Seed Sales Managers
INSERT INTO sales_managers (company_id, first_name, last_name) VALUES
    (1, 'Robert', 'Miller'),
    (1, 'Jennifer', 'Clark'),
    (2, 'William', 'Rodriguez'),
    (3, 'Elizabeth', 'Lewis'),
    (3, 'Christopher', 'Lee'),
    (4, 'Patricia', 'Walker'),
    (5, 'Richard', 'Hall');

-- Seed Leads
INSERT INTO leads (company_id, customer_id, status, created_at) VALUES
    (1, 1, 'PENDING', NOW() - INTERVAL '30 days'),
    (1, 2, 'IN_PROGRESS', NOW() - INTERVAL '25 days'),
    (1, 3, 'IN_PROGRESS', NOW() - INTERVAL '20 days'),
    (2, 4, 'PENDING', NOW() - INTERVAL '15 days'),
    (2, 5, 'IN_PROGRESS', NOW() - INTERVAL '10 days'),
    (3, 6, 'WON', NOW() - INTERVAL '8 days'),
    (3, 7, 'WON', NOW() - INTERVAL '5 days'),
    (4, 8, 'PENDING', NOW() - INTERVAL '3 days'),
    (4, 9, 'LOST', NOW() - INTERVAL '2 days'),
    (5, 10, 'PENDING', NOW() - INTERVAL '1 day');

-- Seed Sales Manager Leads (assign leads to sales managers)
INSERT INTO sales_manager_leads (sales_manager_id, lead_id) VALUES
    (1, 1),
    (1, 2),
    (2, 3),
    (3, 4),
    (3, 5),
    (4, 6),
    (5, 7),
    (6, 8),
    (6, 9),
    (7, 10);
