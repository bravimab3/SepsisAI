// ===============================
// SepsisAI Frontend Script
// ===============================


// Load icons
if (typeof lucide !== "undefined") {
    lucide.createIcons();
}


// ===============================
// Navigation
// ===============================

function goToPrediction() {
    window.location.href = "prediction.html";
}

function goToLogin() {
    window.location.href = "login.html";
}

function goToSignup() {
    window.location.href = "signup.html";
}


// ===============================
// Calculate MAP & Shock Index Live
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const heartRateInput =
        document.getElementById("heart_rate");

    const sbpInput =
        document.getElementById("blood_pressure");

    const dbpInput =
        document.getElementById("dbp");

    const mapDisplay =
        document.getElementById("map_value");

    const shockDisplay =
        document.getElementById("shock_index");

    function updateIndicators() {

        if (
            !heartRateInput ||
            !sbpInput ||
            !dbpInput
        ) {
            return;
        }

        const hr =
            parseFloat(heartRateInput.value) || 0;

        const sbp =
            parseFloat(sbpInput.value) || 0;

        const dbp =
            parseFloat(dbpInput.value) || 0;

        // MAP

        if (sbp > 0 && dbp > 0) {

            const map =
                (sbp + (2 * dbp)) / 3;

            if (mapDisplay) {
                mapDisplay.textContent =
                    map.toFixed(1);
            }

        }

        // Shock Index

        if (hr > 0 && sbp > 0) {

            const shock =
                hr / sbp;

            if (shockDisplay) {
                shockDisplay.textContent =
                    shock.toFixed(2);
            }

        }
    }

    if (heartRateInput)
        heartRateInput.addEventListener(
            "input",
            updateIndicators
        );

    if (sbpInput)
        sbpInput.addEventListener(
            "input",
            updateIndicators
        );

    if (dbpInput)
        dbpInput.addEventListener(
            "input",
            updateIndicators
        );

    updateIndicators();
});


// ===============================
// Sepsis Prediction
// Frontend → Flask → XGBoost
// ===============================

async function runPrediction() {

    console.log(
        "Prediction button clicked"
    );

    try {

        const patientData = {

            heart_rate: Number(
                document.getElementById(
                    "heart_rate"
                ).value
            ),

            temperature: Number(
                document.getElementById(
                    "temperature"
                ).value
            ),

            resp_rate: Number(
                document.getElementById(
                    "resp_rate"
                ).value
            ),

            oxygen: Number(
                document.getElementById(
                    "oxygen"
                ).value
            ),

            blood_pressure: Number(
                document.getElementById(
                    "blood_pressure"
                ).value
            ),

            dbp: Number(
                document.getElementById(
                    "dbp"
                ).value
            ),

            age: Number(
                document.getElementById(
                    "age"
                ).value
            ),

            gender: Number(
                document.getElementById(
                    "gender"
                ).value
            ),

            iculos: Number(
                document.getElementById(
                    "iculos"
                ).value
            ),

            hospadmtime: Number(
                document.getElementById(
                    "hospadmtime"
                ).value
            ),

            hour: Number(
                document.getElementById(
                    "hour"
                ).value
            )

        };

        console.log(
            "Sending Data:",
            patientData
        );

        const response = await fetch(

            "/predict",

            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify(
                    patientData
                )
            }
        );

        const result =
            await response.json();

        console.log(
            "Backend Response:",
            result
        );

        // =========================
        // Update Probability
        // =========================

        const probabilityElement =
            document.getElementById(
                "risk-probability"
            );

        if (
            probabilityElement
        ) {

            probabilityElement.innerHTML =
                result.probability + "%";
        }

        // =========================
        // Update Risk Text
        // =========================

        const riskElement =
    document.getElementById("risk-result");

const riskStatus =
    document.getElementById("risk-status");

const riskLevel =
    document.getElementById("risk-level");

riskElement.innerText =
    result.prediction;

if(result.prediction.includes("High")){

    riskStatus.innerText =
        "HIGH SEPSIS RISK";

    riskLevel.innerText =
        "CRITICAL";

}else{

    riskStatus.innerText =
        "LOW SEPSIS RISK";

    riskLevel.innerText =
        "STABLE";

}

        if (
            riskElement
        ) {

            riskElement.innerHTML =
                result.prediction;

            if (
                result.prediction.includes(
                    "High"
                )
            ) {

                riskElement.style.color =
                    "red";

            } else {

                riskElement.style.color =
                    "green";
            }
        }

        // =========================
        // Confidence
        // =========================

        const confidenceElement =
    document.getElementById(
        "model-confidence"
    );

confidenceElement.innerText =
    result.probability + "%";
        if (
            confidenceElement
        ) {

            confidenceElement.innerHTML =
                result.probability + "%";
        }
        

        const guidance =
document.getElementById(
    "clinical-guidance"
);

if(result.probability >= 80){

    guidance.innerText =
    `A ${result.probability}% risk score indicates a critical likelihood of sepsis. Immediate ICU review and intervention are strongly recommended.`;

}
else if(result.probability >= 50){

    guidance.innerText =
    `A ${result.probability}% risk score indicates elevated sepsis risk. Continuous monitoring and clinical assessment are recommended.`;

}
else if(result.probability >= 20){

    guidance.innerText =
    `A ${result.probability}% risk score suggests moderate concern. Monitor vital signs closely and reassess the patient regularly.`;

}
else{

    guidance.innerText =
    `A ${result.probability}% risk score indicates low sepsis risk. Continue routine monitoring and standard clinical care.`;

}
        // =========================
        // Success Popup
        // =========================

        

    }

    catch (error) {

        console.error(
            "Prediction Error:",
            error
        );

        alert(

            "Cannot connect to Flask API.\n\n" +

            "Make sure app.py is running."

        );

    }

}