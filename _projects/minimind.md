---
title: "MiniMind: Training a Language Model From Scratch"
title_zh: "MiniMind：从零训练一个语言模型"
track: ai
featured: true
weight: 3
kicker_en: "Individual Project · 2026 · Pretrain / SFT / LoRA"
kicker_zh: "个人项目 · 2026 · Pretrain / SFT / LoRA"
summary: "A 64M model taken through pretraining, SFT and LoRA on one Kaggle GPU. The goal was never a good model. It was to find out which problems training actually solves, and the answer is narrower than the literature made it sound."
summary_zh: "在单卡 Kaggle 上把一个64M模型完整跑过 Pretrain、SFT、LoRA。目标从来不是得到一个好模型，而是搞清楚训练究竟能解决哪一类问题。答案比文献读起来要窄。"
role: "Solo"
period: "2026.06"
stack: "PyTorch, Kaggle T4, DDP, LoRA"
tags: ["Pretraining", "SFT", "LoRA", "Evaluation"]
---

<div class="stage">
<h2><span data-lang="en">Why I built it</span><span data-lang="zh">起因</span></h2>

<div data-lang="en">
<p>Reading about pretraining, SFT and PEFT leaves a gap: which stage is responsible for which capability. Papers report benchmark deltas, not attribution. Running the full chain once, on a model small enough to finish, is the cheapest way to find out.</p>
<p>The deliverable was therefore never a usable chatbot. It was a set of statements about what each stage does and does not change.</p>
</div>

<div data-lang="zh">
<p>读 Pretrain、SFT、PEFT 的材料会留下一个缺口：哪一个阶段负责哪一类能力。论文报告的是 benchmark 差值，不是归因。把完整链路在一个小到能跑完的模型上走一遍，是弄清这件事最便宜的方式。</p>
<p>因此产出目标从一开始就不是一个可用的对话模型，而是一组关于"每个阶段改变了什么、没改变什么"的判断。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">My approach</span><span data-lang="zh">思路</span></h2>

<div data-lang="en">
<p><strong>Fix the evaluation before running anything.</strong> Eight prompts and a fixed decoding configuration, frozen on day one, covering assistant framing, factual recall, reasoning, translation, formatting and repetition. Loss alone cannot distinguish "sounds more like an assistant" from "is more correct", and those turned out to be exactly the two things that diverge.</p>
<p><strong>Change one variable per stage.</strong> Pretrain at 10k first to prove the loop runs, then scale to 200k. SFT on the self-trained base. LoRA on top. Nothing else moves between comparisons.</p>
<p><strong>Include an upper bound.</strong> The author's released <code>full_sft</code> checkpoint runs the same eight prompts. Without it, a weak result is unattributable: a bad script and an undertrained base look identical from the output side.</p>
<p><strong>Pick a narrow task for LoRA.</strong> Identity injection, roughly 91 samples, rather than a broad capability target. The question being tested is whether the PEFT mechanism engages at all, and a narrow task answers it cleanly.</p>
</div>

<div data-lang="zh">
<p><strong>先定评测，再跑任何东西。</strong>8条固定 prompt 加固定解码参数，第一天冻结，覆盖助手化表述、事实召回、推理、翻译、格式与复读。只看 loss 无法区分"更像助手"与"更正确"，而后来发现分叉恰好就在这两者之间。</p>
<p><strong>每个阶段只改一个变量。</strong>Pretrain 先跑10k验证链路通畅，再扩到20万条；SFT 基于自训基座；LoRA 叠在其上。对照之间不动其他任何设置。</p>
<p><strong>设置上界对照。</strong>作者发布的 <code>full_sft</code> 权重跑同一套8条 prompt。没有这个对照，弱结果无法归因：脚本写错与基座训练不足，从输出侧看完全一样。</p>
<p><strong>LoRA 选窄任务。</strong>身份注入，约91条样本，而非宽泛的能力目标。要检验的问题是 PEFT 机制是否生效，窄任务能给出干净的答案。</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Stage</span><span data-lang="zh">阶段</span></th>
  <th><span data-lang="en">Data</span><span data-lang="zh">数据</span></th>
  <th><span data-lang="en">Base</span><span data-lang="zh">基座</span></th>
  <th><span data-lang="en">Output</span><span data-lang="zh">产物</span></th>
</tr></thead>
<tbody>
<tr><td>Pretrain</td><td><code>pretrain_t2t_mini</code> 10k → 200k</td><td><span data-lang="en">none</span><span data-lang="zh">无</span></td><td><code>pretrain_b2_768.pth</code></td></tr>
<tr><td>SFT</td><td><code>sft_mainline_200k</code></td><td>pretrain_b2</td><td><code>full_sft_b2_768.pth</code> <span class="num">131 MB</span></td></tr>
<tr><td>LoRA</td><td><code>lora_identity.jsonl</code> <span class="num">91</span></td><td><span data-lang="en">author's full_sft</span><span data-lang="zh">作者 full_sft</span></td><td><code>lora_identity_768.pth</code> <span class="num">0.76 MB</span></td></tr>
<tr><td><span data-lang="en">Upper bound</span><span data-lang="zh">上界对照</span></td><td><span data-lang="en">same 8 prompts</span><span data-lang="zh">同一组8条 prompt</span></td><td><span data-lang="en">author's full_sft</span><span data-lang="zh">作者 full_sft</span></td><td><code>author_full_sft_eval.json</code></td></tr>
</tbody>
</table>
</div>

<div class="stage">
<h2><span data-lang="en">What it produced</span><span data-lang="zh">成果</span></h2>

<div data-lang="en">
<p><strong>Pretrain.</strong> At 10k, loss falls from about 7.7 to 4.3 and the loop is confirmed working. Scaled to 200k with two-card DDP it trains for hours without incident. <code>logits_loss == loss</code> throughout, as expected with MoE off and <code>aux_loss</code> at zero.</p>
<p><strong>SFT on that base.</strong> Weights come out normal. Against the eight prompts, held next to the pretrain checkpoint:</p>
<ul>
<li>Improved: assistant framing on Q1, occasional correct code-block formatting on Q4.</li>
<li>Unchanged or worse: Q2, Q3 and Q6 still wrong on both fact and reasoning; Q5 translation sometimes better <em>before</em> SFT; Q7 introduces meta-commentary such as "the user is asking me to write"; repetition remains obvious.</li>
<li>Adding <code>repetition_penalty=1.15</code> reduces the repetition and moves nothing else.</li>
</ul>
<p><strong>Upper bound.</strong> The author's checkpoint is better across Q3, Q7 and Q8 in both format and content, and still fabricates, confusing Jay Chou with a fourth-century calligrapher on Q2. The gap between the two chains is in pretraining data and scale, not in the training scripts.</p>
<p><strong>LoRA.</strong> On identity prompts the injection works: a generic assistant self-description becomes a specific small-model identity. On everything else it does not move. The relationship-to-OpenAI prompt is still fabricated, just differently, and general knowledge is unchanged.</p>
</div>

<div data-lang="zh">
<p><strong>Pretrain。</strong>10k 规模下 loss 由约7.7降至4.3，链路确认通畅。扩到20万条并启用双卡 DDP 后可正常训练，耗时数小时。全程 <code>logits_loss == loss</code>，在未开 MoE、<code>aux_loss</code> 为0的情况下属正常。</p>
<p><strong>基于该基座的 SFT。</strong>权重产出正常。在8条 prompt 上与 pretrain 检查点并列对比：</p>
<ul>
<li>有改善：Q1 的助手化表述，Q4 偶尔出现正确的代码块格式。</li>
<li>未改善或更差：Q2、Q3、Q6 的事实与推理仍然错误；Q5 翻译在 SFT <em>之前</em>有时更好；Q7 出现"用户让我写……"这类元话语；复读依然明显。</li>
<li>加入 <code>repetition_penalty=1.15</code> 后复读减轻，其余均无变化。</li>
</ul>
<p><strong>上界对照。</strong>作者权重在 Q3、Q7、Q8 上的格式与内容均更优，但仍会胡编，Q2 把周杰伦与王羲之混为一谈。两条链路的差距在 pretrain 数据与训练规模，不在训练脚本。</p>
<p><strong>LoRA。</strong>身份类 prompt 上注入生效：从泛化的 AI 助手话术变为具体的小参数模型定位。其余全部未动：与 OpenAI 关系的 prompt 仍是胡编，只是换了一种编法；通用知识没有提升。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">The one-line result</span><span data-lang="zh">一句话结果</span></p>
  <p><span data-lang="en">A weak base plus 200k SFT samples mainly teaches a model <strong>the shell of a conversation</strong>, not to be more correct. LoRA rewrote its sense of identity and nothing else.</span><span data-lang="zh">弱基座加20万条 SFT，主要学到的是<strong>对话的壳子</strong>，不是变得更正确。LoRA 改写了它的身份认知，别的什么都没改。</span></p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">Postmortem</span><span data-lang="zh">事后复盘</span></h2>

<div data-lang="en">
<p>The bottleneck is base capability plus data scale and quality, not any single hyperparameter. That sounds obvious written down. It was not obvious while watching a loss curve fall and reading outputs that were visibly becoming more polite.</p>
<p>Which is the reason the eight fixed prompts were worth freezing on day one. Loss fell at every stage. Correctness did not follow it, and only a fixed comparison set makes that visible. "It got better" is not a claim until it names which of format compliance, repetition rate, factual score or head-to-head win rate got better.</p>
<p>Engineering notes worth keeping, all of them cheap to avoid and expensive to debug: <code>run_eval</code> resolves <code>load_from="model"</code> as a Hugging Face repo when run from the wrong directory; pretrain data cannot be fed to SFT, the multi-turn format and label masking differ; two cards are not automatically faster, and on a T4 <code>use_compile=1</code> was sometimes slower; a Kaggle refresh loses draft cells, so checkpoints and eval JSON have to be saved out deliberately.</p>
<p>Three things this does not establish. There is no human-scored baseline, so every comparison is one set of outputs against another, not against a standard. Only one domain was tried for LoRA, identity, so nothing here says whether a vertical LoRA such as a medical one would behave the same way. And eight prompts is a diagnostic, not a benchmark.</p>
<p>Rerun today, the order would change: prove the loop with a 10k pretrain, then go straight to the author's checkpoint to understand what a working SFT looks like, and spend the saved time on LoRA and evaluation instead of on pushing a weak base through full SFT.</p>
</div>

<div data-lang="zh">
<p>瓶颈是基座能力加数据的规模与质量，不是任何单点超参。写下来显得理所当然，但在盯着 loss 曲线下降、同时读到输出明显变得更客气的时候，它并不显然。</p>
<p>这正是那8条 prompt 值得在第一天就冻结的原因。每个阶段 loss 都在降，正确性没有跟着降，而只有固定对照集能让这件事被看见。"效果变好了"在指明是格式合规率、复读率、事实题得分还是固定 prompt 的胜率变好之前，不构成一个结论。</p>
<p>值得留存的工程记录，都属于避免起来很便宜、debug 起来很贵的那类：在错误目录下运行时，<code>run_eval</code> 会把 <code>load_from="model"</code> 当作 Hugging Face 仓库解析；pretrain 数据不能直接喂给 SFT，多轮格式与 label 掩码规则不同；双卡不一定更快，T4 上 <code>use_compile=1</code> 有时反而更慢；Kaggle 刷新会丢失 draft cell，检查点与评测 JSON 必须主动导出。</p>
<p>三件本项目没有确立的事：没有人工评分基准，因此所有对比都是一组输出与另一组输出相比，而非与标准相比；LoRA 只试了身份一个方向，因此这里的结论不能推广到医疗这类垂域 LoRA；8条 prompt 是诊断工具，不是 benchmark。</p>
<p>若今天重跑，顺序会改：先用10k pretrain 验证链路通畅，随即直接使用作者权重理解一个可用的 SFT 是什么样子，把省下的时间放到 LoRA 与评测上，而不是在弱基座上硬推全量 SFT。</p>
</div>
</div>
