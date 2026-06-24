from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd



app = Flask(__name__)


# Allow frontend connection

CORS(
    app,
    resources={
        r"/*": {
            "origins": "*"
        }
    }
)



# ============================
# Load ML files
# ============================


model = joblib.load(
    "sepsis_xgboost_model.pkl"
)


scaler = joblib.load(
    "robust_scaler.pkl"
)


feature_columns = joblib.load(
    "feature_columns.pkl"
)


print("FEATURES:", feature_columns)





# ============================
# Home
# ============================


@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.json

        # ============================
        # Basic Vital Signs
        # ============================

        heart_rate = float(data["heart_rate"])
        temperature = float(data["temperature"])
        resp_rate = float(data["resp_rate"])
        oxygen = float(data["oxygen"])
        blood_pressure = float(data["blood_pressure"])   # SBP
        dbp = float(data["dbp"])

        # ============================
        # Additional ICU Parameters
        # ============================

        age = float(data["age"])
        gender = int(data["gender"])
        iculos = float(data["iculos"])
        hospadmtime = float(data["hospadmtime"])
        hour = float(data["hour"])

        # ============================
        # Derived Features
        # ============================

        map_value = (blood_pressure + (2 * dbp)) / 3

        shock_index = (
            heart_rate / blood_pressure
            if blood_pressure > 0
            else 0
        )

        # ============================
        # Create Input DataFrame
        # ============================

        input_df = pd.DataFrame([{

            "Hour": hour,

            "HR": heart_rate,

            "O2Sat": oxygen,

            "Temp": temperature,

            "SBP": blood_pressure,

            "MAP": map_value,

            "DBP": dbp,

            "Resp": resp_rate,

            "Age": age,

            "Gender": gender,

            "HospAdmTime": hospadmtime,

            "ICULOS": iculos,

            "Shock_Index": shock_index

        }])

        # Ensure exact column order
        input_df = input_df[feature_columns]

        # ============================
        # Scale Input
        # ============================

        scaled_input = scaler.transform(
            input_df
        )

        # ============================
        # Predict
        # ============================

        probability = model.predict_proba(
            scaled_input
        )[0][1]

        # ============================
        # Threshold
        # ============================

        THRESHOLD = 0.20

        if probability >= THRESHOLD:

            result = "High Sepsis Risk"

        else:

            result = "Low Sepsis Risk"

        # ============================
        # Return Response
        # ============================

        return jsonify({

            "prediction": result,

            "probability": round(
                float(probability) * 100,
                2
            ),

            "threshold": THRESHOLD,

            "map": round(map_value, 2),

            "shock_index": round(
                shock_index,
                3
            )

        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({

            "error": str(e)

        }), 500

# ============================
# Run
# ============================


if __name__ == "__main__":


    app.run(

        debug=True,

        port=5000

    )

    