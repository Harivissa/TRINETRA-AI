"""Tests for backend/db/ — migration correctness and repository reads.

Run: python3 -m pytest tests/ -v
"""
import pytest
from backend.db.database import get_session
from backend.db.models import Country, CountryModule, Relationship, Chokepoint, Entity
from backend.data import repository


@pytest.fixture(autouse=True)
def clear_repo_cache():
    repository.clear_cache()
    yield
    repository.clear_cache()


class TestMigrationIntegrity:
    def test_exactly_21_countries_migrated(self):
        session = get_session()
        count = session.query(Country).count()
        session.close()
        assert count == 21

    def test_no_duplicate_country_ids(self):
        session = get_session()
        ids = [r.id for r in session.query(Country).all()]
        session.close()
        assert len(ids) == len(set(ids)), "Duplicate country IDs found in database"

    def test_all_country_ids_are_valid_iso_style(self):
        session = get_session()
        ids = [r.id for r in session.query(Country).all()]
        session.close()
        for cid in ids:
            assert cid.isupper() and cid.isalpha() and len(cid) == 3, f"Unexpected ID format: {cid}"

    def test_india_payload_matches_original_confidence(self):
        """Spot-check: a known field from the original JSON must survive
        migration unchanged."""
        session = get_session()
        india = session.query(Country).filter_by(id="IND").first()
        session.close()
        assert india is not None
        assert india.payload["id"] == "IND"
        assert india.payload["name"] == "India"
        # confidence extracted from the original _meta.confidence field
        assert india.confidence is not None

    def test_country_modules_migrated(self):
        session = get_session()
        modules = session.query(CountryModule).filter_by(country_id="IND").all()
        session.close()
        module_names = {m.module for m in modules}
        assert "history" in module_names
        assert "politics" in module_names

    def test_relationships_have_valid_country_pairs(self):
        session = get_session()
        rels = session.query(Relationship).filter(
            Relationship.country_a.isnot(None),
            Relationship.country_b.isnot(None),
        ).all()
        session.close()
        assert len(rels) > 0
        for r in rels:
            assert len(r.country_a) == 3
            assert len(r.country_b) == 3

    def test_chokepoints_migrated(self):
        session = get_session()
        count = session.query(Chokepoint).count()
        session.close()
        assert count >= 2  # this repo snapshot has 2 (Malacca, Hormuz)

    def test_entities_migrated(self):
        session = get_session()
        count = session.query(Entity).count()
        session.close()
        assert count > 0


class TestRepositoryReadsMatchOriginalBehaviour:
    def test_get_country_index_returns_21(self):
        index = repository.get_country_index()
        assert len(index) == 21

    def test_get_country_returns_full_payload(self):
        india = repository.get_country("IND")
        assert india is not None
        assert india["name"] == "India"
        assert "military" in india
        assert "energy" in india

    def test_get_country_case_insensitive(self):
        assert repository.get_country("ind") == repository.get_country("IND")

    def test_get_country_unknown_returns_none(self):
        assert repository.get_country("ZZZ") is None

    def test_get_country_module_returns_none_when_absent(self):
        # China has no deep-dive modules in this repo snapshot
        assert repository.get_country_module("CHN", "history") is None

    def test_get_country_module_returns_data_when_present(self):
        history = repository.get_country_module("IND", "history")
        assert history is not None
        assert "events" in history
        assert len(history["events"]) > 0

    def test_get_relationship_undirected(self):
        r1 = repository.get_relationship("IND", "CHN")
        r2 = repository.get_relationship("CHN", "IND")
        assert r1 is not None
        assert r1 == r2

    def test_get_relationship_unknown_pair_returns_none(self):
        assert repository.get_relationship("CAN", "BRA") is None

    def test_get_relationships_for_country(self):
        rels = repository.get_relationships_for("IND")
        assert len(rels) > 0
        for r in rels:
            assert r.get("country_a") == "IND" or r.get("country_b") == "IND"

    def test_get_chokepoints_returns_list(self):
        cps = repository.get_chokepoints()
        assert isinstance(cps, list)
        assert len(cps) > 0
        assert all("id" in cp for cp in cps)

    def test_get_deep_dive_analyses_only_for_india_china(self):
        assert len(repository.get_deep_dive_analyses("IND", "CHN")) > 0
        assert len(repository.get_deep_dive_analyses("CAN", "BRA")) == 0
