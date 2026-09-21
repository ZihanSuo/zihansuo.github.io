---
title: "Meituan Business Analytics Competition"
title_zh: "美团商业分析大赛"
track: data
featured: true
weight: 1
kicker_en: "Team of 3 · 2026 · Data engineering"
kicker_zh: "三人团队 · 2026 · 数据工程"
summary: "611 event names with no naming convention, and no business-line field anywhere in the log. My job was to turn that into a table three downstream modules could use, and to define what every field in it means."
summary_zh: "611个命名毫无规范的埋点名，日志里没有任何业务线字段。我的工作是把它变成下游三个模块可以直接使用的宽表，并定义其中每个字段的口径。"
role: "Data engineering, business baseline, report writing · modelling co-designed, implemented by teammates"
role_zh: "数据工程、业务基准、报告写作 · 建模思路共同讨论，队友实现"
period: "2026.04"
stack: "Python, 规则归因, LLM 交叉标注, 分层切分"
tags: ["Data engineering", "Labelling", "Leakage control"]
links:
  - { label: "GitHub · L0 & L1", url: "https://github.com/ZihanSuo/meituan-cross-analysis" }
  - { label: "终稿 Final report", url: "/assets/pdf/meituan-report.pdf" }
---

<div class="stage">
<h2><span data-lang="en">Why I built it</span><span data-lang="zh">起因</span></h2>

<div data-lang="en">
<p>The competition question was whether cross-business-line usage relates to ordering, and whether cross-line guidance is worth building. The data was one day of row-level browse and order logs from 11 January 2026, around 500,000 users, of whom 395,546 made it into the final user-level table.</p>
<p>Two problems blocked every downstream analysis. The log has no business-line field at all, so the central variable of the question did not exist and had to be inferred. And the 611 unique <code>event_name</code> values follow no naming convention, so user intent could not be grouped without first defining what the groups are.</p>
<p>I owned two layers and the writing. The data layer (L0) and the business baseline (L1) are mine, and I turned every layer's output into written reports and assembled the final submission. The approach for the propensity score matching (L2) and the predictive model (L4) was worked out together as a team, and teammates wrote the code. That matters for how the results below should be read.</p>
</div>

<div data-lang="zh">
<p>赛题是跨业务线使用与下单之间是什么关系，以及跨业务引导是否值得做。数据为美团2026年1月11日单日的行级浏览与下单日志，约50万用户，最终进入用户宽表的为395546人。</p>
<p>有两个问题挡在所有下游分析之前。日志里根本没有业务线字段，也就是说赛题的核心变量并不存在，必须推断出来；而611个唯一 <code>event_name</code> 没有任何命名规范，用户意图在定义清楚分类之前无法归并。</p>
<p>我负责两层以及写作。数据层（L0）与业务基准（L1）由我完成，各层产出由我写成报告，终稿由我合稿。倾向得分匹配（L2）与预测建模（L4）的思路由团队共同讨论确定，代码由队友实现，这一点影响下面结果该如何被读取。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">My approach</span><span data-lang="zh">思路</span></h2>

<div data-lang="en">
<p><strong>Business-line attribution in three passes, because one pass cannot cover it.</strong> Static mapping from first-level category first, then substring matching on page name and POI name for whatever it missed. Two deliberate exceptions:</p>
<ul>
<li><strong>Order rows ignore the category field entirely and use page name only.</strong> One order page carries items from several categories and its category value depends on how the event was implemented, so it frequently disagrees with the actual line. Page name is stable. This trades coverage for accuracy.</li>
<li><strong>The submit-order page is back-filled from event sequence.</strong> That page carries no business semantics at all, food delivery and hotel booking both pass through it, so rule-based attribution drops all of it into "other". Those rows are the closest thing in the data to conversion, and discarding them would systematically distort every downstream funnel. Sorting events within each user and inheriting the previous row's line recovers them.</li>
</ul>

<p><strong>An intent taxonomy validated by disagreement rather than by accuracy.</strong> 611 event names map to 8 intent classes plus an "other" bucket excluded from analysis. There is no ground truth, and labelling all 611 by hand is too expensive, so a single model's labels cannot be checked. Three models labelled independently under the same written rules.</p>
</div>

<div data-lang="zh">
<p><strong>业务线归因分三阶段，因为单一阶段覆盖不了。</strong>先按一级类目做静态映射初判，未命中的再按页面名与 POI 名做子串补标。其中两处是刻意的例外：</p>
<ul>
<li><strong>下单行完全不看类目字段，只走页面名。</strong>同一个下单页承载多个类目的商品，其类目取值取决于埋点实现，与实际业务线经常对不上；而页面名是稳定的。这是用覆盖率换准确率。</li>
<li><strong>提交订单页按事件时序回写。</strong>该页面不带任何业务语义，买外卖与订酒店都经过它，按规则判会全部落入"其他"。而这些行恰恰是数据中最接近转化的行为，丢弃它们会让下游漏斗系统性失真。按 user_id 内事件时间排序、继承上一条行为的业务线，可以把它们找回来。</li>
</ul>

<p><strong>意图分类用分歧而非准确率来验证。</strong>611个埋点名归到8类有效意图，另设"其他"一类，不参与后续分析。不存在 ground truth，人工全标成本过高，因此单个模型的标注无法自证对错。改由三个模型依据同一套成文规则独立标注。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Why three labellers, not a vote</span><span data-lang="zh">为什么用三个标注者，而不是投票</span></p>
  <p><span data-lang="en">The point is not majority rule. It is that <strong>"is the label correct" cannot be verified, while "where do three labellers disagree" can be observed.</strong> Disagreement concentrates exactly where the written rule is underdefined, which locates the problem faster than random manual spot-checks.</span><span data-lang="zh">目的不是多数决，而是：<strong>"标得对不对"无法验证，"三个标注者在哪里分歧"可以观测。</strong>分歧集中的位置，正是成文规则定义不清的位置，这比随机抽样人工复核更快地定位问题区域。</span></p>
  <p><span data-lang="en">439 of 678 agreed completely, 64.7%. The remaining 239 went to manual adjudication rather than to a vote, and the final labels agree with the primary annotator at 97.1%.</span><span data-lang="zh">678条中439条完全一致，占64.7%。其余239条进入人工裁决而非自动多数决，最终标签与主标注版的一致率为97.1%。</span></p>
</div>

<div data-lang="en">
<p><strong>A hard disambiguation table above all keyword rules.</strong> Compound event names break keyword priority in ways only page semantics can settle. <code>电话模块_地址点击</code> contains both "phone" and "address"; keyword order calls it contact-merchant, but it is the address entry inside the phone module, so the intent is navigate-to-store. <code>非导航电话</code> contains "navigation" as an exclusion, not a subject. <code>订单详情页_cross</code> is not order management, it is the recommendation strip after an order completes. These three are cases where keyword matching is guaranteed to be wrong. The table matches whole strings and stops the chain on a hit.</p>

<p><strong>Splitting and leakage control at the data layer, not at the modelling layer.</strong> Split 80/20 by <code>user_id</code> rather than by row, because one user's rows are highly correlated and a row split puts the same user on both sides, inflating downstream test performance. Stratify by region so the split does not introduce geographic drift, with a documented fallback to unstratified if stratification fails. Fill missing dwell time in both sets using medians computed on the training set only, since using the test set's own statistics leaks its distribution into the features.</p>

<p>1,196 raw cities map to 34 provincial units and then to 7 regions. Grouping by raw city leaves too many cells too thin for inference; keeping both levels lets downstream pick its granularity. Values previously labelled "other" were renamed "unknown", because "other" already means something specific in the business-line dimension and the collision would be silent.</p>
</div>

<div data-lang="zh">
<p><strong>一张优先级高于所有关键词规则的硬消歧表。</strong>复合埋点串会以只有页面语义才能裁定的方式破坏关键词优先级。<code>电话模块_地址点击</code>同时含"电话"与"地址"，按关键词优先级会判成联系商家，但它是电话模块内的地址入口，语义为导航到店；<code>非导航电话</code>中的"导航"是排除语义而非主语；<code>订单详情页_cross</code>不是订单管理，而是订单完成后的推荐位。这三类都是关键词匹配必然出错的情况。该表按整串匹配，命中即定，不再向下走。</p>

<p><strong>切分与防泄漏放在数据层，而不是建模层。</strong>按 <code>user_id</code> 而非按行做80/20切分，因为同一用户的行高度相关，按行切会使同一用户同时出现在两侧，虚高下游测试表现。按地域分层，避免切分本身引入地域偏移，并在代码中写明分层失败时回退非分层。停留时长的缺失值，两个集合都用训练集上算出的中位数填充，因为使用测试集自身统计量等于把其分布信息泄漏进特征。</p>

<p>1196个原始城市映射到34个省级行政区，再到7个地理大区。直接按城市分组会使大量格子样本量不足以支撑统计推断；保留两级则允许下游自行选择粒度。原本标为"其他"的取值统一改为"未知"，因为"其他"在业务线维度已有确定含义，这种冲突不会报错。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What it produced</span><span data-lang="zh">成果</span></h2>

<table>
<thead><tr>
  <th><span data-lang="en">Measure</span><span data-lang="zh">项</span></th>
  <th><span data-lang="en">Value</span><span data-lang="zh">数值</span></th>
</tr></thead>
<tbody>
<tr><td><span data-lang="en">Users covered</span><span data-lang="zh">覆盖用户数</span></td><td>395,546</td></tr>
<tr><td><span data-lang="en">Unique event names mapped</span><span data-lang="zh">归类的唯一埋点名</span></td><td>611 → 8 <span class="num">+ other</span></td></tr>
<tr><td><span data-lang="en">Business-line attribution coverage</span><span data-lang="zh">业务线归因覆盖率</span></td><td>99.76% <span class="num">7 lines</span></td></tr>
<tr><td><span data-lang="en">Page-event mapping pairs</span><span data-lang="zh">页面事件映射对</span></td><td>809</td></tr>
<tr><td><span data-lang="en">Three-model full agreement</span><span data-lang="zh">三模型完全一致</span></td><td>64.7% <span class="num">439 / 678</span></td></tr>
<tr><td><span data-lang="en">Sent to manual adjudication</span><span data-lang="zh">进入人工裁决</span></td><td>35.3% <span class="num">239</span></td></tr>
<tr><td><span data-lang="en">Cities collapsed to regions</span><span data-lang="zh">城市归并为大区</span></td><td>1,196 → 34 → 7</td></tr>
<tr><td><span data-lang="en">Cross-line users, full sample</span><span data-lang="zh">全样本跨业务用户占比</span></td><td>60.1%</td></tr>
<tr><td><span data-lang="en">Ordering users, full sample</span><span data-lang="zh">全样本下单用户占比</span></td><td>35.9%</td></tr>
</tbody>
</table>

<div data-lang="en">
<p>The row-level table and the user-level wide table carried three downstream modules: funnel analysis, propensity score matching, and user segmentation.</p>
<p>The funnel analysis is also mine. L1 set the baseline every later layer compares against: session-level funnels and first-intent structure by business line, tested with chi-square and corrected for multiple comparisons with Benjamini-Hochberg. Funnel differences between lines are significant, and dwell-time bins move monotonically with all three conversion measures.</p>
<p>Then the writing. I wrote up each layer's results, including two versions of the matching and modelling reports: a defence version that states the identification framework, the balance criteria and the confidence intervals, and a plain-language version for readers without a causal inference background. I assembled the final report and wrote the appendix.</p>
<p>The output I would point at first is not a number. A teammate's framework document contains the line <em>"where this conflicts with the team Word draft, the L0 spec and this notebook take precedence"</em>. The field spec had become the team's single source of truth rather than documentation written after the fact. The same document carries a constraint I sent downstream: <em>do not admit variables equivalent to the definition of Cross into the model</em>. The data layer knows which fields are derived from the same source, so that line was mine to draw.</p>
</div>

<div data-lang="zh">
<p>行级表与用户级宽表支撑了下游三个模块：漏斗分析、倾向得分匹配、用户分层。</p>
<p>其中漏斗分析也由我完成。L1 建立了后续各层比较时使用的基准：按业务线统计 session 级漏斗与首条意图结构，做卡方检验并以 BH-FDR 校正多重比较。结果显示各业务线的漏斗差异显著，停留时长分箱与三个转化指标呈单调关系。</p>
<p>然后是写作。各层结果由我写成报告，其中匹配与建模两层各写了两个版本：答辩版写明识别框架、平衡性判据与置信区间，通俗版面向没有因果推断背景的读者。终稿由我合稿，附录由我撰写。</p>
<p>最值得指出的产出不是一个数字。队友的框架文档里有这样一句：<em>"与队内 Word 稿冲突时，以 L0 和本 Notebook 实现为准"</em>。口径文档成为了团队的唯一真相来源，而不是事后补写的说明书。同一份文档中还有一条由我发给下游的约束：<em>勿将与 Cross 定义等价的变量纳入模型</em>。数据层比建模层更清楚哪些字段同源，这条红线应当由数据层来划。</p>
</div>

<h3><span data-lang="en">The submission</span><span data-lang="zh">提交物</span></h3>
<div class="doc-list">
  <a class="doc" href="/assets/pdf/meituan-report.pdf" target="_blank" rel="noopener">
    <span class="doc__icon">PDF</span>
    <span class="doc__name"><span data-lang="en">Final report · team submission</span><span data-lang="zh">终稿 · 团队提交版</span></span>
    <span class="doc__meta">39 <span data-lang="en">pages</span><span data-lang="zh">页</span> · 2.7 MB</span>
  </a>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">Postmortem</span><span data-lang="zh">事后复盘</span></h2>

<div class="callout">
  <p class="label"><span data-lang="en">How the headline result should be read</span><span data-lang="zh">主结果该怎么读</span></p>
  <p><span data-lang="en">The 13.2 percentage point gap in ordering rate is <strong>an adjusted difference on a comparable population, not a causal effect</strong>. Two reasons. The propensity model's AUC is 0.56, close to random: the upside is near-total overlap and a clean balance table with every standardised mean difference under 0.01, the cost is that observed covariates barely explain who goes cross-line, so the estimate is sensitive to unobserved confounding. And the treatment and the outcome share one observation window, so a user who orders more has more chances to touch a second line, and reverse causality cannot be excluded.</span><span data-lang="zh">下单率13.2个百分点的差距是<strong>可比人群上的调整后差异，不是因果效应</strong>。两个原因。倾向得分模型的 AUC 为0.56，接近随机：好处是两组重叠度极高、匹配后所有协变量的标准化均值差均小于0.01，balance 表很干净；代价是观测协变量对"谁会跨业务"几乎没有解释力，因此该估计对未观测混淆敏感。以及，处理变量与结果变量共享同一个观测窗口，下单多的用户天然有更多机会接触第二条业务线，反向因果无法排除。</span></p>
</div>

<div data-lang="en">
<p>The submitted report is not consistent on this point. Its abstract says PSM "proves" cross-line behaviour carries incremental value; its body calls the same number "a quasi-causal estimate controlling for observed confounders". The second is the defensible reading, and the one used here. Identifying a causal effect would need the treatment defined on an earlier window and the outcome measured on a later one. That is a decision taken when the tables are designed, and it cannot be retrofitted.</p>
<p><strong>A definitional leakage risk I flagged and cannot confirm was resolved.</strong> The segmentation model reports AUC 0.80, and its top SHAP features include the count of distinct second-level categories. <code>is_cross</code> is defined as two or more distinct business lines, and business line is derived from category. Those two overlap structurally. The modelling code was not mine, so the honest statement is that the risk exists and the ablation that would settle it, dropping that feature and seeing how far AUC falls, was not run. For the same reason the segmentation result is quoted here as observed rates rather than as model performance: the high-potential tier orders at 44.3% against 10.0% for the no-potential tier.</p>
<p><strong>The taxonomy is coarse where it matters most.</strong> Exploratory browsing absorbs 377 of the mapped names, close to half. It should split into targeted list browsing, meaning search results and rankings, and untargeted feed browsing, which are different user states calling for different interventions. At the other end, search behaviour and "other" hold nine names each, too few for group analysis. The taxonomy was designed to cover every event name, not to balance analysis, and that tradeoff was not revisited.</p>
<p><strong>Agreement is not accuracy.</strong> 64.7% is a consistency figure. Without even a hundred hand-labelled items as a standard set, the labelling system has no credibility number attached to it, only an internal one. Building that standard set is the first thing I would add.</p>
<p>Most of the disagreement is not a model failure either. The largest cluster, 59 cases, sits on the boundary between exploratory and deep browsing, defined as multi-store versus single-store. Names like <code>单个图片/视频_mc</code> do not say whether they fired on a list page or a detail page. <strong>The information needed to decide is absent from the event name itself</strong>, which is a finding about the instrumentation rather than about the labellers.</p>
</div>

<div data-lang="zh">
<p>提交的终稿在这一点上前后不一：摘要写 PSM"证明"了跨业务行为具有增量价值，正文则称同一数字为"控制可观测混杂后的类因果估计"。后者是站得住的读法，本页采用后者。要识别因果，需要处理变量定义在前期窗口、结果变量测在后期窗口。这是设计数据表时就该定下的事，事后无法补救。</p>
<p><strong>一处我已提示、但无法确认是否被处理的定义性泄漏风险。</strong>分层模型报告 AUC 0.80，其 SHAP 重要性前列包含二级类目去重数；而 <code>is_cross</code> 的定义是去重业务线数大于等于2，业务线又由类目映射而来。二者存在结构性重叠。建模代码不由我实现，因此诚实的表述是：风险存在，而能够定论的消融实验，即去掉该特征观察 AUC 下降多少，并未执行。出于同样的原因，此处引用分层结果时只报观测比率而不报模型表现：高潜层实际下单率44.3%，无潜层10.0%。</p>
<p><strong>分类体系在最要紧的地方过粗。</strong>探索浏览吸收了377条映射名，接近一半。它应当拆分为有目标的列表浏览（搜索结果、榜单）与无目标的 feeds 流浏览，二者是不同的用户状态，对应的运营手段也不同。另一端，搜索行为与"其他"各只有9条，样本量不足以做分组分析。这套分类是为覆盖全部埋点设计的，不是为均衡分析设计的，而这个取舍后来没有被重新审视。</p>
<p><strong>一致率不是准确率。</strong>64.7%是一个内部一致性数字。在没有哪怕100条人工标注作为标准集的情况下，整套标注体系没有可信度数字，只有内部数字。补上这个标准集是首先要加的一件事。</p>
<p>而多数分歧也并非模型能力问题。最大的一簇59例落在探索浏览与深度浏览的边界上，二者定义为店外多店浏览与单店内浏览，但 <code>单个图片/视频_mc</code> 这类名称根本看不出它触发在列表页还是详情页。<strong>做出判断所需的信息，在埋点名本身里就不存在</strong>，这是关于埋点设计的发现，不是关于标注者的发现。</p>
</div>
</div>
