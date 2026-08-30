from pydantic import BaseModel
from typing import Any


class RelationshipSchema(BaseModel):
    country_a: str
    country_b: str
    relationship_type: str
    strategic_issues: list[str] = []
    trade_dependencies: list[str] = []
    energy_relationship: dict[str, Any] = {}
    military_relationship: dict[str, Any] = {}
    diplomatic_relationship: dict[str, Any] = {}
    major_disputes: list[str] = []
    areas_of_cooperation: list[str] = []
    escalation_factors: list[str] = []
    deescalation_factors: list[str] = []
