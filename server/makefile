all: run

run:
	go run cmd/main.go

migrate:
	go run db/migrate.go

rollback:
	go run db/migrate.go -rollback

rollback-steps:
	go run db/migrate.go -rollback -steps=$(steps)

force-version:
	go run db/migrate.go -force=3

version:
	go run db/migrate.go -version

create-migration:
	migrate create -ext sql -dir db/migrations -seq $(name)
