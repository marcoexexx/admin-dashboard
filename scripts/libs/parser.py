from abc import ABC, abstractmethod
from typing import Generic, List, Literal, TypeVar, TypedDict


class Brand(TypedDict):
    name: str


class Specification(TypedDict):
    name: str
    value: str


class Category(TypedDict):
    name: str


class SalesCategory(TypedDict):
    name: str


class Exchange(TypedDict):
    to: Literal["USD", "SGD", "MMK", "THB", "KRW"]
    from_: Literal["USD", "SGD", "MMK", "THB", "KRW"]
    rate: float
    date: str


T = TypeVar("T")

class Parser(Generic[T], ABC):
    """Object parser"""
    @abstractmethod
    def parse(self, raw: List[T]) -> List[T]:
        """parser objectABC"""

    @property
    @abstractmethod
    def label(self) -> str:
        """get parser name"""
