---
title: "Meituan Business Analytics Competition"
title_zh: "美团商业分析大赛"
track: data
featured: true
weight: 1
kicker_en: "Team Project · 2026 · Data Engineering"
kicker_zh: "团队项目 · 2026 · 数据工程"
summary: "I built the shared data layer for a four-person study of cross-business use and ordering at Meituan. The logs had no business-line field and 611 event names with no taxonomy. I defined both. Downstream numbers inherited those definitions, including the ones that look causal and are not."
summary_zh: "四人组的美团商分，题目是跨业务使用和下单的关系。我负责数据底座：原始日志没有业务线字段，611个埋点名也没有分类。两套口径都是我定的。下游那些好看的数字，包括那13.2个百分点，都继承了这些定义。"
role: "Data engineering · L0"
period: "2026-04"
stack: "Python, pandas"
tags: ["Data engineering", "Taxonomy", "Behavioural logs"]
---

<div class="stage">
<h2><span data-lang="en">The problem</span><span data-lang="zh">问题是什么</span></h2>

<div data-lang="en">
<p>The brief was a causal-sounding question: what is the relationship between a user crossing Meituan business lines and then placing an order, and is cross-business guidance worth the spend. We had row-level browse and order logs for 395,546 users. There was no business-line field in those logs. There were 611 unique <code>event_name</code> values, written by engineers, with no naming convention. <code>poi_list_mc</code>, <code>混排Feed-商家下挂商品卡片-商家区域_mc</code> and <code>MRY-售前部分-首页-门店强提醒-门店选择_mc</code> all describe browsing. The strings do not say so.</p>
<p>Keyword mapping fails on the compound names, which is the actual failure. <code>电话模块_地址</code> contains "phone" and would be labelled "contact the merchant." It is the address entry inside the phone module. The right label is navigate-to-store. <code>非导航电话</code> contains "navigate" and would be labelled navigate-to-store. "Non-navigate" is a negation. The right label is contact. <code>订单详情页_cross</code> contains "order" and would be labelled order management. It is a recommendation of other shops after the order is done. The right label is explore. None of those can be recovered from a keyword list. You have to know what the page looks like.</p>
<p>If I had left the definitions unset, each downstream module would have invented its own. The funnel, the matching study and the classifier would have been answering three different questions while sharing a filename.</p>
</div>

<div data-lang="zh">
<p>题目听起来像因果：用户跨业务线使用和下单是什么关系，值不值得做跨业务引导。我们拿到的是395546个用户的行级浏览和下单日志。日志里没有“业务线”这个字段。有611个唯一 <code>event_name</code>，是工程埋点，毫无命名规范。<code>poi_list_mc</code>、<code>混排Feed-商家下挂商品卡片-商家区域_mc</code>、<code>MRY-售前部分-首页-门店强提醒-门店选择_mc</code>，描述的都是浏览行为，字符串本身不说这件事。</p>
<p>关键词映射会在复合串上失败，这才是真正的失败。<code>电话模块_地址</code> 含“电话”，会被标成联系商家。它是电话区里的地址入口，该标导航到店。<code>非导航电话</code> 含“导航”，会被标成导航到店。“非导航”是排除语义，该标联系商家。<code>订单详情页_cross</code> 含“订单”，会被标成订单管理。那是订单完成后推荐的其他店，该标探索浏览。这三件都不能从关键词表里恢复，得知道页面实际长什么样。</p>
<p>如果口径不定，下游每个模块都会自己发明一套。漏斗、匹配、分类器会在同一个文件名下回答三个不同的问题。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">The call I made</span><span data-lang="zh">我做的判断</span></h2>

<div data-lang="en">
<p>Four people. I took L0: business-line attribution, the intent taxonomy, geo normalisation, the split, the user-level table, and the field-definition document the rest of the project had to share. Funnel work, propensity-score matching, Markov flows, the classifier and the strategy deck were led by teammates. I did not run those models. I defined what they were allowed to call a business line, a cross-business user, and a conversion-adjacent row.</p>
</div>
<div data-lang="zh">
<p>四个人。我拿了 L0：业务线归因、意图标签、地理归一、切分、用户级宽表，以及全项目共用的字段口径文档。漏斗、倾向得分匹配、马尔可夫流转、分类器和策略稿由队友主导。那些模型不是我跑的。什么叫业务线、什么叫跨业务用户、哪一行算靠近转化，是我定的。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">The job, said in one sentence</span><span data-lang="zh">一句话</span></p>
  <p><span data-lang="en"><strong>Define the object of analysis so that three modules can read one table without each rewriting the question.</strong> If the definitions are wrong, a clean matching table is still answering the wrong thing.</span><span data-lang="zh"><strong>把分析对象定义清楚，让三个模块读同一张表，而不必各自重写问题。</strong>口径错了，匹配表再干净，答的也是错题。</span></p>
</div>

<div data-lang="en">
<p>Three decisions followed from that. Order rows are labelled from <code>page_name</code> only, never from <code>first_cate_name</code>: the same checkout page can carry more than one category, and the category field follows the tracker, not the purchase. The "submit order" page carries no business semantics at all (food and hotels share it), so those rows inherit the previous event's business line inside the user. Drop them and every funnel conversion rate is systematically wrong. And the split is by <code>user_id</code>, not by row. The same person's events are correlated. A row split would put one user in both train and test, and any later test score would be a rehearsal.</p>
<p>I also wrote a constraint into the schema for the people who would model: do not put a feature that is definitionally equivalent to <code>is_cross</code> into the model. The data layer can see which fields are the same quantity written twice. The model layer often cannot, until SHAP ranks them.</p>
</div>
<div data-lang="zh">
<p>后面三条都从这里来。ORDER 行只看 <code>page_name</code>，不看 <code>first_cate_name</code>：同一个下单页可以承载多个类目，类目字段跟的是埋点实现，不是这笔购买。“提交订单页”本身没有任何业务语义（外卖和酒店走同一页），这些行按用户内时序继承上一条的业务线。丢掉它们，下游漏斗的转化率会系统性失真。切分按 <code>user_id</code>，不按行。同一人的行为高度相关，按行切会让一个人同时进训练和测试，后面的测试分数是彩排。</p>
<p>我还在口径里给建模的人写了一条约束：不要把和 <code>is_cross</code> 定义等价的变量放进模型。数据层看得见哪些字段是同一个量写了两遍。建模层往往要等到 SHAP 把它们排上来才看见。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How it works</span><span data-lang="zh">怎么做的</span></h2>

<div data-lang="en">
<p>L0 is a seven-step notebook: business line, intent, geo, time-of-day, an 80/20 user split stratified on region, dwell time, then the user-level table. The parts that are not mechanical:</p>
</div>
<div data-lang="zh">
<p>L0 是一个七步 notebook：业务线、意图、地理、时段、按地域分层的用户80/20切分、停留时长，然后是用户级宽表。不是机械步骤的部分：</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Piece</span><span data-lang="zh">块</span></th>
  <th><span data-lang="en">Rule</span><span data-lang="zh">规则</span></th>
  <th><span data-lang="en">Why it is a decision</span><span data-lang="zh">为什么这是判断</span></th>
</tr></thead>
<tbody>
<tr>
  <td><span data-lang="en">Business line, three passes</span><span data-lang="zh">业务线，三阶段</span></td>
  <td><span data-lang="en">Category map, then page/POI substring backfill, then submit-order inherit.</span><span data-lang="zh">类目初判，页面／POI 子串补标，提交订单页回写。</span></td>
  <td><span data-lang="en">Coverage versus accuracy, on purpose. Order rows give up the category field.</span><span data-lang="zh">覆盖率和准确率是故意取舍。下单行放弃类目字段。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Nine intents</span><span data-lang="zh">九类意图</span></td>
  <td><span data-lang="en">A hard disambiguation table, then ten priority rules, first hit wins, then negative assertions before publish.</span><span data-lang="zh">硬消歧表，再十条优先级规则，首次命中即停，发布前跑否定断言。</span></td>
  <td><span data-lang="en">The three compound cases above are in the hard table. Keywords never get a second vote.</span><span data-lang="zh">上面那三个复合串都在硬表里。关键词没有第二次投票的机会。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Geo</span><span data-lang="zh">地理</span></td>
  <td><span data-lang="en">1,196 cities to 34 provinces to 7 regions. Mapping values labelled "other" rewritten to "unknown."</span><span data-lang="zh">1196个城市到34个省级行政区再到7个大区。映射表里的“其他”改写成“未知”。</span></td>
  <td><span data-lang="en">City cells are too thin for inference. "Other" already means a trash-can business line. Two "others" would collide.</span><span data-lang="zh">按城市分组格子太薄，做不了推断。“其他”已经是业务线的垃圾桶，两个“其他”会撞车。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Anti-leak</span><span data-lang="zh">防泄漏</span></td>
  <td><span data-lang="en">User-level split. Region-stratified, with a coded fallback. Test missing dwell filled from train medians only.</span><span data-lang="zh">用户级切分。按地域分层，分层失败回退写在代码里。测试集停留缺失只用训练集中位数填。</span></td>
  <td><span data-lang="en">Filling test from test statistics is a quiet leak of the test distribution into the feature.</span><span data-lang="zh">用测试集自己的统计量填测试集，是把测试分布悄悄漏进特征。</span></td>
</tr>
</tbody>
</table>

<div data-lang="en">
<p>Intents: explore, deep browse, search, contact, navigate, save/share, coupon redeem, order management, other. Each label carries <code>confidence</code> and <code>compound_note</code> (which rule fired, which wrong reading was excluded).</p>
<p>The teammate who wrote L1 put one sentence in their framework: when it conflicts with the team's Word draft, L0 and the notebook win. That is the only evidence I have that the schema became the team's source of truth, rather than a document I wrote after the fact.</p>
</div>
<div data-lang="zh">
<p>九类：探索浏览、深度浏览、搜索行为、联系商家、导航到店、收藏分享、优惠核销、订单管理、其他。每条标签带 <code>confidence</code> 和 <code>compound_note</code>（命中哪条规则、排除了哪种误读）。</p>
<p>写 L1 的队友在自己的框架文档里留了一句：与队内 Word 稿冲突时，以 L0 和 notebook 为准。这是我仅有的证据，说明口径文档成了团队的事实标准，而不是我事后补的说明书。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How I tested it</span><span data-lang="zh">怎么验的</span></h2>

<div data-lang="en">
<p>There is no gold set for 611 internal event names. Full human labelling was not a cost we were going to pay. A single model giving labels is unfalsifiable: you cannot see where it is wrong.</p>
<p>So I had three models, DeepSeek, Claude and Cursor, label from the same spec, independently. That turns "is the label correct," which cannot be checked, into "where do three annotators disagree," which can. Disagreement piles up where the spec itself is thin. That is not majority vote. One run is the primary annotator. The other two are there to surface hard cases. Anything material goes to a person.</p>
<p>Three counts show up below and they are different units, not three versions of one number: 611 unique event names in the log, 678 rows in the annotation table, 809 page-by-event pairs in the published mapping.</p>
</div>
<div data-lang="zh">
<p>611个内部埋点名没有标准答案。全量人工标注不是我们付得起的成本。单个模型给标签无法证伪：看不见它错在哪。</p>
<p>所以我让三个模型（DeepSeek、Claude、Cursor）按同一份规范独立标。这把“标签对不对”（不可查）转成“三个标注者在哪里分歧”（可查）。分歧堆在规范本身写薄的地方。这不是多数投票。一版是主标注，另外两版用来暴露难例。实质性的分歧进人。</p>
<p>下面会出现三个数，它们是三种不同的东西，不是同一个数的三个版本：日志里611个唯一埋点名，标注原表678行，最终发布的映射809条页面×事件。</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Check</span><span data-lang="zh">查什么</span></th>
  <th><span data-lang="en">Number</span><span data-lang="zh">数字</span></th>
</tr></thead>
<tbody>
<tr>
  <td><span data-lang="en">All three models agree</span><span data-lang="zh">三模型完全一致</span></td>
  <td>439 / 678 <span class="num">64.7%</span></td>
</tr>
<tr>
  <td><span data-lang="en">Disagreement, human adjudication</span><span data-lang="zh">分歧，进人工裁决</span></td>
  <td>239 / 678 <span class="num">35.3%</span></td>
</tr>
<tr>
  <td><span data-lang="en">Pairwise agreement</span><span data-lang="zh">两两一致率</span></td>
  <td>DeepSeek / Claude <span class="num">79.5%</span><br>DeepSeek / Cursor <span class="num">73.0%</span><br>Claude / Cursor <span class="num">70.6%</span></td>
</tr>
<tr>
  <td><span data-lang="en">Final labels vs primary run</span><span data-lang="zh">最终标签与主标注</span></td>
  <td>97.1%</td>
</tr>
<tr>
  <td><span data-lang="en">Largest disputed pair</span><span data-lang="zh">最大争议类别对</span></td>
  <td><span data-lang="en">explore vs deep browse, 59 cases</span><span data-lang="zh">探索浏览／深度浏览，59例</span></td>
</tr>
</tbody>
</table>

<div class="callout">
  <p class="label"><span data-lang="en">What 64.7% is allowed to mean</span><span data-lang="zh">64.7%被允许说的话</span></p>
  <p><span data-lang="en"><strong>It is not a quality score, and it is not "the labels are 65% right."</strong> The 59-case pile is a real semantic hole: explore is multi-shop, deep browse is inside one shop, and names like <code>单个图片/视频_mc</code> do not say which page they sit on. 35% disagreement is a measure of how much information the tracking schema carries, not of how badly the models read.</span><span data-lang="zh"><strong>它不是质量分，也不是“标签65%正确”。</strong>那59例是真的语义空洞：探索是跨多店，深度是单店内，<code>单个图片/视频_mc</code> 这种名字不说自己在列表页还是详情页。35%的分歧度量的是埋点 schema 的信息含量，不是模型读得有多差。</span></p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">Evidence</span><span data-lang="zh">结果和证据</span></h2>

<div data-lang="en">
<p>The table I can stand behind is the one I built. 809 page-event mappings. Explore is 377 of them (46.6%). Search and "other" are 9 each. That skew is a design choice: the taxonomy was built to cover every event, not to give every class enough mass for a group test. Cross-business users are 60.1% of the sample, orderers 35.9%, under a definition of <code>is_cross</code> that drops the "other" trash-can line before counting. Leave "other" in and the rate moves up. That single rule changes the size of the treated group for everything downstream.</p>
<p>What I cannot stand behind as my result, and will not read as cause:</p>
</div>
<div data-lang="zh">
<p>我能站在后面的，是我造的那张表。809条页面事件映射。探索浏览377条（46.6%）。搜索和其他各9条。这个偏斜是设计：分类是为覆盖全部埋点，不是为每个类都够做分组检验。跨业务用户占60.1%，下单用户占35.9%，前提是 <code>is_cross</code> 在计数前丢掉“其他”这个垃圾桶类目。把“其他”留进去，这个比例会上去。这一条规则会改掉下游处理组有多大。</p>
<p>我不能当成自己的结果、也不会读成因果的：</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Downstream number</span><span data-lang="zh">下游数字</span></th>
  <th><span data-lang="en">Honest reading</span><span data-lang="zh">诚实的读法</span></th>
</tr></thead>
<tbody>
<tr>
  <td><span data-lang="en">+13.2pp order rate after matching (CI 12.9 to 13.5); +0.266 orders; all SMDs &lt; 0.01; stable at calipers 0.1 / 0.2 / 0.3</span><span data-lang="zh">匹配后下单率高13.2个百分点（区间12.9到13.5）；订单数高0.266；全部标准化均值差小于0.01；卡钳0.1／0.2／0.3时稳在0.132附近</span></td>
  <td><span data-lang="en">An adjusted gap on comparable people. Not a causal effect.</span><span data-lang="zh">可比人群上的调整后差异。不是因果效应。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Propensity model ROC-AUC 0.5623</span><span data-lang="zh">倾向得分模型 ROC-AUC 0.5623</span></td>
  <td><span data-lang="en">Why the overlap is beautiful and why unobserved confounding is not addressed. Sensitivity checks were on caliper width, not Rosenbaum bounds.</span><span data-lang="zh">重叠漂亮的原因，以及未观测混淆没被处理的原因。敏感性查的是卡钳宽度，不是 Rosenbaum bounds。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Four-tier order rates 44.3% / 53.9% / 35.2% / 9.96%; test AUC 0.803</span><span data-lang="zh">四层实际下单率44.3%／53.9%／35.2%／9.96%；测试集 AUC 0.803</span></td>
  <td><span data-lang="en">Use the observed tier rates. Do not use 0.803 as pure prediction.</span><span data-lang="zh">用各层直接观测的下单率。不要把0.803当纯预测能力。</span></td>
</tr>
</tbody>
</table>

<div class="callout">
  <p class="label"><span data-lang="en">Why 13.2 points is not a lift</span><span data-lang="zh">为什么13.2个百分点不是提升</span></p>
  <p><span data-lang="en">Treatment and outcome sit in the same window. A user who orders more has more chances to touch a second line. Reverse causality is not ruled out. Identifying cause needs an exposure window and a later outcome window. That is a design decision. I did not cut the table that way, because I did not treat the causal question as a data-shape question at the start.</span><span data-lang="zh">处理和结果在同一个观测窗口。下单多的人天然有更多机会碰到第二条业务线。反向因果排除不掉。要识别因果，需要前期窗口定义暴露、后期窗口测下单。那是设计期的决定。我没有把表切成那样，因为一开始没把因果问题当成数据形状问题。</span></p>
</div>

<div data-lang="en">
<p>On the classifier: SHAP's top three include <code>log1p_second_cate_nunique</code>. <code>is_cross</code> is unique business lines ≥ 2, and lines are mapped from categories. Those quantities overlap by construction. The L1 framework already said not to do this. Whether L4 obeyed it, I did not verify. The "外卖/闪购" slice scoring AUC 1.0000 (n=676) is the kind of number a leak produces. I would start any remake with an ablation that drops that feature. I have not run it. The modelling is not mine to rerun without saying so.</p>
</div>
<div data-lang="zh">
<p>分类器那边：SHAP 重要性前三里有 <code>log1p_second_cate_nunique</code>。<code>is_cross</code> 的定义是去重业务线数 ≥ 2，业务线又从类目映射来。这两个量在结构上重叠。L1 框架已经写过不要这样做。L4 有没有执行，我没有核实。“外卖/闪购”那一组 AUC 1.0000（n=676），是泄漏会产出的那种数。重做的第一件事应是去掉这个特征做消融。我没跑。建模不是我的，重跑之前得先说清楚。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What it still can't do</span><span data-lang="zh">哪里没做到</span></h2>

<div data-lang="en">
<p>I can report agreement. I cannot report accuracy. There is no human gold set. A hundred hand-labelled rows would have given the whole taxonomy a number it still does not have.</p>
<p>Explore is too coarse. It is almost half the mapping table, and it mixes goal-directed list browsing (search results, rankings) with aimless feeds. Those are different user states and different operations. Search and "other," at nine rows each, cannot support a group analysis. The taxonomy covers the log. It does not balance the analysis.</p>
<p>The single-window table is the one I would not ship again if I knew the causal question on day one. Retrofitting an exposure window onto a table that was built without one is not a weekend patch. I wrote that limitation into the README. I did not rebuild the table.</p>
</div>
<div data-lang="zh">
<p>我能报一致率，不能报准确率。没有人工标准集。哪怕人工标100条，整套标签也会有一个它现在没有的可信度数字。</p>
<p>探索浏览太粗。它占了映射表将近一半，把有目标的列表浏览（搜索结果、榜单）和无目标的 feeds 混在一起。那是两种用户状态，对应不同的运营。搜索和其他各9条，做不了分组分析。这套分类覆盖了日志，没有平衡分析。</p>
<p>单一时间窗口这张表，如果第一天就知道下游要问因果，我不会再交出去。给一张当初没按窗口切的表补暴露期，不是一个周末能补的补丁。我把这条写进了 README。我没有重建这张表。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">The sentence I will not say in an interview</span><span data-lang="zh">面试里我不会说的那句</span></p>
  <p><span data-lang="en"><strong>I will not say we proved that crossing business lines lifts order rate by 13.2 points, or that I built a model with AUC 0.80.</strong> I built the definitions those numbers sit on. That is the job. It is also why a wrong definition would have made every later chart false in the same direction.</span><span data-lang="zh"><strong>我不会说我们证明了跨业务能把下单率提升13.2个百分点，也不会说我做了一个 AUC 0.80的模型。</strong>那些数字坐在我定的口径上。这就是这份工作。也是为什么口径错了，后面每张图都会朝同一个方向错。</span></p>
</div>
</div>
