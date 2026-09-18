"""Tests for backend/app.py — API endpoints, unchanged behaviour after
migrating the data layer from JSON files to SQLite."""
import pytest
from backend.app import app as flask_app
from backend.data import repository


@pytest.fixture
def client():
    repository.clear_cache()
    flask_app.config["TESTING"] = True
    with flask_app.test_client() as c:
        yield c


class TestCountryEndpoints:
    def test_list_countries(self, client):
        r = client.get("/api/countries")
        assert r.status_code == 200
        assert len(r.get_json()) == 21

    def test_get_single_country(self, client):
        r = client.get("/api/countries/IND")
        assert r.status_code == 200
        assert r.get_json()["name"] == "India"

    def test_get_unknown_country_404(self, client):
        r = client.get("/api/countries/ZZZ")
        assert r.status_code == 404

    def test_country_energy(self, client):
        r = client.get("/api/countries/IND/energy")
        assert r.status_code == 200

    def test_country_modules_list(self, client):
        r = client.get("/api/countries/IND/modules")
        assert r.status_code == 200
        assert "history" in r.get_json()["available_modules"]

    def test_country_module_generic_route(self, client):
        r = client.get("/api/countries/IND/history")
        assert r.status_code == 200
        assert "events" in r.get_json()

    def test_country_module_not_populated_returns_404_not_fake_data(self, client):
        r = client.get("/api/countries/CHN/history")
        assert r.status_code == 404
        assert "error" in r.get_json()


class TestRelationshipEndpoints:
    def test_known_relationship(self, client):
        r = client.get("/api/relationships/IND/CHN")
        assert r.status_code == 200
        assert r.get_json()["relationship_type"] == "strategic_rivalry"

    def test_unknown_relationship_404(self, client):
        r = client.get("/api/relationships/CAN/BRA")
        assert r.status_code == 404


class TestRivalryAnalysis:
    @pytest.mark.parametrize("a,b", [
        ("IND", "CHN"), ("IND", "PAK"), ("IND", "BGD"),
        ("CHN", "USA"), ("IND", "RUS"), ("USA", "RUS"),
    ])
    def test_rivalry_analysis_returns_200(self, client, a, b):
        r = client.post("/api/analysis/rivalry", json={"country_a": a, "country_b": b})
        assert r.status_code == 200
        d = r.get_json()
        assert "military" in d
        assert "economic" in d
        assert "energy" in d
        assert "chokepoints" in d
        assert "resilience_profile" in d

    def test_rivalry_missing_country_400_or_404(self, client):
        r = client.post("/api/analysis/rivalry", json={"country_a": "IND"})
        assert r.status_code == 400

    def test_rivalry_unknown_country_404(self, client):
        r = client.post("/api/analysis/rivalry", json={"country_a": "IND", "country_b": "ZZZ"})
        assert r.status_code == 404

    def test_india_china_has_deep_dive_analyses(self, client):
        r = client.post("/api/analysis/rivalry", json={"country_a": "IND", "country_b": "CHN"})
        assert len(r.get_json()["deep_dive_analyses"]) > 0

    def test_unrelated_pair_has_no_deep_dive_analyses(self, client):
        r = client.post("/api/analysis/rivalry", json={"country_a": "CAN", "country_b": "BRA"})
        assert len(r.get_json()["deep_dive_analyses"]) == 0


class TestNetworkAndHealth:
    def test_network(self, client):
        r = client.get("/api/network")
        assert r.status_code == 200
        d = r.get_json()
        assert len(d["nodes"]) == 21
        assert "edges" in d

    def test_health(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        assert r.get_json()["status"] == "ok"


class TestSemanticSearchEndpoint:
    def test_search_requires_query(self, client):
        r = client.post("/api/search", json={})
        assert r.status_code == 400

    def test_search_returns_results_shape(self, client, monkeypatch):
        # Stub the embedding model so this test doesn't need network
        # access to huggingface.co (unavailable in some CI/sandbox
        # environments) - verifies the API wiring and result shape,
        # not embedding quality.
        import backend.analysis.semantic_search as ss
        import numpy as np

        class FakeModel:
            def encode(self, texts, convert_to_numpy=True, show_progress_bar=False):
                return np.random.rand(len(texts), 10)

        ss._model = FakeModel()
        ss._index = None

        r = client.post("/api/search", json={"query": "India China dependency", "top_k": 3})
        assert r.status_code == 200
        d = r.get_json()
        assert d["query"] == "India China dependency"
        assert len(d["results"]) <= 3
        for result in d["results"]:
            assert set(result.keys()) >= {
                "record_id", "record_type", "entity", "relevance", "source", "confidence", "text_excerpt",
            }
