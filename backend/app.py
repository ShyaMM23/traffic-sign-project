from fastapi import FastAPI, File, UploadFile
import torch
import cv2
import numpy as np
import io
from PIL import Image
from model.cnn_model import RoadSignNet
import uvicorn

app = FastAPI()

# Load best model (baseline was best)
MODEL_PATH = "model_baseline.pth"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = RoadSignNet(num_classes=8, use_se=False).to(device)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

CLASS_NAMES = [
    "Speed Limit",
    "Stop",
    "No Entry",
    "Yield",
    "Pedestrian",
    "Traffic Light",
    "Turn Left",
    "Turn Right"
]

DESCRIPTIONS = {
    "Speed Limit": "Maximum speed allowed on this road.",
    "Stop": "You must come to a complete stop.",
    "No Entry": "Vehicles cannot enter.",
    "Yield": "Give priority to other vehicles.",
    "Pedestrian": "Pedestrian crossing ahead.",
    "Traffic Light": "Traffic signal ahead.",
    "Turn Left": "Left turn permitted.",
    "Turn Right": "Right turn permitted."
}


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = np.array(image)

    original_h, original_w = image.shape[:2]

    img_resized = cv2.resize(image, (32, 32))
    img_resized = img_resized / 255.0
    img_resized = np.transpose(img_resized, (2, 0, 1))
    img_tensor = torch.tensor(img_resized, dtype=torch.float32).unsqueeze(0).to(device)

    with torch.no_grad():
        class_out, bbox_out = model(img_tensor)

        _, predicted = torch.max(class_out, 1)
        predicted_class = CLASS_NAMES[predicted.item()]

        bbox = bbox_out[0].cpu().numpy()

    x_min = int(bbox[0] * original_w)
    y_min = int(bbox[1] * original_h)
    x_max = int(bbox[2] * original_w)
    y_max = int(bbox[3] * original_h)

    return {
        "class": predicted_class,
        "description": DESCRIPTIONS.get(predicted_class, ""),
        "bbox": [x_min, y_min, x_max, y_max]
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)