---
title: "Fanzone: A Mini-Program for Organizing Fan Events"
title_zh: "Fanzone：一个组织线下应援的小程序"
track: ai
featured: false
weight: 4
kicker_en: "Team of 3 · 2024 · Product design"
kicker_zh: "三人团队 · 2024 · 产品设计"
summary: "The earliest thing here, and the only one that is not a system. Fans were already organizing offline events. They were doing it in the comment sections of platforms built for something else."
summary_zh: "全站最早的项目，也是唯一一个不是系统的。粉丝原本就在组织线下应援，只是组织过程发生在为其他用途设计的平台的评论区里。"
role: "Product design lead · research, IA, prototypes"
period: "2024.06"
stack: "问卷与深访, 竞品分析, Sketch, XMind"
tags: ["Product design", "User research", "WeChat mini-program"]
cover: /assets/img/fanzone/home.webp
---

<div class="stage">
<h2><span data-lang="en">The problem</span><span data-lang="zh">起因</span></h2>

<div data-lang="en">
<p>A fan wants to attend a screening party for a concert she cannot get tickets to. She searches Weibo supertopics, Douban groups and Xiaohongshu. What she finds in the comments is other fans asking the same question. Nobody in that thread is the organizer. Everyone in it is waiting.</p>
<p>That is not a discovery problem in the usual sense. The events exist and the organizers exist. They are separated because every platform involved was built to host posts, not to host events, so an event lives as a post that scrolls away, and the coordination happens in replies that no structure holds together.</p>
</div>

<div data-lang="zh"><p>粉丝想参加一场线下观影，在微博超话、豆瓣小组、小红书检索，评论区里全是同样在问的人。帖子下没有主办方，只有等待者。</p>
<p>这不是通常意义上的信息缺失。活动存在，主办方也存在，两端被隔开的原因是：相关平台都为"发帖"设计，而非为"办活动"设计。因此一场活动的存在形式是一条会被刷走的帖子，协调过程发生在没有结构承托的回复里。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What the research actually said</span><span data-lang="zh">调研</span></h2>

<div data-lang="en">
<p>67 valid questionnaires, 61 of them from people who had actually attended an offline fan event, plus 6 in-depth interviews with participants aged 20 to 26. Event types clustered into four kinds: birthday cafe events, big-screen check-ins, group screenings, and airport send-offs.</p>
<p>Three findings, and the third one changed what we built.</p>
<ul>
<li><strong>Information is scattered across channels.</strong> No single place holds offline events, so fans monitor several platforms and still miss things.</li>
<li><strong>Getting the information is hard even when it exists.</strong> Posts are not searchable by city or date, because they are posts.</li>
<li><strong>People strongly want to talk to other fans of the same person.</strong> Not as a side effect of attending. As a reason for attending.</li>
</ul>
<p>The first two describe an aggregator. The third does not. If we had only run the survey and skipped the interviews, we would have built a listings board, and the listings board would have been correct and unloved.</p>
</div>

<div data-lang="zh"><p>67份有效问卷，其中61份来自实际参加过线下应援的人；6个深访，年龄集中在20至26岁。活动类型集中于四类：生咖应援、大屏打卡、线下观影、接送机。</p>
<p>三个发现，第三个改变了产品形态。</p>
<ul>
<li><strong>应援信息的获取渠道分散。</strong>没有任何单一入口汇总线下活动，同时盯多个平台仍会错过。</li>
<li><strong>信息存在也难以获取。</strong>帖子无法按城市与日期检索，因为它本质上只是帖子。</li>
<li><strong>与同担交流的意愿强烈。</strong>这不是参加活动的副产品，本身即为参加理由之一。</li>
</ul>
<p>前两条指向一个信息聚合器，第三条不指向。若只做问卷、跳过深访，产出会是一个活动列表页，正确但无人使用。</p>
</div>

<div class="callout">
  <p class="label"><span data-lang="en">Market context</span><span data-lang="zh">市场背景</span></p>
  <p><span data-lang="en">Weibo alone hosts more than 30,000 celebrity and fan-club accounts, and 73% of surveyed Weibo fans had paid to support an artist. The fan-economy adjacent market was put above 4.1 trillion RMB in 2020, projected past 6 trillion by 2023. Source: <em>Fan Economy 4.0 White Paper</em>. Those figures were cited, not collected by us.</span><span data-lang="zh">仅微博即有超过3万个娱乐明星及粉丝团账户，受访微博粉丝中73%有过"付费支持"行为。粉丝经济关联产业市场规模2020年超4.1万亿元，2023年预计超6万亿元。数据来源：《粉丝经济4.0时代白皮书》，为引用数据，非本项目采集。</span></p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What we built</span><span data-lang="zh">成果</span></h2>

<div data-lang="en">
<p>Four modules, mapping to four jobs rather than to four screens: aggregating offline events, hosting one, joining one, and finding people who follow the same artist. Home carries the aggregation, Circle handles browsing and signing up, Messages handles interaction, and Profile holds a user's own history.</p>
<p>It is a WeChat mini-program rather than an app, deliberately. The behaviour we were designing for is occasional and situational. Nobody is going to install and maintain an app for four screenings a year, and the sharing already happens inside WeChat.</p>
</div>

<div data-lang="zh"><p>四个模块对应四件事而非四个页面：线下应援信息整合、组织活动（主办方）、参加活动（粉丝）、寻找同好。首页承担整合，圈子承担浏览与报名，消息承担互动，我的承担用户自身足迹。</p>
<p>做成微信小程序而非 App 是刻意选择。目标行为偶发且场景化，为一年四次的线下观影安装并维护一个 App 不成立，而分享本身就发生在微信内。</p>
</div>

<div class="screens">
  <figure>
    <span class="shot"><img src="/assets/img/fanzone/home.webp" alt="Fanzone home screen, aggregating offline fan events" loading="lazy"></span>
    <figcaption><strong><span data-lang="en">Home</span><span data-lang="zh">首页</span></strong>
      <span data-lang="en">Everything scattered across four platforms, in one place.</span><span data-lang="zh">原本分散在四个平台的信息，收在一处。</span></figcaption>
  </figure>
  <figure>
    <span class="shot"><img src="/assets/img/fanzone/browse.webp" alt="Browsing and filtering events by city" loading="lazy"></span>
    <figcaption><strong><span data-lang="en">Browse by city</span><span data-lang="zh">按城市筛选</span></strong>
      <span data-lang="en">Offline events are local. Filtering by region comes before anything else.</span><span data-lang="zh">线下活动具有地域性，地区筛选优先于其他条件。</span></figcaption>
  </figure>
  <figure>
    <span class="shot"><img src="/assets/img/fanzone/create.webp" alt="The flow for creating an event as an organizer" loading="lazy"></span>
    <figcaption><strong><span data-lang="en">Host an event</span><span data-lang="zh">创建活动</span></strong>
      <span data-lang="en">The organizer side, which is the half that comment sections cannot hold.</span><span data-lang="zh">主办方一侧，即评论区无法承托的那一半。</span></figcaption>
  </figure>
  <figure>
    <span class="shot"><img src="/assets/img/fanzone/chat.webp" alt="Chat between fans attending the same event" loading="lazy"></span>
    <figcaption><strong><span data-lang="en">Talk to other fans</span><span data-lang="zh">和同担说话</span></strong>
      <span data-lang="en">The finding from the interviews, given its own surface instead of a comment thread.</span><span data-lang="zh">深访中的第三个发现，被给予独立入口，而非一条评论。</span></figcaption>
  </figure>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">The decision I would still defend</span><span data-lang="zh">关键决策</span></h2>

<div data-lang="en">
<p>Fan events involve money. People pool funds for a cafe booking, for printed materials, for a screen rental. The obvious product move is to handle payments, because that is where the friction is and where the revenue would be.</p>
<p>We designed the opposite. Four safety rules, and the fourth one is the one that mattered:</p>
<ul>
<li>Identity verification for organizers</li>
<li>Fan-club endorsement as a second signal</li>
<li>Proof of arrangements before an event can be published</li>
<li><strong>No money changes hands inside the product</strong></li>
</ul>
<p>The reasoning: a platform that holds fans' pooled money becomes the thing people blame when an organizer disappears, and it becomes attractive to exactly the organizers you do not want. Staying out of the transaction meant giving up the obvious business model in exchange for not having to solve fraud, refunds and custody as a three-person student team. It also meant the product could not lie about what it guarantees, because it guaranteed nothing financial.</p>
<p>Whether that is the right long-run call for a real company, I do not know. As a decision made with the resources we actually had, I still think it was right, and it is the part of this project I would want to be asked about.</p>
</div>

<div data-lang="zh"><p>应援活动涉及资金：集资订咖啡厅、印物料、租大屏。产品上最顺理成章的动作是接入支付，因为摩擦与收入都在那里。</p>
<p>设计选择了相反方向。四条安全保障，关键的是第四条：</p>
<ul>
<li>主办方身份认证</li>
<li>后援会背书作为第二重信号</li>
<li>发布前须提供活动举办材料</li>
<li><strong>产品内不直接涉及金钱交易</strong></li>
</ul>
<p>依据是：托管粉丝集资的平台会在主办方跑路时成为被问责方，且会吸引来最不希望出现的那类主办方。不碰交易意味着放弃最直白的商业模式，换来的是不必以三人学生团队的资源解决欺诈、退款与资金托管，同时使产品无法在"保障什么"上失实，因为它在资金层面不作任何保障。</p>
<p>对一家真实公司而言这是否为长期正确的判断，无法确定。但作为以当时可用资源做出的决定，我至今认为成立，这也是这个项目最值得被追问的部分。</p>
</div>
</div>

<div class="stage">
<h2><span data-lang="en">What it still can't do</span><span data-lang="zh">复盘</span></h2>

<div data-lang="en">
<p><strong>It was never built.</strong> This is a research report, an information architecture, a set of flows and a high-fidelity prototype presented at a roadshow. No line of it shipped, so every claim about how it would perform is a claim about a drawing.</p>
<p><strong>Nothing was tested with a user.</strong> The 67 questionnaires and 6 interviews all happened before the design existed. Not one person was put in front of the prototype and asked to host an event. So the research supports the problem statement and supports nothing about the solution, which is the most common way a student product project overstates itself.</p>
<p><strong>Six interviews is a small number, and they were people I could reach.</strong> Everyone was 20 to 26. Organizers, who carry the harder half of the product, are underrepresented against attendees.</p>
<p><strong>The safety design has no adversarial thinking in it.</strong> Identity verification and fan-club endorsement are stated as protections without anyone having asked how they would be worked around, and they are easy to work around. Writing this page is the first time I have looked at that list and read it as an attacker rather than as its author.</p>
<p>I am keeping this project in the AI track rather than filing it under research because of what it is evidence of, and I would rather say that plainly than let the placement imply something it should not. It is 2024, it contains no AI, and it is the earliest work on this site. What it does contain is the shape of a decision I still make the same way: work out what the thing must not be trusted to do, then design so that it never has to be trusted with it. Two years later that turned into audit logs and citation checkers. Here it was just a rule that the product does not touch anyone's money.</p>
</div>

<div data-lang="zh"><p><strong>它没有被实现。</strong>产出是一份调研报告、一套信息架构、一组流程和一个在路演上展示过的高保真原型。没有一行代码上线，因此任何关于"它会表现如何"的说法，说的都是一张图。</p>
<p><strong>没有做过用户测试。</strong>67份问卷与6个深访全部发生在设计存在之前，没有任何一人被放到原型面前、被要求创建一场活动。这些调研支撑的是问题定义，对解决方案不提供任何支撑，而这正是学生产品项目最常见的自我夸大方式。</p>
<p><strong>6个深访样本小，且都是可触达的人。</strong>全部20至26岁。主办方承担产品中更难的一半，相对参与者严重不足。</p>
<p><strong>安全设计缺乏对抗性思考。</strong>身份认证与后援会背书被写成保护措施，但从未有人推演它们会如何被绕过，而它们很容易被绕过。撰写本页是第一次以攻击者而非作者的身份重读那份清单。</p>
<p>把这个项目放在 AI 线而非归入研究类，依据是它能证明的东西，这一点直接写明，避免让位置暗示不该暗示的事。它属于2024年，不含任何 AI，是全站最早的作品。它包含的是一个至今仍在沿用的判断方式：先确定这个东西哪些地方不能被信任，再把设计做成它不需要在那里被信任。两年后这变成了审计日志与引用校验器，在这里，它只是一条规则：产品不碰任何人的钱。</p>
</div>
</div>
