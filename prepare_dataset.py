import os
import shutil
import cv2

# 🔹 Path to your extracted GTSRB dataset
GTSRB_PATH = r"D:\datasets\GTSRB\Training"

# 🔹 Path to your project dataset folder
PROJECT_IMAGES = r"D:\road-sign-project\data\train\images"
PROJECT_LABELS = r"D:\road-sign-project\data\train\labels"

# 🔹 Selected folders and new class mapping
CLASS_MAP = {
    "00014": 0,  # Stop
    "00001": 1,  # Speed 30
    "00002": 2,  # Speed 50
    "00005": 3,  # Speed 80
    "00017": 4,  # No Entry
    "00038": 5,  # Keep Right
    "00025": 6,  # Road Work
    "00012": 7   # Priority Road
}

image_counter = 0

for folder_name, new_class_id in CLASS_MAP.items():

    folder_path = os.path.join(GTSRB_PATH, folder_name)

    if not os.path.exists(folder_path):
        print(f"Folder {folder_name} not found!")
        continue

    print(f"Processing class {folder_name} → New ID {new_class_id}")

    for file in os.listdir(folder_path):

        if file.endswith(".ppm") or file.endswith(".png") or file.endswith(".jpg"):

            old_image_path = os.path.join(folder_path, file)

            # Read image
            image = cv2.imread(old_image_path)

            if image is None:
                continue

            height, width, _ = image.shape

            # Create new name
            new_image_name = f"img_{image_counter:05d}.png"
            new_image_path = os.path.join(PROJECT_IMAGES, new_image_name)

            # Save image in new folder
            cv2.imwrite(new_image_path, image)

            # Create corresponding label file
            label_path = os.path.join(PROJECT_LABELS, new_image_name.replace(".png", ".txt"))

            with open(label_path, "w") as f:
                f.write(f"{new_class_id} 0 0 {width} {height}")

            image_counter += 1

print("✅ Dataset preparation complete!")
print(f"Total images processed: {image_counter}")