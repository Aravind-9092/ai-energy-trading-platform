import pandas as pd

DATA_PATH = "data/raw/uae_weather_energy_data.csv"


def load_dataset():
    print("Loading dataset...")

    # Skip metadata rows
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

    # Remove duplicates
    df = df.drop_duplicates()

    print("\nEnergy-related column statistics:")

    energy_cols = ["T2M", "WS10M", "ALLSKY_SFC_SW_DWN", "RH2M"]
    print(df[energy_cols].describe())

    print("\nData Types:")
    print(df.dtypes)

    print("\nCleaned dataset shape:")
    print(df.shape)

    return df


def create_timestamp(df):

    print("\nCreating timestamp column...")

    df["timestamp"] = pd.to_datetime(
        df[["YEAR", "MO", "DY", "HR"]].rename(
            columns={
                "YEAR": "year",
                "MO": "month",
                "DY": "day",
                "HR": "hour"
            }
        )
    )

    print("Timestamp created successfully.")

    return df


def save_processed_data(df):

    print("\nSaving processed dataset...")

    output_path = "data/processed/clean_energy_weather.csv"

    df.to_csv(output_path, index=False)

    print(f"Dataset saved to: {output_path}")


if __name__ == "__main__":

    # Step 1: Load dataset
    data = load_dataset()

    # Step 2: Clean dataset
    data = clean_data(data)

    # Step 3: Create timestamp
    data = create_timestamp(data)

    # Step 4: Save processed dataset
    save_processed_data(data)

    print("\nFirst 5 rows with timestamp:")
    print(data.head())