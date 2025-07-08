use axum::{routing::{get, post}, Router, Json, extract::State, response::IntoResponse};
use serde::{Deserialize, Serialize};
use sqlx::{SqlitePool, Row};
use std::net::SocketAddr;

#[derive(Clone)]
struct AppState {
    db: SqlitePool,
}

#[derive(Deserialize)]
struct RegisterRequest {
    username: String,
    password: String,
}

#[derive(Deserialize)]
struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Deserialize)]
struct MediaRequest {
    name: String,
    description: String,
    medium: String,
}

#[derive(Deserialize)]
struct ReviewRequest {
    user_id: i64,
    media_id: i64,
    rating: i64,
    review_txt: String,
}

#[derive(Serialize)]
struct LoginResponse {
    user_id: i64,
}

#[derive(Serialize, sqlx::FromRow)]
struct Media {
    name: String,
    description: String,
    medium: String,
}

#[tokio::main]
async fn main() {
    let db = SqlitePool::connect("sqlite://recd.db").await.unwrap();
    let state = AppState { db };

    let app = Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/media", post(add_media).get(list_media))
        .route("/reviews", post(add_review))
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Server running at http://{}", addr);
    axum::Server::bind(&addr).serve(app.into_make_service()).await.unwrap();
}

async fn register(State(state): State<AppState>, Json(payload): Json<RegisterRequest>) -> impl IntoResponse {
    let qry = "INSERT INTO users (username, password) VALUES (?, ?)";
    match sqlx::query(qry).bind(&payload.username).bind(&payload.password).execute(&state.db).await {
        Ok(_) => (axum::http::StatusCode::CREATED, "User registered").into_response(),
        Err(_) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, "Registration failed").into_response(),
    }
}

async fn login(State(state): State<AppState>, Json(payload): Json<LoginRequest>) -> impl IntoResponse {
    let qry = "SELECT user_id FROM users WHERE username = ? AND password = ?";
    let res = sqlx::query(qry).bind(&payload.username).bind(&payload.password).fetch_optional(&state.db).await;

    match res {
        Ok(Some(row)) => {
            let user_id: i64 = row.get("user_id");
            (axum::http::StatusCode::OK, Json(LoginResponse { user_id })).into_response()
        },
        Ok(None) => (axum::http::StatusCode::UNAUTHORIZED, "Invalid credentials").into_response(),
        Err(_) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, "Login failed").into_response(),
    }
}

async fn add_media(State(state): State<AppState>, Json(payload): Json<MediaRequest>) -> impl IntoResponse {
    let qry = "INSERT INTO media (name, description, medium) VALUES (?, ?, ?)";
    match sqlx::query(qry).bind(&payload.name).bind(&payload.description).bind(&payload.medium).execute(&state.db).await {
        Ok(_) => (axum::http::StatusCode::CREATED, "Media added").into_response(),
        Err(_) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, "Adding media failed").into_response(),
    }
}

async fn list_media(State(state): State<AppState>) -> impl IntoResponse {
    let qry = "SELECT name, description, medium FROM media";
    match sqlx::query_as::<_, Media>(qry).fetch_all(&state.db).await {
        Ok(media_list) => Json(media_list).into_response(),
        Err(_) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, "Query failed").into_response(),
    }
}

async fn add_review(State(state): State<AppState>, Json(payload): Json<ReviewRequest>) -> impl IntoResponse {
    let qry = "INSERT INTO reviews (user_id, media_id, rating, review_txt) VALUES (?, ?, ?, ?)";
    match sqlx::query(qry)
        .bind(payload.user_id)
        .bind(payload.media_id)
        .bind(payload.rating)
        .bind(&payload.review_txt)
        .execute(&state.db)
        .await {
        Ok(_) => (axum::http::StatusCode::CREATED, "Review added").into_response(),
        Err(_) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, "Adding review failed").into_response(),
    }
}
