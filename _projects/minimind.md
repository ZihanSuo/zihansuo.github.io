---
title: "MiniMind: Training a Language Model From Scratch"
title_zh: "MiniMind：从零训练一个语言模型"
track: ai
featured: true
weight: 3
kicker_en: "Individual Project · 2026 · Pretrain / SFT / LoRA"
kicker_zh: "个人项目 · 2026 · Pretrain / SFT / LoRA"
summary: "I reproduced the full MiniMind pipeline, then used a frozen eval set to check what actually changed. A weak base plus 200k SFT mostly learned the shell of a conversation, not a smarter model."
summary_zh: "我把 MiniMind 的 Pretrain、SFT、LoRA 全流程跑通，再用固定评测去看到底变了什么。弱基座加20万条 SFT 主要学到的是对话的壳子，不是变聪明。"
role: "Solo"
period: "2026-06"
stack: "PyTorch, Kaggle T4, DDP, LoRA"
tags: ["Pretraining", "SFT", "LoRA"]
---

<div class="stage">
<h2><span data-lang="en">The problem</span><span data-lang="zh">问题是什么</span></h2>

<div data-lang="en">
<p>The version of this project that writes itself is: I trained a 64M language model from scratch. Loss went down. After SFT it started answering like an assistant. That is the version I would have shipped, if I had let the training log be the result.</p>
<p>The actual failure is simpler. <strong>Falling loss and assistant-shaped replies are not evidence that the model got smarter.</strong> On a weak pretrained base, 200k SFT can learn the shell of a conversation (the greeting, the code fence, the "as an AI" posture) while facts, reasoning and translation stay wrong, or get worse. If the eval set is not frozen before you train, you cannot tell those two things apart, and the write-up becomes a success story about a model that still cannot do the task.</p>
</div>

<div data-lang="zh">
<p>这个项目有一个会自己长出来的版本：我从零训了一个64M语言模型。loss降了。SFT之后它开始像助手那样回答。如果我让训练日志充当结果，交出去的就会是这一版。</p>
<p>真正的失败更简单。<strong>loss在降、回复开始像助手，都不是模型变聪明的证据。</strong>弱预训练基座上，20万条 SFT 可以只学到对话的壳子（开场白、代码块、“作为 AI”的姿态），事实、推理、翻译照样错，有的还会更差。如果不在开训前把评测集冻住，这两件事分不开，写出来就会是一个成功故事，而模型仍然不会做那道题。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">The call I made</span><span data-lang="zh">我做的判断</span></h2>

<div data-lang="en">
<p>I stopped treating the loss curve as the outcome, and made four decisions that the rest of the project had to follow.</p>
</div>
<div data-lang="zh">
<p>我不再把 loss 曲线当成结果，后面的实验都按这四条来。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">What I would actually measure</span><span data-lang="zh">到底量什么</span></p>
  <p><span data-lang="en"><strong>A frozen set of eight prompts, scored by what changed in the text.</strong> Format, repetition, factual errors, whether it sounds like an assistant. Loss can fall while all of those stay the same.</span><span data-lang="zh"><strong>冻住8条prompt，看文本里到底变了什么。</strong>格式、复读、事实错误、像不像助手。loss可以一直降，这些可以一动不动。</span></p>
</div>

<div data-lang="en">
<p>The other three were about what not to compare against. I would not declare SFT a success because the new checkpoint looked better than the last one I trained. The ceiling was the author's <code>full_sft</code> weight, run on the same eight prompts. If my pipeline could not get near that ceiling, the gap was in data and scale, not in a missing line of training code. And LoRA would be tested as a narrow job (identity), not as proof that PEFT made the model generally better.</p>
<p>Early on I ran the author's checkpoint to confirm the environment and the inference path worked at all. I kept that run out of the self-trained chain. Mixing them would have let a working demo pretend to be a working training pipeline.</p>
</div>
<div data-lang="zh">
<p>另外三条是关于不要跟谁比。我不会因为新 checkpoint 比我自己上一版好看，就宣布 SFT 成功。上界是作者的 <code>full_sft</code> 权重，同一套8条prompt。如果我的流水线靠近不了这条上界，差距就在数据和规模，不在训练脚本少写了一行。LoRA 只拿来测窄任务（身份），不当成“做了 PEFT 所以整体更强”的证据。</p>
<p>早期我先用作者的权重跑通过环境和推理链路，确认这两样是好的。那次跑不算进自训链路。混在一起的话，一个能用的 demo 会假装成一条能用的训练流水线。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How it works</span><span data-lang="zh">怎么做的</span></h2>

<div data-lang="en">
<p>MiniMind is a 64M model. I ran it on Kaggle Tesla T4s, single card then two-card DDP. Four stages, one frozen eval:</p>
</div>
<div data-lang="zh">
<p>MiniMind 是64M。跑在 Kaggle 的 Tesla T4 上，先单卡再双卡 DDP。四个阶段，评测集始终同一套：</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">Stage</span><span data-lang="zh">阶段</span></th>
  <th><span data-lang="en">Script / data</span><span data-lang="zh">脚本 / 数据</span></th>
  <th><span data-lang="en">Base</span><span data-lang="zh">基座</span></th>
  <th><span data-lang="en">Artifact</span><span data-lang="zh">产物</span></th>
</tr></thead>
<tbody>
<tr>
  <td>B1 Pretrain</td>
  <td><code>train_pretrain.py</code><br><code>pretrain_t2t_mini</code> (10k, then 200k)</td>
  <td><code>from_weight=none</code></td>
  <td><code>pretrain_b2_768.pth</code></td>
</tr>
<tr>
  <td>B2 SFT</td>
  <td><code>train_full_sft.py</code><br><code>sft_mainline_200k</code> (random sample)</td>
  <td>my <code>pretrain_b2</code></td>
  <td><code>full_sft_b2_768.pth</code> (~131MB)</td>
</tr>
<tr>
  <td>B3 LoRA</td>
  <td><code>train_lora.py</code><br><code>lora_identity.jsonl</code> (~91 rows)</td>
  <td>author's <code>full_sft</code></td>
  <td><code>lora_identity_768.pth</code> (0.76MB)</td>
</tr>
<tr>
  <td><span data-lang="en">Ceiling</span><span data-lang="zh">上界对照</span></td>
  <td><code>run_eval</code> · frozen 8 prompts</td>
  <td>author's <code>full_sft</code></td>
  <td><code>author_full_sft_eval.json</code></td>
</tr>
</tbody>
</table>

<div data-lang="en">
<p>Pretrain loss is next-token over almost the whole sequence (pad masked). SFT loss is mostly on the assistant turns. That is why you cannot take the pretrain 200k and "just SFT on it": the files are different formats, and the labels mean different things. LoRA freezes <em>W</em> and trains a low-rank update. It is a small file on purpose. It is not a substitute for a full SFT, and I did not treat the 0.76MB as a smaller, cheaper version of the 131MB.</p>
</div>
<div data-lang="zh">
<p>Pretrain 的 loss 是几乎全文的 next-token（pad 不算）。SFT 的 loss 主要落在助手回复上。所以不能拿 pretrain 那20万条“直接拿来做 SFT”：文件格式不同，label 的含义也不同。LoRA 冻结 <em>W</em>，只训一个低秩更新。文件小是设计如此。它不是全量 SFT 的替代品，我没有把0.76MB当成131MB的便宜缩小版。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">How I tested it</span><span data-lang="zh">怎么验的</span></h2>

<div data-lang="en">
<p>The eight prompts never moved. What I did not do, and should have done on day one, is fix the decode settings up front and write down that only one variable changes per stage. The one decode change I made came after SFT, <code>repetition_penalty=1.15</code>, as a single-variable check: repetition eased, knowledge did not move.</p>
<p>The eval path itself almost lied to me. Running <code>run_eval</code> from the <code>trainer/</code> directory, with <code>load_from="model"</code>, sent Hugging Face a repo name that does not exist. The error was 401. It looks like an auth problem. It was a working directory problem. A 401 here does not mean the weight is broken. It means the measuring instrument pointed at the internet instead of the disk.</p>
<p>The other trap I actually hit: I built <code>sft_mainline_200k.jsonl</code> and then pointed the trainer at a <code>520k</code> path, then a <code>50k</code> path. The run would have been clean, and the comparison would have been against the wrong file. After that, <code>ls</code> and <code>wc -l</code> became a step, not a habit I remembered after the fact.</p>
</div>
<div data-lang="zh">
<p>8条prompt没有改过。我没做、而且第一天就该做的，是把解码参数一起固定下来，并写明每个阶段只改一个变量。唯一一次解码改动发生在 SFT 之后，<code>repetition_penalty=1.15</code>，作为单变量检查：复读轻了，知识没有涨。</p>
<p>评测路径本身差点骗我。在 <code>trainer/</code> 目录下跑 <code>run_eval</code>，<code>load_from="model"</code> 会被当成 Hugging Face 仓库名去网上拉一个不存在的库。报错是401。看起来像鉴权问题，其实是工作目录问题。这里的401不表示权重坏了，表示量尺指到了网上，而不是磁盘上。</p>
<p>另一个我真实踩过的坑：建好了 <code>sft_mainline_200k.jsonl</code>，训练脚本却先指向 <code>520k</code> 路径，再指向 <code>50k</code>。训练会很干净，对比的却是错文件。从那以后，<code>ls</code> 和 <code>wc -l</code> 变成步骤，不是事后才想起来的习惯。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">Evidence</span><span data-lang="zh">结果和证据</span></h2>

<div data-lang="en">
<p>On the 10k pretrain smoke run, loss fell from about 7.7 to 4.3, which only means the loop ran. Cross-entropy can sit above 1 for a long time (<code>-log(0.1)</code> is already 2.3). <code>logits_loss == loss</code> because MoE was off and <code>aux_loss=0</code>. None of that is a quality claim. Scaling to 200k on two T4s was slow, hours not minutes, and still not the result.</p>
<p>The result is the frozen eight, my <code>pretrain_b2</code> against my <code>full_sft_b2</code>:</p>
</div>
<div data-lang="zh">
<p>1万条的 pretrain 冒烟跑，loss 大约从7.7降到4.3，这只说明循环是通的。交叉熵长期大于1很正常（<code>-log(0.1)</code> 已经是2.3）。<code>logits_loss == loss</code> 是因为没开 MoE，<code>aux_loss=0</code>。这些都不是质量主张。扩到20万、双卡 T4，耗时是数小时不是几分钟，那也还不是结果。</p>
<p>结果是冻住的那8条，我的 <code>pretrain_b2</code> 对上我的 <code>full_sft_b2</code>：</p>
</div>

<table>
<thead><tr>
  <th><span data-lang="en">What I looked at</span><span data-lang="zh">看什么</span></th>
  <th><span data-lang="en">After SFT</span><span data-lang="zh">SFT 之后</span></th>
</tr></thead>
<tbody>
<tr>
  <td>Q1</td>
  <td><span data-lang="en">More like an assistant.</span><span data-lang="zh">更像助手。</span></td>
</tr>
<tr>
  <td>Q4</td>
  <td><span data-lang="en">Occasionally produced a code block.</span><span data-lang="zh">偶尔出现 code block 格式。</span></td>
</tr>
<tr>
  <td>Q2 / Q3 / Q6</td>
  <td><span data-lang="en">Facts and reasoning still wrong.</span><span data-lang="zh">事实和推理仍然错。</span></td>
</tr>
<tr>
  <td>Q5 (translation)</td>
  <td><span data-lang="en">The pretrained checkpoint was sometimes better.</span><span data-lang="zh">预训练那个 checkpoint 有时更好。</span></td>
</tr>
<tr>
  <td>Q7</td>
  <td><span data-lang="en">Started talking about the user ("the user asked me to write…").</span><span data-lang="zh">开始说“用户让我写…”这种元话语。</span></td>
</tr>
<tr>
  <td><span data-lang="en">Repetition</span><span data-lang="zh">复读</span></td>
  <td><span data-lang="en">Still obvious, until <code>repetition_penalty=1.15</code>. Then it eased. Knowledge did not move.</span><span data-lang="zh">仍然明显，直到 <code>repetition_penalty=1.15</code>。然后轻了。知识没有动。</span></td>
</tr>
</tbody>
</table>

<div class="callout">
  <p class="label"><span data-lang="en">What that table is allowed to say</span><span data-lang="zh">这张表被允许说的话</span></p>
  <p><span data-lang="en"><strong>A weak base plus 200k SFT mostly learned the shell of a conversation, not a smarter model.</strong> Two prompts looked more like products. The rest did not get better, and one got a worse habit. "Loss went down" does not appear in this table, because it does not belong here.</span><span data-lang="zh"><strong>弱基座加20万条 SFT，主要学到的是对话的壳子，不是变聪明。</strong>两条看起来更像成品。其余没有变好，一条还多了坏习惯。“loss降了”不出现在这张表里，因为它不属于这里。</span></p>
</div>

<div data-lang="en">
<p>The author's <code>full_sft</code>, same eight prompts, is better as a whole: Q3, Q7 and Q8 are closer to the task in both format and content. It still fabricates. On Q2 it mixed Jay Chou with Wang Xizhi. So the ceiling is real, and it is not "correct". The gap between my chain and that ceiling is data and training scale. It is not a bug in the scripts. I know the scripts ran, because the author's weight runs on them.</p>
<p>Identity LoRA went on the author's <code>full_sft</code>, not on my weak SFT. That was deliberate: if identity injection failed on a capable base, I would have been measuring the adapter against a broken floor.</p>
</div>
<div data-lang="zh">
<p>作者的 <code>full_sft</code>，同一套8条，整体更好：Q3、Q7、Q8 的格式和内容都更接近任务。它仍然会胡编。Q2 把周杰伦和王羲之搅在一起。所以上界是真的，上界也不是“正确”。我这条链路和这条上界之间的差距，在数据和训练规模，不在脚本写错。脚本能跑，是因为作者的权重在同一套脚本上能跑。</p>
<p>Identity LoRA 打在作者的 <code>full_sft</code> 上，不打在我那个弱 SFT 上。这是故意的：如果身份注入在一个能用的基座上失败，我量到的就是适配器和一个坏地板之间的差。</p>
</div>

<table>
<thead><tr>
  <th>Prompt</th>
  <th><span data-lang="en">Before LoRA</span><span data-lang="zh">LoRA 前</span></th>
  <th><span data-lang="en">After</span><span data-lang="zh">LoRA 后</span></th>
  <th><span data-lang="en">Call</span><span data-lang="zh">判断</span></th>
</tr></thead>
<tbody>
<tr>
  <td><span data-lang="en">Introduce yourself in one sentence</span><span data-lang="zh">一句话介绍自己</span></td>
  <td><span data-lang="en">Generic assistant talk</span><span data-lang="zh">泛化的 AI 助手话术</span></td>
  <td><span data-lang="en">Names jingyaogong / small-model positioning</span><span data-lang="zh">带 jingyaogong / 小参数模型定位</span></td>
  <td><span data-lang="en">Identity injection worked</span><span data-lang="zh">身份注入有效</span></td>
</tr>
<tr>
  <td><span data-lang="en">Who are you</span><span data-lang="zh">你是谁</span></td>
  <td><span data-lang="en">Already had jingyaogong</span><span data-lang="zh">已经有 jingyaogong</span></td>
  <td><span data-lang="en">Slightly longer wording</span><span data-lang="zh">表述略扩展</span></td>
  <td><span data-lang="en">Small change</span><span data-lang="zh">变化小</span></td>
</tr>
<tr>
  <td><span data-lang="en">Relation to OpenAI</span><span data-lang="zh">和 OpenAI 的关系</span></td>
  <td><span data-lang="en">Invented an Alibaba Cloud link</span><span data-lang="zh">胡编和阿里云的关系</span></td>
  <td><span data-lang="en">Still invented, slightly different</span><span data-lang="zh">仍胡编，略不同</span></td>
  <td><span data-lang="en">Not fixed</span><span data-lang="zh">没修好</span></td>
</tr>
<tr>
  <td><span data-lang="en">Jay Chou / "the sky is blue"</span><span data-lang="zh">周杰伦 / 天空蓝</span></td>
  <td><span data-lang="en">Bad</span><span data-lang="zh">差</span></td>
  <td><span data-lang="en">About the same</span><span data-lang="zh">差不多</span></td>
  <td><span data-lang="en">No lift on general knowledge</span><span data-lang="zh">通用知识无提升</span></td>
</tr>
</tbody>
</table>

<div data-lang="en">
<p>LoRA is the right tool for a narrow identity job. It is the wrong tool for buying facts and reasoning that the base does not have.</p>
</div>
<div data-lang="zh">
<p>LoRA 适合窄的身份任务。它买不来基座里没有的事实和推理。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What it still can't do</span><span data-lang="zh">哪里没做到</span></h2>

<div data-lang="en">
<p>My self-trained pretrain-to-SFT chain did not match the author's <code>full_sft</code> on these eight prompts. I am not going to phrase that as "further training would close the gap." I did not run the experiment that would test that, and 200k on a 64M model is already the scale I had.</p>
<p>Identity LoRA worked on the self-introduction prompt. The OpenAI hallucination did not move. That is coverage, not a PEFT bug: about 91 identity rows never said "I am not related to OpenAI," so the adapter had nothing to install. I did not add the 10 to 20 clarifying rows that would test whether Q3 is fixable. I also did not run a medical-domain LoRA, which would have been the cleaner demonstration of "narrow task, frozen eval, before and after."</p>
</div>
<div data-lang="zh">
<p>自训的 pretrain 到 SFT，没有在这8条prompt上追平作者的 <code>full_sft</code>。我不会把这句话改成“再训就会补上差距”。能检验这句话的实验我没做，64M上20万条已经是我当时的规模。</p>
<p>Identity LoRA 在自我介绍那条上有效。OpenAI 那条幻觉没有动。这是覆盖问题，不是 PEFT 写错：大约91条身份数据里从来没写过“我和 OpenAI 没有关系”，适配器没有可安装的东西。我没有补那10到20条澄清样本，去测 Q3 能不能修好。医疗垂域 LoRA 也没做，而那才是更干净的演示：“窄任务、冻住评测、训前训后”。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">The claim I am not making</span><span data-lang="zh">我没有在做的那个主张</span></p>
  <p><span data-lang="en"><strong>Eight prompts are not an eval set.</strong> They are a tripwire. They can falsify "SFT made it smarter." They cannot support "the model is good at X." Format win-rate, repetition rate, and a human score on facts would be the next instruments. I logged those as the right measurements. I did not build them.</span><span data-lang="zh"><strong>8条prompt不是评测集。</strong>它是绊索。它可以证伪“SFT让它变聪明了”。它支撑不了“模型擅长 X”。格式合规率、复读率、事实题的人工分，才是下一把尺子。我把它们写成了该量的东西。我没有把它们做出来。</span></p>
</div>

<div data-lang="en">
<p>If I ran the calendar again I would fix the eight prompts and the decode settings on day one, as one decision, and hold every stage to a single changed variable. I would not spend the 200k self-pretrain hoping for dialogue quality. A 10k run is enough to understand <code>train_epoch</code>. The author's <code>full_sft</code> is the ceiling worth reading. A narrow LoRA on top of that is the experiment that actually moves. Another full SFT on this base would mostly buy a thicker shell.</p>
<p>The useful output of the project is not the 131MB file. It is a pipeline I can rerun, a tripwire that caught a story I almost told, and a clean negative: <strong>on a weak base, SFT taught the model how to talk like it knew, not how to know.</strong></p>
</div>
<div data-lang="zh">
<p>如果重来，我会在第一天就把8条prompt和解码参数一起定死，当成同一个决定，并且要求每个阶段只改一个变量。我不会把那20万条自训 pretrain 当成对话质量的投资。1万条够用来搞懂 <code>train_epoch</code>。值得读的上界是作者的 <code>full_sft</code>。在那上面做窄 LoRA，才是真的会动的实验。在这个基座上再刷一轮全量 SFT，多半只是把壳加厚。</p>
<p>这个项目有用的产出不是那131MB文件。是一条能重跑的流水线，一根拦住我差点写出去的故事的绊索，和一个干净的否定结论：<strong>弱基座上，SFT 教模型的是“说话像知道”，不是“知道”。</strong></p>
</div>
</div>
