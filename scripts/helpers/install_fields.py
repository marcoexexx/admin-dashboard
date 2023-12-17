from dataclasses import dataclass
from pathlib import Path
from typing import List

from libs.brand_parser import BrandParser
from libs.category_parser import CategoryParser
from libs.sales_catgory_parser import SalesCategoryParser
from libs.serializer import Serializer
from libs.specification_parser import SpecificationParser
from helpers.get_keys import Product, RawProduct


@dataclass(frozen=True)
class InstallFields:
    raw_path: Path

    def install(self, serializer: Serializer[List[RawProduct]]) -> List[Product]:
        raw = serializer.serialize(self.raw_path)

        result: List[Product] = []

        for product in raw:
            brand = BrandParser().parse(product)
            categories = CategoryParser().parse(product)
            sales_categories = SalesCategoryParser().parse(product)
            specifications = SpecificationParser().parse(product)

            data = Product(
                status = "Pending",
                title = product.get("title", "exportted product"),
                type_ = product.get("type", 0),
                price = product.get("price", 0),
                overview = product["overview"],
                feature = product["features"],
                marketPrice = product.get("market_price", 0),
                categories = categories,
                priceUnit = product["price_unit"],
                images = product["image"],
                warranty = 0,
                description = product["desc"],
                salesCategory = sales_categories,
                quantity = 1,
                specification = specifications,
                discount = product["discount"],
                instockStatus = "AskForStock",
                dealerPrice = product.get("dealer_price", 0),
                colors = product["color"],
                brand = brand
            )

            result.append(data)

        return result
