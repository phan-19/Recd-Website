use axum::extract::Path;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;
use serde_json::json;
use sqlx::query;
use sqlx::{Row, SqlitePool};

/*

Review

*/

pub async fn get_review(
    State(pool): State<SqlitePool>,
    Path(review_id): Path<String>,
) -> impl IntoResponse {
    let qry = "SELECT * FROM reviews WHERE review_id = $1";
    let result = query(&qry)
        .bind(review_id.parse::<i64>().unwrap())
        .fetch_one(&pool)
        .await;
    match result {
        Ok(row) => {
            let review_id: i64 = row.get("review_id");
            let user_id: i64 = row.get("user_id");
            let media_id: i64 = row.get("media_id");
            let rating: i64 = row.get("rating");
            let review_txt: String = row.get("review_txt");

            let username_qry = "SELECT username FROM users WHERE user_id = $1";
            let username = sqlx::query_scalar::<_, String>(&username_qry)
                .bind(user_id.clone())
                .fetch_one(&pool)
                .await
                .unwrap();

            let media_name_qry = "SELECT name FROM media WHERE media_id = $1";
            let media_name = sqlx::query_scalar::<_, String>(&media_name_qry)
                .bind(media_id.clone())
                .fetch_one(&pool)
                .await
                .unwrap();

            return (StatusCode::OK, Json(
                json!({"review_id": review_id, "user_id": user_id, "username": username, "media_id": media_id, "media_name": media_name, "rating": rating, "review_txt": review_txt}),
            )).into_response();
        }
        Err(_) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to retrieve review",
            )
                .into_response();
        }
    }
}

/*

Page

*/

//Home
pub async fn get_page_home(State(pool): State<SqlitePool>) -> impl IntoResponse {
    let qry = "SELECT review_id FROM reviews ORDER BY review_id DESC LIMIT 10";
    let result = sqlx::query_scalar::<_, i64>(&qry).fetch_all(&pool).await;
    match result {
        Ok(reviews) => {
            return (StatusCode::OK, Json(json!({"reviews": reviews}))).into_response();
        }
        Err(_) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to retrieve home page",
            )
                .into_response();
        }
    }
}

//User
pub async fn get_page_user(
    State(pool): State<SqlitePool>,
    Path(user_id): Path<String>,
) -> impl IntoResponse {
    let qry = "SELECT * FROM users WHERE user_id = $1";
    let result = query(&qry)
        .bind(user_id.parse::<i64>().unwrap())
        .fetch_one(&pool)
        .await;
    match result {
        Ok(user) => {
            let user_id: i64 = user.get("user_id");
            let username: String = user.get("username");
            let bio: String = user.get("bio");

            let reviews_qry = "SELECT review_id FROM reviews WHERE user_id = $1";
            let reviews = sqlx::query_scalar::<_, i64>(&reviews_qry)
                .bind(user_id.clone())
                .fetch_all(&pool)
                .await
                .unwrap();

            (StatusCode::OK, Json(json!({"user_id": user_id, "username": username, "bio": bio, "reviews": reviews}))).into_response()
        }
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to retrieve user page",
        )
            .into_response(),
    }
}

//Media

pub async fn get_page_media(
    State(pool): State<SqlitePool>,
    Path(media_id): Path<String>,
) -> impl IntoResponse {
    let qry = "SELECT * FROM media WHERE media_id = $1";
    let result = query(&qry)
        .bind(media_id.parse::<i64>().unwrap())
        .fetch_one(&pool)
        .await;
    match result {
        Ok(media) => {
            let media_id: i64 = media.get("media_id");
            let media_name: String = media.get("name");
            let description: String = media.get("description");
            let medium: String = media.get("medium");

            let reviews_qry = "SELECT review_id FROM reviews WHERE media_id = $1";
            let reviews = sqlx::query_scalar::<_, i64>(&reviews_qry)
                .bind(media_id.clone())
                .fetch_all(&pool)
                .await
                .unwrap();

            (StatusCode::OK, Json(json!({"media_id": media_id, "media_name": media_name, "description": description, "medium": medium, "reviews": reviews}))).into_response()
        }
        Err(_) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to retrieve media page",
            )
                .into_response();
        }
    }
}

//Medium

/*

Search

*/

#[derive(sqlx::FromRow)]
struct UserSearchReturn {
    pub user_id: i64,
    pub username: String,
}

#[derive(sqlx::FromRow)]
struct MediaSearchReturn {
    pub media_id: i64,
    pub name: String,
}

//User
pub async fn search_user(
    State(pool): State<SqlitePool>,
    Path(searchterm): Path<String>,
) -> impl IntoResponse {
    let qry = "SELECT user_id, username FROM users WHERE username LIKE $1";
    let result = sqlx::query_as::<_, UserSearchReturn>(&qry)
        .bind("%".to_owned() + &searchterm + "%")
        .fetch_all(&pool)
        .await;
    match result {
        Ok(users) => {
            let mut user_ids: Vec<i64> = Vec::new();
            let mut usernames: Vec<String> = Vec::new();

            for user in users {
                user_ids.push(user.user_id);
                usernames.push(user.username);
            }

            (
                StatusCode::OK,
                Json(json!({"user_ids": user_ids, "usernames": usernames})),
            )
                .into_response()
        }
        Err(_) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to retrieve user search result",
            )
                .into_response();
        }
    }
}

//Media
pub async fn search_media(
    State(pool): State<SqlitePool>,
    Path(searchterm): Path<String>,
) -> impl IntoResponse {
    let qry = "SELECT media_id, name FROM media WHERE name LIKE $1";
    let result = sqlx::query_as::<_, MediaSearchReturn>(&qry)
        .bind("%".to_owned() + &searchterm + "%")
        .fetch_all(&pool)
        .await;
    match result {
        Ok(medias) => {
            let mut media_ids: Vec<i64> = Vec::new();
            let mut names: Vec<String> = Vec::new();

            for media in medias {
                media_ids.push(media.media_id);
                names.push(media.name);
            }

            (
                StatusCode::OK,
                Json(json!({"media_ids": media_ids, "names": names})),
            )
                .into_response()
        }
        Err(_) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Failed to retrieve media search result",
            )
                .into_response();
        }
    }
}

/*

Login

*/

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

pub async fn login(
    State(pool): State<SqlitePool>,
    Json(login): Json<LoginRequest>,
) -> impl IntoResponse {
    let qry = "SELECT user_id, username FROM users WHERE username = $1 AND password = $2";
    let result = query(&qry)
        .bind(login.username)
        .bind(login.password)
        .fetch_optional(&pool)
        .await;
    match result {
        Ok(Some(user)) => {
            let user_id: i64 = user.get("user_id");
            let username: String = user.get("username");
            (
                StatusCode::OK,
                Json(json!({"success": true, "user_id" : user_id, "username": username})),
            )
                .into_response()
        }
        Ok(None) => (
            StatusCode::OK,
            Json(json!({"success": false, "user_id" : -1, "username": ""})),
        )
            .into_response(),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Failed to process login attempt",
        )
            .into_response(),
    }
}
