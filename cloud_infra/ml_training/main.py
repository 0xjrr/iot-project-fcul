# main.py

import os
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import FunctionTransformer
from sklearn.pipeline import Pipeline
import pickle


# Load your data
df = pd.read_csv("data/train.csv", sep=";")
df["activity_bool"] = df.activity.astype('boolean')

# Extract features and target variable
X = df[['acceleration_x', 'acceleration_y', 'acceleration_z', 'gyro_x', 'gyro_y', 'gyro_z']]
y = df['activity']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Define the scaling function
def scale01(x):
    return (x - x.min()) / (x.max() - x.min())

# Create a pipeline with preprocessing and modeling steps
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='mean')),
    ('scaler', FunctionTransformer(func=scale01)),
    ('clf', RandomForestClassifier())
])

# Train the pipeline
pipeline.fit(X_train, y_train)
print (pipeline)

# Serialize the pipeline using pickle
with open('pipeline.pkl', 'wb') as file:
    pickle.dump(pipeline, file)

