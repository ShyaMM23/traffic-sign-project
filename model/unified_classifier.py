import torch
import torch.nn as nn
import torchvision.models as models
import torch.nn.functional as F


class SEBlock(nn.Module):
    def __init__(self, channels, reduction=16):
        super(SEBlock, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(channels, channels // reduction),
            nn.ReLU(),
            nn.Linear(channels // reduction, channels),
            nn.Sigmoid()
        )

    def forward(self, x):
        b, c = x.size()
        y = self.fc(x)
        return x * y


class UnifiedClassifier(nn.Module):
    def __init__(self, num_classes=9, use_se=True):
        super(UnifiedClassifier, self).__init__()

        backbone = models.resnet50(weights="IMAGENET1K_V2")
        self.feature_extractor = nn.Sequential(*list(backbone.children())[:-1])

        self.use_se = use_se

        if use_se:
            self.se = SEBlock(2048)

        self.classifier = nn.Linear(2048, num_classes)

    def forward(self, x):
        features = self.feature_extractor(x)
        features = features.view(features.size(0), -1)

        if self.use_se:
            features = self.se(features)

        out = self.classifier(features)
        return out