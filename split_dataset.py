import os
import shutil
import random

TRAIN_IMAGES = "data/train/images"
TRAIN_LABELS = "data/train/labels"

VAL_IMAGES = "data/val/images"
VAL_LABELS = "data/val/labels"

SPLIT_RATIO = 0.2  # 20% validation

image_files = [
    f for f in os.listdir(TRAIN_IMAGES)
    if f.lower().endswith((".jpg", ".jpeg", ".png"))
]

random.shuffle(image_files)

val_size = int(len(image_files) * SPLIT_RATIO)
val_files = image_files[:val_size]

print(f"Total images: {len(image_files)}")
print(f"Validation images: {val_size}")
print(f"Training images after split: {len(image_files) - val_size}")

for img_name in val_files:
    label_name = img_name.replace(".png", ".txt").replace(".jpg", ".txt")

    # Move image
    shutil.move(
        os.path.join(TRAIN_IMAGES, img_name),
        os.path.join(VAL_IMAGES, img_name)
    )

    # Move label
    shutil.move(
        os.path.join(TRAIN_LABELS, label_name),
        os.path.join(VAL_LABELS, label_name)
    )

print("✅ Dataset split completed successfully!")