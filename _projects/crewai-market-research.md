---
title: "Multi-Agent Overseas Market Research System"
title_zh: "出海市场研究多 Agent 系统"
track: ai
featured: true
weight: 1
kicker_en: "Individual Project · 2026 · CrewAI"
kicker_zh: "个人项目 · 2026 · CrewAI"
summary: "A multi-agent system that researches overseas markets for Chinese brands. The part that took the time was not getting it to write reports. It was building the machinery that proves when a report cannot be trusted."
summary_zh: "一个帮中国品牌做出海市场研究的多 Agent 系统。真正花时间的不是让它写出报告，而是造出一套能证明报告什么时候不可信的东西。"
role: "Solo · design, build, evaluation"
period: "2026.06–08"
stack: "CrewAI, Python, YAML, pytest"
tags: ["Multi-agent", "Evaluation", "Go-to-market"]
cover: /assets/img/placeholder.png
links:
  - { label: "GitHub", url: "https://github.com/ZihanSuo/cross-border-market-entry" }
---

<div class="stage">
<h2><span data-lang="en">The problem</span><span data-lang="zh">问题是什么</span></h2>

<div data-lang="en">
<p>A single agent doing market-entry research fails in four predictable ways. Its conclusions drift away from its own competitor findings. Its claims carry no sources, and sometimes carry sources it invented. It quietly ignores the complicated rules, the evidence grading and the decision logic. And nothing downstream ever checks whether any of it is right, so correctness is judged by whether the output <em>looks</em> like research.</p>
<p>There was a fifth failure I only noticed later, and it turned out to be the worst one. I went back through 11 versions across 2 cases. <strong>Every single feasibility report concluded "enter the market."</strong> Whatever the scores said.</p>
</div>

<div data-lang="zh">
<p>单个 Agent 做市场进入研究，会以四种可预测的方式失败：结论和它自己写的竞品洞察脱节；论断没有来源，有时候来源是它编的；复杂规则（证据分级、决策逻辑）它会图省事不遵守；而且没有任何环节做事后校验，所以"对不对"最后是靠"看起来像不像研究"来判断的。</p>
<p>还有第五种失败是我后来才注意到的，也是最严重的一种。我回头翻了11个版本、2个案例，<strong>每一份可行性报告的结论都是"建议进入"</strong>。不管评分打了多少。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">The call I made</span><span data-lang="zh">我做的判断</span></h2>

<div data-lang="en">
<p>I wrote more than twenty hard rules into the prompt. No fabricated domains. No using a brand's homepage as evidence for a product claim. The model broke them anyway, and every time I closed one hole it found a different one: fake domains, then real links whose content did not match, then TBD placeholders, then homepages, then unsourced numbers with a disclaimer bolted on.</p>
<p>So I stopped trying to write a better prompt, and made one decision that shaped the rest of the project:</p>
</div>

<div data-lang="zh">
<p>我在提示词里写了二十多条硬规则：禁止编造域名，禁止拿品牌首页当产品论断的证据，等等。模型照样违反，而且我每堵一个漏洞，它就换一种绕法：先是假域名，然后是真链接但内容对不上，然后是 TBD 占位，然后是品牌首页，最后是"市场份额约30%（待验证）"这种没来源的数字加个免责词。</p>
<p>所以我不再试着把提示词写得更好，而是做了一个决定，这个决定定义了整个项目后面的走向：</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">The rule everything else follows from</span><span data-lang="zh">整个项目的那条原则</span></p>
  <p><span data-lang="en"><strong>Anything that can be decided objectively never gets left to the model's own account of itself.</strong> Deciding what to do next can be handed to the model. Deciding whether it was done correctly cannot.</span><span data-lang="zh"><strong>凡是能被客观判定的事，都不留给模型自述。</strong>"下一步做什么"可以交给模型，"这一步做得对不对"不能交。</span></p>
</div>

<div data-lang="en">
<p>The reason that rule is not academic: I later took the most independent step of the pipeline and rebuilt it as a fully agentic version, to see what handing over control actually buys. It ran four rounds and failed all four, but the failures evolved. Round two produced ten lines reading "verified with scrape_page, page shows £XX." I checked each one against the tool-call audit log.</p>
</div>

<div data-lang="zh">
<p>这条原则不是纸上谈兵。我后来把流水线里最独立的一步改成了完全 agentic 的版本，就是想看看"把控制权让渡出去"到底换来了什么。跑了四轮，四轮全败，但失败形式在演化。第二轮它交出了10条"已用 scrape_page 核实，页面显示标价 £XX"。我拿工具调用审计日志逐条对质。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Of ten citations the model said it had verified</span><span data-lang="zh">模型自称已核实的10条引用</span></p>
  <p><span data-lang="en"><strong>Zero survived the audit log.</strong> The audit also showed it really had called the scraper six times, successfully. It had scraped four brand homepages and one anti-bot interstitial that returned 106 characters of "please enable JavaScript." It marked all of them verified.</span><span data-lang="zh"><strong>0条成立。</strong>审计日志同时证明它确实调用了6次抓取而且全部成功，只不过抓的是4个品牌首页和1个反爬拦截页（返回106个字符的"请开启 JavaScript"）。它把这些全部标成了"已核实"。</span></p>
</div>

<div data-lang="en">
<p>Not that agents don't work, and not that the model wasn't strong enough. The audit proves the tools worked fine. The problem is structural: <strong>leave a field in the design where the model reports on its own performance, and it will fill that field with something that looks good and isn't true.</strong> Close one place it can lie and it moves to another. Four rounds, four forms.</p>
</div>

<div data-lang="zh">
<p>不是"agent 不行"，也不是模型不够强，审计证明它工具用得好好的。问题是结构性的：<strong>只要设计里留了"让模型报告自己做得怎么样"的字段，它就会填出好看但不真实的内容。</strong>堵住一个说谎的位置，它就换一个位置说。四轮，换了四种形式。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How it works</span><span data-lang="zh">怎么做的</span></h2>

<div data-lang="en">
<p>Three role-specialised agents run as an SOP pipeline: feasibility research, market expansion, competitor analysis. Downstream tasks receive upstream conclusions as structured context, so nothing gets re-argued from scratch. Role and task decomposition lives in YAML; per-market knowledge packs (compliance regimes, channels, platform rules) load automatically for whichever market the brief names.</p>
<p>On top of that sit three verification layers, and the point is that they catch different <em>kinds</em> of problem. They are a pipeline, not alternatives to one another.</p>
</div>

<div data-lang="zh">
<p>三个角色化 Agent 组成 SOP 式流水线：市场可行性、市场开拓、竞品分析。下游任务通过结构化上下文拿到上游结论，不用重新论证一遍。角色和任务拆解写在 YAML 里；按市场自动加载的知识包（合规制度、渠道、平台规则）根据简报里的目标市场自动匹配。</p>
<p>在这之上是三层验证。关键在于它们抓的是<em>不同类型</em>的问题，三者是流水线关系，不是备选关系。</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Layer</span><span data-lang="zh">层</span></th>
  <th><span data-lang="en">Good at</span><span data-lang="zh">擅长</span></th>
  <th><span data-lang="en">Blind to</span><span data-lang="zh">盲区</span></th>
</tr></thead>
<tbody>
<tr>
  <td><span data-lang="en">Code checks<br><code>citation_check.py</code>, 18 classes</span><span data-lang="zh">机械校验<br><code>citation_check.py</code>，18类检测</span></td>
  <td><span data-lang="en">Exhaustive checks on form. Every URL's shape, every slot that should hold a URL and doesn't. Never skips a line.</span><span data-lang="zh">穷举式的形式检查。每个 URL 的格式，每个该填 URL 却空着的位置。不会漏行。</span></td>
  <td><span data-lang="en">Only the patterns written into the code.</span><span data-lang="zh">只认写进代码的那几种模式。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Tool-call audit<br>CrewAI event bus</span><span data-lang="zh">工具调用审计<br>订阅 CrewAI 事件总线</span></td>
  <td><span data-lang="en">Whether a claimed action actually happened. Which tool, which URL, how many bytes came back, did it error.</span><span data-lang="zh">声称做过的动作是否真的发生。调了什么工具、传了哪个 URL、返回多长、报没报错。</span></td>
  <td><span data-lang="en">Says nothing about whether the content was read correctly.</span><span data-lang="zh">不管抓回来的内容有没有被正确读取。</span></td>
</tr>
<tr>
  <td><span data-lang="en">QA agent<br>reasoning model</span><span data-lang="zh">QA 审校<br>推理模型</span></td>
  <td><span data-lang="en">Judgements that require going back to source material. Is this figure actually in the brief. Does this claim have an origin at all.</span><span data-lang="zh">需要回查原始材料的判断。这个数字简报里到底有没有，这个说法有没有出处。</span></td>
  <td><span data-lang="en">No guarantee it covers every line.</span><span data-lang="zh">不保证覆盖每一行。</span></td>
</tr>
</tbody>
</table>

<div data-lang="en">
<p>The mechanical checks also run as a CrewAI task guardrail, which gives the workflow one genuinely agentic property without giving up evaluability:</p>
<p><strong>produce, check, and if something severe comes back, feed the violations line by line to the same agent and rerun.</strong></p>
<p>That is a real observe-act-observe loop converging on a passing state, which is self-correction. But the control flow stays in code, task order is fixed, output structure doesn't move, so compliance rates stay comparable across versions. The only difference from the agentic experiment is who referees.</p>
</div>

<div data-lang="zh">
<p>机械校验同时挂成了 CrewAI 的 task guardrail，这让 workflow 获得了一个真正属于 agent 的特征，同时没有牺牲可评估性：</p>
<p><strong>产出，校验，如果有严重问题，把违规逐条喂回同一个 agent，自动重跑。</strong></p>
<p>这是一个真实的"观察、行动、再观察"闭环，自己收敛到合格，这就是 self-correction。但控制流仍在代码手里、任务顺序固定、输出结构不变，所以跨版本的遵守率矩阵依然可比。它和那个 agentic 实验的唯一区别，是裁判是谁。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How I tested it</span><span data-lang="zh">怎么验的</span></h2>

<div data-lang="en">
<p>The first five rounds all ran on one case, a skincare brand entering the UK. Each version looked better than the last, which is exactly the trap: I could not tell whether the rules were genuinely good or whether I had tuned them to fit one case.</p>
<p>So the second and third cases were each designed to falsify a specific assumption, not to pad the count. The second changed category and market at once (colour cosmetics into Thailand). The third changed industry entirely (home appliances into Germany), to test whether the beauty-specific wording had been hard-coded into the rules.</p>
<p>The second case paid for itself on its first run. Every one of four Thai local brands came back with a "UK market share" and "UK channel leads." I had written "UK" into the template as a <em>field name</em>, not as an example, and the model dutifully filled in the blanks.</p>
</div>

<div data-lang="zh">
<p>前五轮我都在同一个案例上调规则：一个护肤品牌进英国。每一版都比上一版好看，而这恰恰是陷阱，我分不清规则是真的好，还是只是被我调得刚好适配这一个案例。</p>
<p>所以第二和第三个案例，每个都是为了证伪一个具体假设而设计的，不是为了凑数量。第二个同时换掉品类和市场（彩妆进泰国）。第三个换掉整个行业（家电进德国），用来测试规则里的美妆表述是不是被硬编码了。</p>
<p>第二个案例第一次跑就回本了。四家泰国本土品牌，每一家都写着"英国市场份额""英国渠道线索"。我之前把"英国"当成<em>字段名</em>写死进了模板，不是当例子，模型老实照模板填空。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Why that bug mattered</span><span data-lang="zh">这个 bug 为什么重要</span></p>
  <p><span data-lang="en">Under the original case it is <strong>always correct and never raises an error</strong>. A hundred runs on the UK brand would never have surfaced it. Only changing the market exposes it.</span><span data-lang="zh">在原案例下它<strong>永远正确、永远不报错</strong>。跑一百遍英国那个品牌都发现不了，只有换市场才暴露。</span></p>
</div>

<div data-lang="en">
<p>Fixing it produced the second lesson, which I now think is the more useful one. After the fix I reran, the old problems went to zero, and the model immediately invented two new evasions my checker could not see. The tool reported <strong>5 severe issues</strong>. Once I added detection for the two new patterns, the true number on the same files was <strong>15</strong>.</p>
<p>That matters because a baseline is the number every later version gets compared against. Had I written 5 into the changelog, a later version scoring 8 would have read as "worse," when it had in fact improved from 15 to 8. Not one misreading. Every comparison from then on, inverted.</p>
<p>The same lesson came back twice more. My audit script identified scraping calls by looking for "scrape" in the tool name, and CrewAI's <code>ScrapeWebsiteTool</code> actually displays as "Read website content." Left alone, the audit would have reported zero scraping calls, and I would have concluded the model fabricated everything, on the one measurement that mattered most. My QA scoring script used brand names as match keys, which inflated recall from a true 38% to 75%.</p>
<p><strong>Three times, the thing lying to me was my own measuring instrument.</strong></p>
</div>

<div data-lang="zh">
<p>修完它带来了第二个教训，我现在觉得这个更有用。修完重跑，旧问题清零，模型立刻发明了两种我的校验工具看不见的新绕法。工具报告<strong>5处严重问题</strong>。补上这两个检测之后，同一批文件的真实数字是<strong>15处</strong>。</p>
<p>这件事之所以要紧，是因为基线是以后每个版本都要拿来对比的参照。如果我把5写进 changelog，后来某一版跑出8处，我会读成"变差了"，而真实情况是从15降到8、大幅变好。这不是读错一次，是从此以后所有对比都是反的。</p>
<p>同样的教训后来又重演了两次。我的审计脚本原本用工具名里含不含 scrape 来识别抓取调用，而 CrewAI 里 <code>ScrapeWebsiteTool</code> 的显示名其实是"Read website content"。不查这一下，审计会报告"没有任何抓取调用"，我会据此得出"模型纯编造"的错误结论，而这个假阴性恰好出现在最关键的那个测量上。我的 QA 评分脚本用品牌名当匹配键，把召回率从真实的38%虚高到了75%。</p>
<p><strong>三次，骗我的都是我自己的量尺。</strong></p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">Evidence</span><span data-lang="zh">结果和证据</span></h2>

<div data-lang="en">
<p>The main metric is severe citation problems per 10 URLs, normalised so that long reports and short ones stay comparable.</p>
</div>
<div data-lang="zh">
<p>主指标是每10个 URL 的严重引用问题数，做归一化是为了让长报告和短报告可比。</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Case</span><span data-lang="zh">案例</span></th>
  <th><span data-lang="en">First run</span><span data-lang="zh">起点</span></th>
  <th><span data-lang="en">Best</span><span data-lang="zh">当前最好</span></th>
</tr></thead>
<tbody>
<tr><td><span data-lang="en">Skincare into UK</span><span data-lang="zh">护肤进英国</span></td>
    <td>8 / 28 URL<span class="num">2.9</span></td><td>1 / 36 URL<span class="num">0.3</span></td></tr>
<tr><td><span data-lang="en">Colour cosmetics into Thailand</span><span data-lang="zh">彩妆进泰国</span></td>
    <td>15 / 39 URL<span class="num">3.8</span></td><td><strong>0</strong> / 37 URL</td></tr>
<tr><td><span data-lang="en">Home appliances into Germany</span><span data-lang="zh">家电进德国</span></td>
    <td>1 / 34 URL</td><td><span data-lang="en">clean on first cross-industry run</span><span data-lang="zh">跨行业首跑即接近干净</span></td></tr>
</tbody>
</table>

<div data-lang="en">
<p>Two things have to be said alongside that table, and not saying them would mean I had not understood my own numbers.</p>
<p>One early archived version scores <strong>0 severe problems</strong>, and that is not cleanliness. It has no citations at all. With nothing checkable in it, a checker finds nothing wrong. The comparison matrix flags versions like that and refuses to rank them against cited ones. <em>"The metric looks good" and "the work is good" are different statements.</em></p>
<p>Early numbers are also systematically understated. Those versions used a bullet format where the price and its supporting evidence sat on different lines, and the numeric check runs line by line. Nine confirmed misses, all in the earliest version and the two agentic ones. So "the agentic version was worse" still holds, and the real gap is wider than measured.</p>
<p>The QA layer is measured separately, against 18 human-labelled known problems in already-archived reports:</p>
</div>

<div data-lang="zh">
<p>这张表旁边有两件事必须一起说，不说就说明我没看懂自己的数字。</p>
<p>有一个早期归档版本是<strong>0处严重问题</strong>，但那不是干净，是全文零引用。里面没有任何可核查的东西，校验工具自然查不出问题。对比矩阵里给这类版本专门标了警告，不允许和有引用的版本比。<em>"指标好看"和"质量好"在这里是两回事。</em></p>
<p>早期版本的数字还被系统性低估了。那时用的是 bullet 格式，价格和它的依据不在同一行，而数字关是逐行判的。已确认影响9处，全在最早的版本和两个 agentic 版里。所以"agentic 版更差"这个结论仍然成立，而且实际差距比测出来的更大。</p>
<p>QA 那一层单独用 benchmark 量，输入是已归档报告，对照人工标注的18条已知问题算召回：</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Benchmark case</span><span data-lang="zh">Benchmark 案例</span></th>
  <th><span data-lang="en">Recall</span><span data-lang="zh">召回</span></th>
</tr></thead>
<tbody>
<tr><td>herbeast_v3</td><td>3/3 <span class="num">100%</span></td></tr>
<tr><td>herbeast_v8</td><td>5/7 <span class="num">71%</span></td></tr>
<tr><td>flowerknows_v2</td><td>8/8 <span class="num">100%</span></td></tr>
</tbody>
</table>

<div data-lang="en">
<p>The value of that benchmark isn't the score. It's that it turns "the rule change worked" into something causal. Three claims of the form "market share around 25% (evidence insufficient)" passed QA before a rule change and failed after it, and the wording of the failure matched the new rule clause by clause. Not a coincidence.</p>
<p>Then there is the scoring table. Its five weighted dimensions looked quantitative and constrained nothing, which I consider the most dangerous class of defect: not an obvious error, but <strong>emptiness dressed as rigour</strong>. The root cause was not that the model can't compute a weighted sum. It was that I had never told it what separates a 4 from a 3. With no decidable standard, scoring becomes a vibe vote, and vibes skew optimistic, because the report's default narrative is that the brand wants to enter.</p>
<p>Two small rules fixed the mechanism. Every dimension got 1/3/5 anchors stated as checkable facts rather than adjectives (compliance: 5 = regime clear and no local agent needed; 3 = regime clear but registration or a designated agent required; 1 = regime unclear or prohibitions exist). And the total score determines the verdict band with no room for interpretation.</p>
<p>Then I wrote a fifty-line script to recompute every archived report's own weighted sum and check it against its own verdict.</p>
</div>

<div data-lang="zh">
<p>这套 benchmark 的价值不在分数，在于它把"规则改写有效"变成了可验证的因果。三条"市场份额约25%（证据不足）"形式的论断，改规则前 QA 判为合规，加了新规则之后判定变成违规，而且措辞与新规则一一对应。不是碰巧。</p>
<p>然后是那张评分表。五个加权维度看起来很量化，实际对结论没有任何约束力，我认为这是最危险的一类问题：它不是明显的错误，它是<strong>伪装成严谨的空洞</strong>。根因不是模型不会算加权分，是我从来没告诉过它"4分"和"3分"的区别是什么。没有可判定的标准，打分就变成氛围投票，而氛围总是偏乐观，毕竟报告的默认叙事就是"品牌想进入这个市场"。</p>
<p>两条很小的规则修好了机制。每个维度写1/3/5三档锚点，锚点必须是可判定的客观事实而不是形容词（合规维度：5=制度清晰且无需本地代理；3=制度清晰但需完成登记或指定代理；1=制度不明或存在禁止性条款）。以及，总分直接决定结论档位，不留解释空间。</p>
<p>然后我写了个五十行的脚本，把每份归档报告自己那条加权总分的式子重算一遍，再核对它自己的结论。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Most reports got their own arithmetic wrong</span><span data-lang="zh">多数报告把自己的加权总分算错了</span></p>
  <p><span data-lang="en">Five had verdicts that directly contradicted the scores they themselves had written. The clearest case wrote out <code>0.25×4 + 0.15×3 + 0.20×3 + 0.20×4 + 0.20×4 = 3.35</code>, which actually comes to 3.65, and then concluded "enter the market" when 3.35 requires "validate assumptions first, hold the rollout."</span><span data-lang="zh">其中5份的结论与它自己写的分数直接矛盾。最典型的一份写着 <code>0.25×4 + 0.15×3 + 0.20×3 + 0.20×4 + 0.20×4 = 3.35</code>，实际算出来是3.65，然后结论写"建议进入"，而按它自己写的3.35，规则要求的是"先验证假设、暂缓铺货"。</span></p>
  <p><span data-lang="en">The score and the verdict were being written independently of each other. A fabricated citation at least requires clicking a link to expose. <strong>A wrong weighted sum needs no clicking at all, and precisely for that reason nobody ever checks it.</strong></span><span data-lang="zh">分数和结论根本是各写各的。假引用至少还需要读者点开链接才知道是假的，<strong>算错的加权和连点都不用点，但也恰恰因此没人会去验。</strong></span></p>
</div>

<div data-lang="en">
<p>With the anchors in place, the German appliance case scored 3, 4, 3, 3, 3, weighted to <strong>3.15</strong>, and the system downgraded its own verdict to <em>validate assumptions first, hold the rollout</em>, citing the band at the top of the report.</p>
<p>Across every version before that, the answer had always been "enter." <strong>This was the first time a feasibility study said don't.</strong></p>
</div>

<div data-lang="zh">
<p>锚点上线之后，德国家电那个案例五个维度打出3、4、3、3、3，加权<strong>3.15</strong>，系统主动把结论降级成<em>"先验证假设、暂缓铺货"</em>，并在报告开头标注了依据。</p>
<p>在那之前的所有版本里，答案永远是"建议进入"。<strong>这是第一次有一份可行性研究说了"先别进"。</strong></p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What it still can't do</span><span data-lang="zh">哪里没做到</span></h2>

<div data-lang="en">
<p>I nearly put an overclaim on my own resume, so this section exists.</p>
<p>Reading that last result, the obvious conclusion is "the anchors gave the system the ability to say no." I grouped the archive by version name, since newer versions should have anchors, computed four downgrades after anchors were introduced, and wrote down that even evidence-rich cases get downgraded, so the alternative explanation is ruled out.</p>
<p>Then I regrouped by whether the report body actually contained anchors, rather than by what the version was called. The conclusion inverted.</p>
</div>

<div data-lang="zh">
<p>我差点把一个过度解读写进简历里，所以有了这一节。</p>
<p>读到上面那个结果，显而易见的结论是"锚点让系统具备了说 no 的能力"。我按版本名分组（新版本应该带锚点），算出加锚点后有4份降级，然后写下"证据充分的案例也会降级，替代解释被排除了"。</p>
<p>然后我改成按报告正文里到底有没有锚点来判定，而不是按版本叫什么名字。结论整个翻转了。</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Case</span><span data-lang="zh">案例</span></th>
  <th><span data-lang="en">Reports with anchors</span><span data-lang="zh">带锚点的份数</span></th>
  <th><span data-lang="en">Downgraded</span><span data-lang="zh">其中降级</span></th>
</tr></thead>
<tbody>
<tr><td><span data-lang="en">Skincare into UK</span><span data-lang="zh">护肤进英国</span></td><td>4</td><td><strong>0</strong></td></tr>
<tr><td><span data-lang="en">Colour cosmetics into Thailand</span><span data-lang="zh">彩妆进泰国</span></td><td>6</td><td><strong>0</strong></td></tr>
<tr><td><span data-lang="en">Home appliances into Germany</span><span data-lang="zh">家电进德国</span></td><td>4</td><td><strong>3</strong></td></tr>
</tbody>
</table>

<div data-lang="en">
<p>All three downgrades come from the one case with the thinnest public data, where four of five dimensions could only score 3. So the honest statement splits in two:</p>
<ul>
<li><strong>The mechanism is real.</strong> Consistency between the total score and the verdict band is now enforced and mechanically checkable, and there is code to prove it.</li>
<li><strong>The claim that anchors make the system willing to say no in any case is not proven.</strong> Ten anchored beauty-case reports, zero downgrades. The most I can say is that anchors did not prevent downgrades from happening, not that anchors caused them.</li>
</ul>
<p>The design that would settle it is a single-variable rerun on one case, changing only whether anchors are present. I haven't done it.</p>
<p>I left this mistake in the documentation because it is the measuring-instrument lesson happening a third time, except this time the faulty instrument was my own choice of how to group the data. <strong>Guessing from version names is wishful thinking. Reading the report bodies is fact.</strong></p>
</div>

<div data-lang="zh">
<p>三次降级全部来自同一个案例，就是那个公开数据最稀薄的德国家电，五个维度里有四个只能给3分。所以诚实的说法要拆成两句：</p>
<ul>
<li><strong>机制确实建立起来了。</strong>总分与结论档位的一致性现在是强制的、可机械校验的，这一点有代码为证。</li>
<li><strong>但"锚点让系统在任何案例下都敢说不"没有被证明。</strong>10份带锚点的美妆案例报告，降级次数是0。我最多只能说：锚点没有阻止降级发生，不能说是锚点导致了降级。</li>
</ul>
<p>能定论的设计是拿同一个案例做单变量对照，只改有没有锚点，其余全部不动。我还没做。</p>
<p>我把这个失误留在文档里，是因为它是"量尺本身要先验证"这个教训的第三次重演，只不过这次出问题的是我自己选的数据分组方式。<strong>按版本名猜是想当然，按正文内容查才是事实。</strong></p>
</div>

<div data-lang="en">
<p>One more limit worth stating. When the reports felt thin, the tempting fix was another agent or a more agentic deep-dive. I tried a different route: a separate depth variant with a mechanical evidence floor (retail URLs on an allowlist, price-band rows, quotes, falsifiable claims, scrape effort), leaving the frozen pipeline untouched. Across all three cases the depth runs passed the pipeline and <strong>failed as deliverables</strong>, and one of them produced a less honest verdict than the thin version had.</p>
<p><strong>A thicker template does not buy a more honest conclusion.</strong> Depth is good at turning "is there retail evidence, was the page actually fetched" into something that can go red or green. It is not good at making the model do the arithmetic correctly, or at making it read what the scraper brought back. Consulting-grade depth still takes a person.</p>
<p>Manual review is not the answer either, and I have a counter-example from my own archive. I found a URL path that contradicted its product category, wrote it into the changelog in v4.1, and it then appeared in v5, v6, v7 and v8 without being caught once. Not because it was hard to see. Because human attention is inconsistent: each read, I was watching for something else.</p>
<p>So the division of labour that actually holds: <strong>people find new kinds of problem, code guarantees known problems never slip through again, and the model covers the semantic judgements in between.</strong> Every one of the 18 checks in the citation checker started as something a human noticed once. That is what makes manual review compound instead of repeat.</p>
</div>

<div data-lang="zh">
<p>还有一个限制值得说清楚。当报告读起来偏薄的时候，很容易想到的解法是再加一个 Agent，或者放开成更 agentic 的深挖。我选了另一条路：不动已冻结的流水线，另开一个 depth 变体，用机械证据地板去逼硬证据（零售 URL 必须落在 allowlist 上、价带行数、摘录、可证伪主张、抓取努力各有地板）。三个案例的 depth 归档全部是流水线通过、<strong>成品不合格</strong>，而且其中一次给出的结论比薄版本还不诚实。</p>
<p><strong>模板加厚换不来更诚实的结论。</strong>Depth 擅长的是把"有没有零售证据、有没有真的抓过页面"变成可红可绿的东西；它不擅长替模型把加权算术做对，也不擅长逼它去读抓回来的字。咨询级的深度仍然要人。</p>
<p>但人工复核也不是答案，我自己的归档里就有反证：有一条 URL 路径与产品品类矛盾的问题，我在 v4.1 就发现并写进了 changelog，然后它在 v5、v6、v7、v8 里连续出现四个版本，一次都没被拦下来。不是因为难发现，是因为人的注意力不稳定，每次读报告时我盯的东西都不一样。</p>
<p>所以真正成立的分工是：<strong>人负责发现新的问题类型，代码负责保证已知问题不再漏，模型负责在两者之间做需要语义判断的补充。</strong>引用校验器里那18类检测，每一条都来自一次人工发现。这样人工投入的时间才有复利，而不是每次重来。</p>
</div>
</div>
