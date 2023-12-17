from typing import List, Dict, Literal, TypedDict

from libs.parser import Brand, Category, SalesCategory, Specification
from libs.serializer import JSONSerializer, Path


"""
from: {'desc', 'image', 'dealer_price', 'price_unit', 'color', 'brand', 'specification', 'price', '_id', 'instock', 'market_price', 'updatedAt', 
       'discount_item', 'category', 'warranty', 'title', 'createdAt', 'discount', '__v', 'features', 'overview', 'display', 'type', 'sales_category'}
to: ['status', 'title', 'type', 'price', 'overview', 'features', 'marketPrice', 'categories', 'priceUnit', 'images', 'id', 'warranty', 'description', 
     'salesCategory', 'quantity', 'createdAt', 'specification', 'discount', 'instockStatus', 'dealerPrice', 'colors', 'updatedAt', 'brand', 'brandId']
"""
class RawProduct(TypedDict):
    desc: str
    image: List[str]
    dealer_price: int
    price_unit: Literal["USD", "SGD", "MMK", "THB", "KRW"]
    color: str
    brand: str
    specification: Dict
    price: int
    _id: Dict
    instock: str
    market_price: int
    discount_item: bool
    category: List[str]
    warranty: str
    title: str
    discount: int
    features: str
    overview: str
    display: bool  #  status
    type: str # product type
    sales_category: List[str]
    itemCode: List[str]  #  important


class Product(TypedDict):
    status: Literal["Draft", "Pending", "Published"]
    title: str
    type_: str
    price: float
    overview: str
    feature: str
    marketPrice: float
    categories: List[Category]  # id list
    priceUnit: Literal["USD", "SGD", "MMK", "THB", "KRW"]
    images: List[str]
    warranty: int  # by year
    description: str
    salesCategory: List[SalesCategory]  # id list
    quantity: int
    specification: List[Specification]
    discount: int
    instockStatus: Literal["InStock", "OutOfStock", "AskForStock"]
    dealerPrice: int
    colors: str
    brand: Brand  # brand name


def get_json_keys(path: Path) -> List:
    serializer = JSONSerializer[List[Dict]]()
    products = serializer.serialize(path)

    keys = []

    for product in products:
        for k, _ in product.items():
            keys.append(k)

    keys = set(keys)

    return list(keys)
