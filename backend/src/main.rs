use sqlx::{migrate::MigrateDatabase, sqlite::SqliteQueryResult, Sqlite, SqlitePool};
use std::env;
use std::result::Result;

async fn add_user(
    pool: &SqlitePool,
    username: &str,
    password: &str,
) -> Result<SqliteQueryResult, sqlx::Error> {
}

async fn list_users(
    pool: &SqlitePool,
) -> Result<SqliteQueryResult, sqlx::Error> {
}

async fn main() {
    let args = env::args().collect();
    let pool = SqlitePool::connect("sqlite://recd.db").await().unwrap();
}
