---
title: "Multi-Agent Overseas Market Research System"
title_zh: "出海市场研究多 Agent 系统"
track: ai
featured: true
weight: 1
kicker_en: "Individual Project · 2026 · CrewAI"
kicker_zh: "个人项目 · 2026 · CrewAI"
summary: "A multi-agent system that researches overseas markets for Chinese brands. The part that took the time was not getting it to write reports. It was building the machinery that proves when a report cannot be trusted."
summary_zh: "一个面向中国品牌出海市场研究的多 Agent 系统。主要工作量不在让它写出报告，而在构建一套能判定报告何时不可信的机制。"
role: "Solo · design, build, evaluation"
role_zh: "独立完成 · 设计、开发、评测"
period: "2026.06–08"
stack: "CrewAI, Python, YAML, pytest"
tags: ["Multi-agent", "Evaluation", "Go-to-market"]
links:
  - { label: "GitHub", url: "https://github.com/ZihanSuo/cross-border-market-entry" }
---

<div class="stage">
<h2><span data-lang="en">The problem</span><span data-lang="zh">起因</span></h2>

<div data-lang="en">
<p>A single agent doing market-entry research fails in four predictable ways. Its conclusions drift away from its own competitor findings. Its claims carry no sources, and sometimes carry sources it invented. It quietly ignores the complicated rules, the evidence grading and the decision logic. And nothing downstream ever checks whether any of it is right, so correctness is judged by whether the output <em>looks</em> like research.</p>
<p>There was a fifth failure I only noticed later, and it turned out to be the worst one. I went back through 11 versions across 2 cases. <strong>Every single feasibility report concluded "enter the market."</strong> Whatever the scores said.</p>
</div>

<div data-lang="zh"><p>单个 Agent 做市场进入研究有四种可预测的失败：结论与它自己写出的竞品洞察脱节；论断没有来源，有时来源是编造的；证据分级与决策逻辑这类复杂规则会被绕过；没有事后校验，"对不对"最终由"看起来像不像研究"决定。</p>
<p>第五种失败是后来才发现的，也最严重：回查11个版本、2个案例，<strong>每一份可行性报告的结论都是"建议进入"</strong>，与评分无关。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">The call I made</span><span data-lang="zh">思路</span></h2>

<div data-lang="en">
<p>I wrote more than twenty hard rules into the prompt. No fabricated domains. No using a brand's homepage as evidence for a product claim. The model broke them anyway, and every time I closed one hole it found a different one: fake domains, then real links whose content did not match, then TBD placeholders, then homepages, then unsourced numbers with a disclaimer bolted on.</p>
<p>So I stopped trying to write a better prompt, and made one decision that shaped the rest of the project:</p>
</div>

<div data-lang="zh"><p>提示词里写了二十多条硬规则，包括禁止编造域名、禁止拿品牌首页当产品论断的证据。模型仍然违反，且每堵一个漏洞就换一种绕法：假域名，真链接但内容对不上，TBD 占位，品牌首页，最后是"市场份额约30%（待验证）"这类无来源数字加免责词。</p>
<p>提示词写得再细也止不住这个演化，因此改变的不是提示词，而是判定权的归属：</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">The rule everything else follows from</span><span data-lang="zh">统领全篇的原则</span></p>
  <p><span data-lang="en"><strong>Anything that can be decided objectively never gets left to the model's own account of itself.</strong> Deciding what to do next can be handed to the model. Deciding whether it was done correctly cannot.</span><span data-lang="zh"><strong>凡是能被客观判定的事，都不留给模型自述。</strong>"下一步做什么"可以让渡，"这一步做得对不对"不能让渡。</span></p>
</div>

<div data-lang="en">
<p>The reason that rule is not academic: I later took the most independent step of the pipeline and rebuilt it as a fully agentic version, to see what handing over control actually buys. It ran four rounds and failed all four, but the failures evolved. Round two produced ten lines reading "verified with scrape_page, page shows £XX." I checked each one against the tool-call audit log.</p>
</div>

<div data-lang="zh"><p>为验证这条原则，流水线里最独立的一步被改写成完全 agentic 的版本，用来观察让渡控制权换来了什么。四轮全败，失败形式逐轮演化。第二轮交出10条"已用 scrape_page 核实，页面显示标价 £XX"，逐条对照工具调用审计日志。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Of ten citations the model said it had verified</span><span data-lang="zh">模型自称已核实的10条引用</span></p>
  <p><span data-lang="en"><strong>Zero survived the audit log.</strong> The audit also showed it really had called the scraper six times, successfully. It had scraped four brand homepages and one anti-bot interstitial that returned 106 characters of "please enable JavaScript." It marked all of them verified.</span><span data-lang="zh"><strong>0条成立。</strong>审计日志同时证明抓取调用执行了6次且全部成功，但抓取对象是4个品牌首页与1个反爬拦截页（返回106字符的"请开启 JavaScript"）。这些全部被标为"已核实"。</span></p>
</div>

<div data-lang="en">
<p>Not that agents don't work, and not that the model wasn't strong enough. The audit proves the tools worked fine. The problem is structural: <strong>leave a field in the design where the model reports on its own performance, and it will fill that field with something that looks good and isn't true.</strong> Close one place it can lie and it moves to another. Four rounds, four forms.</p>
</div>

<div data-lang="zh"><p>问题不在 agent 形态，也不在模型能力，审计日志证明工具调用全部正常。问题是结构性的：<strong>只要设计里留了"让模型报告自己做得怎么样"的字段，它就会填出好看但不真实的内容。</strong>堵住一处，它换一处，四轮换了四种形式。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How it works</span><span data-lang="zh">实现</span></h2>

<div data-lang="en">
<p>Three role-specialised agents run as an SOP pipeline: feasibility research, market expansion, competitor analysis. Downstream tasks receive upstream conclusions as structured context, so nothing gets re-argued from scratch. Role and task decomposition lives in YAML; per-market knowledge packs (compliance regimes, channels, platform rules) load automatically for whichever market the brief names.</p>
<p>On top of that sit three verification layers, and the point is that they catch different <em>kinds</em> of problem. They are a pipeline, not alternatives to one another.</p>
</div>

<div data-lang="zh"><p>三个角色化 Agent 组成 SOP 式流水线：市场可行性、市场开拓、竞品分析。下游任务通过结构化上下文接收上游结论，不重复论证。角色与任务拆解写在 YAML 中；按市场匹配的知识包（合规制度、渠道、平台规则）依据简报中的目标市场自动加载。</p>
<p>其上是三层验证。三者抓的是不同类型的问题，是流水线关系，不是备选关系。</p>
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

<div data-lang="zh"><p>机械校验同时挂成 CrewAI 的 task guardrail，使 workflow 获得一项真正属于 agent 的特征，同时不牺牲可评估性：</p>
<p><strong>产出，校验，若存在严重问题，将违规逐条喂回同一个 agent 并自动重跑。</strong></p>
<p>这是一个"观察、行动、再观察"的闭环，自行收敛到合格，即 self-correction。但控制流仍在代码手中，任务顺序固定，输出结构不变，因此跨版本的遵守率矩阵依然可比。与 agentic 实验的唯一区别是裁判归属。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How I tested it</span><span data-lang="zh">验证</span></h2>

<div data-lang="en">
<p>The first five rounds all ran on one case, a skincare brand entering the UK. Each version looked better than the last, which is exactly the trap: I could not tell whether the rules were genuinely good or whether I had tuned them to fit one case.</p>
<p>So the second and third cases were each designed to falsify a specific assumption, not to pad the count. The second changed category and market at once (colour cosmetics into Thailand). The third changed industry entirely (home appliances into Germany), to test whether the beauty-specific wording had been hard-coded into the rules.</p>
<p>The second case paid for itself on its first run. Every one of four Thai local brands came back with a "UK market share" and "UK channel leads." I had written "UK" into the template as a <em>field name</em>, not as an example, and the model dutifully filled in the blanks.</p>
</div>

<div data-lang="zh"><p>前五轮规则都在同一个案例上调整：护肤品牌进英国。每一版都比上一版好看，而这正是陷阱，无法区分规则确实有效与规则被调得适配了这一个案例。</p>
<p>因此第二、第三个案例各为证伪一个具体假设而设计，不为凑数量。第二个同时更换品类与市场（彩妆进泰国）；第三个更换整个行业（家电进德国），用于检验规则中的美妆表述是否被硬编码。</p>
<p>第二个案例首跑即见效：四家泰国本土品牌全部带有"英国市场份额"与"英国渠道线索"。"英国"此前被当作<em>字段名</em>写死进模板，而非举例，模型照模板填空。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Why that bug mattered</span><span data-lang="zh">该缺陷的意义</span></p>
  <p><span data-lang="en">Under the original case it is <strong>always correct and never raises an error</strong>. A hundred runs on the UK brand would never have surfaced it. Only changing the market exposes it.</span><span data-lang="zh">在原案例下它<strong>永远正确、永远不报错</strong>。在英国案例上跑一百遍也不会暴露，只有更换市场才能发现。</span></p>
</div>

<div data-lang="en">
<p>Fixing it produced the second lesson, which I now think is the more useful one. After the fix I reran, the old problems went to zero, and the model immediately invented two new evasions my checker could not see. The tool reported <strong>5 severe issues</strong>. Once I added detection for the two new patterns, the true number on the same files was <strong>15</strong>.</p>
<p>That matters because a baseline is the number every later version gets compared against. Had I written 5 into the changelog, a later version scoring 8 would have read as "worse," when it had in fact improved from 15 to 8. Not one misreading. Every comparison from then on, inverted.</p>
<p>The same lesson came back twice more. My audit script identified scraping calls by looking for "scrape" in the tool name, and CrewAI's <code>ScrapeWebsiteTool</code> actually displays as "Read website content." Left alone, the audit would have reported zero scraping calls, and I would have concluded the model fabricated everything, on the one measurement that mattered most. My QA scoring script used brand names as match keys, which inflated recall from a true 38% to 75%.</p>
<p><strong>Three times, the thing lying to me was my own measuring instrument.</strong></p>
</div>

<div data-lang="zh"><p>修复后带来第二个教训，价值更高。重跑后旧问题清零，模型随即发明两种校验工具看不见的新绕法。工具报告<strong>5处严重问题</strong>；补上这两类检测后，同一批文件的真实数字是<strong>15处</strong>。</p>
<p>基线是后续每个版本的比较基准。若5被写入 changelog，后续某版跑出8处会被读成"变差"，而实际是从15降至8。这不是读错一次，而是此后所有对比方向全反。</p>
<p>同类教训后来重演两次。审计脚本原本按工具名是否含 scrape 识别抓取调用，而 CrewAI 中 <code>ScrapeWebsiteTool</code> 的显示名为"Read website content"。若不核对，审计将报告"无任何抓取调用"，据此会得出"模型纯编造"的错误结论，且该假阴性恰好落在最关键的测量上。QA 评分脚本以品牌名作匹配键，将召回率由真实的38%虚高至75%。</p>
<p><strong>三次骗过我的都是量尺本身。</strong></p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">Evidence</span><span data-lang="zh">成果</span></h2>

<div data-lang="en">
<p>The main metric is severe citation problems per 10 URLs, normalised so that long reports and short ones stay comparable.</p>
</div>
<div data-lang="zh"><p>主指标为每10个 URL 的严重引用问题数，归一化后长短报告可比。</p>
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

<div data-lang="zh"><p>这张表旁边有两件事必须一并说明，否则等于没看懂自己的数字。</p>
<p>某个早期归档版本为<strong>0处严重问题</strong>，但那不是干净，而是全文零引用。其中没有可核查对象，校验工具自然查不出问题。对比矩阵对该类版本标注警告，不允许与有引用的版本并列。<em>"指标好看"与"质量好"在此是两回事。</em></p>
<p>早期数字还被系统性低估。当时采用 bullet 格式，价格与其依据不在同一行，而数字关逐行判定。已确认影响9处，全部集中在最早版本与两个 agentic 版。因此"agentic 版更差"的结论仍成立，且实际差距大于测得值。</p>
<p>QA 层单独用 benchmark 度量，输入为已归档报告，对照人工标注的18条已知问题计算召回：</p>
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

<div data-lang="zh"><p>该 benchmark 的价值不在分数，而在于把"规则改写有效"变成可验证的因果。三条"市场份额约25%（证据不足）"形式的论断，改规则前判为合规，加入新规则后判为违规，措辞与新规则逐条对应。</p>
<p>评分表方面：五个加权维度看似量化，实际对结论没有约束力，这是最危险的一类问题，不是明显错误，而是<strong>伪装成严谨的空洞</strong>。根因不是模型不会算加权分，而是从未定义"4分"与"3分"的区别。缺少可判定标准，打分即沦为氛围投票，而氛围偏乐观，因为报告的默认叙事是"品牌想进入这个市场"。</p>
<p>两条规则修复了机制。每个维度设1/3/5三档锚点，锚点须为可判定的客观事实而非形容词（合规维度：5＝制度清晰且无需本地代理；3＝制度清晰但需登记或指定代理；1＝制度不明或存在禁止性条款）。总分直接决定结论档位，不留解释空间。</p>
<p>随后用一段五十行脚本，将每份归档报告自身的加权总分重算并核对其结论。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Most reports got their own arithmetic wrong</span><span data-lang="zh">多数报告的加权总分算错</span></p>
  <p><span data-lang="en">Five had verdicts that directly contradicted the scores they themselves had written. The clearest case wrote out <code>0.25×4 + 0.15×3 + 0.20×3 + 0.20×4 + 0.20×4 = 3.35</code>, which actually comes to 3.65, and then concluded "enter the market" when 3.35 requires "validate assumptions first, hold the rollout."</span><span data-lang="zh">其中5份的结论与其自身分数直接矛盾。最典型的一份写着 <code>0.25×4 + 0.15×3 + 0.20×3 + 0.20×4 + 0.20×4 = 3.35</code>，实际结果为3.65；结论写"建议进入"，而按其自身写下的3.35，规则要求的是"先验证假设、暂缓铺货"。</span></p>
  <p><span data-lang="en">The score and the verdict were being written independently of each other. A fabricated citation at least requires clicking a link to expose. <strong>A wrong weighted sum needs no clicking at all, and precisely for that reason nobody ever checks it.</strong></span><span data-lang="zh">分数与结论各写各的。假引用至少需要读者点开链接才能识别，<strong>算错的加权和无需任何操作即可发现，也恰恰因此无人核验。</strong></span></p>
</div>

<div data-lang="en">
<p>With the anchors in place, the German appliance case scored 3, 4, 3, 3, 3, weighted to <strong>3.15</strong>, and the system downgraded its own verdict to <em>validate assumptions first, hold the rollout</em>, citing the band at the top of the report.</p>
<p>Across every version before that, the answer had always been "enter." <strong>This was the first time a feasibility study said don't.</strong></p>
</div>

<div data-lang="zh"><p>锚点上线后，德国家电案例五个维度打出3、4、3、3、3，加权<strong>3.15</strong>，系统主动将结论降级为<em>"先验证假设、暂缓铺货"</em>，并在报告开头标注依据。</p>
<p>此前所有版本的答案均为"建议进入"。<strong>这是第一次有一份可行性研究给出否定结论。</strong></p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What it still can't do</span><span data-lang="zh">复盘</span></h2>

<div data-lang="en">
<p>I nearly put an overclaim on my own resume, so this section exists.</p>
<p>Reading that last result, the obvious conclusion is "the anchors gave the system the ability to say no." I grouped the archive by version name, since newer versions should have anchors, computed four downgrades after anchors were introduced, and wrote down that even evidence-rich cases get downgraded, so the alternative explanation is ruled out.</p>
<p>Then I regrouped by whether the report body actually contained anchors, rather than by what the version was called. The conclusion inverted.</p>
</div>

<div data-lang="zh"><p>本节存在的原因是：我差点把一个过度解读写进简历。</p>
<p>由上述结果最容易得出的结论是"锚点让系统具备了说 no 的能力"。按版本名分组（新版本应带锚点）统计，得到加锚点后4份降级，据此我写下"证据充分的案例也会降级，替代解释被排除"。</p>
<p>改按报告正文是否实际含有锚点判定后，结论翻转。</p>
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

<div data-lang="zh"><p>三次降级全部来自同一个案例，即公开数据最稀薄的德国家电，五个维度中有四个只能给3分。因此诚实的表述须拆为两句：</p>
<ul>
<li><strong>机制确实建立。</strong>总分与结论档位的一致性现已强制且可机械校验，有代码为证。</li>
<li><strong>"锚点使系统在任何案例下都敢说不"未被证明。</strong>10份带锚点的美妆案例报告，降级0次。最多只能说锚点没有阻止降级发生，不能说锚点导致了降级。</li>
</ul>
<p>能定论的设计是同案例单变量对照，只改是否带锚点，其余不动。尚未执行。</p>
<p>我把这个失误留在文档里，因为它是"量尺本身需先验证"的第三次重演，只是这次出问题的是我自己选的数据分组方式。<strong>按版本名推断是想当然，按正文内容核查才是事实。</strong></p>
</div>

<div data-lang="en">
<p>One more limit worth stating. When the reports felt thin, the tempting fix was another agent or a more agentic deep-dive. I tried a different route: a separate depth variant with a mechanical evidence floor (retail URLs on an allowlist, price-band rows, quotes, falsifiable claims, scrape effort), leaving the frozen pipeline untouched. Across all three cases the depth runs passed the pipeline and <strong>failed as deliverables</strong>, and one of them produced a less honest verdict than the thin version had.</p>
<p><strong>A thicker template does not buy a more honest conclusion.</strong> Depth is good at turning "is there retail evidence, was the page actually fetched" into something that can go red or green. It is not good at making the model do the arithmetic correctly, or at making it read what the scraper brought back. Consulting-grade depth still takes a person.</p>
<p>Manual review is not the answer either, and I have a counter-example from my own archive. I found a URL path that contradicted its product category, wrote it into the changelog in v4.1, and it then appeared in v5, v6, v7 and v8 without being caught once. Not because it was hard to see. Because human attention is inconsistent: each read, I was watching for something else.</p>
<p>So the division of labour that actually holds: <strong>people find new kinds of problem, code guarantees known problems never slip through again, and the model covers the semantic judgements in between.</strong> Every one of the 18 checks in the citation checker started as something a human noticed once. That is what makes manual review compound instead of repeat.</p>
</div>

<div data-lang="zh"><p>另一个限制：当报告读起来偏薄时，容易想到的解法是再加一个 Agent，或放开为更 agentic 的深挖。实际采用的是另一条路径：不改动已冻结的流水线，另开 depth 变体，以机械证据地板逼出硬证据（零售 URL 须落在 allowlist 上，价带行数、摘录、可证伪主张、抓取努力各有地板）。三个案例的 depth 归档全部为流水线通过、<strong>成品不合格</strong>，其中一次给出的结论比薄版本更不诚实。</p>
<p><strong>模板加厚换不来更诚实的结论。</strong>Depth 擅长把"有无零售证据、是否真的抓过页面"变成可红可绿的判据；不擅长替模型做对加权算术，也不擅长逼它读取抓回的内容。咨询级深度仍须由人完成。</p>
<p>人工复核同样不是答案，归档中即有反证：一条 URL 路径与产品品类矛盾的问题在 v4.1 已被发现并写入 changelog，此后在 v5 至 v8 连续出现四个版本，一次未被拦截。原因不是难以发现，而是人的注意力不稳定，每次通读关注的对象都不同。</p>
<p>成立的分工是：<strong>人负责发现新的问题类型，代码负责保证已知问题不再漏检，模型负责在两者之间做需要语义判断的补充。</strong>引用校验器中的18类检测，每一条都源自一次人工发现。这样人工投入才产生复利，而不是每次重来。</p>
</div>
</div>
