from typing import Dict, List

from libs.brand_parser import BrandParser
from libs.serializer import JSONSerializer, Path
from libs.excel import ExcelHandler


OUTPUT = "./brands.xlsx"

def brands_export(path: Path):
    serializer = JSONSerializer[List[Dict]]()
    raw_products = serializer.serialize(path)

    brands_parser = BrandParser()
    brands = brands_parser.parse(raw_products)

    excel_handler = ExcelHandler(data=brands, save_as=Path(OUTPUT))
    excel_handler.export()
