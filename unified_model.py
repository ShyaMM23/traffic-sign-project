import torch
import torch.nn as nn
import torchvision.models as models
from model.se_block import SEBlock


class UnifiedModel(nn.Module):
    def __init__(self, backbone="resnet", num_classes=9, use_se=True):
        super().__init__()

        self.use_se = use_se

        if backbone == "resnet":
            base = models.resnet50(weights="IMAGENET1K_V2")
            self.features = nn.Sequential(*list(base.children())[:-1])
            feat_dim = 2048

        elif backbone == "vgg":
            base = models.vgg19(weights="IMAGENET1K_V1")
            self.features = nn.Sequential(
                base.features,
                nn.AdaptiveAvgPool2d((1, 1))
            )
            feat_dim = 512

        elif backbone == "alexnet":
            base = models.alexnet(weights="IMAGENET1K_V1")
            self.features = nn.Sequential(
                base.features,
                nn.AdaptiveAvgPool2d((1, 1))
            )
            feat_dim = 256

        elif backbone == "efficientnet":
            base = models.efficientnet_v2_s(weights="IMAGENET1K_V1")
            self.features = nn.Sequential(
                base.features,
                nn.AdaptiveAvgPool2d((1, 1))
            )
            feat_dim = 1280

        else:
            raise ValueError("Invalid backbone")

        if use_se:
            self.se = SEBlock(feat_dim)

        self.fc_class = nn.Linear(feat_dim, num_classes)
        self.fc_bbox = nn.Linear(feat_dim, 4)

    def forward(self, x):
        x = self.features(x)

        if self.use_se:
            x = self.se(x)

        x = torch.flatten(x, 1)

        class_out = self.fc_class(x)
        bbox_out = self.fc_bbox(x)

        return class_out, bbox_out