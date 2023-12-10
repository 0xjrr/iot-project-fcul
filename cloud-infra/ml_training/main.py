# main.py

import os
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import FunctionTransformer
from sklearn.preprocessing import MinMaxScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
import pickle

# Load your data
df = pd.read_csv(os.path.join(os.getcwd(),'data', 'train.csv'), sep=";")
df["activity_bool"] = df.activity.astype('boolean')

# Extract features and target variable
X = df[['acceleration_x', 'acceleration_y', 'acceleration_z', 'gyro_x', 'gyro_y', 'gyro_z']]
y = df['activity']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)


# Create a pipeline with preprocessing and modeling steps
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='mean')),
    ('scaler', MinMaxScaler()),
    ('clf', RandomForestClassifier())
])

# Train the pipeline
pipeline.fit(X_train, y_train)
y_pred = pipeline.predict(X_test)
print("Pipeline steps:", pipeline.steps)
print("Model:", pipeline.named_steps['clf'])
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall:", recall_score(y_test, y_pred))
print("F1 Score:", f1_score(y_test, y_pred))

# Retrain on entire dataset
# pipeline.fit(X, y)

# Serialize the pipeline using pickle
with open(os.path.join(os.getcwd(),'model','pipeline.pkl'), 'wb+') as file:
    pickle.dump(pipeline, file)
    print("Model saved to model/pipeline.pkl")


