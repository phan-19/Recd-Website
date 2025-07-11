mod api_get;
mod api_post;

use api_get::*;
use api_post::*;

use axum::{
    routing::{get, post},
    Router,
};
use sqlx::SqlitePool;

async fn get_test() -> &'static str {
    "Connected to Recd with a GET request"
}

async fn post_test() -> &'static str {
    "Connected to Recd with a POST request"
}

//main
#[tokio::main]
async fn main() {
    let db_url = "sqlite://recd.db";
    let pool = SqlitePool::connect(db_url).await.unwrap();

    let app = Router::new()
        .route("/review/{id}", get(get_review))
        .route("/page/home", get(get_page_home))
        .route("/page/user/{id}", get(get_page_user))
        .route("/page/media/{id}", get(get_page_media))
        .route("/search/user/{term}", get(search_user))
        .route("/search/media/{term}", get(search_media))
        .route("/login", get(login))
        .route("/review", post(add_review))
        .route("/user", post(add_user))
        .route("/media", post(add_media))
        .route("/", get(get_test).post(post_test))
        .with_state(pool);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    println!(
        "Backend API running at http://{}",
        listener.local_addr().unwrap()
    );
    axum::serve(listener, app).await.unwrap();
}
