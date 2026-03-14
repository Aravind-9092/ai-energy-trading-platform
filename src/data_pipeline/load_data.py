import pandas as pd

DATA_PATH = "data/raw/uae_weather_energy_data.csv"

def load_dataset():
    print("Loading dataset...")

    df = pd.read_csv(DATA_PATH, skiprows=12)

    print("\nFirst 5 rows:")
    print(df.head())

    print("\nDataset Shape:")
    print(df.shape)

    print("\nColumns:")
    print(df.columns)

    print("\nSummary Statistics:")
    print(df.describe())

    return df


def clean_data(df):

    print("\nChecking missing values...")
    print(df.isnull().sum())

    print("\nChecking duplicate rows...")
    print("Duplicates:", df.duplicated().sum())

    # Drop duplicates
    df = df.drop_duplicates()

    # Convert timestamp column if present
    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(df["timestamp"])

    print("\nData Types:")
    print(df.dtypes)

    print("\nCleaned dataset shape:")
    print(df.shape)

    return df


if __name__ == "__main__":

    data = load_dataset()

    clean_df = clean_data(data)