import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });
  const [scrollWidth, setScrollWidth] = useState('0%');

  // تشغيل وتحديث الأنيميشن عند فتح الموقع أو تغيير اللغة
  useEffect(() => {
    AOS.init({ 
      duration: 1000, 
      once: true, 
      easing: 'ease-out-cubic' 
    });
    AOS.refresh(); // إجبار الـ React على تفعيل الأنيميشن فوراً
    
    const handleScroll = () => {
      const winPos = document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollWidth(`${(winPos / docHeight) * 100}%`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // تحديث الـ AOS لما اللغة تتغير عشان العناصر تترسم صح
  useEffect(() => {
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, [lang]);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
  };

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
    localStorage.setItem('lang', nextLang);
  };

  const t = {
    en: {
      core: "Core", arsenal: "Arsenal", comms: "Comms", projects: "Projects",
      heroTitle: "Architecting <br>The <span class='_amr_gradient_text'>Full-Stack</span> Flow.",
      heroSub: "I am Amr Othman. An Elite Full-Stack Engineer mastering enterprise web applications, robust Node.js architectures, and elegant user interfaces.",
      cvBtn: "DOWNLOAD RESUME (CV)",
      techTitle: "01 // TECHNICAL_ARSENAL",
      commsTitle: "02 // INITIALIZE_COMMUNICATIONS",
      fsTitle: "03 // PRODUCTION_FULL_STACK_APPS",
      feTitle: "04 // BRANDING_FRONTEND_LAYERS",
      beTitle: "05 // CORE_BACKEND_ENGINES",
      mktTitle: "Want to transform your professional identity into a premier digital statement?",
      mktSub: "We engineer bespoke, high-end portfolios for elite professionals with advanced design layouts tailored to attract premium business clients.",
      mktBtn: "Connect with Eng. Amr Othman: 01009694831"
    },
    ar: {
      core: "الرئيسية", arsenal: "التقنيات", comms: "التواصل", projects: "المشاريع",
      heroTitle: "بناء وتطوير <br>الأنظمة <span class='_amr_gradient_text'>من البداية للنهاية</span>",
      heroSub: "أنا عمرو عثمان. مهندس برمجيات فول ستاك متميز، خبير في هندسة تطبيقات الويب، معمارية أنظمة الباك إند القوية، وتطوير الواجهات الاحترافية السلسة.",
      cvBtn: "تحميل السيرة الذاتية (CV)",
      techTitle: "01 // الأسلحة_التقنية",
      commsTitle: "02 // قنوات_الاتصال_المباشر",
      fsTitle: "03 // تطبيقات_الفول_ستاك",
      feTitle: "04 // واجهات_الفرونت_إند",
      beTitle: "05 // محركات_الباك_إند",
      mktTitle: "هل ترغب في تحويل هويتك المهنية إلى واجهة رقمية مشرفة؟",
      mktSub: "نصمم لأصحاب النخبة والمهن الرفيعة بروتفوليو احترافي بلمسة هندسية متفردة تجذب لك أرقى العملاء.",
      mktBtn: "تواصل مع المهندس عمرو عثمان: 01009694831"
    }
  };

  return (
    <div className={`_amr_app_engine ${!isDark ? 'light-theme' : ''} ${lang === 'ar' ? 'rtl-lang' : ''}`}>
      <div className="_amr_grid_overlay"></div>
      <div id="_othman_scroll_pulse" style={{ width: scrollWidth }}></div>

      {/* NAVBAR */}
      <header className="_amr_header_sys">
        <div className="_amr_nav_container">
          <a href="#" className="_amr_brand_core">AMR.<span>OTHMAN</span></a>
          <nav className="_amr_nav_matrix">
            <a href="#home">{t[lang].core}</a>
            <a href="#_amr_skills">{t[lang].arsenal}</a>
            <a href="#_amr_comms">{t[lang].comms}</a>
            <a href="#_amr_fullstack">{t[lang].projects}</a>
          </nav>
          <div className="_amr_sys_controls">
            {/* زر الدارك واللايت مود رجع مكانه هنا */}
            <button onClick={toggleTheme} className="_amr_ctrl_btn" title="Toggle Mode">
              <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button onClick={toggleLang} className="_amr_ctrl_btn">
              <i className="fa-solid fa-language"></i> <span>{lang === 'en' ? 'AR' : 'EN'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO ZONE */}
      <section className="_amr_hero_zone" id="home">
        <div className="_amr_hero_split_container">
          <div className="_amr_hero_text_side" data-aos="fade-right">
            <div className="_amr_sys_badge">
              <span className="_amr_live_dot"></span>
              <span>CLUSTER: ONLINE // READY TO SCALE</span>
            </div>
            <h1 className="_amr_hero_title" dangerouslySetInnerHTML={{ __html: t[lang].heroTitle }}></h1>
            <p className="_amr_hero_sub">{t[lang].heroSub}</p>
            <div className="_amr_action_hub">
              <a href="CV.pdf" target="_blank" className="_amr_btn_prime_gold">
                <i className="fa-solid fa-file-pdf"></i> {t[lang].cvBtn}
              </a>
            </div>
          </div>
          <div className="_amr_hero_image_side" data-aos="fade-left">
            <div className="_amr_image_frame_wrapper">
              <div className="_amr_glow_backdrop"></div>
              <img src="profile.jpg" alt="Amr Othman" className="_amr_core_avatar" />
              <div className="_amr_image_overlay_shade"></div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL ARSENAL */}
      <section className="_amr_section_block" id="_amr_skills">
        <div className="_amr_bound_box">
          <div className="_amr_section_header_flex">
            <h2 className="_amr_section_head">{t[lang].techTitle}</h2>
          </div>
          <div className="_amr_skills_grid" data-aos="fade-up">
            {[{icon: "fa-react", color: "#61dafb", text: "React.js & Next.js"},
              {icon: "fa-node-js", color: "#339933", text: "Node.js & Express"},
              {icon: "fa-cubes", color: "#e0234e", text: "NestJS Framework", isFontAwesome: true},
              {icon: "fa-code", color: "#3178c6", text: "TypeScript Architecture", isFontAwesome: true},
              {icon: "fa-js", color: "#f7df1e", text: "JavaScript (ES6+)"},
              {icon: "fa-java", color: "#f89820", text: "Java Enterprise"},
              {icon: "fa-python", color: "#3776ab", text: "Python Engine"},
              {icon: "fa-database", color: "#47a248", text: "MongoDB & Mongoose", isFontAwesome: true},
              {icon: "fa-aws", color: "#ff9900", text: "AWS Cloud Operations"},
              {icon: "fa-docker", color: "#2496ed", text: "Docker & Microservices"},
              {icon: "fa-key", color: "#a29bfe", text: "JWT Zero-Trust Security", isFontAwesome: true},
              {icon: "fa-diagram-project", color: "#fd79a8", text: "Data Structures & OOP", isFontAwesome: true}
            ].map((skill, index) => (
              <div className="_amr_skill_item" key={index}>
                <i className={`${skill.isFontAwesome ? 'fa-solid' : 'fa-brands'} ${skill.icon} _amr_skill_icon`} style={{ color: skill.color }}></i>
                <h3>{skill.text}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNICATIONS */}
      <section className="_amr_section_block _amr_comms_bg" id="_amr_comms">
        <div className="_amr_bound_box">
          <div className="_amr_section_header_flex">
            <h2 className="_amr_section_head">{t[lang].commsTitle}</h2>
          </div>
          <div className="_amr_comms_grid" data-aos="zoom-in">
            <a href="https://wa.me/201009694831" target="_blank" rel="noreferrer" className="_amr_comm_card">
              <i className="fa-brands fa-whatsapp"></i>
              <h3>WhatsApp</h3>
              <p>+20 100 969 4831</p>
            </a>
            <a href="mailto:amrothman154@gmail.com" className="_amr_comm_card">
              <i className="fa-solid fa-envelope"></i>
              <h3>Secure Email</h3>
              <p>amrothman154@gmail.com</p>
            </a>
            <a href="https://linkedin.com/in/x-amr-othman-x1" target="_blank" rel="noreferrer" className="_amr_comm_card">
              <i className="fa-brands fa-linkedin-in"></i>
              <h3>LinkedIn</h3>
              <p>in/x-amr-othman-x1</p>
            </a>
            <a href="https://github.com/0xAmr5" target="_blank" rel="noreferrer" className="_amr_comm_card">
              <i className="fa-brands fa-github"></i>
              <h3>GitHub Matrix</h3>
              <p>github.com/0xAmr5</p>
            </a>
          </div>
        </div>
      </section>

      {/* 03 // PRODUCTION_FULL_STACK_APPS */}
      <section className="_amr_section_block" id="_amr_fullstack">
        <div className="_amr_bound_box">
          <div className="_amr_section_header_flex">
            <h2 className="_amr_section_head">{t[lang].fsTitle}</h2>
          </div>
          <div className="_amr_projects_matrix">
            <div className="_othman_project_node" data-aos="fade-up">
              <a href="https://habit-flow-ivory.vercel.app/" target="_blank" rel="noreferrer" className="_amr_img_clickable_link">
                <div className="_amr_node_img_container">
                  <img src="1.png" alt="Habit Flow" className="_amr_project_screen_img" />
                </div>
              </a>
              <div className="_amr_node_badge_row">
                <span className="_amr_badge_cyan">FULL-STACK APP</span>
                <a href="https://habit-flow-ivory.vercel.app/" target="_blank" rel="noreferrer" className="_amr_link_icon"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
              </div>
              <h3>Habit Flow</h3>
              <p>{lang === 'en' ? 'Premium productivity ecosystem engineered for seamless daily routines logging.' : 'تطبيق إنتاجية متميز تم تطويره لتتبع العادات والروتين اليومي بسلاسة تامة.'}</p>
            </div>
            <div className="_othman_project_node" data-aos="fade-up" data-aos-delay="100">
              <a href="https://devfinder-pro-tan.vercel.app/" target="_blank" rel="noreferrer" className="_amr_img_clickable_link">
                <div className="_amr_node_img_container">
                  <img src="2.png" alt="DevFinder Pro" className="_amr_project_screen_img" />
                </div>
              </a>
              <div className="_amr_node_badge_row">
                <span className="_amr_badge_cyan">FULL-STACK APP</span>
                <a href="https://devfinder-pro-tan.vercel.app/" target="_blank" rel="noreferrer" className="_amr_link_icon"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
              </div>
              <h3>DevFinder Pro</h3>
              <p>{lang === 'en' ? 'Advanced developer profile discoverability platform featuring lightning-fast data filtering.' : 'منصة متقدمة للبحث عن المطورين واستعراض ملفاتهم، تتميز بخوارزميات تصفية بيانات سريعة للغاية.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 // BRANDING_FRONTEND_LAYERS */}
      <section className="_amr_section_block" id="_amr_frontend">
        <div className="_amr_bound_box">
          <div className="_amr_section_header_flex">
            <h2 className="_amr_section_head">{t[lang].feTitle}</h2>
          </div>
          <div className="_amr_projects_matrix">
            {[
              { src: "3.png", title: "M. Shaban Legal Suite", url: "https://mahmoud-shaban-legal.vercel.app/" },
              { src: "4.png", title: "A. Ahmed Law Platform", url: "https://abdulhamid-ahmed-lawyer.vercel.app/" },
              { src: "5.png", title: "Fattouh Legal Matrix", url: "https://fattouh-abdelhamid.vercel.app/" },
              { src: "6.png", title: "M. Saeed Legal Portal", url: "https://mohamedsaeedlawyer.vercel.app/" }
            ].map((proj, i) => (
              <div className="_othman_project_node" data-aos="fade-up" data-aos-delay={i * 100} key={i}>
                <a href={proj.url} target="_blank" rel="noreferrer" className="_amr_img_clickable_link">
                  <div className="_amr_node_img_container">
                    <img src={proj.src} alt={proj.title} className="_amr_project_screen_img" />
                  </div>
                </a>
                <div className="_amr_node_badge_row">
                  <span className="_amr_badge_gold">FRONTEND PORTAL</span>
                  <a href={proj.url} target="_blank" rel="noreferrer" className="_amr_link_icon"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                </div>
                <h3>{proj.title}</h3>
                <p>{lang === 'en' ? 'Comprehensive elite web management portal designed with absolute pixel precision.' : 'منصة ويب متكاملة مصممة بأعلى درجات الدقة الهندسية لإدارة الأعمال والهوية الرقمية.'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BACKEND SYSTEMS */}
      <section className="_amr_section_block" id="_amr_backend">
        <div className="_amr_bound_box">
          <div className="_amr_section_header_flex">
            <h2 className="_amr_section_head">{t[lang].beTitle}</h2>
          </div>
          <div className="_amr_projects_matrix">
            <div className="_othman_project_node" data-aos="fade-up">
              <div className="_amr_node_img_container"><div className="_amr_img_placeholder"><i className="fa-solid fa-shield-halved"></i></div></div>
              <div className="_amr_node_badge_row">
                <span className="_amr_badge_black">BACKEND SYSTEM</span>
                <a href="https://github.com/0xAmr5" target="_blank" rel="noreferrer" className="_amr_link_icon"><i className="fa-brands fa-github"></i></a>
              </div>
              <h3>Saraha Security Engine</h3>
              <p>{lang === 'en' ? 'Zero-trust anonymous messaging platform featuring JWT authentication and MongoDB Atlas.' : 'منصة رسائل مجهولة آمنة تماماً، تعتمد على التوثيق المعتمد على JWT، وتخزين سحابي.'}</p>
            </div>
            <div className="_othman_project_node" data-aos="fade-up" data-aos-delay="100">
              <div className="_amr_node_img_container"><div className="_amr_img_placeholder"><i className="fa-solid fa-users"></i></div></div>
              <div className="_amr_node_badge_row">
                <span className="_amr_badge_black">BACKEND SYSTEM</span>
                <a href="https://github.com/0xAmr5" target="_blank" rel="noreferrer" className="_amr_link_icon"><i className="fa-brands fa-github"></i></a>
              </div>
              <h3>Social App Core</h3>
              <p>{lang === 'en' ? 'Scalable network backend utilizing complex Mongoose schemas.' : 'باك إند شبكة اجتماعية قابل للتوسع يستخدم مخططات Mongoose المعقدة لدعم منشورات المستخدمين.'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING */}
      <section className="_amr_marketing_block" data-aos="zoom-in">
        <div className="_amr_marketing_box">
          <h2>{t[lang].mktTitle}</h2>
          <p>{t[lang].mktSub}</p>
          <a href="https://wa.me/201009694831" target="_blank" rel="noreferrer" className="_amr_mkt_btn">
            <i className="fa-brands fa-whatsapp"></i> <span>{t[lang].mktBtn}</span>
          </a>
        </div>
      </section>

      <footer className="_amr_footer_sys">
        <p className="_amr_footer_copy">© 2026 AMR OTHMAN // ROOT ACCESS GRANTED.</p>
      </footer>
    </div>
  );
}

export default App;