---
title: "INVESTelligence: AI-Powered Financial News Agent"
title_zh: "INVESTelligence：AI 财经新闻 Agent"
track: ai
featured: true
weight: 2
kicker_en: "Individual Project · 2025 · n8n"
kicker_zh: "个人项目 · 2025 · n8n"
summary: "The first AI agent I built end to end on my own. It ran for three weeks and I never once checked whether its ranking was right. Going back through the archive to write this page, I found out it wasn't."
summary_zh: "真正意义上第一个我独立完成的 AI agent。它跑了三个星期，而我一次都没验过它排的序对不对。为了写这一页回去翻归档，才发现它不对。"
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
<p>我那时候刚开始投资，盯三个东西：比特币、稀土、特斯拉。这三样每天的新闻都不缺。缺的不是新闻，问题恰恰就是新闻太多。</p>
<p>信息流是按"新"和"热"排的，而这两件事都不等于"对我手上那几个仓位重要"。十家媒体写同一条马斯克的消息，那是一件事，不是十件。一份改变公司成本结构的法院判决，摆在信息流里并不会比一篇 Model Y 试驾看起来更重要。我想要的不是更全的覆盖，是有人告诉我今天哪些可以不看，并且给出理由。</p>
<p>这也是我第一个从头到尾自己独立做完的系统，没有人可以把难的那部分甩过去。这一点对这一页后面要讲的事情很关键，只不过不是我原本以为的那种关键。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">The call I made</span><span data-lang="zh">我做的判断</span></h2>

<div data-lang="en">
<p>The obvious build is to hand each article to a model and ask it how important this is, one to a hundred. I did not want that. At the time I could only put the reason roughly: the model would hand back a number, the number would look considered, and I would have no way to argue with it.</p>
<p>So I split the judgement in two, along the line between what is genuinely a matter of reading and what is genuinely a matter of counting.</p>
</div>

<div data-lang="zh">
<p>最直觉的做法是把每篇文章丢给模型，问它"这条有多重要，一到一百打个分"。我不想这么干。当时说不太清楚为什么，大概意思是：模型会给我一个数，这个数看起来像是经过考虑的，而我没有任何办法跟它争。</p>
<p>所以我把判断拆成两半，分界线是：这件事到底是要"读"才能定，还是"数"就能定。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">The split</span><span data-lang="zh">这条分界线</span></p>
  <p><span data-lang="en"><strong>Reading goes to the model.</strong> Event severity, market proximity, forward impact, each scored 0 to 4. Deciding whether an export restriction outranks a quarterly delivery number requires actually understanding the article.</span><span data-lang="zh"><strong>要读的交给模型。</strong>事件严重度、市场贴近度、前瞻影响，各打0到4分。判断一条出口管制是不是比一份季度交付数据更重要，这件事必须真的读懂文章才能做。</span></p>
  <p><span data-lang="en"><strong>Counting goes to Python.</strong> Source credibility, topic weight, search relevance, how many outlets picked the story up. Whether Reuters is more reliable than a content farm is a fact. It should not be re-litigated by a language model every morning at eight.</span><span data-lang="zh"><strong>能数的交给代码。</strong>来源可信度、主题权重、搜索相关性、多少家媒体跟进了同一条。路透比内容农场可信，这是事实，不该每天早上八点由一个语言模型重新裁决一遍。</span></p>
</div>

<div data-lang="en">
<p>The two combine as <code>final = materiality × 0.6 + quality × 0.4</code>. Materiality carries more weight because a beautifully sourced article about nothing is still about nothing.</p>
<p>Three smaller calls followed from wanting the thing to stay inspectable. Retrieval goes through Tavily rather than a general search API, because general search returns whatever is winning at SEO that week. Storage is GitHub rather than a database, so every run leaves a versioned, diffable copy of exactly what it saw and exactly what it scored. And the cadence is daily rather than real time, because I was not trading on this, I was reading it with coffee.</p>
<p>One thing I should say plainly here, because the rest of the page depends on it. Every constant in that scoring design (the 0.6 and 0.4, the 40/25/20/15 inside the quality layer, the cutoff at 50) is a number I picked by hand in a single afternoon. They are stated in my documentation as though they were findings. They were guesses.</p>
</div>

<div data-lang="zh">
<p>两层合成一个分：<code>final = materiality × 0.6 + quality × 0.4</code>。语义那层权重更高，因为一篇引用规范、来源权威、但什么都没说的文章，它依然什么都没说。</p>
<p>另外三个决定都是为了让这套东西保持"可检查"。检索走 Tavily 而不是通用搜索 API，因为通用搜索返回的是这周 SEO 打赢了的内容。存储用 GitHub 而不是数据库，这样每一次运行都会留下一份带版本、可以逐行 diff 的记录，它当天看到了什么、给每条打了多少分，全部在案。节奏是每天一次而不是实时，因为我不靠它做交易，我是端着咖啡读它。</p>
<p>有一件事必须在这里直说，因为这一页后面全都建立在它上面：上面那套评分里的每一个常数，0.6和0.4、质量层里的40/25/20/15、50分的阈值，全都是我一个下午凭手感定的。它们在我自己的文档里被写得像是结论，其实是猜的。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How it works</span><span data-lang="zh">怎么做的</span></h2>

<div data-lang="en">
<p>A scheduled trigger fires at eight in the morning. Keywords come out of a Google Sheet, so changing what I follow does not mean editing the workflow. Each keyword goes through semantic expansion before retrieval, so that a query for Tesla can also reach upstream supply chain and regulatory news that never uses the word. Tavily returns articles, Python cleans and deduplicates them, the model scores materiality, Python scores quality, the two combine and rank. Survivors are written to a dated folder on GitHub as CSV and JSON. From there one branch renders an email newsletter through Gmail and the other is read directly by a Streamlit dashboard.</p>
<p>Execution, storage and presentation never touch each other. n8n only orchestrates, GitHub only stores, Streamlit only reads. The dashboard has no database and no hidden state, which means anything it shows me, I can go and find as a file.</p>
</div>

<div data-lang="zh">
<p>早上八点定时触发。关键词存在 Google Sheet 里，所以改变我关注什么不需要动工作流本身。每个关键词在检索前先做一次语义扩展，这样搜"特斯拉"也能够到那些根本不出现这三个字的上游供应链和监管消息。Tavily 返回文章，Python 清洗去重，模型打语义分，Python 打质量分，两层合成后排序。留下来的写进 GitHub 上一个以日期命名的文件夹，存成 CSV 和 JSON。从这里分两路，一路经 Gmail 渲染成邮件简报，另一路由 Streamlit 看板直接读取。</p>
<p>执行、存储、展示三层互不接触。n8n 只负责编排，GitHub 只负责存，Streamlit 只负责读。看板没有数据库也没有隐藏状态，意味着它显示给我的任何东西，我都能去翻出对应的那个文件。</p>
</div>

<figure>
  <img src="/assets/img/investelligence_1.png" alt="The full n8n workflow, from schedule trigger through retrieval, scoring and dual delivery">
  <figcaption><span data-lang="en">The whole workflow in n8n. The visual sprawl is the point: every branch is something I can open and inspect.</span><span data-lang="zh">n8n 里的完整工作流。它铺开这么大是有意义的，每一个分支都是我可以点开检查的东西。</span></figcaption>
</figure>

<div data-lang="en">
<p>The three components that produce a ranking are each good at something the other two are bad at, and each has a blind spot that the design does not cover.</p>
</div>
<div data-lang="zh">
<p>产生排序的三个部件，各自擅长另外两个不擅长的事，也各自留了一个这套设计没有覆盖的盲区。</p>
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
<p>I checked that it ran. That is the entire answer, and it is worth being exact about what it covers, because at the time I would have told you I had tested the system.</p>
<p>I checked that the trigger fired at eight, that no node went red, that the CSVs landed in the right dated folder, that the mail arrived, that the dashboard rendered without throwing. All of it passed. The archive backs that up: twelve run-days between 30 November and 20 December, ten of them carrying a newsletter, with a two-day hole on the 16th and 17th that I did not notice while it was happening.</p>
<p>Every one of those checks is about whether the machine is alive. Not one of them looks at the ranking. Put differently: <strong>if the scores had been assigned at random, all of my tests would still have passed.</strong></p>
<p>What I did instead was read the newsletter every morning and find it reasonable. That is not a test. That is the thing tests exist to replace, because I was reading output I had designed, looking for a problem I had no definition of.</p>
</div>

<div data-lang="zh">
<p>我验了它能跑。就这些。而且值得把"这些"到底覆盖了什么说清楚，因为在当时，你问我，我会回答"我测过了"。</p>
<p>我确认过定时器八点会触发、没有节点报红、CSV 落进了当天日期的文件夹、邮件收到了、看板能正常渲染不抛异常。全部通过。归档也支持这个说法：11月30日到12月20日之间有12个运行日，其中10天有简报，16号和17号断了两天，而这件事发生的时候我并没有察觉。</p>
<p>这里面每一项检查，问的都是"这台机器还活着吗"。没有一项在看排序本身。换一种说法：<strong>如果那些分数是随机生成的，我所有的测试依然会全部通过。</strong></p>
<p>我实际做的事情是每天早上读那封简报，觉得挺合理。这不是验证。这恰恰是验证这件事存在的理由所要替代的东西，因为我在读一份自己设计出来的输出，去找一个我根本没有定义过的问题。</p>
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
<p>运行层面的数字是真实的，也很平常。一次运行15分钟以内跑完，成本不到0.3美元。归档里有12个运行日，发出去10封简报。12月20日那天，系统在三个主题下检索、去重并打分了50篇文章：比特币17篇，稀土15篇，特斯拉18篇。</p>
<p>时间和成本是我自己看着它跑估的，没有任何埋点。我自己那份 README 在三个不同的章节里把这两个数写成了三个不同的版本，这件事本身很小，但它说明我当时有多不把这些数字当回事。</p>
<p>这一节剩下的部分，是我终于回头去检查排序之后发现的东西。检查发生在写这一页的时候，距离这套系统停止运行大约九个月。</p>
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
<p><strong>最显眼的那个数字是装饰性的。</strong>看板上写着"Market Sentiment +0.18"，下面标着"Bullish"。而那天全部50篇文章的情绪分布里，强负面0篇，强正面也是0篇，全部落在中性或弱倾向。把三个互不相干的主题平均成一个数，再给它配一个市场判断词，等于赋予了它底层分布根本不具备的确定性。而且情绪分完全不参与排序，它是展示出来的，不是用上的。</p>
<p><strong>阈值没有生效。</strong>整套设计的前提之一是丢掉总分50以下的内容。而12月20日喂给看板的那个文件里，有20.8分、26.4分、30.8分、33.48分的条目。这件事不用打开数据就能看见，上面那张截图里横轴从20开始，因为点就在那儿。</p>
<p><strong>语义扩展漂了，而评分没有提出异议。</strong>那天在"bitcoin"这个关键词下，系统检索并打分了一篇标题为"欧洲药品审批时间将缩短近15%"的文章，得分65.8。同一个文件里两条真正的比特币消息，一条讲 American Bitcoin 的持仓，一条讲 Bitdeer 的挖矿产出，都是50.8。欧洲医疗器械法规和农业生物防治审批也一起挂在了 bitcoin 下面。在"tesla"下面，系统给一个福克斯新闻的栏目索引页打了60.8分，网址结尾是 <code>?page=46</code>。那不是一篇文章。</p>
</div>

<div data-lang="en">
<p>Then I recomputed the scores, and found the thing I would not have believed if someone had told me.</p>
<p>For all 50 rows on 20 December, the final score is exactly:</p>
<p><code>final = 60 × materiality + 16 × credibility + 12.8</code></p>
<p>It fits every single row, to the last decimal place.</p>
</div>

<div data-lang="zh">
<p>然后我把分数重算了一遍，发现了一件如果是别人告诉我、我不会相信的事。</p>
<p>12月20日全部50行，最终得分精确等于：</p>
<p><code>final = 60 × materiality + 16 × credibility + 12.8</code></p>
<p>50行全中，小数点后一位不差。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Why that equation should not exist</span><span data-lang="zh">这个式子为什么不该存在</span></p>
  <p><span data-lang="en">The quality layer has four components. If topic importance, search relevance and cross-source pickup were contributing anything, the final score could not collapse into a clean function of materiality and credibility alone. <code>pickup_count</code> is 0 on every row that day, including a Musk pay ruling that sits in that same file three times, filed separately by the Wall Street Journal, Reuters and TechCrunch. The other two contributed an identical constant to all 50 articles.</span><span data-lang="zh">质量层有四个分量。如果主题重要性、搜索相关性、跨源覆盖这三项当天真的在起作用，最终分不可能坍缩成只由语义分和可信度决定的干净线性式。那天每一行的 <code>pickup_count</code> 都是0，包括那条马斯克薪酬案判决，它在同一个文件里出现了三次，分别来自华尔街日报、路透和 TechCrunch。另外两项给50篇文章贡献了完全相同的常数。</span></p>
  <p><span data-lang="en"><strong>Three of the four quality components did no work at all.</strong> They are 60% of the quality layer, which is 40% of the final score.</span><span data-lang="zh"><strong>四个质量分量里有三个完全没有起作用。</strong>它们占质量层的60%，而质量层占最终得分的40%。</span></p>
</div>

<div data-lang="en">
<p>It had not always been like that. On 9 December, <code>pickup_count</code> is populated, the same equation does not fit, and articles with identical materiality and identical credibility receive different scores, which means the other components were still discriminating. Between the ninth and the twentieth, the scoring function quietly changed shape.</p>
<p>The part that actually matters is not the bug. It is this: <strong>both runs succeeded.</strong> Both fired on schedule, both wrote well-formed CSVs into correctly dated folders, both sent a newsletter that read fine over coffee, both rendered a dashboard with plausible numbers on it. Nothing I was checking could distinguish a scoring function with four working components from one with two.</p>
</div>

<div data-lang="zh">
<p>它并不是一直如此。12月9日那天，<code>pickup_count</code> 是有值的，同一个式子对不上，而且语义分和可信度都相同的文章会拿到不同的总分，说明另外几个分量当时还在起区分作用。在9号到20号之间，这个评分函数悄悄换了形状。</p>
<p>真正要紧的不是这个 bug 本身，而是：<strong>这两天的运行都是成功的。</strong>都准时触发，都把格式正确的 CSV 写进了日期正确的文件夹，都发出了一封配着咖啡读起来毫无问题的简报，都渲染出了一个数字看着挺合理的看板。我当时在检查的所有东西，都无法区分"四个分量都在工作的评分函数"和"只剩两个的评分函数"。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What it still can't do</span><span data-lang="zh">哪里没做到</span></h2>

<div data-lang="en">
<p>The honest headline is not that the ranking has bugs in it. It is that <strong>no measurement of the ranking exists.</strong> There is no set of articles labelled "this one mattered" anywhere in this project, so there is no statement I can make about ranking quality that would survive being asked how I know. The bugs above are not the limitation. They are what the absence of a measurement looks like when you finally go and look.</p>
<p>What makes that worse rather than better is that the material for the check was sitting there the entire time. Every run archived <code>dedupted_news.csv</code> and <code>scores.csv</code>, which hold the full scored pool, not just the items that survived filtering. So the discarded articles were recoverable from day one. The single most important question about a filter is what it threw away, and I had the answer to that question written to disk every morning for three weeks and never opened it.</p>
<p>There is a design lesson in that which I did not expect to be the takeaway. I deliberately built for inspection: GitHub as a versioned store precisely so that every run would be auditable, no hidden state, nothing that could not be traced back to a file. Then I never inspected. <strong>Storing the evidence and checking the evidence are two different projects, and I had only finished the first one.</strong> An audit trail nobody reads is just disk usage.</p>
</div>

<div data-lang="zh">
<p>诚实的说法不是"排序里有 bug"，而是<strong>这个项目里根本不存在对排序质量的任何测量</strong>。没有任何一份标注了"这条真的重要"的文章集合，所以关于排序好不好，我说不出任何一句经得起追问"你怎么知道"的话。上面那些 bug 不是缺陷本身，它们只是"没有测量"这件事在你终于回头去看的时候呈现出来的样子。</p>
<p>让这件事更难看而不是更好看的是：做这个检查所需要的材料，一直都在那儿。每一次运行都归档了 <code>dedupted_news.csv</code> 和 <code>scores.csv</code>，里面是完整的打分池，不只是通过过滤的那些。也就是说被丢掉的文章从第一天起就是可追回的。关于一个过滤器，最重要的问题是"它扔掉了什么"，而这个问题的答案连续三个星期每天早上都被写进磁盘，我一次都没打开过。</p>
<p>这里有一个我没预料到会成为主要收获的设计教训。我是刻意为"可检查"做的架构：用 GitHub 做版本化存储，就是为了让每次运行都可审计，没有隐藏状态，没有任何东西追不回到一个文件。然后我从来没有去检查过。<strong>"把证据存下来"和"去核对证据"是两个不同的项目，我只完成了前一个。</strong>没有人读的审计记录，只是占硬盘。</p>
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
<li><strong>所谓个性化，只有一个人。</strong>兴趣权重是我按自己的持仓手动设的。这套系统从来没有对准过别人的组合，所以"个性化"描述的是架构，不是一个被验证过的性质。</li>
<li><strong>语义打分没有稳定性检查。</strong>同一篇文章在两天里打出不同的分，流水线不会察觉，更不会报警。</li>
<li><strong>"每天运行"是我文档里的说法。</strong>归档里的说法是三个星期里的12天，中间断了两次，其中一次是我写这一页的时候才发现的。</li>
</ul>
<p>要把最核心的那个问题定下来，方法并不复杂，大概一天的工作量：取某一天过滤之前的完整打分池，人工标注哪些是真正重要的，看排序把它们放在了什么位置，重点看掉到阈值以下的是什么。然后用不同的权重把同一天重跑一遍，看输出会不会变。如果不变，那些权重就是装饰。我没有做。</p>
<p>最后一件事，也是这一页值得留着而不是悄悄下架的原因。我后来做的下一个 agent 系统是从相反的一端开始的，先有评估工具再有流水线，大部分力气花在了"造出能证明它自己什么时候不可信的东西"上面。那不是有远见，<strong>那是这个项目的账单到期了。</strong></p>
</div>
</div>
