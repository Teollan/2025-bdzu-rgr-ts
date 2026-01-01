include .env

seed-tables:
	@echo "Seeding the database..."
	psql -U $(DB_USERNAME) -d $(DB_NAME) -f seeder.sql
	@echo "\033[32mDatabase seeded.\033[0m"