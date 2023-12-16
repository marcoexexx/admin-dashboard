from pathlib import Path
from libs.excel import ExcelHandler
from libs.parser import Parser
from libs.serializer import Serializer


def exporter(serializer: Serializer, parser: Parser, path: Path):
    raw_products = serializer.serialize(path)

    categories = parser.parse(raw_products)
    
    output = path.parent / (path.name)

    excel_handler = ExcelHandler(data=categories, save_as=Path(output.with_suffix(".xlsx")))
    excel_handler.export()
