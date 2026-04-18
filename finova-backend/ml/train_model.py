import pandas as pd
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

def train_classifier(csv_path):
    """
    Trains a Logistic Regression model to classify transaction text into categories.
    """
    # 1. Load Data
    if not os.path.exists(csv_path):
        print(f"Error: Training file '{csv_path}' not found.")
        print("Please ensure you have a 'transactions_training.csv' in the same folder.")
        return

    df = pd.read_csv(csv_path)
    
    # 2. Preprocessing
    # Ensure no missing values in text columns
    df['merchant'] = df['merchant'].fillna('')
    df['description'] = df['description'].fillna('')
    
    # Combine merchant and description into a single feature string
    df['input_text'] = df['merchant'] + " " + df['description']
    
    # Prepare X (features) and y (target)
    X = df['input_text']
    y = df['category']

    # 3. Text Vectorization
    # TfidfVectorizer converts text to numerical vectors
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    X_tfidf = vectorizer.fit_transform(X)

    # 4. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X_tfidf, y, test_size=0.2, random_state=42)

    # 5. Model Training
    # Logistic Regression is efficient and reliable for text classification
    model = LogisticRegression(class_weight='balanced')
    model.fit(X_train, y_train)

    # 6. Evaluation
    y_pred = model.predict(X_test)
    print("--- Training Results ---")
    print(f"Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # 7. Save Artifacts
    # Save the model and vectorizer to current directory
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    with open('vectorizer.pkl', 'wb') as f:
        pickle.dump(vectorizer, f)

    print("Model and Vectorizer saved successfully as 'model.pkl' and 'vectorizer.pkl'!")

if __name__ == "__main__":
    # Path relative to this script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    training_file = os.path.join(current_dir, "transactions_training.csv")
    
    # Change CWD to script dir to ensure artifacts are saved there
    os.chdir(current_dir)
    
    train_classifier(training_file)
