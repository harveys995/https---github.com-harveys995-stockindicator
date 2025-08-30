import pandas as pd

def get_s&p_fulllist():
url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
tables = pd.read_html(url)
sp500_df = tables[0]  # first table is the constituents
print(sp500_df.head())
