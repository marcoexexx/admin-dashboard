#!/bin/python3.10

import logging
from pathlib import Path
from typing import Dict, List

from libs.serializer import JSONSerializer
from libs.brand_parser import BrandParser
from libs.specification_parser import SpecificationParser

from helpers.exporter import exporter


INPUT_RAW_DATA = Path("./data/laptops.json")

logging.basicConfig(
    format="[ %(levelname)s::%(asctime)s ] %(message)s",
    level=logging.INFO
)


def export() -> None:
    serializer = JSONSerializer[List[Dict]]()

    brand_parser = BrandParser()
    exporter(serializer, brand_parser, INPUT_RAW_DATA)


def print_field() -> None:
    serializer = JSONSerializer[List[Dict]]()
    raw_products = serializer.serialize(INPUT_RAW_DATA)

    brands_parser = BrandParser()
    brands = brands_parser.parse(raw_products)

    specifications_parser = SpecificationParser()
    specifications = specifications_parser.parse(raw_products[0:1])

    print(brands, specifications)


def main() -> None:
    export()


if __name__ == "__main__":
    main()
