import os

pg_config = {
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'dbhost': os.getenv("DB_HOST"),
    'dbname': os.getenv("DB_NAME"),
    'dbport': os.getenv("DB_PORT")
}
