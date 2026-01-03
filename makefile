include .env

create-tables:
	@echo "Creating the database tables..."
	psql -U $(DB_USERNAME) -d $(DB_NAME) -f create-tables.sql
	@echo "\033[32mDatabase tables created.\033[0m"

seed-tables:
	@echo "Seeding the database tables with initial data..."
	psql -U $(DB_USERNAME) -d $(DB_NAME) -f seed-tables.sql
	@echo "\033[32mDatabase tables seeded with initial data.\033[0m"

drop-tables:
	@echo "Dropping the database tables..."
	psql -U $(DB_USERNAME) -d $(DB_NAME) -f drop-tables.sql
	@echo "\033[32mDatabase tables dropped.\033[0m"