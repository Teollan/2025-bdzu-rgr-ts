-- Seed Companies
INSERT INTO companies (name) VALUES
    ('Acme Corporation'),
    ('TechStart Inc'),
    ('Global Solutions'),
    ('Innovate Labs'),
    ('Prime Services');

-- Seed Customers
INSERT INTO customers (first_name, last_name, phone_number, email) VALUES
    ('John', 'Smith', '3804567890', 'john.smith@email.com'),
    ('Emily', 'Johnson', '3804567891', 'emily.johnson@email.com'),
    ('Michael', 'Brown', '3804567892', 'michael.brown@email.com'),
    ('Sarah', 'Davis', '3804567893', 'sarah.davis@email.com'),
    ('David', 'Wilson', '3804567894', 'david.wilson@email.com'),
    ('Jessica', 'Martinez', '3804567895', 'jessica.martinez@email.com'),
    ('Daniel', 'Anderson', '3804567896', 'daniel.anderson@email.com'),
    ('Ashley', 'Taylor', '3804567897', 'ashley.taylor@email.com'),
    ('James', 'Thomas', '3804567898', 'james.thomas@email.com'),
    ('Amanda', 'Garcia', '3804567899', 'amanda.garcia@email.com');

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

-- Seed util tables for random data generation
INSERT INTO first_names (first_name) VALUES
    ('James'), ('John'), ('Robert'), ('Michael'), ('William'),
    ('David'), ('Richard'), ('Joseph'), ('Thomas'), ('Charles'),
    ('Christopher'), ('Daniel'), ('Matthew'), ('Anthony'), ('Donald'),
    ('Mark'), ('Paul'), ('Steven'), ('Andrew'), ('Kenneth'),
    ('Mary'), ('Patricia'), ('Jennifer'), ('Linda'), ('Elizabeth'),
    ('Barbara'), ('Susan'), ('Jessica'), ('Sarah'), ('Karen'),
    ('Nancy'), ('Lisa'), ('Margaret'), ('Betty'), ('Sandra'),
    ('Ashley'), ('Dorothy'), ('Kimberly'), ('Emily'), ('Donna');

INSERT INTO last_names (last_name) VALUES
    ('Smith'), ('Johnson'), ('Williams'), ('Brown'), ('Jones'),
    ('Garcia'), ('Miller'), ('Davis'), ('Rodriguez'), ('Martinez'),
    ('Hernandez'), ('Lopez'), ('Gonzalez'), ('Wilson'), ('Anderson'),
    ('Thomas'), ('Taylor'), ('Moore'), ('Jackson'), ('Martin'),
    ('Lee'), ('Perez'), ('Thompson'), ('White'), ('Harris'),
    ('Sanchez'), ('Clark'), ('Ramirez'), ('Lewis'), ('Robinson'),
    ('Walker'), ('Young'), ('Allen'), ('King'), ('Wright'),
    ('Scott'), ('Torres'), ('Nguyen'), ('Hill'), ('Flores');

INSERT INTO email_domains (domain) VALUES
    ('gmail.com'), ('yahoo.com'), ('outlook.com'), ('hotmail.com'), ('icloud.com'),
    ('protonmail.com'), ('aol.com'), ('mail.com'), ('zoho.com'), ('yandex.com'),
    ('fastmail.com'), ('tutanota.com'), ('gmx.com'), ('live.com'), ('inbox.com');

INSERT INTO adjectives (adjective) VALUES
    ('Global'), ('Dynamic'), ('Premier'), ('Innovative'), ('Strategic'),
    ('Advanced'), ('Rapid'), ('Smart'), ('Digital'), ('Prime'),
    ('Elite'), ('Superior'), ('Optimal'), ('NextGen'), ('Pro'),
    ('Mega'), ('Ultra'), ('Alpha'), ('Summit'), ('Apex'),
    ('Quantum'), ('Phoenix'), ('Titan'), ('Infinity'), ('Velocity');

INSERT INTO nouns (noun) VALUES
    ('Technologies'), ('Solutions'), ('Systems'), ('Services'), ('Consulting'),
    ('Group'), ('Partners'), ('Ventures'), ('Enterprises'), ('Industries'),
    ('Logistics'), ('Marketing'), ('Analytics'), ('Networks'), ('Media'),
    ('Capital'), ('Holdings'), ('Innovations'), ('Development'), ('Dynamics');

INSERT INTO designators (designator) VALUES
    ('Inc.'), ('LLC'), ('Corp.'), ('Ltd.'),
    ('Corporation'), ('Incorporated'), ('Group'), ('International'), ('Associates'),
    ('Partners'), ('Enterprises'), ('Holdings'), ('Limited'), ('Company');

