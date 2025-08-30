import requests
import certifi
import pandas as pd
from io import StringIO

WIKI_URL = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
UA = {"User-Agent": "Mozilla/5.0"}

def _fetch_wiki_df() -> pd.DataFrame:
    r = requests.get(WIKI_URL, headers=UA, verify=certifi.where(), timeout=20)
    r.raise_for_status()
    # Wrap literal HTML to silence the FutureWarning
    tables = pd.read_html(StringIO(r.text))
    df = tables[0]
    return df

def get_sp500_list_df() -> pd.DataFrame:
    """Full constituents table as a DataFrame."""
    return _fetch_wiki_df()

