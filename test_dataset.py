from training.dataset import RoadDataset

dataset = RoadDataset("data/train/images", "data/train/labels")

print("Total samples:", len(dataset))

for i in range(5):
    img, cls, bbox = dataset[i]

    print(f"\nSample {i}")
    print("Class:", cls.item())
    print("BBox:", bbox)