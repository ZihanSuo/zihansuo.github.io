---
title: "INVESTelligence: AI-Powered Financial News Agent"
title_zh: "INVESTelligence：AI 财经新闻 Agent"
track: ai
featured: true
weight: 2
kicker_en: "Individual Project · 2025 · n8n"
kicker_zh: "个人项目 · 2025 · n8n"
summary: "A daily ranking agent for financial news, built end to end on my own. It ran for three weeks and I monitored it daily. Nine months later the archive showed the scoring function had silently degraded partway through, and that nothing I monitored could have caught it."
summary_zh: "一个每日排序财经新闻的 agent，从架构到部署由我独立完成。运行三周，我每天核查。九个月后归档数据显示，评分函数在中途已静默退化，而我核查的任何一项都不可能发现它。"
role: "Solo · design, build, deployment"
period: "2025.10–12"
stack: "n8n, Python, OpenAI, Tavily, Streamlit, GitHub"
tags: ["Agent workflow", "Scoring design", "n8n"]
cover: /assets/img/investelligence_1.png
links:
  - { label: "GitHub", url: "https://github.com/ZihanSuo/INVESTelligence" }
  - { label: "Live Demo", url: "https://investelligence.streamlit.app/" }
---

<div class="stage">
<h2><span data-lang="en">Why I built it</span><span data-lang="zh">起因</span></h2>

<div data-lang="en">
<p>I follow three positions: bitcoin, rare earths and Tesla. A feed ranks by recency and popularity, and neither is the same as relevance to a holding. Ten outlets covering one event count as ten items. A ruling that changes a company's cost base sits level with a product review.</p>
<p>What I wanted was a ranking that came with a reason to skip something, not broader coverage. It was also the first system I built end to end on my own.</p>
</div>

<div data-lang="zh">
<p>我关注比特币、稀土、特斯拉三个标的。信息流按时效与热度排序，这两条都不等同于"与持仓相关"：同一事件的多家转载被计为多条，改变公司成本结构的判决与一篇产品评测在版面上没有轻重之分。</p>
<p>我需要的是一个附带跳过理由的排序，不是更全的覆盖。这也是我第一个从架构设计到部署完全独立完成的系统。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">My approach</span><span data-lang="zh">思路</span></h2>

<div data-lang="en">
<p><strong>Split the judgement instead of asking the model for one number.</strong> Handing each article to a model for a 1 to 100 importance score returns a value that cannot be argued with and cannot be traced when wrong. So the split runs along a single line: does this require comprehension, or can it be counted.</p>
<ul>
<li><strong>Semantic layer, model.</strong> Event severity, market proximity, forward impact, each 0 to 4. Deciding whether an export restriction outranks a quarterly delivery figure requires reading the article.</li>
<li><strong>Quality layer, Python.</strong> Source credibility, topic weight, search relevance, cross-source pickup. That Reuters beats a content farm is a fact, and should not be re-decided by a language model every morning.</li>
</ul>
<p>Combined as <code>final = materiality × 0.6 + quality × 0.4</code>. Materiality weighs more because a well-sourced article about nothing is still about nothing.</p>
<p><strong>Three infrastructure choices, all for inspectability.</strong> Retrieval through Tavily rather than a general search API, which returns whatever won at SEO that week. Storage on GitHub rather than a database, so every run leaves a versioned, diffable record of what it saw and what it scored. Daily rather than real time, because I was not trading on it.</p>
<p><strong>What I did not do.</strong> Every constant above, the 0.6 and 0.4, the 40/25/20/15 inside the quality layer, the cutoff at 50, was set by hand in one afternoon and never validated. My documentation states them as design conclusions. They were estimates.</p>
</div>

<div data-lang="zh">
<p><strong>把判断拆开，而不是向模型要一个数。</strong>直接让模型给每篇文章打1到100的重要性分，得到的数值无法争辩，出错时也无法定位。因此按一条界线拆分：这件事需要读懂，还是可以计数。</p>
<ul>
<li><strong>语义层，模型。</strong>事件严重度、市场贴近度、前瞻影响，各0到4分。判断一条出口管制是否重于一份季度交付数据，必须读完文章。</li>
<li><strong>质量层，代码。</strong>来源可信度、主题权重、搜索相关性、跨源跟进数。路透社优于内容农场是既定事实，不需要每天早上由一个语言模型重新裁决。</li>
</ul>
<p>合成为 <code>final = materiality × 0.6 + quality × 0.4</code>。语义层权重更高，因为来源权威但言之无物的文章依然言之无物。</p>
<p><strong>三个基础设施决定，依据都是可检查性。</strong>检索走 Tavily 而非通用搜索 API，后者返回的是当周 SEO 胜出的内容。存储用 GitHub 而非数据库，使每次运行留下带版本、可逐行比对的记录，检索到什么、每条打了多少分都有据可查。频率为每日一次而非实时，因为我不据此交易。</p>
<p><strong>没有做的事。</strong>上述每一个常数，0.6与0.4的分配、质量层内部的40/25/20/15、50分的阈值，均由我在一个下午凭经验设定，未经任何验证。我的文档把它们写成了设计结论，实际上只是估计。</p>
</div>

<div data-lang="en">
<p>The pipeline: scheduled trigger at eight, keywords from a Google Sheet, semantic expansion before retrieval so a Tesla query also reaches supply chain and regulatory news that never names it, Tavily retrieval, Python cleaning and deduplication, the two scoring layers, then ranking. Survivors are written to a dated GitHub folder as CSV and JSON, from which one branch renders an email and the other feeds a Streamlit dashboard. Orchestration, storage and presentation never touch: the dashboard has no database and no hidden state, so anything it shows is traceable to a file.</p>
</div>

<div data-lang="zh">
<p>流水线：八点定时触发，关键词取自 Google Sheet，检索前先做语义扩展，使检索"特斯拉"也能覆盖通篇不出现该词的上游供应链与监管消息；Tavily 检索，Python 清洗去重，两层打分后排序。通过筛选的条目以 CSV 与 JSON 写入 GitHub 上以日期命名的文件夹，一路渲染成邮件，一路供 Streamlit 看板读取。编排、存储、展示三层互不接触：看板没有数据库，也没有隐藏状态，它呈现的任何内容都可追溯到一个文件。</p>
</div>

<figure>
  <img src="/assets/img/investelligence_1.png" alt="The full n8n workflow, from schedule trigger through retrieval, scoring and dual delivery">
  <figcaption><span data-lang="en">The workflow in n8n. Every branch is something that can be opened and inspected.</span><span data-lang="zh">n8n 里的工作流。每一个分支都可以点开检查。</span></figcaption>
</figure>

<div data-lang="en">
<p>Each of the three components that produce a ranking covers what the other two cannot, and each has a blind spot the design does not address.</p>
</div>
<div data-lang="zh">
<p>产生排序的三个部件，各自覆盖另外两者做不到的部分，也各自留下一个本设计未处理的盲区。</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Component</span><span data-lang="zh">部件</span></th>
  <th><span data-lang="en">Good at</span><span data-lang="zh">擅长</span></th>
  <th><span data-lang="en">Blind to</span><span data-lang="zh">盲区</span></th>
</tr></thead>
<tbody>
<tr>
  <td><span data-lang="en">Semantic materiality<br>LLM, three dimensions at 0 to 4</span><span data-lang="zh">语义重要性<br>模型，三维度各0到4分</span></td>
  <td><span data-lang="en">Whether an event matters, which cannot be decided without comprehension.</span><span data-lang="zh">事件是否重要，不理解内容无法判定。</span></td>
  <td><span data-lang="en">Its own consistency. Nothing forces the same article to score the same twice.</span><span data-lang="zh">自身一致性。没有机制保证同一篇文章两次得分相同。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Structural quality<br>Python, four weighted components</span><span data-lang="zh">结构质量分<br>Python，四个加权分量</span></td>
  <td><span data-lang="en">Countable facts. Deterministic, same input gives the same answer.</span><span data-lang="zh">可计数的事实。确定性，同样输入得同样结果。</span></td>
  <td><span data-lang="en">Anything needing comprehension. A category index page on a trusted domain looks excellent.</span><span data-lang="zh">任何需要读懂的内容。可信域名下的栏目索引页在它眼中评分很高。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Semantic expansion<br>LLM query rewriting</span><span data-lang="zh">语义扩展<br>模型改写检索词</span></td>
  <td><span data-lang="en">Reaching news that affects a holding without naming it.</span><span data-lang="zh">够到影响持仓但不提及其名称的消息。</span></td>
  <td><span data-lang="en">Drift. Nothing bounds how far "related" may travel.</span><span data-lang="zh">漂移。没有任何约束限定"相关"可以走多远。</span></td>
</tr>
</tbody>
</table>
</div>

<div class="stage">
<h2><span data-lang="en">What it produced</span><span data-lang="zh">成果</span></h2>

<div data-lang="en">
<p>Twelve run-days between 30 November and 20 December, ten of them delivering a newsletter. A run finishes in under fifteen minutes at under thirty cents. On 20 December it retrieved, deduplicated and scored 50 articles across the three themes: 17 bitcoin, 15 rare earth, 18 Tesla.</p>
<p>I monitored it daily for all three weeks: trigger fired at eight, no node red, CSVs in the correctly dated folder, mail delivered, dashboard rendering. Everything passed.</p>
<p>Every one of those checks asks whether the machine is alive. None looks at the ranking. <strong>Had the scores been assigned at random, all of them would still have passed.</strong></p>
</div>

<div data-lang="zh">
<p>11月30日至12月20日共12个运行日，其中10日产出简报。单次运行耗时15分钟以内，成本低于0.3美元。12月20日在三个主题下检索、去重并打分50篇文章：比特币17篇，稀土15篇，特斯拉18篇。</p>
<p>三周内我每日核查：定时器是否八点触发、有无节点报错、CSV 是否落入当日文件夹、邮件是否送达、看板能否渲染。全部通过。</p>
<p>这些检查项问的都是同一个问题，即系统是否仍在运行，没有一项面向排序结果。<strong>即便分数由随机数生成，它们依然会全部通过。</strong></p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">Postmortem</span><span data-lang="zh">事后复盘</span></h2>

<div data-lang="en">
<p>I went back to the archive nine months later, while writing this page. Three things were wrong on 20 December.</p>
<p><strong>The headline figure is decorative.</strong> The dashboard shows "Market Sentiment +0.18" labelled "Bullish". That day's distribution contains zero strong-negative and zero strong-positive readings across all 50 articles. Averaging three unrelated themes into one number and attaching a market verdict gives it a confidence the spread does not have. Sentiment also does not enter the ranking. It is shown, not used.</p>
<p><strong>The threshold is not applied.</strong> The design discards anything below 50. The file feeding the dashboard contains scores of 20.8, 26.4, 30.8 and 33.48. Visible without opening the data: the scatter's x axis starts at 20.</p>
<p><strong>Semantic expansion drifted and scoring did not object.</strong> Under bitcoin, an article titled "Medicine approval times in Europe to be cut by almost 15%" scored 65.8, while two genuine bitcoin stories in the same file scored 50.8. EU medical device regulation and agricultural biocontrol authorization also came in under bitcoin. Under Tesla, a Fox News category listing page, url ending <code>?page=46</code>, scored 60.8.</p>
</div>

<div data-lang="zh">
<p>九个月后，在撰写本页期间我回看了归档。12月20日有三处问题。</p>
<p><strong>看板首屏数字不具备指示意义。</strong>显示"Market Sentiment +0.18"，标注"Bullish"。当日50篇文章的情绪分布中，强负面0篇，强正面0篇。将三个互不相关主题的均值合并为单一数值并附加市场判断词，赋予了它底层分布不具备的确定性。情绪分且不参与排序，仅用于展示。</p>
<p><strong>阈值未生效。</strong>设计前提为舍弃50分以下条目，而供给看板的文件中存在20.8、26.4、30.8、33.48。无需查阅数据即可确认：散点图横轴自20起始。</p>
<p><strong>语义扩展发生漂移，评分未予拦截。</strong>bitcoin 关键词下，标题为"欧洲药品审批时间将缩短近15%"的文章得分65.8，而同一文件中两条真实的比特币条目得分均为50.8。欧洲医疗器械法规与农业生物防治审批同样归入 bitcoin。tesla 关键词下，福克斯新闻栏目索引页得分60.8，URL 以 <code>?page=46</code> 结尾。</p>
</div>

<figure>
  <img src="/assets/img/investelligence_2.png" alt="The Market Radar dashboard for 20 December 2025, showing the daily pulse and the impact against sentiment scatter">
  <figcaption><span data-lang="en">20 December 2025. The scatter's x axis starts at 20.</span><span data-lang="zh">2025年12月20日。散点图横轴自20起始。</span></figcaption>
</figure>

<div data-lang="en">
<p>Then I recomputed the scores. All 50 rows that day satisfy exactly:</p>
<p><code>final = 60 × materiality + 16 × credibility + 12.8</code></p>
</div>

<div data-lang="zh">
<p>随后我重算了分数。当日50行精确满足：</p>
<p><code>final = 60 × materiality + 16 × credibility + 12.8</code></p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Where 12.8 comes from</span><span data-lang="zh">12.8 的来源</span></p>
  <p><span data-lang="en">The quality layer reads its inputs with <code>dict.get(key, default)</code> and the defaults are hardcoded: <code>weight</code> 0.8, <code>expansion_importance</code> 1.0, <code>tavily_score</code> 0.6. Through the weighting those give <code>0.4 × (0.25 × 0.8 × 1.0 + 0.20 × 0.6 + 0.15 × 0) × 100 = 12.8</code>.</span><span data-lang="zh">质量层使用 <code>dict.get(key, default)</code> 读取输入，默认值写死在代码中：<code>weight</code> 0.8，<code>expansion_importance</code> 1.0，<code>tavily_score</code> 0.6。代入权重公式得 <code>0.4 × (0.25 × 0.8 × 1.0 + 0.20 × 0.6 + 0.15 × 0) × 100 = 12.8</code>。</span></p>
  <p><span data-lang="en">Recomputing from the real field values matches 2 of 50 rows. From the defaults, 50 of 50. Three of the four quality components were not weak. They were absent.</span><span data-lang="zh">以真实字段值重算，吻合2行；以默认值重算，吻合50行。四个质量分量中的三项并非权重偏低，而是未取到值。</span></p>
</div>

<div data-lang="en">
<p>The fields were not missing from the pipeline. That day's <code>dedupted_news.csv</code> carries <code>weight</code>, <code>expansion_importance</code> and <code>tavily_score</code>, populated and varying. They were lost in transit: the materiality node rebuilds each item from a fixed whitelist, and those three are not on it.</p>
<p>So it is an ordering change, and the archive dates it. On 9 December <code>dedupted_news.csv</code> has a <code>qual_score</code> column, quality was computed while the item still carried its inputs, and the final scores reconstruct from it exactly, 22 of 22 rows. On 20 December that column is gone.</p>
<p><strong>Both runs were successes.</strong> Nothing threw, because by any standard a program can detect nothing went wrong: a key was absent, a default was available. That is the language behaving as specified. Which means the degradation is unobservable by construction. There is no state in which my monitoring returns a different answer for four working components than for two.</p>
</div>

<div data-lang="zh">
<p>字段并未从流水线中丢失。当日 <code>dedupted_news.csv</code> 中 <code>weight</code>、<code>expansion_importance</code>、<code>tavily_score</code> 三列均有取值且行间存在差异。丢失发生在传递环节：语义打分节点依据固定字段白名单重建每个对象，该三项不在白名单内。</p>
<p>因此这是一次节点顺序变更，归档数据可为其定年。12月9日的 <code>dedupted_news.csv</code> 含 <code>qual_score</code> 列，质量评分执行于对象仍携带输入字段的阶段，当日最终得分可由该列精确重构，22行全部吻合；12月20日该列已不存在。</p>
<p><strong>两日运行均判定为成功。</strong>全程无异常抛出，因为按程序可识别的标准此处并未出错：键不存在，默认值可用，这是语言按规范执行。也就是说，这种退化在设计上不可观测。不存在任何系统状态，能使当时的监控对"四个分量生效"与"两个分量生效"给出不同结论。</p>
</div>

<div data-lang="en">
<p>The root cause is not the bug. <strong>No measurement of ranking quality was ever defined.</strong> There is no labelled set of articles that mattered, so no claim about ranking quality survives the question of how I know. Worse, the material for that check was archived daily: <code>dedupted_news.csv</code> and <code>scores.csv</code> hold the full scored pool, including everything the filter discarded, one directory above the files I was checking.</p>
<p>I built for inspectability on purpose, and then audited the wrong column. Storing the evidence and knowing what question to ask of it are separate problems, and I had only solved the first.</p>
<p>Three limits worth stating rather than leaving implied. The interest weights were set for my own holdings and the system has never been pointed at anyone else's, so "personalized" describes the architecture, not a tested property. Materiality has no stability check, so the same article scored twice could differ and nothing would notice. And "runs daily" is what my documentation says; the archive says twelve days across three weeks with two gaps.</p>
<p>Settling the main question is about a day of work: take one day's full pre-filter pool, label by hand what mattered, check where the ranking put it and what fell below the cutoff, then rerun with different weights and see whether the output moves. If it does not, the weights are decoration. I have not done it.</p>
<p>The next agent system I built started from the other end, with the evaluation harness before the pipeline, and most of its effort went into machinery for proving when its own output cannot be trusted. That was not foresight. It was this project's bill.</p>
</div>

<div data-lang="zh">
<p>根本原因不是这个缺陷。<strong>这个项目从未定义过针对排序质量的测量。</strong>不存在任何标注了"该条确实重要"的文章集合，因此关于排序质量的任何说法都经不起"你怎么知道"的追问。更麻烦的是，做这项核查所需的材料每天都在归档：<code>dedupted_news.csv</code> 与 <code>scores.csv</code> 保存了完整的打分池，包含被过滤器舍弃的全部条目，位置就在我所核查的那些文件的上一级目录。</p>
<p>我是刻意为可检查性做的架构，然后审计了错误的那一列。保存证据，和知道该向证据提出什么问题，是两个不同的问题，我只解决了前一个。</p>
<p>三个限制需要写明而非默认：兴趣权重按我自己的持仓设定，系统从未面向他人的组合运行，因此"个性化"描述的是架构，不是被验证过的性质；语义打分没有稳定性检验，同一篇文章两次得分不同不会被察觉；"每日运行"是我文档中的说法，归档数据是三周内12天，中间存在两次断档。</p>
<p>要把核心问题定下来约需一天：取某一日筛选前的完整打分池，人工标注哪些确实重要，考察排序将其置于何处、以及落在阈值以下的是什么，再换一组权重重跑同一日，观察输出是否变化。若不变化，这些权重即为装饰。这项工作尚未完成。</p>
<p>我随后做的 agent 系统是从另一端开始的：先有评估工具，再有流水线，大部分力气用于构建一种机制，证明它自己何时不该被相信。那不是远见，那是本项目的账单。</p>
</div>
</div>
