import torch.nn as nn
import torch


class MultiTaskLoss(nn.Module):
    def __init__(self, alpha=0.5, beta=0.5, ohem_ratio=1.0):
        super().__init__()
        self.ce = nn.CrossEntropyLoss(reduction='none')
        self.mse = nn.MSELoss(reduction='none')

        self.alpha = alpha
        self.beta = beta
        self.ohem_ratio = ohem_ratio

    def forward(self, class_out, class_labels, bbox_out, bbox_labels):

        cls_loss = self.ce(class_out, class_labels)
        box_loss = self.mse(bbox_out, bbox_labels).mean(dim=1)

        total_loss = self.alpha * cls_loss + self.beta * box_loss

        # OHEM
        k = int(self.ohem_ratio * len(total_loss))
        hard_loss, _ = torch.topk(total_loss, k)

        return hard_loss.mean()