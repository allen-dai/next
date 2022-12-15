use mnist::Mnist;
use neural_network::activations::ActivationFn;
use neural_network::activations::Sigmoid;
use neural_network::layer::dense::DenseLayer;
use neural_network::layer::LayerType;
use neural_network::loss::MSE;
use neural_network::network::Net;
use neural_network::network::Network;
use neural_network::trainer::Trainer;
use rand::thread_rng;
use std::fs::File;
use std::io::{self, BufRead};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut data: Vec<Vec<f32>> = io::BufReader::new(File::open("./examples/data/dataset")?)
        .lines()
        .skip(1)
        .map(|l| {
            l.unwrap()
                .split(" ")
                .map(|s| s.parse::<f32>().unwrap())
                .collect()
        })
        .collect();

    let mut label: Vec<Vec<f32>> = io::BufReader::new(File::open("./examples/data/datalabel")?)
        .lines()
        .skip(1)
        .map(|l| {
            l.unwrap()
                .split(" ")
                .map(|s| s.parse::<f32>().unwrap())
                .collect()
        })
        .collect();

    label.iter_mut().for_each(|row| {
        if row.iter().all(|n| n < &1.0f32) {
            row.push(1f32);
        } else {
            row.push(0f32);
        }
    });

    let mut train_set = Vec::new();
    let mut train_label = Vec::new();
    let mut test_set = Vec::new();
    let mut test_label = Vec::new();

    let mut rng = rand::thread_rng();
    let sample = rand::seq::index::sample(&mut rng, data.len(), data.len()).into_vec();

    for i in &sample[..sample.len() / 7] {
        train_set.push(data[*i].clone());
        train_label.push(label[*i].clone());
    }

    for i in &sample[(sample.len() / 7)..] {
        test_set.push(data[*i].clone());
        test_label.push(label[*i].clone());
    }

    println!("{:?}", data.len());
    println!("{:?}", label.len());

    let mut network = Network::from_file("./examples/model/covid19")?;

    /* let mut network = Network::new(vec![
        Net::Layer(LayerType::Dense(DenseLayer::new(6, 20))),
        Net::Activation(ActivationFn::Sigmoid(Sigmoid::default())),
        Net::Layer(LayerType::Dense(DenseLayer::new(20, 10))),
        Net::Activation(ActivationFn::Sigmoid(Sigmoid::default())),
        Net::Layer(LayerType::Dense(DenseLayer::new(10, 3))),
        Net::Activation(ActivationFn::Sigmoid(Sigmoid::default())),
    ]); */

    /* Trainer::cpu(
        &mut network,
        MSE {},
        &train_set,
        &train_label,
        0.01f32,
        1000,
        true,
        "./examples/model/covid19",
    ); */

    let mut score = 0;
    for i in 0..test_set.len() {
        let pred = network
            .predict_ref(&test_set[i])
            .iter()
            .enumerate()
            .max_by(|(_, a), (_, b)| a.total_cmp(b))
            .map(|(index, _)| index)
            .unwrap();
        let expect = test_label[i]
            .iter()
            .enumerate()
            .max_by(|(_, a), (_, b)| a.total_cmp(b))
            .map(|(index, _)| index)
            .unwrap();
        if pred == expect {
            score += 1
        }
    }

    println!("Accurarcy: {}", score as f32 / test_set.len() as f32);

    Ok(())
}
