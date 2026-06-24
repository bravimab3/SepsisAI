# SepsisAI

# SepsisAI – Early Sepsis Risk Prediction System

## Overview

SepsisAI is an end-to-end Machine Learning web application designed to predict the risk of sepsis in ICU patients using clinical vital signs and demographic information.

The system uses an XGBoost classification model trained on ICU patient data to provide real-time risk assessment and assist healthcare professionals in early intervention.

---

## Features

* Real-time sepsis risk prediction
* Interactive clinical dashboard
* ICU patient vital sign monitoring
* Dynamic risk visualization
* Model confidence scoring
* Clinical guidance recommendations
* Flask REST API backend
* Responsive frontend interface

---

## Tech Stack

### Frontend

* HTML5
* Tailwind CSS
* JavaScript
* Lucide Icons

### Backend

* Python
* Flask
* Flask-CORS

### Machine Learning

* XGBoost
* Scikit-Learn
* Pandas
* NumPy

---

## Dataset

The model was trained using ICU patient physiological data containing:

* Heart Rate
* Body Temperature
* Respiratory Rate
* Oxygen Saturation (SpO₂)
* Blood Pressure
* Age
* Gender
* ICU Length of Stay
* Hospital Admission Time
* Monitoring Hour

Target Variable:

* Sepsis (0 = No Sepsis, 1 = Sepsis)

---

## Model Performance

| Metric    | Score |
| --------- | ----- |
| Accuracy  | XX%   |
| Precision | XX%   |
| Recall    | XX%   |
| F1 Score  | XX%   |
| ROC-AUC   | XX%   |

*(Replace with your actual results.)*



## Project Structure


SepsisAI/
│
├── backend/
│   ├── app.py
│   ├── model.pkl
│   └── scaler.pkl
│
├── frontend/
│   ├── index.html
│   ├── prediction.html
│   ├── login.html
│   ├── signup.html
│   └── script.js
│
├── training_model.ipynb
├── requirements.txt
└── README.md
---

## Future Improvements

* User authentication system
* Prediction history database
* Patient management module
* Explainable AI (SHAP)
* Cloud deployment
* Real-time hospital integration
* LLM-powered clinical recommendations

---

## Author

Bravima B

Machine Learning | Data Science | Full Stack AI Development

GitHub: https://github.com/bravimab3
