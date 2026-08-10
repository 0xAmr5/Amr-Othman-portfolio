import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

function App() {
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Live Testimonials from Firebase
  const [testimonials, setTestimonials] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newReview, setNewReview] = useState({ author: '', role: '', quote: '', stars: 5 });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isAddingReview, setIsAddingReview] = useState(false);

  // Real-time Firebase Listener for Reviews
  useEffect(() => {
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedReviews = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestimonials(fetchedReviews);
        setLoadingReviews(false);
      }, (error) => {
        console.error("Firestore Listen Error:", error);
        setLoadingReviews(false);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase setup error", e);
      setLoadingReviews(false);
    }
  }, []);

  // Dynamic Typewriter Effect
  const titles = ["Full-Stack Engineer", "React.js Specialist", "Node.js Architecture", "SaaS Developer"];
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Scroll Events
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalHeight) * 100);
      setShowScrollTop(currentScroll > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter Loop Logic
  useEffect(() => {
    const currentTitle = titles[titleIndex];
    const speed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentTitle) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % titles.length);
      } else {
        setDisplayText(
          isDeleting
            ? currentTitle.substring(0, displayText.length - 1)
            : currentTitle.substring(0, displayText.length + 1)
        );
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex]);

  const copyEmail = () => {
    navigator.clipboard.writeText('amrothman154@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Save Review Directly to Firebase Cloud Firestore
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (newReview.author && newReview.quote) {
      setIsAddingReview(true);
      try {
        await addDoc(collection(db, "reviews"), {
          author: newReview.author,
          role: newReview.role || 'عميل معتمد',
          quote: newReview.quote,
          stars: Number(newReview.stars) || 5,
          createdAt: new Date()
        });
        setReviewSubmitted(true);
        setNewReview({ author: '', role: '', quote: '', stars: 5 });
        setTimeout(() => setReviewSubmitted(false), 4000);
      } catch (error) {
        console.error("Error saving review:", error);
        alert("حدث خطأ أثناء حفظ التقييم على السيرفر، يرجى المحاولة لاحقاً.");
      } finally {
        setIsAddingReview(false);
      }
    }
  };

  // Formspree Submission Logic
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/moeaelpn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormStatus(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus(false), 5000);
      } else {
        alert("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      alert("تعذر الاتصال بالسيرفر. يرجى التحقق من اتصال الإنترنت.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const guarantees = [
    { icon: "fa-shield-check", title: "كود نظيف وآمن 100%", desc: "اتباع أفضل الممارسات البرمجية ومعايير Clean Architecture وسرعة الأداء." },
    { icon: "fa-headset", title: "دعم وصيانة مجانية 30 يوماً", desc: "متابعة مستمرة للتطبيقات والمناصت بعد التسليم لمعالجة أي ملاحظات فوراً." },
    { icon: "fa-rocket", title: "سرعة تحميل ممتازة و SEO", desc: "تهيئة المواقع لتصدر نتائج البحث على Google واستجابة سريعة مع جميع الأجهزة." },
    { icon: "fa-lock", title: "تأمين وحماية البيانات", desc: "ربط القواعد بتوثيق JWT وإعدادات حماية سحابية يضمن سرية بياناتك وموكلينك." }
  ];

  const services = [
    {
      icon: "fa-laptop-code",
      title: "تطوير منصات SaaS & Web Apps",
      desc: "بناء تطبيقات ويب متكاملة من الصفر وتصميم واجهات مستخدم فائقة السرعة ومتجاوبة تماماً."
    },
    {
      icon: "fa-server",
      title: "معمارية الباك إند و REST APIs",
      desc: "إنشاء سيرفرات قوية بـ Node.js & NestJS وربط قواعد البيانات وتأمينها باستخدام JWT."
    },
    {
      icon: "fa-database",
      title: "إدارة قواعد البيانات السحابية",
      desc: "تصميم وتنظيم قواعد البيانات MongoDB & Firebase لضمان استرجاع البيانات ومعالجتها فورياً."
    },
    {
      icon: "fa-shield-halved",
      title: "تحسين الأداء والأمان (Optimization)",
      desc: "تأمين الثغرات، تسريع زمن تحميل الصفحات SEO، وترقية البورتفوليو الشخصي للشركات والأفراد."
    }
  ];

  const workSteps = [
    { num: "01", title: "دراسة الفكرة والتحليل", desc: "فهم متطلبات المشروع بدقة وتحديد أفضل المعماريات والتقنيات المناسبة." },
    { num: "02", title: "تصميم الواجهات UI/UX", desc: "بناء تجربة مستخدم سلسة وعصرية ومتجاوبة 100% مع كافة الشاشات والموبايل." },
    { num: "03", title: "البرمجة والربط السحابي", desc: "كتابة كود نظيف وتطوير محركات الباك إند وربط قواعد البيانات بأعلى كفاءة." },
    { num: "04", title: "الاختبار والإطلاق أونلاين", desc: "فحص الأداء والأمان والتأكد من سرعة الصفحة ثم رفع الموقع لايف على السيرفر." }
  ];

  const timeline = [
    { year: "2026 - الحالي", title: "Full-Stack Software Engineer", desc: "تطوير تطبيقات الويب السحابية والمنصات التفاعلية باستخدام React.js & Node.js." },
    { year: "2025 - 2026", title: "Frontend & UI Developer", desc: "بناء واجهات مستخدم معقدة وبوابات إلكترونية مخصصة لمكاتب المحاماة والدليل الطبي." },
    { year: "2024 - 2025", title: "JavaScript & Open Source Contributor", desc: "بناء مشاريع برمجية مفتوحة المصدر وتصميم أدوات الإنتاجية ولوحات التحكم." }
  ];

  const projects = [
    {
      id: 1,
      title: "دليل أطباء ديروط",
      tag: "FULL-STACK SAAS",
      desc: "منصة طبية سحابية شاملة للاستعلام عن الأطباء، العيادات، ومعامل التحاليل مع مزامنة لحظية مع قواعد البيانات.",
      url: "https://dairut-doctors-directory.vercel.app/",
      img: "dairut-doctors.png"
    },
    {
      id: 2,
      title: "منصة نور الإسلام",
      tag: "ISLAMIC ECOSYSTEM",
      desc: "تطبيق ويب إسلامي شامل وبدون إعلانات يضم القرآن الكريم نصاً وصوتاً، الأذكار، ومواقيت الصلاة.",
      url: "https://noor-alislam.vercel.app/",
      img: "noor-alislam.png"
    },
    {
      id: 3,
      title: "Habit Flow",
      tag: "PRODUCTIVITY APP",
      desc: "تطبيق متكامل لتتبع العادات والروتين اليومي وتحليل نسبة الإنتاجية بأسلوب تفاعلي وجذاب.",
      url: "https://habit-flow-ivory.vercel.app/",
      img: "1.png"
    },
    {
      id: 4,
      title: "DevFinder Pro",
      tag: "DEVELOPER TOOL",
      desc: "منصة متقدمة للبحث عن المطورين واستعراض ملفاتهم على GitHub بسرعة فائقة وخوارزميات فلترة ذكية.",
      url: "https://devfinder-pro-tan.vercel.app/",
      img: "2.png"
    },
    {
      id: 5,
      title: "منصة أ. محمود شعبان للمحاماة",
      tag: "LEGAL PORTAL",
      desc: "منصة قانونية تفاعلية تتضمن استعلام الموكلين برقم الدعوى وإدارة الجلسات ورفع المستندات.",
      url: "https://mahmoud-shaban-legal.vercel.app/",
      img: "3.png"
    },
    {
      id: 6,
      title: "منصة المستشار عبد الحميد أحمد",
      tag: "LEGAL PORTAL",
      desc: "واجهة رقمية فخمة للخدمات الاستشارية والقانونية مع دعم تحويل المود التفاعلي.",
      url: "https://abdulhamid-ahmed-lawyer.vercel.app/",
      img: "4.png"
    },
    {
      id: 7,
      title: "منصة فتوح عبد الحميد القانونية",
      tag: "LEGAL PORTAL",
      desc: "موقع ويب متكامل لإدارة الخدمات القانونية وصياغة العقود بتصميم هندسي متجاوب.",
      url: "https://fattouh-abdelhamid.vercel.app/",
      img: "5.png"
    },
    {
      id: 8,
      title: "بوابة أ. محمد سعيد المحامي",
      tag: "LEGAL PORTAL",
      desc: "منصة استشارات قانونية سريعة تمتاز بدقة التصميم واستجابتها مع جميع الشاشات.",
      url: "https://mohamedsaeedlawyer.vercel.app/",
      img: "6.png"
    }
  ];

  const skillCategories = [
    {
      title: "تطوير الواجهات (Frontend)",
      icon: "fa-code",
      skills: [
        { name: "React.js", icon: "fa-brands fa-react", color: "#61dafb" },
        { name: "Next.js", icon: "fa-solid fa-square-rss", color: "#000000" },
        { name: "JavaScript (ES6+)", icon: "fa-brands fa-js", color: "#f7df1e" },
        { name: "TypeScript", icon: "fa-solid fa-code", color: "#3178c6" },
        { name: "HTML5 / CSS3", icon: "fa-brands fa-html5", color: "#e34f26" },
        { name: "Tailwind CSS", icon: "fa-brands fa-css3-alt", color: "#38bdf8" }
      ]
    },
    {
      title: "الباك إند والسحابة (Backend & Cloud)",
      icon: "fa-server",
      skills: [
        { name: "Node.js", icon: "fa-brands fa-node-js", color: "#339933" },
        { name: "Express.js", icon: "fa-solid fa-cubes", color: "#000000" },
        { name: "NestJS", icon: "fa-solid fa-network-wired", color: "#e0234e" },
        { name: "RESTful APIs", icon: "fa-solid fa-gears", color: "#0d9488" },
        { name: "JWT Security", icon: "fa-solid fa-key", color: "#a29bfe" },
        { name: "Cloudinary", icon: "fa-solid fa-cloud-arrow-up", color: "#3448c5" }
      ]
    },
    {
      title: "قواعد البيانات (Databases)",
      icon: "fa-database",
      skills: [
        { name: "MongoDB & Mongoose", icon: "fa-solid fa-leaf", color: "#47a248" },
        { name: "Firebase / Firestore", icon: "fa-solid fa-fire", color: "#ffca28" },
        { name: "PostgreSQL", icon: "fa-solid fa-database", color: "#336791" }
      ]
    },
    {
      title: "أدوات ومفاهيم برمجية (Tools & Concepts)",
      icon: "fa-wrench",
      skills: [
        { name: "Git & GitHub", icon: "fa-brands fa-github", color: "#181717" },
        { name: "Vercel Deployment", icon: "fa-solid fa-globe", color: "#000000" },
        { name: "OOP & Clean Code", icon: "fa-solid fa-diagram-project", color: "#fd79a8" },
        { name: "Responsive UI/UX", icon: "fa-solid fa-mobile-screen-button", color: "#0d9488" }
      ]
    }
  ];

  const faqs = [
    {
      q: "ما هي المدة الزمنية المتوقعة لتنفيذ وتكلفة تطوير موقع ويب؟",
      a: "تعتمد المدة على حجم المشروع. المواقع التعريفية والبورتفوليو تستغرق عادة من 3 إلى 5 أيام، بينما المنصات الكاملة (SaaS & Full-Stack) تستغرق من أسبوع إلى أسبوعين."
    },
    {
      q: "هل يتم تسليم الكود المصدري وتقديم دعم فني بعد التسليم؟",
      a: "بالتأكيد! يتم تسليم الكود البرمجي كاملاً ونظيفاً على GitHub مع تقديم استضافة وصيانة مجانية لمتابعة الأداء بعد الإطلاق."
    },
    {
      q: "كيف يتم التواصل ومتابعة مراحل العمل؟",
      a: "يتم التواصل عبر الواتساب أو البريد الإلكتروني مع مشاركة رابط معاينة حي (Live Staging) لمتابعة التحديثات خطوة بخطوة."
    }
  ];

  return (
    <div className="app-container">
      {/* Top Scroll Indicator */}
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      {/* NAVBAR */}
      <header className="navbar-modern">
        <div className="nav-container">
          <div className="brand-logo">AMR.OTHMAN</div>

          <nav className="nav-links">
            <a href="#home">الرئيسية</a>
            <a href="#guarantees">الضمانات</a>
            <a href="#services">الخدمات</a>
            <a href="#process">خطوات العمل</a>
            <a href="#skills">المهارات</a>
            <a href="#projects">المشاريع</a>
            <a href="#reviews">الآراء والتقييمات</a>
            <a href="#contact">التواصل Direct</a>
          </nav>

          <div className="nav-actions">
            <a href="/CV.pdf" target="_blank" rel="noreferrer" className="btn-cv-nav">
              <i className="fa-solid fa-file-arrow-down"></i> تحميل CV
            </a>
            <button className="btn-copy-email" onClick={copyEmail}>
              <i className="fa-solid fa-copy"></i>
              {copied ? 'تم النسخ!' : 'نسخ الإيميل'}
            </button>

            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>الرئيسية</a>
          <a href="#guarantees" onClick={() => setMobileMenuOpen(false)}>الضمانات</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>الخدمات</a>
          <a href="#process" onClick={() => setMobileMenuOpen(false)}>خطوات العمل</a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)}>المهارات</a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)}>المشاريع</a>
          <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>الآراء والتقييمات</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>التواصل Direct</a>
        </div>
      </header>

      {/* HERO ZONE */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="badge-available">
            <span className="pulse-dot"></span>
            متاح لاستقبال المشاريع والتعاقدات البرمجية
          </div>

          <h1 className="hero-title">
            عمرو عثمان <br />
            <span className="gradient-text typewriter">{displayText}<span className="cursor">|</span></span>
          </h1>

          <p className="hero-subtitle">
            مهندس برمجيات متخصص في بناء واجهات المستخدم الحديثة وتطوير محركات السحابة والباك إند بـ React.js & Node.js بأعلى معدلات الكفاءة والسرعة.
          </p>
          
          <div className="hero-actions">
            <a href="https://wa.me/201009694831" target="_blank" rel="noreferrer" className="btn-primary-teal pulse-btn">
              <i className="fa-brands fa-whatsapp"></i> تواصل واتساب
            </a>
            <a href="/CV.pdf" target="_blank" rel="noreferrer" className="btn-cv-hero">
              <i className="fa-solid fa-file-pdf"></i> استعراض الـ CV
            </a>
            <a href="https://linkedin.com/in/x-amr-othman-x1" target="_blank" rel="noreferrer" className="btn-secondary-outline">
              <i className="fa-brands fa-linkedin"></i> LinkedIn
            </a>
          </div>
        </div>

        <div className="hero-avatar-wrapper">
          <div className="avatar-frame animate-float">
            <img src="profile.jpg" alt="عمرو عثمان" className="profile-img" />
          </div>
        </div>
      </section>

      {/* LIVE METRICS COUNTER */}
      <section className="metrics-banner">
        <div className="metrics-container">
          <div className="metric-box">
            <h3>+10</h3>
            <p>مشاريع حية أونلاين</p>
          </div>
          <div className="metric-box">
            <h3>100%</h3>
            <p>تجاوب ودقة مع الموبايل</p>
          </div>
          <div className="metric-box">
            <h3>REST / JWT</h3>
            <p>معايير الأمان المعتمدة</p>
          </div>
          <div className="metric-box">
            <h3>24/7</h3>
            <p>دعم واستجابة سريعة</p>
          </div>
        </div>
      </section>

      {/* NEW GUARANTEES & CONFIDENCE SECTION */}
      <section className="section-wrapper" id="guarantees">
        <div className="section-header">
          <h2 className="section-head-title">معايير وضمانات جودة التنفيذ</h2>
          <span className="section-badge">100% Quality Assurance</span>
        </div>
        <div className="guarantees-grid">
          {guarantees.map((g, idx) => (
            <div className="guarantee-card" key={idx}>
              <i className={`fa-solid ${g.icon} g-icon`}></i>
              <h3>{g.title}</h3>
              <p>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="section-wrapper" id="services">
        <div className="section-header">
          <h2 className="section-head-title">الخدمات والحلول البرمجية</h2>
          <span className="section-badge">Solutions Offered</span>
        </div>
        <div className="services-grid">
          {services.map((s, idx) => (
            <div className="service-card" key={idx}>
              <i className={`fa-solid ${s.icon} service-icon`}></i>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORK PROCESS SECTION */}
      <section className="section-wrapper" id="process">
        <div className="section-header">
          <h2 className="section-head-title">مراحل وخطوات تنفيذ العمل</h2>
          <span className="section-badge">Workflow Process</span>
        </div>
        <div className="process-grid">
          {workSteps.map((step, idx) => (
            <div className="process-card" key={idx}>
              <span className="step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section className="section-wrapper" id="skills">
        <div className="section-header">
          <h2 className="section-head-title">المهارات والتقنيات البرمجية</h2>
          <span className="section-badge">Technical Arsenal</span>
        </div>
        <div className="skills-grid">
          {skillCategories.map((cat, index) => (
            <div className="skill-cat-card" key={index}>
              <h3 className="cat-title">
                <i className={`fa-solid ${cat.icon}`}></i> {cat.title}
              </h3>
              <div className="skills-tags-wrapper">
                {cat.skills.map((skill, sIndex) => (
                  <div className="skill-item-tag" key={sIndex}>
                    <i className={skill.icon} style={{ color: skill.color }}></i>
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="section-wrapper" id="projects">
        <div className="section-header">
          <h2 className="section-head-title">معرض الأعمال والمشاريع</h2>
          <span className="section-badge">+8 تطبيقات لايف</span>
        </div>
        <div className="cards-grid">
          {projects.map((proj) => (
            <div className="saas-card" key={proj.id}>
              <div className="card-img-wrapper">
                <img src={proj.img} alt={proj.title} loading="lazy" />
                <div className="card-img-overlay">
                  <a href={proj.url} target="_blank" rel="noreferrer" className="overlay-btn">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> فتح المعاينة
                  </a>
                </div>
              </div>
              <span className="card-tag">{proj.tag}</span>
              <h3 className="card-title">{proj.title}</h3>
              <p className="card-desc">{proj.desc}</p>
              <a href={proj.url} target="_blank" rel="noreferrer" className="card-link">
                معاينة المنصة <i className="fa-solid fa-arrow-left"></i>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="section-wrapper" id="timeline">
        <div className="section-header">
          <h2 className="section-head-title">محطات ومسار الخبرة البرمجية</h2>
          <span className="section-badge">Experience Roadmap</span>
        </div>
        <div className="timeline-container">
          {timeline.map((item, idx) => (
            <div className="timeline-item" key={idx}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-year">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE FIREBASE REVIEWS & FEEDBACK SECTION */}
      <section className="section-wrapper" id="reviews">
        <div className="section-header">
          <h2 className="section-head-title">ثقة العملاء والتقييمات الحية</h2>
          <span className="section-badge">Live Reviews ({testimonials.length})</span>
        </div>

        {/* Form To Add New Review */}
        <div className="add-review-box">
          <h3><i className="fa-solid fa-star-half-stroke"></i> أضف رأيك أو تقييمك للخدمة</h3>
          {reviewSubmitted && (
            <div className="toast-success">
              <i className="fa-solid fa-circle-check"></i> شكر لك! تم نشر تقييمك سحابياً وبات ظاهراً في لوحة الآراء الحية للجميع.
            </div>
          )}
          <form onSubmit={handleAddReview} className="review-form-grid">
            <div className="form-group">
              <label>الاسم أو الجهة</label>
              <input 
                type="text" 
                placeholder="مثال: د. أحمد علي / شركة X" 
                value={newReview.author} 
                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })} 
                required 
              />
            </div>

            <div className="form-group">
              <label>المسمى الوظيفي / الخدمة</label>
              <input 
                type="text" 
                placeholder="مثال: عميل تطوير بورتفوليو / محامٍ" 
                value={newReview.role} 
                onChange={(e) => setNewReview({ ...newReview, role: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label>التقييم بالنجوم</label>
              <select 
                value={newReview.stars} 
                onChange={(e) => setNewReview({ ...newReview, stars: Number(e.target.value) })}
                className="stars-select"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5/5 ممتاز جداً)</option>
                <option value="4">⭐⭐⭐⭐ (4/5 جيد جداً)</option>
                <option value="3">⭐⭐⭐ (3/5 جيد)</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>رأيك أو انطباعك عن الخدمة والتنفيذ</label>
              <textarea 
                rows="3" 
                placeholder="اكتب تقييمك أو تجربتك في التعامل هنا..." 
                value={newReview.quote} 
                onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })} 
                required 
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-teal btn-submit-review" disabled={isAddingReview}>
              <i className="fa-solid fa-paper-plane"></i> {isAddingReview ? 'جاري الحفظ سحابياً...' : 'نشر التقييم للجميع فوراً'}
            </button>
          </form>
        </div>

        {/* Display Reviews directly from Firebase */}
        <div className="testimonials-grid">
          {loadingReviews ? (
            <p style={{ color: '#64748b', textAlign: 'center', gridColumn: 'span 2' }}>جاري سحب التقييمات الحية من السيرفر...</p>
          ) : testimonials.length === 0 ? (
            <p style={{ color: '#64748b', textAlign: 'center', gridColumn: 'span 2' }}>لا توجد تقييمات حتى الآن. كن أول من يضيف رأيه!</p>
          ) : (
            testimonials.map((t) => (
              <div className="testimonial-card" key={t.id || Math.random()}>
                <div className="stars-row">
                  {[...Array(t.stars || 5)].map((_, i) => (
                    <i className="fa-solid fa-star" key={i}></i>
                  ))}
                </div>
                <p className="quote-text">"{t.quote}"</p>
                <div className="author-info">
                  <h4>{t.author}</h4>
                  <span>{t.role || 'عميل معتمد'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="section-wrapper" id="faq">
        <div className="section-header">
          <h2 className="section-head-title">الأسئلة الشائعة (FAQ)</h2>
        </div>
        <div className="faq-container">
          {faqs.map((faq, idx) => (
            <div className={`faq-item ${openFaq === idx ? 'active' : ''}`} key={idx} onClick={() => toggleFaq(idx)}>
              <div className="faq-question">
                <h3>{faq.q}</h3>
                <i className={`fa-solid ${openFaq === idx ? 'fa-minus' : 'fa-plus'}`}></i>
              </div>
              {openFaq === idx && <p className="faq-answer">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE CONTACT FORM SECTION WITH FORMSPREE */}
      <section className="section-wrapper" id="contact">
        <div className="section-header">
          <h2 className="section-head-title">إرسال رسالة مباشرة أو طلب مشروع</h2>
          <span className="section-badge">Get In Touch</span>
        </div>

        <div className="contact-section-grid">
          {/* Quick Direct Links */}
          <div className="contact-grid">
            <a href="https://wa.me/201009694831" target="_blank" rel="noreferrer" className="contact-card whatsapp">
              <i className="fa-brands fa-whatsapp"></i>
              <div>
                <h3>WhatsApp</h3>
                <p>+20 100 969 4831</p>
              </div>
            </a>

            <a href="mailto:amrothman154@gmail.com" className="contact-card email">
              <i className="fa-solid fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <p>amrothman154@gmail.com</p>
              </div>
            </a>

            <a href="https://linkedin.com/in/x-amr-othman-x1" target="_blank" rel="noreferrer" className="contact-card linkedin">
              <i className="fa-brands fa-linkedin-in"></i>
              <div>
                <h3>LinkedIn</h3>
                <p>in/x-amr-othman-x1</p>
              </div>
            </a>

            <a href="https://github.com/0xAmr5" target="_blank" rel="noreferrer" className="contact-card github">
              <i className="fa-brands fa-github"></i>
              <div>
                <h3>GitHub</h3>
                <p>github.com/0xAmr5</p>
              </div>
            </a>
          </div>

          {/* Contact Form with Formspree Endpoint */}
          <form className="contact-form-box" onSubmit={handleFormSubmit}>
            {formStatus && (
              <div className="toast-success">
                <i className="fa-solid fa-circle-check"></i> تم إرسال رسالتك بنجاح وسوف تصل لحساب البريد الخاص بك!
              </div>
            )}
            <div className="form-group">
              <label>الاسم الكامل</label>
              <input 
                type="text" 
                name="name"
                placeholder="أدخل اسمك الكريم" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input 
                type="email" 
                name="email"
                placeholder="example@domain.com" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>تفاصيل المشروع أو الرسالة</label>
              <textarea 
                name="message"
                rows="4" 
                placeholder="اكتب فكرة مشروعك أو استفسارك هنا..." 
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})} 
                required 
              ></textarea>
            </div>
            <button type="submit" className="btn-primary-teal btn-submit" disabled={isSubmitting}>
              <i className="fa-solid fa-paper-plane"></i> {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة فوراً'}
            </button>
          </form>
        </div>
      </section>

      {/* BACK TO TOP FLOATING BUTTON */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Return to top">
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}

      {/* FOOTER */}
      <footer className="footer-modern">
        <p>© 2026 ENG. AMR OTHMAN // ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

export default App;