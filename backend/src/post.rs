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
#[derive(Deserialize)]
pub struct AddReviewRequest {
    pub user_id: i32,
    pub rating: i32,
    pub media_name: String,
    pub review_txt: String,
}
async fn add_review(
    State(state): State<AppState>,
    Json(review): Json<AddReviewRequest>,
) -> impl IntoResponse {
    let qry = "insert into reviews (username, review) VALUES (?, ?)";
    match sqlx::query(qry)
        .bind(review.user_id)
        .bind(review.media_name)
        .bind(review.rating)
        .bind(review.review_txt)
        .execute(&state.db)
        .await
    {
         Ok(_) => (
            StatusCode::CREATED,
            Json(json!({"status": "success", "message": "Review added"}))
        ).into_response(),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"status": "error", "message": "Posting review failed"}))
        ).into_response(),
    }
}
#[derive(Deserialize)]
pub struct AddMediaRequest {
    pub media_name: String,
    pub description: String,
    pub medium: String,

}
async fn add_media(
    State(state): State<AppState>,
    Json(media): Json<AddMediaRequest>,
) -> impl IntoResponse {
    let qry = "insert into media (media_name, description, medium) VALUES (?, ?, ?)";
    match sqlx::query(qry)
        .bind(media.media_name)
        .bind(media.description)
        .bind(media.medium)
        .execute(&state.db)
        .await
    {
         Ok(_) => (
            StatusCode::CREATED,
            Json(json!({"status": "success", "message": "Media added"}))
        ).into_response(),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({"status": "error", "message": "Adding media failed"}))
        ).into_response(),
    }
}
