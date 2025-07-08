mod api_back.rs

use api_back.rs::run_backend
use sqlx::query;
use sqlx::sqlite::SqliteRow;
use sqlx::{Row, SqlitePool};
use std::env;
use std::result::Result;
use std::{io::*, vec};

/*

Auth functions

*/

async fn login(
    pool: &SqlitePool,
    username: &String,
    password: &String,
) -> Result<Option<i64>, sqlx::Error> {
    let qry = "select user_id from users where username = $1 and password = $2";
    let result = query(&qry)
        .bind(username)
        .bind(password)
        .fetch_optional(pool)
        .await?;
    match result {
        Some(user) => Ok(Some(user.get("user_id"))),
        None => Ok(None),
    }
}

/*

Add functions

*/

async fn add_user(pool: &SqlitePool, username: &str, password: &str) -> Result<(), sqlx::Error> {
    let qry = "insert into users (username, password) values ($1, $2)";
    query(&qry)
        .bind(username)
        .bind(password)
        .execute(pool)
        .await?;
    Ok(())
}

async fn add_review(
    pool: &SqlitePool,
    user_id: i64,
    media_id: i64,
    rating: i64,
    txt: &String,
) -> Result<(), sqlx::Error> {
    let qry = "insert into reviews (user_id, media_id, rating, review_txt) values ($1, $2, $3, $4)";
    query(&qry)
        .bind(user_id)
        .bind(media_id)
        .bind(rating)
        .bind(txt)
        .execute(pool)
        .await?;

    Ok(())
}

async fn add_media(
    pool: &SqlitePool,
    name: &String,
    description: &String,
    medium: &String,
) -> Result<(), sqlx::Error> {
    let qry = "insert into media (name, description, medium) values ($1, $2, $3)";
    query(&qry)
        .bind(name)
        .bind(description)
        .bind(medium)
        .execute(pool)
        .await?;
    Ok(())
}

/*

Search functions

*/

async fn find_user(pool: &SqlitePool, username: &String) -> Result<Option<i64>, sqlx::Error> {
    let qry = "select user_id from users where username = $1";
    let result = query(&qry).bind(username).fetch_optional(pool).await?;
    match result {
        Some(media) => Ok(Some(media.get("user_id"))),
        None => Ok(None),
    }
}

async fn find_media(pool: &SqlitePool, name: &String) -> Result<Option<i64>, sqlx::Error> {
    let qry = "select media_id from media where name = $1";
    let result = query(&qry).bind(name).fetch_optional(pool).await?;
    match result {
        Some(media) => Ok(Some(media.get("media_id"))),
        None => Ok(None),
    }
}

/*

Info functions

*/

async fn list_users(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let qry = "select * from users";
    let result = query(&qry).fetch_all(pool).await?;
    println!("");
    for user in result {
        let username: String = user.get("username");
        println!("{}", username);
    }
    Ok(())
}

async fn list_media(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let qry = "select * from media";
    let result = query(&qry).fetch_all(pool).await?;
    println!("\n------------");
    for media in result {
        let name: String = media.get("name");
        let description: String = media.get("description");
        let medium: String = media.get("medium");
        println!("{}\n{}\n\n{}\n------------", name, medium, description);
    }
    Ok(())
}

async fn display_review_info(pool: &SqlitePool, review: &SqliteRow) -> Result<(), sqlx::Error> {
    let user_id: i64 = review.get("user_id");
    let media_id: i64 = review.get("media_id");
    let rating: i64 = review.get("rating");
    let review_txt: String = review.get("review_txt");

    let username_qry = "select username from users where user_id = $1";
    let username: String = query(&username_qry)
        .bind(user_id)
        .fetch_one(pool)
        .await?
        .get("username");
    let media_qry = "select name from media where media_id = $1";
    let media: String = query(&media_qry)
        .bind(media_id)
        .fetch_one(pool)
        .await?
        .get("name");

    println!(
        "Media: {}\nReviewer: {}\n{}/5\n\n{}\n------------------------",
        media, username, rating, review_txt
    );

    Ok(())
}

async fn list_user_reviews(pool: &SqlitePool, user_id: i64) -> Result<(), sqlx::Error> {
    let qry = "select * from reviews where user_id = $1";
    let result = query(&qry).bind(user_id).fetch_all(pool).await?;
    println!("\n------------------------");
    for review in result {
        let _ = display_review_info(pool, &review).await?;
    }
    Ok(())
}

async fn list_media_reviews(pool: &SqlitePool, media_id: i64) -> Result<(), sqlx::Error> {
    let qry = "select * from reviews where media_id = $1";
    let result = query(&qry).bind(media_id).fetch_all(pool).await?;
    println!("\n------------------------");
    for review in result {
        let _ = display_review_info(pool, &review).await?;
    }
    Ok(())
}

/*

Main helpers

*/

fn take_input() -> String {
    let mut input = String::new();
    let _ = stdin().read_line(&mut input);
    input.trim().to_string()
}

/*

Main

*/

#[async_std::main]
async fn main() {
    let mut new_user = false;

    let pool = SqlitePool::connect("sqlite://recd.db").await.unwrap();
    let args: Vec<String> = env::args().collect();

    for arg in args {
        match arg.as_str() {
            "-n" | "new" => new_user = true,
            _ => continue,
        }
    }

    let user_id: i64;
    if new_user {
        'new_user: loop {
            println!("Creating new Recd account!\nUsername");
            let username = take_input();
            println!("Password");
            let password = take_input();
            let _ = add_user(&pool, &username, &password).await;
            match login(&pool, &username, &password).await.unwrap() {
                Some(user) => {
                    user_id = user;
                    println!(
                        "\nWelcome to Recd {}! Type help for a list of commands!",
                        username
                    );
                    break 'new_user;
                }
                None => println!("Invalid login info"),
            }
        }
    } else {
        'login: loop {
            println!("Logging into Recd!\nUsername");
            let username = take_input();
            println!("Password");
            let password = take_input();
            match login(&pool, &username, &password).await.unwrap() {
                Some(user) => {
                    user_id = user;
                    println!(
                        "\nWelcome to Recd {}! Type help for a list of commands!",
                        username
                    );
                    break 'login;
                }
                None => println!("Invalid login info"),
            }
        }
    }

    'main_loop: loop {
        println!("Enter a command");
        let input = take_input();

        match input.as_str() {
            "addr" => {
                println!("Media to review");
                let media = take_input();
                let media_id = match find_media(&pool, &media).await.unwrap() {
                    Some(id) => id,
                    None => {
                        println!("No media named {} found!", media);
                        continue 'main_loop;
                    }
                };
                println!("Your rating (1-5)");
                let rating = take_input().parse::<i64>().unwrap();
                if rating < 1 || rating > 5 {
                    println!("Must choose a rating as an int between 1 and 5");
                    continue 'main_loop;
                }
                println!("Review message");
                let review_text = take_input();

                let _ = add_review(&pool, user_id, media_id, rating, &review_text).await;
                println!("Review posted!");
            }
            "addm" => {
                println!("Name of the media to add");
                let name = take_input();
                println!("Short desription of the media");
                let description = take_input();
                println!("The medium (Book/Show/Movie/Game/Song)");
                let medium = take_input().to_lowercase();
                let allowed_mediums = vec!["book", "show", "movie", "game", "song"];
                if !allowed_mediums.contains(&medium.as_str()) {
                    println!("Please choose a valid medium!");
                    continue 'main_loop;
                }
                let _ = add_media(&pool, &name, &description, &medium).await;
                println!("Media posted!");
            }
            "searchu" => {
                println!("Username");
                let username = take_input();
                let user_id = match find_user(&pool, &username).await.unwrap() {
                    Some(id) => id,
                    None => {
                        println!("No user named {} found", username);
                        continue 'main_loop;
                    }
                };
                let _ = list_user_reviews(&pool, user_id).await;
            }
            "searchm" => {
                println!("Name of the media");
                let media = take_input();
                let user_id = match find_media(&pool, &media).await.unwrap() {
                    Some(id) => id,
                    None => {
                        println!("No media named {} found", media);
                        continue 'main_loop;
                    }
                };
                let _ = list_media_reviews(&pool, user_id).await;
            }
            "listu" => {
                let _ = list_users(&pool).await;
            }
            "listm" => {
                let _ = list_media(&pool).await;
            }
            "help" => {
                println!("\nCommand list\n-addr: add review\n-addm: add media\n-searchu: search reviews by username\n-searchm: search reviews by media\n-listu: list users\n-listm: list media\n-quit: quit");
            }
            "quit" => {
                break 'main_loop;
            }
            _ => println!("Invalid Command"),
        }
        println!("");
    }

    println!("Closing Recd");
    pool.close().await;
}
