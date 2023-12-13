#!/bin/python3.10

import logging
from pathlib import Path

from helpers.brands_excel_expoter import brands_export
from helpers.categories_excel_exporter import categories_export
from helpers.sales_categories_excel_exporter import sales_categories_export


INPUT_RAW_DATA = Path("./data/raw.json")

logging.basicConfig(
    format="[ %(levelname)s::%(asctime)s ] %(message)s",
    level=logging.INFO
)


def main() -> None:
    brands_export(INPUT_RAW_DATA)
    categories_export(INPUT_RAW_DATA)
    sales_categories_export(INPUT_RAW_DATA)


if __name__ == "__main__":
    main()
