---
title: "INVESTelligence: AI-Powered Financial News Agent"
title_zh: "INVESTelligence：AI 财经新闻 Agent"
track: ai
featured: true
weight: 2
kicker_en: "Individual Project · 2025 · n8n"
kicker_zh: "个人项目 · 2025 · n8n"
summary: "The first agent system I built end to end on my own. It ran daily for three weeks and I monitored it every day. Nine months later I went back to the archive and found that the scoring function had silently degraded partway through, and that nothing I had been monitoring could have told me."
summary_zh: "第一个完全由我独立完成的 agent 系统。它连续运行三周，我每天核查其运行状态，却从未核查过排序结果本身。九个月后回溯归档数据，发现评分函数在中途已经静默退化。"
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

<div data-lang="zh">
<p>我当时刚开始投资，关注三个标的：比特币、稀土、特斯拉。这三者每天都不缺新闻。缺的不是新闻，新闻过多本身就是问题。</p>
<p>信息流按时效与热度排序，而这两者都不等同于"对我持有的少数仓位重要"。十家媒体报道同一条马斯克消息，那是一个事件，不是十个。一份改变公司成本结构的法院判决，在信息流中并不会显得比一篇 Model Y 试驾更重要。我需要的不是更完整的覆盖，而是一个可以据此跳过某些内容的理由。</p>
<p>这也是我第一个从架构设计到部署完全独立完成的系统，没有可以移交难点的对象。这一点对本页后续的内容至关重要，只是其重要性并非我当初设想的那种。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">The call I made</span><span data-lang="zh">我做的判断</span></h2>

<div data-lang="en">
<p>The obvious build is to hand each article to a model and ask it how important this is, one to a hundred. I did not want that. At the time I could only put the reason roughly: the model would hand back a number, the number would look considered, and I would have no way to argue with it.</p>
<p>So I split the judgement in two, along the line between what is genuinely a matter of reading and what is genuinely a matter of counting.</p>
</div>

<div data-lang="zh">
<p>最直接的做法是将每篇文章交给模型，让它给出一个1到100的重要性评分。我当时不愿意这样做，理由说得并不清晰，大意是：模型会返回一个数值，这个数值看上去经过了考量，而我没有任何依据可以与之争辩。</p>
<p>因此我将判断拆分为两层，划分依据是：这件事究竟需要"读懂"才能判定，还是"计数"即可判定。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">The split</span><span data-lang="zh">这条分界线</span></p>
  <p><span data-lang="en"><strong>Reading goes to the model.</strong> Event severity, market proximity, forward impact, each scored 0 to 4. Deciding whether an export restriction outranks a quarterly delivery number requires actually understanding the article.</span><span data-lang="zh"><strong>需要读懂的交给模型。</strong>事件严重度、市场贴近度、前瞻影响，各按0到4分评定。判断一条出口管制是否比一份季度交付数据更重要，必须真正读懂文章才能完成。</span></p>
  <p><span data-lang="en"><strong>Counting goes to Python.</strong> Source credibility, topic weight, search relevance, how many outlets picked the story up. Whether Reuters is more reliable than a content farm is a fact. It should not be re-litigated by a language model every morning at eight.</span><span data-lang="zh"><strong>可以计数的交给代码。</strong>来源可信度、主题权重、搜索相关性、同一事件的跨源跟进数量。路透社比内容农场可信是既定事实，不应当每天早上八点由一个语言模型重新裁决一次。</span></p>
</div>

<div data-lang="en">
<p>The two combine as <code>final = materiality × 0.6 + quality × 0.4</code>. Materiality carries more weight because a beautifully sourced article about nothing is still about nothing.</p>
<p>Three smaller calls followed from wanting the thing to stay inspectable. Retrieval goes through Tavily rather than a general search API, because general search returns whatever is winning at SEO that week. Storage is GitHub rather than a database, so every run leaves a versioned, diffable copy of exactly what it saw and exactly what it scored. And the cadence is daily rather than real time, because I was not trading on this, I was reading it with coffee.</p>
<p>One thing I should say plainly here, because the rest of the page depends on it. Every constant in that scoring design (the 0.6 and 0.4, the 40/25/20/15 inside the quality layer, the cutoff at 50) is a number I picked by hand in a single afternoon. They are stated in my documentation as though they were findings. They were guesses.</p>
</div>

<div data-lang="zh">
<p>两层合成为一个总分：<code>final = materiality × 0.6 + quality × 0.4</code>。语义层权重更高，因为一篇引用规范、来源权威却言之无物的文章，依然言之无物。</p>
<p>另外三个决定都服务于同一个目标，即保持系统可检查。检索使用 Tavily 而非通用搜索 API，因为后者返回的是当周 SEO 胜出的内容。存储采用 GitHub 而非数据库，使每次运行都留下带版本、可逐行比对的记录，当日检索到什么、每条打了多少分，全部有据可查。运行频率为每日一次而非实时，因为我并不据此交易，只是每天早上阅读。</p>
<p>有一点必须在此明确说明，因为本页后续内容全部建立在它之上：上述评分体系中的每一个常数，包括0.6与0.4的分配、质量层内部的40/25/20/15、以及50分的阈值，均由我在一个下午凭经验设定，未经任何验证。它们在我自己的文档中被表述为设计结论，实际上只是估计值。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How it works</span><span data-lang="zh">怎么做的</span></h2>

<div data-lang="en">
<p>A scheduled trigger fires at eight in the morning. Keywords come out of a Google Sheet, so changing what I follow does not mean editing the workflow. Each keyword goes through semantic expansion before retrieval, so that a query for Tesla can also reach upstream supply chain and regulatory news that never uses the word. Tavily returns articles, Python cleans and deduplicates them, the model scores materiality, Python scores quality, the two combine and rank. Survivors are written to a dated folder on GitHub as CSV and JSON. From there one branch renders an email newsletter through Gmail and the other is read directly by a Streamlit dashboard.</p>
<p>Execution, storage and presentation never touch each other. n8n only orchestrates, GitHub only stores, Streamlit only reads. The dashboard has no database and no hidden state, which means anything it shows me, I can go and find as a file.</p>
</div>

<div data-lang="zh">
<p>每日八点定时触发。关键词存放于 Google Sheet，因此调整关注对象无需改动工作流本身。每个关键词在检索前先经过一次语义扩展，使得检索"特斯拉"也能覆盖那些完全不出现该词的上游供应链与监管消息。Tavily 返回文章，Python 完成清洗与去重，模型给出语义分，Python 给出质量分，两层合成后排序。通过筛选的条目写入 GitHub 上以日期命名的文件夹，存为 CSV 与 JSON。此后分为两路：一路经 Gmail 渲染为邮件简报，另一路由 Streamlit 看板直接读取。</p>
<p>执行、存储、展示三层相互隔离。n8n 仅负责编排，GitHub 仅负责存储，Streamlit 仅负责读取。看板不含数据库，也不存在隐藏状态，这意味着它呈现的任何内容，都可以回溯到一个具体的文件。</p>
</div>

<figure>
  <img src="/assets/img/investelligence_1.png" alt="The full n8n workflow, from schedule trigger through retrieval, scoring and dual delivery">
  <figcaption><span data-lang="en">The whole workflow in n8n. The visual sprawl is the point: every branch is something I can open and inspect.</span><span data-lang="zh">n8n 里的完整工作流。它铺开这么大是有意义的，每一个分支都是我可以点开检查的东西。</span></figcaption>
</figure>

<div data-lang="en">
<p>The three components that produce a ranking are each good at something the other two are bad at, and each has a blind spot that the design does not cover.</p>
</div>
<div data-lang="zh">
<p>产生排序的三个部件，各自擅长另外两者不擅长的部分，也各自留有一个本设计未能覆盖的盲区。</p>
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

<div data-lang="zh">
<p>三周之内我每天都在核查。这一点需要先说清楚，因为这里真正值得讲的失败并不是疏于监控。</p>
<p>每天早晨我会确认定时器是否在八点触发、是否有节点报错、CSV 是否落入当日日期的文件夹、邮件是否送达、看板能否正常渲染。我会读那封简报，内容看起来合理。所有检查项全部通过，归档数据也与之一致：11月30日至12月20日共12个运行日，其中10日产出简报。</p>
<p>但这些检查项指向的全部是同一个问题，即系统是否仍在运行，没有任何一项面向排序结果本身。换一种表述：<strong>即便那些分数由随机数生成，我当时执行的每一项检查依然会全部通过。</strong></p>
<p>每日核查这个节奏使问题更严重，而非更轻。连续三周每天确认一次，会建立起真实的信心，而我的信心稳定且毫无依据。一个每两周才看一眼的人，或许反而会因为心里没底而去翻一次原始数据。我从未产生过这种不安，因为我所监控的那个对象始终正常。</p>
<p>另有两处遗漏，性质相同。16日与17日存在两天断档，当时我并未察觉；我自己的 README 在三个章节里把运行时间与成本写成了三个不同的版本。单独看都不重要，但它们共同说明：我阅读这些文件是为了获得安心，而不是为了获取信息。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">Evidence</span><span data-lang="zh">结果和证据</span></h2>

<div data-lang="en">
<p>The operating numbers are real and unremarkable. A run finishes in under fifteen minutes and costs under thirty cents. Twelve run-days are archived, ten newsletters were delivered. On 20 December the system retrieved, deduplicated and scored 50 articles across the three themes: 17 for bitcoin, 15 for rare earth, 18 for Tesla.</p>
<p>I measured the runtime and cost by watching my own runs, not with any instrumentation. My own README states them three different ways in three different sections, which is a small thing that tells you how carefully I was holding the numbers.</p>
<p>The rest of this section is what happened when I finally went back and checked the ranking, which was while writing this page, roughly nine months after the system stopped running.</p>
</div>

<div data-lang="zh">
<p>运行层面的数字真实且平常。单次运行在15分钟内完成，成本低于0.3美元。归档中共有12个运行日，发出简报10封。12月20日，系统在三个主题下检索、去重并打分了50篇文章：比特币17篇，稀土15篇，特斯拉18篇。</p>
<p>时间与成本是我在运行过程中目测估计的，没有任何埋点。这两个数字在我自己的 README 中被写成了三个不同的版本，事情本身很小，但足以说明我当时对这些数字的态度。</p>
<p>本节其余内容，是我最终回头核查排序结果后的发现。该核查发生在撰写本页期间，距系统停止运行约九个月。</p>
</div>

<figure>
  <img src="/assets/img/investelligence_2.png" alt="The Market Radar dashboard for 20 December 2025, showing the daily pulse and the impact against sentiment scatter">
  <figcaption><span data-lang="en">20 December 2025. Note the horizontal axis on the scatter: it starts at 20.</span><span data-lang="zh">2025年12月20日。注意散点图的横轴，它是从20开始的。</span></figcaption>
</figure>

<div data-lang="en">
<p><strong>The headline number is decorative.</strong> The dashboard prints "Market Sentiment +0.18" with the word "Bullish" under it. Across all 50 articles that day, the sentiment distribution contains zero strong-negative and zero strong-positive readings. Everything sat neutral or weak. Averaging three unrelated themes into one figure and labelling it with a market verdict gives it a confidence the underlying spread does not have. Sentiment also does not enter the ranking at all. It is shown, not used.</p>
<p><strong>The threshold is not applied.</strong> The design leans on discarding anything below a final score of 50. The 20 December file that feeds the dashboard contains items scoring 20.8, 26.4, 30.8 and 33.48. You can see this in the screenshot above without opening any data: the axis begins at 20, because the points do.</p>
<p><strong>Semantic expansion drifted, and the score did not object.</strong> Under the keyword bitcoin that day, the system returned and scored an article titled "Medicine approval times in Europe to be cut by almost 15%". It scored 65.8. Two genuine bitcoin stories in the same file, one on American Bitcoin's treasury and one on Bitdeer's mining output, both scored 50.8. European medical device regulation and agricultural biocontrol authorization also came in under bitcoin. Under Tesla, the system scored a Fox News category listing page, url ending <code>?page=46</code>, at 60.8. It is not an article.</p>
</div>

<div data-lang="zh">
<p><strong>最显眼的那个数字是装饰性的。</strong>看板显示"Market Sentiment +0.18"，其下标注"Bullish"。而当日全部50篇文章的情绪分布中，强负面为0篇，强正面同样为0篇，全部落在中性或弱倾向区间。将三个互不相关的主题平均为一个数值，再为其配上市场判断词，等于赋予了它底层分布并不具备的确定性。此外，情绪分完全不参与排序，它被展示，但未被使用。</p>
<p><strong>阈值未生效。</strong>整套设计的前提之一是舍弃总分50以下的内容。而12月20日供给看板的文件中，存在20.8分、26.4分、30.8分、33.48分的条目。这一点无需打开数据即可看出：上方截图中横轴自20起始，因为数据点就落在那里。</p>
<p><strong>语义扩展发生漂移，而评分未提出异议。</strong>当日在"bitcoin"关键词下，系统检索并打分了一篇标题为"欧洲药品审批时间将缩短近15%"的文章，得分65.8。同一文件中两条真正的比特币消息，一条关于 American Bitcoin 的持仓，一条关于 Bitdeer 的挖矿产出，得分均为50.8。欧洲医疗器械法规与农业生物防治审批同样被归入 bitcoin 之下。在"tesla"关键词下，系统给一个福克斯新闻的栏目索引页打出60.8分，其网址以 <code>?page=46</code> 结尾。那并不是一篇文章。</p>
</div>

<div data-lang="en">
<p>Then I recomputed the scores, and found the thing I would not have believed if someone had told me.</p>
<p>For all 50 rows on 20 December, the final score is exactly:</p>
<p><code>final = 60 × materiality + 16 × credibility + 12.8</code></p>
<p>It fits every single row, to the last decimal place.</p>
</div>

<div data-lang="zh">
<p>随后我将分数重算了一遍，得到了一个如果由他人转述、我不会采信的结果。</p>
<p>12月20日全部50行，最终得分精确等于：</p>
<p><code>final = 60 × materiality + 16 × credibility + 12.8</code></p>
<p>50行全部吻合，小数位无一偏差。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Where 12.8 comes from</span><span data-lang="zh">12.8 是从哪里来的</span></p>
  <p><span data-lang="en">The quality layer reads its four inputs with <code>dict.get(key, default)</code>, and the defaults are written into the code: <code>weight</code> falls back to 0.8, <code>expansion_importance</code> to 1.0, <code>tavily_score</code> to 0.6. Put those three defaults through the weighting and they come to <code>0.4 × (0.25 × 0.8 × 1.0 + 0.20 × 0.6 + 0.15 × 0) × 100</code>, which is <strong>12.8</strong>, to the decimal.</span><span data-lang="zh">质量层用 <code>dict.get(key, default)</code> 读取它的四个输入，而默认值是写在代码里的：<code>weight</code> 兜底 0.8，<code>expansion_importance</code> 兜底 1.0，<code>tavily_score</code> 兜底 0.6。将这三个默认值代入权重公式，得到 <code>0.4 × (0.25 × 0.8 × 1.0 + 0.20 × 0.6 + 0.15 × 0) × 100</code>，结果正是 <strong>12.8</strong>，小数位完全吻合。</span></p>
  <p><span data-lang="en">Recomputing all 50 rows from the real field values matches 2 of them. Recomputing from the hardcoded fallbacks matches <strong>50 of 50</strong>. Three of the four quality components were not weak that day. They were absent, and the code quietly substituted constants.</span><span data-lang="zh">用真实字段值重算全部50行，只有2行对得上；用代码里的兜底默认值重算，<strong>50行全中</strong>。那天四个质量分量中有三个并不是权重偏低，而是根本没有取到值，代码用常数悄悄替代了它们。</span></p>
</div>

<div data-lang="en">
<p>The inputs were not missing from the pipeline. <code>dedupted_news.csv</code> for that day carries <code>weight</code>, <code>expansion_importance</code> and <code>tavily_score</code>, all populated, all varying across rows. They were lost in transit. The materiality node rebuilds each item from an explicit whitelist of fields, and those three are not on it, so anything scored after that node sees an object where they simply do not exist.</p>
<p>Which means the failure is an ordering change, and the archive dates it. On 9 December, <code>dedupted_news.csv</code> has a <code>qual_score</code> column: quality was computed while the item still carried its inputs, and the final scores reconstruct exactly from it, 22 rows out of 22. On 20 December that column is gone. Same code, same fields, quality scoring now happening downstream of the whitelist.</p>
</div>

<div data-lang="zh">
<p>这些输入并没有从流水线里消失。当天的 <code>dedupted_news.csv</code> 中，<code>weight</code>、<code>expansion_importance</code>、<code>tavily_score</code> 三个字段均有值，且在各行之间存在差异。它们是在传递过程中丢失的：语义打分节点会依据一份固定的字段白名单重建每一个对象，而这三个字段不在白名单内，因此在该节点之后进行的任何打分，看到的都是一个不含这些字段的对象。</p>
<p>也就是说，这是一次节点顺序的改变，而归档数据可以为它定年。12月9日的 <code>dedupted_news.csv</code> 含有 <code>qual_score</code> 列，说明质量评分发生在对象仍携带其输入字段的阶段，当日最终得分可由该列精确重构，22行全部吻合。12月20日该列已不存在，代码与字段均未改变，质量评分被移到了白名单之后。</p>
</div>

<div data-lang="en">
<p>The part that actually matters is not the bug. It is this: <strong>both runs succeeded.</strong> Both fired on schedule, both wrote well-formed CSVs into correctly dated folders, both sent a newsletter that read fine over coffee, both rendered a dashboard with plausible numbers on it. Nothing raised an exception, because nothing went wrong in the sense a program can detect. A key was absent and a default was available, which is not an error. It is the language behaving as specified.</p>
<p>So the degradation is invisible by construction. There is no state in which my monitoring returns a different answer for a scoring function with four working components than for one with two.</p>
</div>

<div data-lang="zh">
<p>真正要紧的不是这个缺陷本身，而是：<strong>这两天的运行都是成功的。</strong>均按时触发，均将格式正确的 CSV 写入日期正确的文件夹，均发出了读起来毫无问题的简报，均渲染出了数值看似合理的看板。没有任何一处抛出异常，因为按照程序可以识别的标准，这里并没有出错：某个键不存在，而默认值可用，这不构成错误，这是语言按规范行事。</p>
<p>因此这种退化在设计上就是不可见的。不存在任何一种状态，能让我当时的监控对"四个分量都在工作的评分函数"和"只剩两个的评分函数"给出不同的回答。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What it still can't do</span><span data-lang="zh">哪里没做到</span></h2>

<div data-lang="en">
<p>The honest headline is not that the ranking has bugs in it. It is that <strong>no measurement of the ranking exists.</strong> There is no set of articles labelled "this one mattered" anywhere in this project, so there is no statement I can make about ranking quality that would survive being asked how I know. The bugs above are not the limitation. They are what the absence of a measurement looks like when you finally go and look.</p>
<p>What makes that worse rather than better is that the material for the check was sitting there the entire time, in files I was opening daily. Every run archived <code>dedupted_news.csv</code> and <code>scores.csv</code>, which hold the full scored pool, not just the items that survived filtering. The single most important question about a filter is what it threw away, and the answer was written to disk every morning for three weeks, one directory above the file I was checking.</p>
<p>There is a design lesson in that which I did not expect to be the takeaway. I deliberately built for inspection: GitHub as a versioned store precisely so that every run would be auditable, no hidden state, nothing that could not be traced back to a file. And then I audited the wrong column. <strong>Storing the evidence, and knowing which question to ask of it, are two different projects, and I had only finished the first one.</strong> An audit trail is only worth its disk if somebody knows what would count as a wrong answer.</p>
</div>

<div data-lang="zh">
<p>诚实的表述不是"排序中存在缺陷"，而是<strong>本项目从未建立过任何针对排序质量的测量</strong>。不存在任何一份标注了"该条目确实重要"的文章集合，因此关于排序质量的优劣，我说不出任何一句经得起追问依据的判断。上述缺陷并非问题本身，它们只是"缺乏测量"这一事实在回溯时呈现出的形态。</p>
<p>使问题更严重的是：完成这项检查所需的材料一直都在，而且就在我每天打开的那些文件里。每次运行都归档了 <code>dedupted_news.csv</code> 与 <code>scores.csv</code>，其中保存的是完整的打分池，而非仅有通过筛选的条目。关于一个过滤器，最重要的问题是它舍弃了什么，而该问题的答案连续三周每天写入磁盘，就在我所核查的那个文件的上一级目录中。</p>
<p>这里有一个我未曾预料会成为主要收获的设计教训。我是刻意为可检查性设计的架构：采用 GitHub 做版本化存储，正是为了让每次运行都可审计，不存在隐藏状态，任何内容都可追溯到具体文件。而我审计的是错误的对象。<strong>"保存证据"与"知道该向证据提出什么问题"是两个不同的课题，我只完成了前者。</strong>一份审计记录唯有在有人清楚什么才算错误答案时，才对得起它占用的存储。</p>
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

<div data-lang="zh">
<p>还有三个小一些的限制，写清楚是为了避免被当成"这个系统能处理的事"：</p>
<ul>
<li><strong>所谓个性化，样本只有一人。</strong>兴趣权重由我依据自己的持仓手动设定。系统从未面向他人的组合运行过，因此"个性化"描述的是架构设计，而非一项经过验证的性质。</li>
<li><strong>语义打分缺乏稳定性检验。</strong>同一篇文章在不同日期得到不同分值，流水线不会察觉，更不会告警。</li>
<li><strong>"每日运行"是我文档中的表述。</strong>归档数据显示为三周内12天，中间存在两次断档，其中一次是在撰写本页时才发现的。</li>
</ul>
<p>要确定这个核心问题，方法并不复杂，工作量约为一天：取某一日筛选之前的完整打分池，人工标注其中哪些确实重要，考察排序将它们置于何处，重点检视落在阈值以下的条目。随后以不同权重重跑同一日，观察输出是否变化。若不变化，则这些权重只是装饰。这项工作我尚未完成。</p>
<p>最后一点，也是本页值得保留而非悄然下架的原因。我随后构建的下一个 agent 系统是从相反的一端开始的：先建立评估工具，再实现流水线，大部分投入用于构建能够证明其自身何时不可信的机制。那并非出于远见，<strong>那是本项目的账单到期。</strong></p>
</div>
</div>
