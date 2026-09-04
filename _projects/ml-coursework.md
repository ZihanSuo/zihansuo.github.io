---
title: "Two Machine Learning Case Studies"
title_zh: "两个机器学习课程项目"
track: data
featured: false
weight: 4
kicker_en: "Individual Projects · 2025"
kicker_zh: "个人项目 · 2025"
summary: "A pest classifier built on transfer learning, and a time-series study on when adding features quietly hurts generalization."
summary_zh: "一个用迁移学习做的害虫分类器，和一个关于“加特征什么时候反而在损害泛化”的时间序列研究。"
role: "Solo"
period: "2025"
stack: "TensorFlow, ResNet50, EfficientNet"
tags: ["Transfer learning", "Time series"]
links:
  - { label: "Pest Classifier", url: "https://github.com/ZihanSuo/Machine_Learning_Projects/tree/main/Transfer%20Learning%20for%20Image%20Classification" }
  - { label: "Time-Series Study", url: "https://github.com/ZihanSuo/Machine_Learning_Projects/tree/main/Time-Series%20Classification%20Case%20Study" }
---

<div data-lang="en" markdown="1">
### 1. Pest Classifier
Transfer learning model for identifying crop pests with high precision.

- 📊 Dataset: 11 pest classes from Kaggle
- 📈 Accuracy: 91% (ResNet50)
- 🛠 Tools: TensorFlow, EfficientNet

### 2. When More Features Hurt: A Time-Series Classification Case Study
Using the **AReM human activity dataset** (multisensor wearable time series), I studied how feature engineering and temporal segmentation affect classification stability. By progressively splitting time series into finer segments, I observed improved separability up to a point—after which variance, class imbalance, and information leakage began to dominate. This project emphasizes statistical judgment over raw accuracy, highlighting when adding features helps and when it quietly harms generalization.
</div>

<div data-lang="zh" markdown="1">
### 1. 害虫分类器
用迁移学习做作物害虫识别。

- 数据：Kaggle 上的11类害虫
- 准确率：91%（ResNet50）
- 工具：TensorFlow、EfficientNet

### 2. 当特征变多反而更糟：一个时间序列分类的案例
用 AReM 人体活动数据集（多传感器可穿戴时间序列），研究特征工程和时间切分如何影响分类的稳定性。把时间序列越切越细，可分性会提升，但过了某个点之后，方差、类别不平衡和信息泄漏开始占主导。这个项目想强调的是统计判断比裸的准确率更重要：加特征什么时候真的有帮助，什么时候是在悄悄损害泛化。
</div>
