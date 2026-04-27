# ==========================================================
# FINAL DETECTION + TRANSLITERATION
# Based on YOUR current working code
# ==========================================================

import torch
import cv2
import numpy as np
from PIL import Image
from torchvision import transforms
import easyocr

from indic_transliteration.sanscript import transliterate
from indic_transliteration import sanscript

from model.unified_model import UnifiedModel

# ==========================================================
# DEVICE
# ==========================================================
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using Device:", DEVICE)

MODEL_PATH = "efficientnet_final.pth"

CLASS_NAMES = [
    "stop",
    "general_board",
    "speed_limit",
    "no_parking",
    "right_turn",
    "advertising_board",
    "left_turn",
    "other_boards",
    "u_turn"
]

model = UnifiedModel(
    backbone="efficientnet",
    num_classes=9,
    use_se=True
)

model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()

print(" Model Loaded")

reader = easyocr.Reader(['en'])

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

def get_text_and_tamil(crop):

    try:
        result = reader.readtext(crop, detail=0)

        if len(result) == 0:
            return "No Text", "No Text"

        text = " ".join(result)

        tamil = transliterate(
            text,
            sanscript.ITRANS,
            sanscript.TAMIL
        )

        return text, tamil

    except:
        return "No Text", "Unable"

def enhance(img):

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    hsv[:,:,1] = cv2.equalizeHist(hsv[:,:,1])
    hsv[:,:,2] = cv2.equalizeHist(hsv[:,:,2])

    return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

def get_candidates(img):

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    lower_red1 = np.array([0,70,50])
    upper_red1 = np.array([10,255,255])

    lower_red2 = np.array([170,70,50])
    upper_red2 = np.array([180,255,255])

    red = cv2.inRange(hsv, lower_red1, upper_red1) + \
          cv2.inRange(hsv, lower_red2, upper_red2)

    lower_blue = np.array([100,100,50])
    upper_blue = np.array([140,255,255])

    blue = cv2.inRange(hsv, lower_blue, upper_blue)

    mask = red + blue

    kernel = np.ones((5,5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

    contours,_ = cv2.findContours(
        mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    boxes = []

    for cnt in contours:

        area = cv2.contourArea(cnt)

        if area < 400:
            continue

        x,y,w,h = cv2.boundingRect(cnt)

        if 0.6 < w/h < 1.4:
            boxes.append((x,y,x+w,y+h))

    return boxes

def classify_crop(crop):

    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    pil = Image.fromarray(rgb)

    inp = transform(pil).unsqueeze(0).to(DEVICE)

    with torch.no_grad():

        c_out, _ = model(inp)

        probs = torch.softmax(c_out, dim=1)

        conf, cls = torch.max(probs, 1)

    return cls.item(), conf.item()

def detect(image_path):

    image = cv2.imread(image_path)

    if image is None:
        print("Image not found")
        return

    image = enhance(image)
    output = image.copy()

    boxes = get_candidates(image)

    best_box = None
    best_cls = None
    best_conf = 0

    for (x1,y1,x2,y2) in boxes:

        crop = image[y1:y2, x1:x2]

        if crop.size == 0:
            continue

        cls, conf = classify_crop(crop)

        if conf < 0.85:
            continue

        if conf > best_conf:
            best_conf = conf
            best_cls = cls
            best_box = (x1,y1,x2,y2)

    if best_box is not None:

        x1,y1,x2,y2 = best_box

        crop = image[y1:y2, x1:x2]

        text, tamil = get_text_and_tamil(crop)

        cv2.rectangle(output,(x1,y1),(x2,y2),(0,255,0),3)

        cv2.putText(
            output,
            f"{CLASS_NAMES[best_cls]} {best_conf:.2f}",
            (x1,y1-10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0,255,0),
            2
        )

        print("\n Prediction :", CLASS_NAMES[best_cls])
        print(" Confidence :", round(best_conf,4))
        print(" OCR Text   :", text)
        print(" Tamil      :", tamil)

    else:
        print("No sign detected")

    cv2.imshow("Detection", output)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    detect("test_image.png")