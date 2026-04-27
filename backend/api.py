
import os
import io
import numpy as np
import torch
import gdown

from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

from model.unified_model import UnifiedModel

app = Flask(__name__)
CORS(app)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

MODEL_PATH = "efficientnet_final.pth"
FILE_ID = "1hcFUOMx5LJ1j_Qx_R_EMF_pPU_EsAArO"

if not os.path.exists(MODEL_PATH):
    print("Downloading model from Google Drive...")
    gdown.download(
        f"https://drive.google.com/uc?id={FILE_ID}",
        MODEL_PATH,
        quiet=False
    )

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
TRANSLITERATION = {
    "stop": "நிறுத்து",
    "left_turn": "இடப்புறம் திரும்பவும்",
    "right_turn": "வலப்புறம் திரும்பவும்",
    "no_parking": "நிறுத்த தடை",
    "speed_limit": "வேக வரம்பு",
    "u_turn": "யு டர்ன்",
    "general_board": "பொது பலகை",
    "advertising_board": "விளம்பர பலகை",
    "other_boards": "மற்ற பலகை"
}

print("Loading model...")

model = UnifiedModel(
    backbone="efficientnet",
    num_classes=9,
    use_se=True
)

state = torch.load(MODEL_PATH, map_location=DEVICE)
model.load_state_dict(state)

model.to(DEVICE)
model.eval()

print("Model loaded successfully")

def softmax_manual(x):
    x = x - torch.max(x)
    exp = torch.exp(x)
    return exp / torch.sum(exp)

def preprocess(img):
    pil = Image.fromarray(img)
    pil = pil.resize((224, 224))

    arr = np.array(pil).astype(np.float32) / 255.0

    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])

    arr = (arr - mean) / std

    arr = np.transpose(arr, (2, 0, 1))

    tensor = torch.tensor(arr).float().unsqueeze(0)

    return tensor.to(DEVICE)

def get_candidates(img):

    h, w, _ = img.shape
    boxes = []

    step = 50
    size = 140

    for y in range(0, h - size, step):
        for x in range(0, w - size, step):

            crop = img[y:y+size, x:x+size]

            r = crop[:, :, 0].mean()
            g = crop[:, :, 1].mean()
            b = crop[:, :, 2].mean()

            # red / blue dominant regions
            if r > g + 20 or b > g + 20:
                boxes.append((x, y, x+size, y+size))

    if len(boxes) == 0:
        boxes.append((0, 0, w, h))

    return boxes

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
    best_conf = 0.0

    for box in boxes:

        x1, y1, x2, y2 = box

        crop = img[y1:y2, x1:x2]

        if crop.size == 0:
            continue

        inp = preprocess(crop)

        with torch.no_grad():

            out1, _ = model(inp)

            probs = softmax_manual(out1[0])

            conf, cls = torch.max(probs, 0)

            conf = float(conf.item())
            cls = int(cls.item())

        label = CLASS_NAMES[cls]

        # ignore non-sign boards
        if label in [
            "general_board",
            "advertising_board",
            "other_boards"
        ]:
            continue

        if conf > best_conf and conf > 0.55:
            best_conf = conf
            best_label = label

    return {
        "class": best_label,
        "confidence": round(best_conf, 4),
        "transliteration":
            TRANSLITERATION.get(best_label, "")
    }

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "message": "Traffic Sign AI API Live"
    })

@app.route("/predict", methods=["POST"])
def predict():

    try:

        if "file" not in request.files:
            return jsonify({
                "error": "No file uploaded"
            }), 400

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
        }), 500
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))

    app.run(
        host="0.0.0.0",
        port=port
    )
