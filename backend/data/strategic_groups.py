"""Neutral, centralized definitions for strategic groupings.
Membership is descriptive; no bloc ranking or composite score is implied.
"""
GROUPS = [
    {"id": "g20", "name": "G20", "description": "Forum for major advanced and emerging economies focused on global economic cooperation and financial stability.", "focus_areas": ["Global economy", "Finance", "Trade", "Development"], "members": ["ARG", "AUS", "BRA", "CAN", "CHN", "FRA", "DEU", "IND", "IDN", "ITA", "JPN", "MEX", "RUS", "SAU", "ZAF", "KOR", "TUR", "GBR", "USA", "EU", "AU"]},
    {"id": "g7", "name": "G7", "description": "Coordination forum of advanced industrial democracies addressing economic, security and global policy issues.", "focus_areas": ["Advanced economies", "Security", "Technology", "Global governance"], "members": ["CAN", "FRA", "DEU", "ITA", "JPN", "GBR", "USA", "EU"]},
    {"id": "brics", "name": "BRICS", "description": "Cooperation grouping centered on emerging economies, development, finance and reform of global institutions.", "focus_areas": ["Emerging economies", "Development finance", "Trade", "Global governance"], "members": ["BRA", "RUS", "IND", "CHN", "ZAF", "EGY", "ETH", "IRN", "ARE", "IDN"]},
    {"id": "sco", "name": "SCO", "description": "Eurasian cooperation organization focused on security, regional stability and economic cooperation.", "focus_areas": ["Regional security", "Counterterrorism", "Eurasia", "Economic cooperation"], "members": ["CHN", "IND", "KAZ", "KGZ", "PAK", "RUS", "TJK", "UZB", "IRN", "BEL"]},
    {"id": "quad", "name": "QUAD", "description": "Diplomatic partnership focused on a free, open, inclusive and resilient Indo-Pacific.", "focus_areas": ["Indo-Pacific", "Maritime security", "Resilient supply chains", "Critical technology"], "members": ["AUS", "IND", "JPN", "USA"]},
]

def get_groups():
    return GROUPS

def get_group(group_id):
    return next((group for group in GROUPS if group["id"] == group_id.lower()), None)
