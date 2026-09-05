---
title: "INVESTelligence: AI-Powered Financial News Agent"
title_zh: "INVESTelligence：AI 财经新闻 Agent"
track: ai
featured: true
weight: 2
kicker_en: "Individual Project · 2025 · n8n"
kicker_zh: "个人项目 · 2025 · n8n"
summary: "The first agent system I built end to end on my own. It ran daily for three weeks and I monitored it every day. Nine months later I went back to the archive and found that the scoring function had silently degraded partway through, and that nothing I had been monitoring could have told me."
summary_zh: "第一个完全由我独立建成的 agent 系统。它运行了三周，我每天都在看它，看的却始终不是它给出的那个排序。九个月后我重新打开归档，才知道那个排序在中途就已经不作数了。"
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
<h2><span data-lang="en">The problem</span><span data-lang="zh">问题是什么</span></h2>

<div data-lang="en">
<p>I had just started investing, and I was following three things: bitcoin, rare earths and Tesla. There was no shortage of news about any of them. That was the problem.</p>
<p>A feed sorts by what is recent and what is popular. Neither of those is the same as what matters to the handful of positions I actually held. Ten outlets writing up the same Musk headline is one event, not ten. A court ruling that changes a company's cost base does not arrive looking any more important than a Model Y review. What I wanted was not more coverage. It was permission to skip things, with a reason attached.</p>
<p>This was also the first system I built end to end by myself, with nobody to hand the hard part to. That turns out to matter for the rest of this page, and not in the way I expected.</p>
</div>

<div data-lang="zh"><p>刚开始投资的那阵子，我盯着三个标的：比特币、稀土、特斯拉。它们从不缺新闻。缺的从来不是新闻，过量本身就是那个问题。</p>
<p>信息流按时效与热度排序，而这两条标准都与"是否关系到我手上的仓位"无关。十家媒体转述同一条马斯克消息，在信息流里就是十条。一份足以改写公司成本结构的判决，与一篇 Model Y 试驾并排躺着，看不出轻重。我想要的不是更全，而是一个可以据此不看的理由。</p>
<p>这也是我第一个从架构设计到部署全部独立完成的系统，没有可以把难题移交出去的人。这件事对后面要讲的内容至关重要，只是它的重要性并不是我当初设想的那一种。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">The call I made</span><span data-lang="zh">我做的判断</span></h2>

<div data-lang="en">
<p>The obvious build is to hand each article to a model and ask it how important this is, one to a hundred. I did not want that. At the time I could only put the reason roughly: the model would hand back a number, the number would look considered, and I would have no way to argue with it.</p>
<p>So I split the judgement in two, along the line between what is genuinely a matter of reading and what is genuinely a matter of counting.</p>
</div>

<div data-lang="zh"><p>最省事的做法是把每篇文章交给模型，让它打一个1到100的重要性分。我当时不愿意这么做，理由说不清楚，大意是：它会给我一个数，那个数看上去像是经过考量的，而我没有任何依据可以跟它争。</p>
<p>于是我把判断拆成两层，分界线是：这件事究竟要读懂才能判定，还是数一数就能判定。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">The split</span><span data-lang="zh">这条分界线</span></p>
  <p><span data-lang="en"><strong>Reading goes to the model.</strong> Event severity, market proximity, forward impact, each scored 0 to 4. Deciding whether an export restriction outranks a quarterly delivery number requires actually understanding the article.</span><span data-lang="zh"><strong>需要读懂的交给模型。</strong>事件严重度、市场贴近度、前瞻影响，各按0到4分评定。一条出口管制是否比一份季度交付数据更重要，不读完文章就无法回答。</span></p>
  <p><span data-lang="en"><strong>Counting goes to Python.</strong> Source credibility, topic weight, search relevance, how many outlets picked the story up. Whether Reuters is more reliable than a content farm is a fact. It should not be re-litigated by a language model every morning at eight.</span><span data-lang="zh"><strong>可以计数的交给代码。</strong>来源可信度、主题权重、搜索相关性、同一事件的跨源跟进数量。路透社比内容农场可信，这是既定事实，不该每天早上八点由一个语言模型重新裁决一次。</span></p>
</div>

<div data-lang="en">
<p>The two combine as <code>final = materiality × 0.6 + quality × 0.4</code>. Materiality carries more weight because a beautifully sourced article about nothing is still about nothing.</p>
<p>Three smaller calls followed from wanting the thing to stay inspectable. Retrieval goes through Tavily rather than a general search API, because general search returns whatever is winning at SEO that week. Storage is GitHub rather than a database, so every run leaves a versioned, diffable copy of exactly what it saw and exactly what it scored. And the cadence is daily rather than real time, because I was not trading on this, I was reading it with coffee.</p>
<p>One thing I should say plainly here, because the rest of the page depends on it. Every constant in that scoring design (the 0.6 and 0.4, the 40/25/20/15 inside the quality layer, the cutoff at 50) is a number I picked by hand in a single afternoon. They are stated in my documentation as though they were findings. They were guesses.</p>
</div>

<div data-lang="zh"><p>两层合成一个总分：<code>final = materiality × 0.6 + quality × 0.4</code>。语义层权重更高，因为一篇引用规范、来源权威却言之无物的文章，依然言之无物。</p>
<p>另外三个决定都指向同一件事：让它保持可检查。检索走 Tavily 而不是通用搜索 API，因为后者返回的是当周 SEO 胜出的东西。存储用 GitHub 而不是数据库，于是每一次运行都留下一份带版本、可以逐行比对的记录，当天检索到什么、每条打了多少分，全部有据可查。频率是每日一次而不是实时，因为我不据此交易，我只是每天早上读它。</p>
<p>有一点必须先说清楚，因为后面的内容全都建立在它之上：上面这套评分里的每一个常数，0.6与0.4的分配、质量层内部的40/25/20/15、50分的阈值，都是我在一个下午凭经验定下来的，没有经过任何验证。它们在我自己的文档里被写成了设计结论，实际上只是估计。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How it works</span><span data-lang="zh">怎么做的</span></h2>

<div data-lang="en">
<p>A scheduled trigger fires at eight in the morning. Keywords come out of a Google Sheet, so changing what I follow does not mean editing the workflow. Each keyword goes through semantic expansion before retrieval, so that a query for Tesla can also reach upstream supply chain and regulatory news that never uses the word. Tavily returns articles, Python cleans and deduplicates them, the model scores materiality, Python scores quality, the two combine and rank. Survivors are written to a dated folder on GitHub as CSV and JSON. From there one branch renders an email newsletter through Gmail and the other is read directly by a Streamlit dashboard.</p>
<p>Execution, storage and presentation never touch each other. n8n only orchestrates, GitHub only stores, Streamlit only reads. The dashboard has no database and no hidden state, which means anything it shows me, I can go and find as a file.</p>
</div>

<div data-lang="zh"><p>每日八点定时触发。关键词放在 Google Sheet 里，所以调整关注对象不必改动工作流本身。每个关键词在检索前先做一次语义扩展，让检索"特斯拉"也能覆盖那些通篇不出现这三个字的上游供应链与监管消息。Tavily 返回文章，Python 清洗去重，模型给出语义分，Python 给出质量分，两层合成后排序。通过筛选的条目写入 GitHub 上以日期命名的文件夹，存为 CSV 与 JSON。此后分作两路，一路经 Gmail 渲染成邮件简报，另一路由 Streamlit 看板直接读取。</p>
<p>执行、存储、展示三层互不接触。n8n 只负责编排，GitHub 只负责存，Streamlit 只负责读。看板没有数据库，也没有隐藏状态，这意味着它呈现给我的任何内容，我都能回头翻出对应的那个文件。</p>
</div>

<figure>
  <img src="/assets/img/investelligence_1.png" alt="The full n8n workflow, from schedule trigger through retrieval, scoring and dual delivery">
  <figcaption><span data-lang="en">The whole workflow in n8n. The visual sprawl is the point: every branch is something I can open and inspect.</span><span data-lang="zh">n8n 里的完整工作流。它铺开成这样是有意的：每一个分支都是我可以点开检查的东西。</span></figcaption>
</figure>

<div data-lang="en">
<p>The three components that produce a ranking are each good at something the other two are bad at, and each has a blind spot that the design does not cover.</p>
</div>
<div data-lang="zh"><p>产生排序的三个部件，各自擅长另外两者不擅长的部分，也各自留下一个这套设计没有覆盖的盲区。</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Component</span><span data-lang="zh">部件</span></th>
  <th><span data-lang="en">Good at</span><span data-lang="zh">擅长</span></th>
  <th><span data-lang="en">Blind to</span><span data-lang="zh">盲区</span></th>
</tr></thead>
<tbody>
<tr>
  <td><span data-lang="en">Semantic materiality<br>LLM, three dimensions at 0 to 4</span><span data-lang="zh">语义重要性<br>模型，三个维度各0到4分</span></td>
  <td><span data-lang="en">Whether an event actually matters, which cannot be decided without comprehension.</span><span data-lang="zh">一个事件到底重不重要，这件事不理解内容就没法判。</span></td>
  <td><span data-lang="en">Its own consistency. Nothing forces the same article to receive the same score twice.</span><span data-lang="zh">它自己的一致性。没有任何机制保证同一篇文章两次打分相同。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Structural quality<br>Python, four weighted components</span><span data-lang="zh">结构质量分<br>Python，四个加权分量</span></td>
  <td><span data-lang="en">Facts that can be counted. Deterministic, so the same input gives the same answer every run.</span><span data-lang="zh">可以数出来的事实。确定性的，同样的输入每次都得到同样的答案。</span></td>
  <td><span data-lang="en">Anything needing comprehension. A category index page on a trusted domain looks excellent to it.</span><span data-lang="zh">任何需要读懂的东西。一个可信域名下的栏目索引页，在它眼里非常优秀。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Semantic expansion<br>LLM query rewriting</span><span data-lang="zh">语义扩展<br>模型改写检索词</span></td>
  <td><span data-lang="en">Reaching news that matters to a holding without ever naming it.</span><span data-lang="zh">够到那些真的影响持仓、但通篇不提这个名字的消息。</span></td>
  <td><span data-lang="en">Drift. Nothing in the design bounds how far "related" is allowed to travel.</span><span data-lang="zh">漂移。设计里没有任何东西限定"相关"可以走多远。</span></td>
</tr>
</tbody>
</table>
</div>

<div class="stage">
<h2><span data-lang="en">How I tested it</span><span data-lang="zh">怎么验的</span></h2>

<div data-lang="en">
<p>I monitored it, daily, for the whole three weeks. That part I want to state plainly, because the interesting failure here is not neglect.</p>
<p>Every morning I checked that the trigger had fired at eight, that no node had gone red, that the CSVs had landed in the correctly dated folder, that the mail had arrived, and that the dashboard rendered without throwing. I read the newsletter. It looked reasonable. All of it passed, and the archive agrees: twelve run-days between 30 November and 20 December, ten carrying a newsletter.</p>
<p>Every one of those checks asks whether the machine is alive. Not one of them looks at the ranking. Put differently: <strong>if the scores had been assigned at random, every check I ran would still have passed.</strong></p>
<p>The daily cadence made this worse rather than better. Checking something every morning for three weeks builds real confidence, and mine was stable and completely unfounded. Someone who glanced at it once a fortnight might have felt uneasy enough to open the data. I never felt uneasy, because the thing I was watching never wavered.</p>
<p>Two things I did miss, and they are the same shape. There is a two-day hole on the 16th and 17th that I did not notice at the time. And my own README states the runtime and cost three different ways in three different sections. Neither is important on its own. Both are evidence that I was reading these files for reassurance rather than for information.</p>
</div>

<div data-lang="zh"><p>那三周里我每天都在核查。这一点必须先讲清楚，因为这个故事真正的转折不在于疏忽。</p>
<p>每天早晨我会确认定时器是否在八点触发、有没有节点报错、CSV 是否落进当日日期的文件夹、邮件是否送达、看板能否正常渲染。我会读那封简报，内容看起来合理。所有检查项全部通过，归档数据也与之一致：11月30日至12月20日共12个运行日，其中10日产出简报。</p>
<p>但这些检查项指向的是同一个问题，即系统是否还在运行，没有一项面向排序结果本身。换一种说法：<strong>即便那些分数由随机数生成，我当时执行的每一项检查依然会全部通过。</strong></p>
<p>每日核查这个节奏让问题更严重，而不是更轻。连续三周每天确认一次，会建立起真实的信心，而我的信心稳定且毫无依据。一个每两周才看一眼的人，也许反而会因为心里没底去翻一次原始数据。我从未有过这种不安，因为我盯着的那个对象始终正常。</p>
<p>另有两处遗漏，性质相同。16日与17日断了两天，当时我没有察觉；我自己的 README 把运行时间与成本写成了三个不同的版本，分散在三个章节里。单独看都不重要，放在一起说明的是同一件事：我读这些文件是为了安心，不是为了获取信息。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">Evidence</span><span data-lang="zh">结果和证据</span></h2>

<div data-lang="en">
<p>The operating numbers are real and unremarkable. A run finishes in under fifteen minutes and costs under thirty cents. Twelve run-days are archived, ten newsletters were delivered. On 20 December the system retrieved, deduplicated and scored 50 articles across the three themes: 17 for bitcoin, 15 for rare earth, 18 for Tesla.</p>
<p>I measured the runtime and cost by watching my own runs, not with any instrumentation. My own README states them three different ways in three different sections, which is a small thing that tells you how carefully I was holding the numbers.</p>
<p>The rest of this section is what happened when I finally went back and checked the ranking, which was while writing this page, roughly nine months after the system stopped running.</p>
</div>

<div data-lang="zh"><p>运行层面的数字真实且平常。单次运行耗时15分钟以内，成本低于0.3美元。归档共12个运行日，产出简报10封。12月20日，系统在三个主题下检索、去重并打分50篇文章，其中比特币17篇、稀土15篇、特斯拉18篇。</p>
<p>上述时间与成本为运行过程中的目测估计，无埋点数据支撑。同一组数字在 README 的三个章节中存在三种表述。</p>
<p>本节其余内容为回溯核查排序结果后的发现。核查时间为撰写本页期间，距系统停止运行约九个月。</p>
</div>

<figure>
  <img src="/assets/img/investelligence_2.png" alt="The Market Radar dashboard for 20 December 2025, showing the daily pulse and the impact against sentiment scatter">
  <figcaption><span data-lang="en">20 December 2025. Note the horizontal axis on the scatter: it starts at 20.</span><span data-lang="zh">2025年12月20日。散点图横轴自20起始。</span></figcaption>
</figure>

<div data-lang="en">
<p><strong>The headline number is decorative.</strong> The dashboard prints "Market Sentiment +0.18" with the word "Bullish" under it. Across all 50 articles that day, the sentiment distribution contains zero strong-negative and zero strong-positive readings. Everything sat neutral or weak. Averaging three unrelated themes into one figure and labelling it with a market verdict gives it a confidence the underlying spread does not have. Sentiment also does not enter the ranking at all. It is shown, not used.</p>
<p><strong>The threshold is not applied.</strong> The design leans on discarding anything below a final score of 50. The 20 December file that feeds the dashboard contains items scoring 20.8, 26.4, 30.8 and 33.48. You can see this in the screenshot above without opening any data: the axis begins at 20, because the points do.</p>
<p><strong>Semantic expansion drifted, and the score did not object.</strong> Under the keyword bitcoin that day, the system returned and scored an article titled "Medicine approval times in Europe to be cut by almost 15%". It scored 65.8. Two genuine bitcoin stories in the same file, one on American Bitcoin's treasury and one on Bitdeer's mining output, both scored 50.8. European medical device regulation and agricultural biocontrol authorization also came in under bitcoin. Under Tesla, the system scored a Fox News category listing page, url ending <code>?page=46</code>, at 60.8. It is not an article.</p>
</div>

<div data-lang="zh"><p><strong>看板首屏数字不具备指示意义。</strong>显示值为"Market Sentiment +0.18"，下方标注"Bullish"。当日50篇文章的情绪分布中，强负面0篇，强正面0篇，全部落于中性或弱倾向区间。将三个互不相关主题的情绪均值合并为单一数值并附加市场判断词，赋予了该数值其底层分布不具备的确定性。此外，情绪分不参与排序计算，仅用于展示。</p>
<p><strong>阈值未生效。</strong>设计前提为舍弃总分50以下条目。12月20日供给看板的文件中存在20.8、26.4、30.8、33.48四档得分。该现象无需查阅数据即可确认：上方截图横轴自20起始。</p>
<p><strong>语义扩展发生漂移，评分未予拦截。</strong>bitcoin 关键词下检索并打分了标题为"欧洲药品审批时间将缩短近15%"的文章，得分65.8；同一文件中两条真实的比特币主题条目，即 American Bitcoin 持仓与 Bitdeer 挖矿产出，得分均为50.8。欧洲医疗器械法规与农业生物防治审批同样归入 bitcoin。tesla 关键词下，福克斯新闻栏目索引页得分60.8，其 URL 以 <code>?page=46</code> 结尾，该页面不是文章。</p>
</div>

<div data-lang="en">
<p>Then I recomputed the scores, and found the thing I would not have believed if someone had told me.</p>
<p>For all 50 rows on 20 December, the final score is exactly:</p>
<p><code>final = 60 × materiality + 16 × credibility + 12.8</code></p>
<p>It fits every single row, to the last decimal place.</p>
</div>

<div data-lang="zh"><p>对当日全部得分执行重算，结果如下。</p>
<p>12月20日50行，最终得分精确等于：</p>
<p><code>final = 60 × materiality + 16 × credibility + 12.8</code></p>
<p>50行全部吻合，小数位无偏差。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Where 12.8 comes from</span><span data-lang="zh">12.8 是从哪里来的</span></p>
  <p><span data-lang="en">The quality layer reads its four inputs with <code>dict.get(key, default)</code>, and the defaults are written into the code: <code>weight</code> falls back to 0.8, <code>expansion_importance</code> to 1.0, <code>tavily_score</code> to 0.6. Put those three defaults through the weighting and they come to <code>0.4 × (0.25 × 0.8 × 1.0 + 0.20 × 0.6 + 0.15 × 0) × 100</code>, which is <strong>12.8</strong>, to the decimal.</span><span data-lang="zh">质量层使用 <code>dict.get(key, default)</code> 读取四个输入，默认值写死在代码中：<code>weight</code> 兜底 0.8，<code>expansion_importance</code> 兜底 1.0，<code>tavily_score</code> 兜底 0.6。三者代入权重公式，得 <code>0.4 × (0.25 × 0.8 × 1.0 + 0.20 × 0.6 + 0.15 × 0) × 100</code>，结果为 <strong>12.8</strong>，小数位完全吻合。</span></p>
  <p><span data-lang="en">Recomputing all 50 rows from the real field values matches 2 of them. Recomputing from the hardcoded fallbacks matches <strong>50 of 50</strong>. Three of the four quality components were not weak that day. They were absent, and the code quietly substituted constants.</span><span data-lang="zh">以真实字段值重算50行，吻合2行；以代码默认值重算，<strong>吻合50行</strong>。当日四个质量分量中的三项并非权重偏低，而是未取到值，代码以常数替代。</span></p>
</div>

<div data-lang="en">
<p>The inputs were not missing from the pipeline. <code>dedupted_news.csv</code> for that day carries <code>weight</code>, <code>expansion_importance</code> and <code>tavily_score</code>, all populated, all varying across rows. They were lost in transit. The materiality node rebuilds each item from an explicit whitelist of fields, and those three are not on it, so anything scored after that node sees an object where they simply do not exist.</p>
<p>Which means the failure is an ordering change, and the archive dates it. On 9 December, <code>dedupted_news.csv</code> has a <code>qual_score</code> column: quality was computed while the item still carried its inputs, and the final scores reconstruct exactly from it, 22 rows out of 22. On 20 December that column is gone. Same code, same fields, quality scoring now happening downstream of the whitelist.</p>
</div>

<div data-lang="zh"><p>输入字段并未从流水线中丢失。当日 <code>dedupted_news.csv</code> 中，<code>weight</code>、<code>expansion_importance</code>、<code>tavily_score</code> 三列均有取值，且行间存在差异。丢失发生在传递环节：语义打分节点依据一份固定的字段白名单重建每个对象，该三项不在白名单内，因此位于该节点下游的任何打分逻辑，接收到的都是不含这些字段的对象。</p>
<p>由此可判定该故障为节点顺序变更，且归档数据可为其定年。12月9日的 <code>dedupted_news.csv</code> 含 <code>qual_score</code> 列，表明质量评分执行于对象仍携带输入字段的阶段，当日最终得分可由该列精确重构，22行全部吻合。12月20日该列不存在。代码与字段均未变更，质量评分已位于白名单下游。</p>
</div>

<div data-lang="en">
<p>The part that actually matters is not the bug. It is this: <strong>both runs succeeded.</strong> Both fired on schedule, both wrote well-formed CSVs into correctly dated folders, both sent a newsletter that read fine over coffee, both rendered a dashboard with plausible numbers on it. Nothing raised an exception, because nothing went wrong in the sense a program can detect. A key was absent and a default was available, which is not an error. It is the language behaving as specified.</p>
<p>So the degradation is invisible by construction. There is no state in which my monitoring returns a different answer for a scoring function with four working components than for one with two.</p>
</div>

<div data-lang="zh"><p>需要强调的不是该缺陷本身，而是<strong>两日运行均判定为成功</strong>。均按时触发，均将格式合规的 CSV 写入日期正确的文件夹，均发出简报，均渲染出数值合理的看板。全程无异常抛出，因为按程序可识别的标准，此处并未出错：键不存在，默认值可用，这不构成错误，是语言按规范执行。</p>
<p>因此该退化在设计上不可观测。不存在任何一种系统状态，能使当时的监控对"四个质量分量均生效"与"仅两个生效"给出不同结论。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What it still can't do</span><span data-lang="zh">哪里没做到</span></h2>

<div data-lang="en">
<p>The honest headline is not that the ranking has bugs in it. It is that <strong>no measurement of the ranking exists.</strong> There is no set of articles labelled "this one mattered" anywhere in this project, so there is no statement I can make about ranking quality that would survive being asked how I know. The bugs above are not the limitation. They are what the absence of a measurement looks like when you finally go and look.</p>
<p>What makes that worse rather than better is that the material for the check was sitting there the entire time, in files I was opening daily. Every run archived <code>dedupted_news.csv</code> and <code>scores.csv</code>, which hold the full scored pool, not just the items that survived filtering. The single most important question about a filter is what it threw away, and the answer was written to disk every morning for three weeks, one directory above the file I was checking.</p>
<p>There is a design lesson in that which I did not expect to be the takeaway. I deliberately built for inspection: GitHub as a versioned store precisely so that every run would be auditable, no hidden state, nothing that could not be traced back to a file. And then I audited the wrong column. <strong>Storing the evidence, and knowing which question to ask of it, are two different projects, and I had only finished the first one.</strong> An audit trail is only worth its disk if somebody knows what would count as a wrong answer.</p>
</div>

<div data-lang="zh"><p>诚实的说法不是"排序里有缺陷"，而是<strong>这个项目从未建立过任何针对排序质量的测量</strong>。没有任何一份标注了"这一条确实重要"的文章集合，所以关于排序好不好，我说不出一句经得起追问依据的话。上面那些缺陷不是问题本身，它们只是"没有测量"这件事在你终于回头去看时呈现出的样子。</p>
<p>更难看的地方在于，做这项核查所需要的材料一直都在，而且就在我每天打开的那些文件旁边。每次运行都归档了 <code>dedupted_news.csv</code> 与 <code>scores.csv</code>，里面是完整的打分池，不只是通过筛选的那些。关于一个过滤器，最重要的问题是它扔掉了什么，而这个问题的答案连续三周每天写进磁盘，就在我所核查的那个文件的上一级目录里。</p>
<p>这里有一个我没料到会成为主要收获的设计教训。我是刻意为可检查性做的架构：用 GitHub 做版本化存储，正是为了让每次运行都可审计，没有隐藏状态，任何内容都能追回到一个文件。而我审计的是错误的那一列。<strong>把证据存下来，和知道该向证据提什么问题，是两件事，我只完成了前一件。</strong>一份审计记录，只有在有人清楚什么才算错误答案的时候，才对得起它占的那点硬盘。</p>
</div>

<div data-lang="en">
<p>Three smaller limits, stated so they are not mistaken for things the system handles:</p>
<ul>
<li><strong>Personalization means one person.</strong> The interest weights were hand-set for my own holdings. The system has never been pointed at anyone else's portfolio, so "personalized" is a description of the architecture, not a tested property.</li>
<li><strong>Materiality has no stability check.</strong> The same article scored on two different days could come back differently and nothing in the pipeline would notice, let alone flag it.</li>
<li><strong>"Runs daily" is what my documentation says.</strong> The archive says twelve days across three weeks with two gaps, one of which I found while writing this page.</li>
</ul>
<p>What would settle the main question is not complicated and is roughly a day of work. Take one day's full scored pool, before filtering. Label by hand which items actually mattered. Check where the ranking put them, and specifically check what fell below the cutoff. Then rerun the same day with different weights and see whether the output moves at all. If it does not move, the weights are decoration. I have not done it.</p>
<p>One last thing, which is the reason this page is worth keeping rather than quietly retiring. The next agent system I built started from the opposite end, with the evaluation harness before the pipeline, and most of its effort went into machinery for proving when its own output cannot be trusted. That was not foresight. <strong>That was this project's bill arriving.</strong></p>
</div>

<div data-lang="zh"><p>还有三个小一些的限制，写清楚是为了避免它们被当成"这个系统能处理的事"：</p>
<ul>
<li><strong>所谓个性化，样本只有一个人。</strong>兴趣权重是我照着自己的持仓手动设的。这套系统从未面向别人的组合运行过，所以"个性化"描述的是架构，不是一项被验证过的性质。</li>
<li><strong>语义打分没有稳定性检验。</strong>同一篇文章在不同日期得到不同分值，流水线不会察觉，更不会告警。</li>
<li><strong>"每日运行"是我文档里的说法。</strong>归档数据的说法是三周内12天，中间断过两次，其中一次是写这一页的时候才发现的。</li>
</ul>
<p>要把最核心的那个问题定下来并不复杂，大约一天的工作量：取某一日筛选之前的完整打分池，人工标注哪些确实重要，看排序把它们放在了什么位置，重点看落在阈值以下的是什么。然后换一组权重把同一天重跑，看输出会不会动。如果不动，那些权重就是装饰。这件事我还没做。</p>
<p>最后一点，也是这一页值得留下而不是悄悄下架的理由。我之后做的那个 agent 系统是从另一端开始的：先有评估工具，再有流水线，力气大半花在构建一种机制上，用来证明它自己什么时候不该被相信。<strong>那不是远见。那是这一次的账单到了期。</strong></p>
</div>
</div>
