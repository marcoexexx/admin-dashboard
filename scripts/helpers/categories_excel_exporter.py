from typing import List

from libs.category_parser import CategoryParser
from libs.serializer import JSONSerializer, Path
from libs.excel import ExcelHandler
from helpers.get_keys import Product


OUTPUT = "./categories.xlsx"

def categories_export(path: Path):
    serializer = JSONSerializer[List[Product]]()
    raw_products = serializer.serialize(path)

    categories_parser = CategoryParser()
    categories = categories_parser.parse(raw_products)

    excel_handler = ExcelHandler(data=categories, save_as=Path(OUTPUT))
    excel_handler.export()

