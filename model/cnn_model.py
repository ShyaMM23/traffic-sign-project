import torch
import torch.nn as nn
from model.se_block import SEBlock


class RoadSignNet(nn.Module):
    def __init__(self, num_classes=8, use_se=True):
        super(RoadSignNet, self).__init__()

        self.use_se = use_se

        # Feature extractor
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(2)

        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(2)

        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.relu3 = nn.ReLU()
        self.pool3 = nn.MaxPool2d(2)

        # Optional SE block
        if self.use_se:
            self.se = SEBlock(128)

        self.flatten = nn.Flatten()

        # Fully connected heads
        self.classifier = nn.Linear(128 * 4 * 4, num_classes)
        self.bbox_regressor = nn.Linear(128 * 4 * 4, 4)

    def forward(self, x):
        x = self.pool1(self.relu1(self.conv1(x)))
        x = self.pool2(self.relu2(self.conv2(x)))
        x = self.pool3(self.relu3(self.conv3(x)))

        if self.use_se:
            x = self.se(x)

        x = self.flatten(x)

        class_out = self.classifier(x)
        bbox_out = self.bbox_regressor(x)

        return class_out, bbox_out