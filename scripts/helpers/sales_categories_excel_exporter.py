from typing import Dict, List

from libs.sales_catgory_parser import SalesCategoryParser
from libs.serializer import JSONSerializer, Path
from libs.excel import ExcelHandler


OUTPUT = "./sales-categories.xlsx"

def sales_categories_export(path: Path):
    serializer = JSONSerializer[List[Dict]]()
    raw_products = serializer.serialize(path)

    categories_parser = SalesCategoryParser()
    categories = categories_parser.parse(raw_products)

    excel_handler = ExcelHandler(data=categories, save_as=Path(OUTPUT))
    excel_handler.export()


