use actix_web::{get, web, App, HttpResponse, HttpServer, Responder, post};
use lazy_static::lazy_static;
use neural_network::network::Network;
use serde::{Deserialize, Serialize};

const INPUT_LENGTH: usize = 6;

lazy_static! {
    static ref NETWORK: Network = Network::from_file("./examples/model/covid19").unwrap();
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[derive(Debug, Serialize, Deserialize)]
struct Input {
    input: Vec<f32>,
}

#[post("/predict")]
async fn predit(input: web::Json<Input>) -> impl Responder {
    if input.input.len() != INPUT_LENGTH {
        return HttpResponse::BadRequest().body("Incorrect input length");
    }
    HttpResponse::Ok().json(NETWORK.predict_ref(&input.input.clone()))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(hello).service(predit))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
