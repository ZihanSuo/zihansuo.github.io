# 个人网站重建 · 交接说明

给接手的 AI 助手：这份文件是唯一的上下文来源。开始动手前请完整读完，并按“工作方式约定”执行。

---

## 1. 这是什么

索梓涵（Zihan Suo）的个人作品集网站，用途是 2026 年秋招展示。
仓库：`/Users/yunimashu/zihansuo.github.io`，线上地址 `zihansuo.github.io`。

**当前工作分支：`rebuild/v2`。** `main` 还是旧站，没动过。
原站完整备份在分支 `backup/chirpy-original-20260904`，另有一份 tar 包在 `~/Desktop/personal/工作/网站原版备份_20260904.tar.gz`。

**求职定位**（决定内容取舍）：AI 产品经理为主线，数据与增长分析为第二线，传播与叙事是差异化护城河。重点投境外岗位（东南亚为主，欧美也考虑），同时也投国内，所以国内可访问性和中文版都要认真对待。

---

## 2. 已经做完的

原站基于 Jekyll Chirpy 主题，问题是内容停在 2025.12、UI 分类混乱、三个页面三套内联 CSS。已经彻底重做：

- 移除 Chirpy 主题、`_chirpy` 与 `assets/lib` 子模块、空的 `_posts` 博客脚手架
- 自建 layout（`_layouts/default|page|project.html`）与 include（`_includes/head|nav|footer|project-card|track-index.html`）
- **单一设计层** `assets/css/main.scss`，全站唯一的样式来源
- **中英切换**：同页双语，`data-lang="en|zh"` 加前端 toggle 加 `localStorage`，不做两套 URL
- **零 CDN 依赖**：AOS 换成原生 IntersectionObserver，字体走系统栈，国内可访问
- 内容按三条投递线重组，`_projects` collection 共 12 个项目
- `about.md` 时间轴 34 条，全部中英双语
- CrewAI 项目详情页已写完（整站头牌，也是其他详情页的模板）

---

## 3. 设计规范（已定稿，不要擅自改）

### 配色
用户自己给的色板：`#F3E8CA` `#645E4E` `#B1AB99` `#C5F2E8` `#8FB9B1`。
落地时取了“轻量版”：奶油只出现在卡片和分区底色，页面主底接近白，正文压深以保证对比度。全部 token 在 `main.scss` 顶部的 `:root`，深浅两套齐全。**改配色只改 token，不要在组件里写死颜色。**

### 字体
```
--serif: Georgia, "Times New Roman", "PingFang SC", ... , serif;
--sans:  -apple-system, ..., "PingFang SC", ..., sans-serif;
```
关键：拉丁走 Georgia，中文往后落到苹方。**中文绝对不要用宋体（Songti SC）或思源宋体**，用户明确否掉了；也不要用 Iowan Old Style。

### 深色模式
`:root` 定义完整浅色 token，`@media (prefers-color-scheme: dark) { html:not([data-theme="light"]) {...} }` 与 `:root[data-theme="dark"] {...}` 各覆盖一次。新增颜色必须先在 `:root` 里定义。

---

## 4. 文案规范（用户明确要求，务必遵守）

- **英文里不要用破折号（em dash）**，改用句号、逗号、冒号或括号
- 中文排版：不要用「」，一律用全角双引号“”；不要用箭头符号（→）
- 中英混排：字母和数字不加粗；数字与中文之间不留空格（写“68000阅读”不写“68000 阅读”）
- 语气：直接、不煽情、带自嘲，不要励志腔和营销腔
- **用户自己写的英文原文是她的，不要重写**。只有她明确要求同步时才改英文
- 中文不是英文的逐句翻译，允许两边说的东西不完全一样

---

## 5. 目录结构

```
_config.yml              站点配置（无主题依赖，plugins: sitemap + seo-tag）
_layouts/                default / page / project
_includes/               head / nav / footer / project-card / track-index
_projects/               项目集合，12 个 .md，front matter 驱动
assets/css/main.scss     唯一样式表（顶部有 --- 空 front matter，Jekyll 才会编译）
assets/js/site.js        语言切换、主题切换、移动端导航、滚动显现
assets/img/              8 张图 + favicons/
assets/pdf/              3 份 PDF
index.html               首页
ai-systems.md            A 线：AI 产品与系统
data-growth.md           B 线：数据与增长分析
storytelling.md          C 线：传播与叙事
about.md                 时间轴（34 条，双语）
resume.md                简历下载页
.preview/                本地预览工具，已 gitignore
_to_delete/              暂存待删（langgraph 项目，用户还没做，先留着）
```

### 项目 front matter 约定
```yaml
title / title_zh
track: ai | data | story          # 决定归到哪条线、用哪个主题色
featured: true                    # 是否上首页精选
weight: 1                         # 同一条线内的排序
kicker_en / kicker_zh             # 卡片上方的小字
summary / summary_zh              # 一句话概括
role / period / stack / award     # 详情页 factbar，可选
tags: []                          # 卡片底部标签
cover: /assets/img/xxx.png
links: [{ label: "GitHub", url: "..." }]
```

---

## 6. 详情页写法（照 CrewAI 那页写）

`_projects/crewai-market-research.md` 是标准范例，务必先读一遍再写别的。结构是：

1. **The problem / 问题是什么** — 不是背景介绍，是具体的失败
2. **The call I made / 我做的判断** — 你做了什么决定，为什么
3. **How it works / 怎么做的** — 架构，配表格说明分工
4. **How I tested it / 怎么验的** — 可选，验证过程本身有内容时才加
5. **Evidence / 结果和证据** — 数字，**并说明数字在什么情况下会骗人**
6. **What it still can't do / 哪里没做到** — 必写，不许省

**第 6 段是整站的核心竞争力。** 用户所有项目都有一个共同点：她在认真地证伪自己（引用审计 10 条 0 条成立、MiniMind 复盘承认 SFT 没让模型变聪明、Depth 实验承认更深的模板没带来更诚实的结论）。这在应届 AI 产品候选人里极其罕见，是整站的叙事主轴，不要弱化成“不足与展望”那种套话。

写法上用原始 HTML，双语用 `<div data-lang="en">` / `<div data-lang="zh">` 成对包裹，不要用 `markdown="1"`（预览工具对纯 HTML 处理更稳）。可用的样式类：`.stage` `.callout`（配 `.label`）`.doc-list`/`.doc` `.gallery` `.num`。

---

## 7. 还没做的

**按优先级：**

1. **MiniMind 详情页** `_projects/minimind.md`
   素材：`~/Desktop/personal/竞赛/2606Minimind/复盘.md`，质量很高，几乎可以直接改写。
   定位很重要：不要写成“我训了个模型”，要写成“我复现了全流程，并诚实记录了它没做到什么”。核心结论是弱基座加20万条 SFT 主要学到“对话的壳子”不是变聪明；LoRA 改得动身份认知改不动事实推理；和作者 full_sft 的差距在数据和训练规模不在脚本。

2. **美团商分详情页** `_projects/meituan-psm.md`
   素材：`~/Desktop/personal/竞赛/美团商分2604/`，有现成图表 png 三张。
   数据已脱敏可公开。**必须明确写清她负责的是数据工程，不是建模**（队友张泽夏负责建模）。

3. **INVESTelligence 详情页** `_projects/investelligence.md`
   现在只有功能清单，缺“为什么做”和“做完发现了什么”。她自己的说法是“真正意义上第一个我独立完成的 AI agent，帮的是刚开始尝试投资的我自己”。

4. **三条线的定位段落** `ai-systems.md` / `data-growth.md` / `storytelling.md` 的 `lede_en` / `lede_zh` 还是占位。

5. **首页中文定位语和中文简介** `index.html` 里标着待定。英文用的是她原来写的，别动。

6. **封面图** 多数项目 `cover:` 指向不存在的 `/assets/img/placeholder.png`，卡片缩略图是空灰块。CrewAI 那页最该配架构图或工具审计对质表。

7. **简历 PDF** `resume.md` 里两个下载位是空的，需要中英文 PDF 放进 `assets/pdf/`。

8. **合并上线** 确认无误后 `rebuild/v2` 合进 `main`，GitHub Actions 会自动构建部署。

**其余零散 TODO** 直接全局搜 `TODO`、`待定`、`待补`。

---

## 8. 本地开发

原环境装不了 Jekyll（gem 源被网络策略挡住），所以做了个 Python 预览工具作为替代：

```bash
cd .preview && python3 build.py     # 生成 site-preview.html，浏览器直接打开
```
它读真实的 `_projects/*.md`、`about.md`、`main.scss`、`site.js`，渲染成一个可点击切页的单文件预览，图片内嵌为 data URI。

**如果你的环境能装 Jekyll，优先用真的：**
```bash
bundle install && bundle exec jekyll serve
```
Jekyll 是唯一的事实标准，预览工具只是权宜之计。跑通之后建议直接用 Jekyll，并把 `.preview/` 留着不动。

**Git 注意**：这个仓库开了 git 后台维护，偶尔会残留 `.git/index.lock` / `.git/HEAD.lock` 导致提交失败。删掉或重命名这些 lock 文件即可，不是仓库损坏。

---

## 9. 工作方式约定

- **先诊断再动手。** 用户明确说过“一次做对”，不喜欢打补丁式的修改
- **不要说内容丢了之前先核对。** 之前发生过一次误判，实际文件完好，是预览截断造成的错觉
- **动大改之前先备份**（建分支或 tar 包）
- 用户偏好直接、不奉承的沟通，有不同意见就直说
- 涉及她本人经历的事实，不确定就问，不要编
