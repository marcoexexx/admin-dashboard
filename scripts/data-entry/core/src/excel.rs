use std::{io::Cursor, fs::File};

use polars::io::{json::JsonReader, SerReader, csv::CsvWriter, SerWriter};
use serde::Serialize;


pub fn export_excel<T>(products: &Vec<T>) 
where
    T: Serialize
{
    let json = serde_json::to_string(&products).expect("Failed: could not serialize json");

    let cursor = Cursor::new(json);
    let mut df = JsonReader::new(cursor).finish().expect("Failed: could not convert DataFrame");

    println!("{}", df);

    let mut file = File::create("some.csv").expect("Failed: could not create csv");

    CsvWriter::new(&mut file).finish(&mut df).expect("Faield: could not write csv");
}
