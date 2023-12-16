from dataclasses import dataclass
from typing import Dict, List, TypeVar, TypedDict

from .parser import Specification, Parser


class SpecificationBound(TypedDict):
    specification: Dict[str, str]

T = TypeVar("T", bound=SpecificationBound)

@dataclass(frozen=True)
class SpecificationParser(Parser[T]):
    def parse(self, raw: List[T]) -> List[Specification]:
        result: List[Specification] = []

        for obj in raw:
            for k, v in obj["specification"].items():
                result.append({ "name": k, "value": v })
            
        return result

    @property
    def label(self) -> str:
        return "specifications"
