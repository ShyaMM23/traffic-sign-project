import torch
import numpy as np
from sklearn.metrics import precision_score, recall_score


# ===============================
# ACCURACY, PRECISION, RECALL
# ===============================

def classification_metrics(model, dataloader, device):
    model.eval()

    all_preds = []
    all_labels = []

    with torch.no_grad():
        for images, labels, _ in dataloader:
            images = images.to(device)
            labels = labels.to(device)

            class_out, _ = model(images)
            _, preds = torch.max(class_out, 1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)

    accuracy = (all_preds == all_labels).mean() * 100
    precision = precision_score(all_labels, all_preds, average='macro') * 100
    recall = recall_score(all_labels, all_preds, average='macro') * 100

    return accuracy, precision, recall


# ===============================
# IOU
# ===============================

def calculate_iou(pred_boxes, true_boxes):
    x1 = torch.max(pred_boxes[:, 0], true_boxes[:, 0])
    y1 = torch.max(pred_boxes[:, 1], true_boxes[:, 1])
    x2 = torch.min(pred_boxes[:, 2], true_boxes[:, 2])
    y2 = torch.min(pred_boxes[:, 3], true_boxes[:, 3])

    inter = torch.clamp(x2 - x1, min=0) * torch.clamp(y2 - y1, min=0)

    area_pred = (pred_boxes[:, 2] - pred_boxes[:, 0]) * (pred_boxes[:, 3] - pred_boxes[:, 1])
    area_true = (true_boxes[:, 2] - true_boxes[:, 0]) * (true_boxes[:, 3] - true_boxes[:, 1])

    union = area_pred + area_true - inter

    iou = inter / (union + 1e-6)

    return iou.mean().item()


# ===============================
# FULL EVALUATION (PAPER STYLE)
# ===============================

def evaluate_full(model, dataloader, device):
    model.eval()

    total_iou = 0
    count = 0

    all_preds = []
    all_labels = []

    with torch.no_grad():
        for images, labels, bbox in dataloader:
            images = images.to(device)
            labels = labels.to(device)
            bbox = bbox.to(device)

            class_out, bbox_out = model(images)

            _, preds = torch.max(class_out, 1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

            total_iou += calculate_iou(bbox_out, bbox)
            count += 1

    accuracy = (np.array(all_preds) == np.array(all_labels)).mean() * 100
    precision = precision_score(all_labels, all_preds, average='macro') * 100
    recall = recall_score(all_labels, all_preds, average='macro') * 100
    mean_iou = total_iou / count

    return accuracy, precision, recall, mean_iou