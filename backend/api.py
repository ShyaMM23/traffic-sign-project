# ==========================================================
# FINAL PRODUCTION api.py
# Manual Detection + EfficientNet + Transliteration
# Flask Backend
# ==========================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import numpy as np
from PIL import Image
import io
import math

from model.unified_model import UnifiedModel

# ==========================================================
# APP
# ==========================================================
app = Flask(__name__)
CORS(app)

# ==========================================================
# DEVICE
# ==========================================================
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MODEL_PATH = "efficientnet_final.pth"

CLASS_NAMES = [
    "stop",
    "general_board",
    "left_turn",
    "no_parking",
    "right_turn",
    "advertising_board",
    "speed_limit",
    "other_boards",
    "u_turn"
]

# ==========================================================
# TRANSLITERATION
# ==========================================================
TRANSLITERATION = {
    "stop": "நிறுத்து",
    "left_turn": "இடப்புறம் திரும்பவும்",
    "right_turn": "வலப்புறம் திரும்பவும்",
    "no_parking": "நிறுத்த தடை",
    "speed_limit": "வேக வரம்பு",
    "u_turn": "யு டர்ன்",
    "general_board": "பொது பலகை",
    "advertising_board": "விளம்பர பலகை",
    "other_boards": "மற்ற பலகை"
}

# ==========================================================
# LOAD MODEL
# ==========================================================
model = UnifiedModel(
    backbone="efficientnet",
    num_classes=9,
    use_se=True
)

model.load_state_dict(
    torch.load(MODEL_PATH, map_location=DEVICE)
)

model.to(DEVICE)
model.eval()

print("🔥 Model Loaded")

# ==========================================================
# MANUAL SOFTMAX
# ==========================================================
def softmax_manual(x):
    exp = torch.exp(x - torch.max(x))
    return exp / exp.sum()

# ==========================================================
# MANUAL RESIZE
# ==========================================================
def resize_manual(img, size=224):
    pil = Image.fromarray(img)
    pil = pil.resize((size, size))
    return np.array(pil)

# ==========================================================
# TO TENSOR
# ==========================================================
def to_tensor(img):
    img = img.astype(np.float32) / 255.0

    mean = np.array([0.485, 0.456, 0.406])
    std  = np.array([0.229, 0.224, 0.225])

    img = (img - mean) / std

    img = np.transpose(img, (2, 0, 1))

    tensor = torch.tensor(img).float().unsqueeze(0)

    return tensor

# ==========================================================
# MANUAL RED BLUE REGION SEARCH
# ==========================================================
def get_candidates(img):

    h, w, _ = img.shape

    boxes = []

    step = 40

    for y in range(0, h - 60, step):
        for x in range(0, w - 60, step):

            crop = img[y:y+120, x:x+120]

            if crop.shape[0] < 60 or crop.shape[1] < 60:
                continue

            r = crop[:, :, 0].mean()
            g = crop[:, :, 1].mean()
            b = crop[:, :, 2].mean()

            # detect red / blue dominant areas
            if r > g + 25 or b > g + 25:
                boxes.append((x, y, x+120, y+120))

    return boxes

# ==========================================================
# DETECTION
# ==========================================================
def detect_image(img):

    h, w, _ = img.shape

    # Resize large image
    if w > 700:
        scale = 700 / w
        nh = int(h * scale)

        pil = Image.fromarray(img)
        pil = pil.resize((700, nh))

        img = np.array(pil)

    boxes = get_candidates(img)

    best_label = "no_sign"
    best_conf = 0

    for box in boxes:

        x1, y1, x2, y2 = box

        crop = img[y1:y2, x1:x2]

        if crop.size == 0:
            continue

        crop = resize_manual(crop, 224)

        inp = to_tensor(crop).to(DEVICE)

        with torch.no_grad():

            out1, _ = model(inp)

            probs = softmax_manual(out1[0])

            conf, cls = torch.max(probs, 0)

            conf = float(conf.item())
            cls = int(cls.item())

        if conf > best_conf and conf > 0.60:

            label = CLASS_NAMES[cls]

            if label in [
                "advertising_board",
                "general_board",
                "other_boards"
            ]:
                continue

            best_conf = conf
            best_label = label

    return {
        "class": best_label,
        "confidence": round(best_conf, 4),
        "transliteration":
        TRANSLITERATION.get(best_label, "")
    }

# ==========================================================
# API ROUTE
# ==========================================================
@app.route("/predict", methods=["POST"])
def predict():

    try:

        if "file" not in request.files:
            return jsonify({
                "error": "No file uploaded"
            })

        file = request.files["file"]

        img_bytes = file.read()

        pil = Image.open(
            io.BytesIO(img_bytes)
        ).convert("RGB")

        img = np.array(pil)

        result = detect_image(img)

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# ==========================================================
# RUN
# ==========================================================
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )