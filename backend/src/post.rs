use axum::{
    routing::{get, post},
    Router,
    extract::State,
    response::Json,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::{SqlitePool, Row};
use std::net::SocketAddr;
use axum::response::IntoResponse;


#[derive(Clone)]
pub struct AppState {
    pub db: SqlitePool,
}

#[derive(Deserialize)]
pub struct AddUserRequest {
    pub username: String,
    pub password: String,
    pub bio: String,
}

async fn add_user(
    State(state): State<AppState>,
    Json(user): Json<AddUserRequest>,
) -> impl IntoResponse {

    let qry = "insert into users (username, password, bio) VALUES (?, ?, ?)";
    match sqlx::query(qry)
        .bind(user.username)
        .bind(user.password)
        .bind(user.bio)
        .execute(&state.db)
        .await
    {
         Ok(_) => (
            StatusCode::CREATED,
            Json(json!({"status": "success", "message": "User added"}))
        ).into_response(),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"status": "error", "message": "Adding user failed"}))
        ).into_response(),
    }

}