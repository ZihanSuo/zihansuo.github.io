---
layout: page
title: About Me
permalink: /about/
use_aos: true
icon: fas fa-user
order: 1
---

If my resume is the "Instagram highlight reel," this is a timeline that **Behind the Scenes**.

Here lies the messy, exciting, and occasionally awkward journey of a storyteller turning into a builder. It features:
* 🗺️ My life across 3 continents
* 🔄 A major pivot from Journalism to Communication, and finally to Data Science
* 💃 A quiet project: rebuilding body-mind connection through dance, outdoor sports and strength training
* ✨ And the moments that didn't make it to the official bio.

🎓 Curious about the highlight reel? → [View my official resume & portfolio](https://drive.google.com/drive/u/0/folders/1KBqwSg3sJHl333HyCilmj4wo8fNc4HkV)

<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* 年份跳转按钮 */
  .year-nav {
    text-align: center;
    margin: 30px 0;
    padding: 15px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .year-nav a {
    display: inline-block;
    padding: 8px 16px;
    margin: 5px;
    border-radius: 8px;
    background: #f8f9fa;
    color: #495057;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
  }

  .year-nav a:hover {
    background: #495057;
    color: white;
    transform: translateY(-2px);
  }

  /* 容器 */
  .timeline-wrapper {
    position: relative;
    width: 100%;
    max-width: 900px;
    margin: 40px auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* 中轴线 */
  .timeline-wrapper::after {
    content: '';
    position: absolute;
    width: 2px;
    border-left: 2px solid transparent;
    border-image: repeating-linear-gradient(
        to bottom,
        #ced4da 0,
        #ced4da 10px,
        transparent 10px,
        transparent 20px
    );
    border-image-slice: 1;
    top: 0;
    bottom: 0;
    left: 50%;
    z-index: 0;
  }

  /* 年份标签样式 */
  .year-marker {
    position: relative;
    width: 100%;
    text-align: center;
    margin: 40px 0 30px 0;
    z-index: 999;
  }

  .year-marker::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    background: #6c757d;
    border: 4px solid white;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    z-index: 999;
  }

  .year-marker::after {
    content: attr(data-year);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    color: #495057;
    padding: 6px 20px;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
    border: 2px solid #dee2e6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    z-index: 999;
  }

  /* 单个时间块 */
  .timeline-item {
    position: relative;
    width: 800px;
    padding-bottom: 20px;
    box-sizing: border-box;
    z-index: 1;
    display: flex;
    justify-content: center;
  }

  /* 左侧块 */
  .left {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  /* 右侧块 */
  .right {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }


  /* 时间标签 */
  .timeline-date {
    position: absolute;
    top: 26px;
    left: 50%;
    transform: translateX(-50%);
    background: #f8f9fa;
    color: #495057;
    padding: 3px 10px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 500;
    white-space: nowrap;
    border: 1px solid #dee2e6;
    z-index: 999;
  }

  /* 内容卡片 */
  .content-box {
    width: 370px;
    flex-shrink: 0;
    padding: 15px 20px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    margin-top: 45px;
    transition: transform 0.2s, box-shadow 0.2s;
    text-align: left;
  }

  .content-box:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  /* 卡片分类 */
  .content-box.study {
    border-left: 3px solid #5b9bd5;
    background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
    box-shadow: 0 4px 12px rgba(91, 155, 213, 0.15), 0 2px 4px rgba(0,0,0,0.05);
  }

  .content-box.work {
    border-left: 3px solid #8b95a1;
    background: linear-gradient(135deg, #f8f9fa 0%, #f0f1f2 100%);
    box-shadow: 0 4px 12px rgba(139, 149, 161, 0.15), 0 2px 4px rgba(0,0,0,0.05);
  }

  .content-box.create {
    border-left: 3px solid #70ad47;
    background: linear-gradient(135deg, #f4f9f0 0%, #e8f5e0 100%);
    box-shadow: 0 4px 12px rgba(112, 173, 71, 0.15), 0 2px 4px rgba(0,0,0,0.05);
  }

  .content-box.life {
    border-left: 3px solid #ffa94d;
    background: linear-gradient(135deg, #fff8f0 0%, #ffeed9 100%);
    box-shadow: 0 4px 12px rgba(255, 169, 77, 0.15), 0 2px 4px rgba(0,0,0,0.05);
  }
  
  .content-box h3 { 
    margin: 0 0 8px 0; 
    font-size: 1.1rem; 
    color: #333; 
  }
  
  .content-box p { 
    margin: 0 0 8px 0; 
    font-size: 0.95rem; 
    color: #666; 
    line-height: 1.6;
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    .timeline-wrapper::after { 
      left: 24px; 
    }
    
    .timeline-item { 
      width: 100%;
      padding-left: 55px; 
      padding-right: 0;
      justify-content: flex-start;
    }

    .left, .right {
      text-align: left;
    }
    
    .timeline-item::before {
      left: 24px;
      transform: translateX(0);
    }
    
    .timeline-date {
      left: 24px;
      transform: translateX(20px);
    }
    
    .year-marker::before {
      left: 24px;
      transform: translate(0, -50%);
    }
    
    .year-marker::after {
      left: 24px;
      transform: translate(20px, -50%);
    }
    
    .content-box {
      width: auto;
      max-width: 100%;
    }
  }
</style>


<!-- 年份快速跳转 -->
<div class="year-nav">
  <a href="#year-2025">2025</a>
  <a href="#year-2024">2024</a>
  <a href="#year-2023">2023</a>
  <a href="#year-2022">2022</a>
  <a href="#year-2021">2021</a>
  <a href="#year-2020">2020</a>
  <a href="#year-2017">2017</a>
</div>

<div class="timeline-wrapper">

  <!-- 年份标签 -->
  <div id="year-2025" class="year-marker" data-year="2025" data-aos="fade-up"></div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">Oct–Dec</div>
    <div class="content-box create">
      <h3>🧠 Built my first real AI system.</h3>
      <p>Wrapped up <strong>INVESTelligence</strong>, an AI-powered news agent filtering financial noise for new investors. Hours of prompt tweaking, data wrangling, and pipeline debugging — and I loved it.</p>
    </div>
  </div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">Aug</div>
    <div class="content-box study">
      <h3>🎓 Started my dual master's journey @ University of Southern California</h3>
      <p>My life in the 3rd continent! Nervous but excited.</p>
    </div>
  </div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">July</div>
    <div class="content-box create">
      <h3>🏆 National 1st Prize · PR Planning Contest</h3>
      <p>Led strategy, research, and storytelling for our team. Learned that empathy is just as important as analytics.</p>
    </div>
  </div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">June</div>
    <div class="content-box create">
      <h3>📺 Public Opinion Analysis · YouTube, China, and Soft Power</h3>
      <p>Used <strong>Python</strong> to analyze foreign tourists' vlogs under the visa-free policy. Dissected narratives frame by frame — data + discourse = 💥</p>
    </div>
  </div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">June</div>
    <div class="content-box create">
      <h3>📊 Social Network Analysis of HIV Conversations</h3>
      <p>Used <strong>R</strong> to explore how health information flows on Twitter. Messy graphs, but meaningful patterns.</p>
    </div>
  </div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">Feb–May</div>
    <div class="content-box work">
      <h3>💼 Microsoft APRD Internship</h3>
      <p>Worked with researchers on product insights across Asia. From managing the 50th-anniversary program(10,000+ participants) to optimizing team workflows — I learned how to bridge the gap between algorithms and executives.</p>
    </div>
  </div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">Jan</div>
    <div class="content-box create">
      <h3>🧠 AI Chatbots & Mental Health Study</h3>
      <p>Explored how chatbot self-disclosure shapes users' emotional responses. A human-AI intimacy experiment.</p>
    </div>
  </div>

  <!-- 年份标签 -->
  <div id="year-2024" class="year-marker" data-year="2024" data-aos="fade-up"></div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">Dec</div>
    <div class="content-box create">
      <h3>📉 Lululemon vs. Decathlon: A Digital Marketing Analysis</h3>
      <p>Compared two sportswear brands' media strategy in China, especially their <strong>community marketing focus</strong>.</p>
    </div>
  </div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">Aug</div>
    <div class="content-box study">
      <h3>🎓 Started my dual master's journey @ Tsinghua</h3>
      <p>A leap into Communication & Data Science. Also took some business classes. Joined the Internet Product Association. A new world for me.</p>
    </div>
  </div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">June</div>
    <div class="content-box study">
      <h3>🎓 Graduated from Renmin University of China</h3>
      <p>Majored in Communication. Minor in doing ten things at once.</p>
      <p>Took a lot of Sociology classes, flirted with the idea of a double major — but classical theory and I didn't quite get along. <em>Maybe I prefer analyzing systems over memorizing dead philosophers</em>.</p>
    </div>
  </div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">June</div>
    <div class="content-box create">
      <h3>📱 Fanzone: My First Product Design Project</h3>
      <p>Prototype of a WeChat mini-program designed for fan event organization.</p>
      <p>Conducted 67 surveys + 6 interviews, competitor analysis, and UX/UI prototyping.</p>
    </div>
  </div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">Jan–Apr</div>
    <div class="content-box work">
      <h3>🥛 My first "real" internship — Nestlé Dairy I&R</h3>
      <p>Ran consumer research, planned offline campaigns, and hosted weekly meetings with more milk talk than you can imagine.</p>
      <p>Discovered that understanding people sometimes starts with <em>how they describe milk</em>.</p>
    </div>
  </div>

  <!-- 年份标签 -->
  <div id="year-2023" class="year-marker" data-year="2023" data-aos="fade-up"></div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">Jan–May</div>
    <div class="content-box study">
      <h3>🌍 Exchange @ Sciences Po Paris</h3>
      <p>Got lost in 10+ countries.</p>
      <p>Proudly Finished my Photo Journalism project of French Pension Strike.</p>
      <p>Learned a bit French.</p>
      <p>Switched my focus to <strong>intercultural communication</strong>.</p>
    </div>
  </div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">Jan</div>
    <div class="content-box create">
      <h3>📰 Published my last feature for the school newspaper</h3>
      <p>It was a story I was proud of — and the moment I knew <em>I didn't want to be a journalist anymore</em>.</p>
      <p>I had told enough stories for others — now I wanted to explore new ways of telling my own, through data, design, and code.</p>
    </div>
  </div>

  <!-- 年份标签 -->
  <div id="year-2022" class="year-marker" data-year="2022" data-aos="fade-up"></div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">Nov</div>
    <div class="content-box create">
      <h3>🏅 National 1st Prize · New Media Creativity Competition</h3>
      <p><strong>H5 Project</strong> <em>"Her Time, Written on This Map"</em> created an <strong>interactive H5 story</strong> about educator Zhang Guimei, blending digital storytelling with user-centered design.</p>
    </div>
  </div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">Sept</div>
    <div class="content-box create">
      <h3>📈 National 1st Prize · China's Data Journalism Contest</h3>
      <p>Investigated the 2022 Sichuan—Chongqing heatwave using <strong>official and self-collected datasets</strong> and scientific studies.</p>
      <p>Built an <strong>interactive web feature</strong> to highlight social inequality under extreme heat.</p>
    </div>
  </div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">June</div>
    <div class="content-box create">
      <h3>📝 Feature Article: "At the night of USC, stars and I are enjoying the real freedom."</h3>
      <p>During COVID lockdown, the campus lawn became our only "social hub." We captured it all with on-the-spot sketches and vignettes. <strong>68k views in one night</strong>, and maybe a few tears.</p>
    </div>
  </div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">Feb–May</div>
    <div class="content-box create">
      <h3>💻 First encounter with Python & R</h3>
      <p><em>Didn't know it'd change my life</em>. Finished some basic reports. Still have my first spaghetti-code script somewhere.</p>
    </div>
  </div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">Jan–Apr</div>
    <div class="content-box life">
      <h3>🎿 Volunteer @ Beijing 2022 Winter Olympics</h3>
      <p>Worked at Main Media Center, first as Information Assistant, then at Conference Booking Office. Helped international guests(mostly famous journalists) navigate chaos with smiles.</p>
    </div>
  </div>

  <!-- 年份标签 -->
  <div id="year-2021" class="year-marker" data-year="2021" data-aos="fade-up"></div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">2021–2022</div>
    <div class="content-box create">
      <h3>📢 Tried the self-media life</h3>
      <p>Ran a personal Bilibili channel and personal WeChat blog.</p>
      <p><strong>Wrote a viral post, made a hit video(both more than 10k read)</strong> — and then stopped updating because I realized I don't enjoy putting my life on display.</p>
      <p>Turns out, I like telling stories. Just not <em>my own</em>.</p>
    </div>
  </div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">Sept</div>
    <div class="content-box life">
      <h3>💃 Joined the School Official Latin Dance Team</h3>
      <p>Came back to dance after 8 years… Turns out, adult limbs don't follow commands as well as teenage ones. Took weeks of awkward spins, sore calves, and identity crises — but hey, <em>muscle memory is real</em>(eventually). I am still making progress in 2026.</p>
    </div>
  </div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">Aug</div>
    <div class="content-box work">
      <h3>🎬 Took charge as Head of Publicity, Outdoor Sports Association</h3>
      <p>Kicked off with a bang — the recruitment video I directed <strong>hit 40k views and made waves in Beijing's outdoor scene</strong>. Over the year, grew our Douyin and Video Channel to <strong>3k+ followers</strong>. Not bad for a team that prefers cliffs over captions.</p>
    </div>
  </div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">Jun–Jul</div>
    <div class="content-box life">
      <h3>⛰️ Trekking & Field Research in Tibet for half a month</h3>
      <p>Interviewed nomads and local people. Slept under glaciers. Wrote pages I'll never publish.</p>
    </div>
  </div>

  <!-- 年份标签 -->
  <div id="year-2020" class="year-marker" data-year="2020" data-aos="fade-up"></div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">Nov</div>
    <div class="content-box create">
      <h3>📰 Published my first feature story on the Newspaper of RUC</h3>
      <p>Wrote about independent bands thriving on campus culture — and even got to interview one with tens of thousands of fans, born from a dorm room.</p>
      <p>That was the moment I thought: <em>I want to be a journalist.</em></p>
    </div>
  </div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">Oct–Dec</div>
    <div class="content-box life">
      <h3>🥾 Dedicated to outdoor sports</h3>
      <p>Hiked almost every weekend in Beijing (yes, there are so many ideal mountains!). Also repped my university in marathons and trail races… until I realized I <em>hate</em> running.</p>
    </div>
  </div>

  <div class="timeline-item right" data-aos="fade-up">
    <div class="timeline-date">Sept</div>
    <div class="content-box study">
      <h3>🎓 Started undergrad @ Renmin University of China</h3>
      <p>Majored in Journalism and Law. Thought I'd be some big girl to change the world with a lot of idealism.</p>
    </div>
  </div>

  <!-- 年份标签 -->
  <div id="year-2017" class="year-marker" data-year="2017" data-aos="fade-up"></div>

  <div class="timeline-item left" data-aos="fade-up">
    <div class="timeline-date">Sept</div>
    <div class="content-box study">
      <h3>📚 Started high school @ Zhengzhou Foreign Language School</h3>
      <p>Came from probably China's most competitive — and under-resourced — Gaokao province. Led the class, joined the Leadership Club, and went abroad for the first time on a school-organized study tour to Italy. I made it out.</p>
    </div>
  </div>

</div>

<script>
  setTimeout(function() {
    AOS.init({
      duration: 600,
      easing: 'ease-out',
      once: true,
      offset: 50
    });
  }, 200);
</script>