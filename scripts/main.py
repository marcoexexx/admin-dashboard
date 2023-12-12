#!/bin/python3.10

import logging
from pathlib import Path

from helpers.brands_excel_expoter import brands_export
from helpers.categories_excel_exporter import categories_export


logging.basicConfig(
    format="[ %(levelname)s::%(asctime)s ] %(message)s",
    level=logging.INFO
)


def main() -> None:
    brands_export(Path("./data/raw.json"))
    categories_export(Path("./data/raw.json"))


if __name__ == "__main__":
    main()
