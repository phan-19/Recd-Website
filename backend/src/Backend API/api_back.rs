use axum::{
    routing::{get, post},
    Router,
    Json,
    extract::State,
    response::IntoResponse,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use sqlx::{SqlitePool, Row};
use std::net::SocketAddr;

#[derive(Clone)]
pub struct AppState {
    pub db: SqlitePool,
}

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct MediaRequest {
    pub name: String,
    pub description: String,
    pub medium: String,
}

#[derive(Deserialize)]
pub struct ReviewRequest {
    pub user_id: i64,
    pub media_id: i64,
    pub rating: i64,
    pub review_txt: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub user_id: i64,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct Media {
    pub name: String,
    pub description: String,
    pub medium: String,
}

pub async fn run_backend(db: SqlitePool) {
    let state = AppState { db };

    let app = Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/media", post(add_media).get(list_media))
        .route("/reviews", post(add_review))
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Backend API running at http://{}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// Handlers
async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> impl IntoResponse {
    let qry = "INSERT INTO users (username, password) VALUES (?, ?)";
    match sqlx::query(qry)
        .bind(&payload.username)
        .bind(&payload.password)
        .execute(&state.db)
        .await
    {
        Ok(_) => (StatusCode::CREATED, "User registered").into_response(),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Registration failed",
        )
            .into_response(),
    }
}

async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    let qry = "SELECT user_id FROM users WHERE username = ? AND password = ?";
    let res = sqlx::query(qry)
        .bind(&payload.username)
        .bind(&payload.password)
        .fetch_optional(&state.db)
        .await;

    match res {
        Ok(Some(row)) => {
            let user_id: i64 = row.get("user_id");
            (StatusCode::OK, Json(LoginResponse { user_id })).into_response()
        }
        Ok(None) => (StatusCode::UNAUTHORIZED, "Invalid credentials").into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Login failed").into_response(),
    }
}

async fn add_media(
    State(state): State<AppState>,
    Json(payload): Json<MediaRequest>,
) -> impl IntoResponse {
    let qry = "INSERT INTO media (name, description, medium) VALUES (?, ?, ?)";
    match sqlx::query(qry)
        .bind(&payload.name)
        .bind(&payload.description)
        .bind(&payload.medium)
        .execute(&state.db)
        .await
    {
        Ok(_) => (StatusCode::CREATED, "Media added").into_response(),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Adding media failed",
        )
            .into_response(),
    }
}

async fn list_media(State(state): State<AppState>) -> impl IntoResponse {
    let qry = "SELECT name, description, medium FROM media";
    match sqlx::query_as::<_, Media>(qry).fetch_all(&state.db).await {
        Ok(media_list) => Json(media_list).into_response(),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Query failed").into_response(),
    }
}

async fn add_review(
    State(state): State<AppState>,
    Json(payload): Json<ReviewRequest>,
) -> impl IntoResponse {
    let qry = "INSERT INTO reviews (user_id, media_id, rating, review_txt) VALUES (?, ?, ?, ?)";
    match sqlx::query(qry)
        .bind(payload.user_id)
        .bind(payload.media_id)
        .bind(payload.rating)
        .bind(&payload.review_txt)
        .execute(&state.db)
        .await
    {
        Ok(_) => (StatusCode::CREATED, "Review added").into_response(),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Adding review failed",
        )
            .into_response(),
    }
}
