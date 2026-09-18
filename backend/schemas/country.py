from pydantic import BaseModel
from typing import Any


class CountrySchema(BaseModel):
    id: str
    name: str
    region: str | None = None
    demographics: dict[str, Any] = {}
    economy: dict[str, Any] = {}
    military: dict[str, Any] = {}
    energy: dict[str, Any] = {}
    infrastructure: dict[str, Any] = {}
    trade: dict[str, Any] = {}
    technology: dict[str, Any] = {}
    geography: dict[str, Any] = {}
    politics: dict[str, Any] = {}
    nuclear: dict[str, Any] = {}
    strategic_priorities: list[str] = []
    dependencies: list[str] = []
    vulnerabilities: list[str] = []
    strengths: list[str] = []
    alliances: list[str] = []
    rivals: list[str] = []
