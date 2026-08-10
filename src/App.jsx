import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

function App() {
  const [lang, setLang] = useState('en'); 
  const [theme, setTheme] = useState('dark'); 
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [theme, lang]);

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

  const titlesEn = ["Full-Stack Engineer", "React.js Specialist", "Node.js Architecture", "SaaS Developer"];
  const titlesAr = ["مهندس برمجيات فول ستاك", "متخصص React.js", "معمارية Node.js", "مطور منصات SaaS"];
  const titles = lang === 'en' ? titlesEn : titlesAr;

  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    const currentTitle = titles[titleIndex] || titles[0];
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
  }, [displayText, isDeleting, titleIndex, titles]);

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

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (newReview.author && newReview.quote) {
      setIsAddingReview(true);
      try {
        await addDoc(collection(db, "reviews"), {
          author: newReview.author,
          role: newReview.role || (lang === 'en' ? 'Verified Client' : 'عميل معتمد'),
          quote: newReview.quote,
          stars: Number(newReview.stars) || 5,
          createdAt: new Date()
        });
        setReviewSubmitted(true);
        setNewReview({ author: '', role: '', quote: '', stars: 5 });
        setTimeout(() => setReviewSubmitted(false), 4000);
      } catch (error) {
        console.error("Error saving review:", error);
        alert(lang === 'en' ? "Error saving review. Please try again." : "حدث خطأ أثناء حفظ التقييم.");
      } finally {
        setIsAddingReview(false);
      }
    }
  };

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
        alert(lang === 'en' ? "Error sending message. Try again." : "حدث خطأ أثناء الإرسال، حاول مجدداً.");
      }
    } catch (error) {
      alert(lang === 'en' ? "Connection error. Check internet." : "تعذر الاتصال بالسيرفر.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = {
    home: lang === 'en' ? 'Home' : 'الرئيسية',
    guarantees: lang === 'en' ? 'Guarantees' : 'الضمانات',
    services: lang === 'en' ? 'Services' : 'الخدمات',
    process: lang === 'en' ? 'Workflow' : 'خطوات العمل',
    skills: lang === 'en' ? 'Skills' : 'المهارات',
    projects: lang === 'en' ? 'Projects' : 'المشاريع',
    reviews: lang === 'en' ? 'Reviews' : 'التقييمات',
    contact: lang === 'en' ? 'Contact' : 'التواصل',
    downloadCv: lang === 'en' ? 'CV Download' : 'تحميل CV',
    copyEmail: lang === 'en' ? (copied ? 'Copied!' : 'Email') : (copied ? 'تم!' : 'الإيميل'),
    availableBadge: lang === 'en' ? 'Available for Hire' : 'متاح لاستقبال المشاريع',
    name: lang === 'en' ? 'Amr Othman' : 'عمرو عثمان',
    heroSub: lang === 'en' 
      ? 'Software Engineer building modern web apps & SaaS backends with React.js & Node.js.'
      : 'مهندس برمجيات متخصص في بناء واجهات المستخدم والباك إند بـ React.js & Node.js.',
    whatsappBtn: lang === 'en' ? 'WhatsApp' : 'تواصل واتساب',
    viewCvBtn: lang === 'en' ? 'View CV' : 'استعراض الـ CV',
    liveProjects: lang === 'en' ? '+10 Live Apps' : '+10 مشاريع حية',
    mobileResponsive: lang === 'en' ? '100% Mobile Fit' : '100% تجاوب للموبايل',
    securityStandards: lang === 'en' ? 'JWT / REST' : 'REST / JWT أمان عالي',
    support: lang === 'en' ? '24/7 Support' : '24/7 دعم فني',
    guaranteesTitle: lang === 'en' ? 'Quality Guarantees' : 'معايير وضمانات جودة التنفيذ',
    servicesTitle: lang === 'en' ? 'Services & Solutions' : 'الخدمات والحلول البرمجية',
    processTitle: lang === 'en' ? 'Development Lifecycle' : 'مراحل وخطوات تنفيذ العمل',
    skillsTitle: lang === 'en' ? 'Technical Skills' : 'المهارات والتقنيات البرمجية',
    projectsTitle: lang === 'en' ? 'Live Projects Portfolio' : 'معرض الأعمال والمشاريع',
    timelineTitle: lang === 'en' ? 'Experience Roadmap' : 'محطات ومسار الخبرة البرمجية',
    reviewsTitle: lang === 'en' ? 'Client Reviews' : 'ثقة العملاء والتقييمات الحية',
    addReviewHeader: lang === 'en' ? 'Leave a Feedback' : 'أضف رأيك أو تقييمك للخدمة',
    yourName: lang === 'en' ? 'Your Name' : 'الاسم أو الجهة',
    yourRole: lang === 'en' ? 'Your Role' : 'المسمى الوظيفي / الخدمة',
    starRating: lang === 'en' ? 'Star Rating' : 'التقييم بالنجوم',
    reviewComment: lang === 'en' ? 'Your Review' : 'رأيك أو انطباعك عن الخدمة والتنفيذ',
    submitReviewBtn: lang === 'en' ? (isAddingReview ? 'Saving...' : 'Publish Review') : (isAddingReview ? 'جاري الحفظ...' : 'نشر التقييم فوراً'),
    faqTitle: lang === 'en' ? 'FAQ' : 'الأسئلة الشائعة (FAQ)',
    contactHeader: lang === 'en' ? 'Send Message / Inquiry' : 'إرسال رسالة مباشرة أو طلب مشروع',
    fullName: lang === 'en' ? 'Full Name' : 'الاسم الكامل',
    emailAddr: lang === 'en' ? 'Email Address' : 'البريد الإلكتروني',
    projectDetails: lang === 'en' ? 'Project Details' : 'تفاصيل المشروع أو الرسالة',
    sendMsgBtn: lang === 'en' ? (isSubmitting ? 'Sending...' : 'Send Message') : (isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة فوراً'),
    msgSuccess: lang === 'en' ? 'Message sent successfully!' : 'تم إرسال رسالتك بنجاح!'
  };

  const guarantees = [
    { icon: "fa-shield-check", title: lang === 'en' ? "100% Clean Code" : "كود نظيف وآمن 100%", desc: lang === 'en' ? "Following Clean Architecture & modular structure." : "اتباع أفضل الممارسات البرمجية ومعايير Clean Architecture." },
    { icon: "fa-headset", title: lang === 'en' ? "30 Days Support" : "دعم وصيانة مجانية 30 يوماً", desc: lang === 'en' ? "Continuous post-delivery revisions & maintenance." : "متابعة مستمرة للتطبيقات والمنصات بعد التسليم معالجة أي ملاحظات." },
    { icon: "fa-rocket", title: lang === 'en' ? "SEO Optimization" : "سرعة تحميل ممتازة و SEO", desc: lang === 'en' ? "Optimized for search engines & fast load speed." : "تهيئة المواقع لتصدر نتائج البحث على Google واستجابة سريعة." },
    { icon: "fa-lock", title: lang === 'en' ? "Data Protection" : "تأمين وحماية البيانات", desc: lang === 'en' ? "JWT security and protected database rules." : "ربط القواعد بتوثيق JWT وإعدادات حماية سحابية يضمن سرية بياناتك." }
  ];

  const services = [
    { icon: "fa-laptop-code", title: lang === 'en' ? "SaaS & Web Applications" : "تطوير منصات SaaS & Web Apps", desc: lang === 'en' ? "Building full web apps from scratch with reactive UI." : "بناء تطبيقات ويب متكاملة من الصفر وتصميم واجهات مستخدم سريعة." },
    { icon: "fa-server", title: lang === 'en' ? "Backend & REST APIs" : "معمارية الباك إند و REST APIs", desc: lang === 'en' ? "Developing secure Node.js & NestJS servers." : "إنشاء سيرفرات قوية بـ Node.js & NestJS وربط قواعد البيانات." },
    { icon: "fa-database", title: lang === 'en' ? "Cloud Databases" : "إدارة قواعد البيانات السحابية", desc: lang === 'en' ? "MongoDB & Firebase architecture for real-time sync." : "تصميم وتنظيم قواعد البيانات MongoDB & Firebase لضمان استرجاع البيانات." },
    { icon: "fa-shield-halved", title: lang === 'en' ? "Performance Optimization" : "تحسين الأداء والأمان (Optimization)", desc: lang === 'en' ? "Page speed optimization and vulnerability fixes." : "تأمين الثغرات، تسريع زمن تحميل الصفحات SEO، وترقية المواقع." }
  ];

  const workSteps = [
    { num: "01", title: lang === 'en' ? "Analysis & Planning" : "دراسة الفكرة والتحليل", desc: lang === 'en' ? "Understanding project goals & choosing tech stack." : "فهم متطلبات المشروع بدقة وتحديد أفضل المعماريات." },
    { num: "02", title: lang === 'en' ? "UI/UX Design" : "تصميم الواجهات UI/UX", desc: lang === 'en' ? "Designing responsive UI across all mobile screens." : "بناء تجربة مستخدم سلسة وعصرية ومتجاوبة 100% مع الموبايل." },
    { num: "03", title: lang === 'en' ? "Full-Stack Coding" : "البرمجة والربط السحابي", desc: lang === 'en' ? "Writing clean code, APIs, and cloud databases." : "كتابة كود نظيف وتطوير محركات الباك إند وربط قواعد البيانات." },
    { num: "04", title: lang === 'en' ? "Testing & Launch" : "الاختبار والإطلاق أونلاين", desc: lang === 'en' ? "Performance testing & cloud deployment." : "فحص الأداء والأمان والتأكد من سرعة الصفحة ثم رفع الموقع لايف." }
  ];

  const timeline = [
    { year: "2026 - Present", title: "Full-Stack Software Engineer", desc: lang === 'en' ? "Engineering SaaS web apps using React.js & Node.js." : "تطوير تطبيقات الويب السحابية والمنصات التفاعلية بـ React & Node." },
    { year: "2025 - 2026", title: "Frontend & UI Developer", desc: lang === 'en' ? "Building portals for law firms and medical directories." : "بناء واجهات مستخدم معقدة وبوابات إلكترونية مخصصة للمحاماة والأطباء." },
    { year: "2024 - 2025", title: "JavaScript Open-Source Dev", desc: lang === 'en' ? "Developing open-source web tools and dashboards." : "بناء مشاريع برمجية مفتوحة المصدر وتصميم أدوات الإنتاجية." }
  ];

  const projects = [
    { id: 1, title: lang === 'en' ? "Dairut Doctors Directory" : "دليل أطباء ديروط", tag: "FULL-STACK SAAS", desc: lang === 'en' ? "Medical SaaS directory for clinics & labs with real-time Firebase sync." : "منصة طبية سحابية شاملة للاستعلام عن الأطباء والعيادات والمعامل.", url: "https://dairut-doctors-directory.vercel.app/", img: "dairut-doctors.png" },
    { id: 2, title: lang === 'en' ? "Noor Al-Islam Platform" : "منصة نور الإسلام", tag: "ISLAMIC ECOSYSTEM", desc: lang === 'en' ? "Ad-free Islamic platform with Quran audio/text, Athkar, prayer times." : "تطبيق ويب إسلامي شامل وبدون إعلانات يضم القرآن والأذكار.", url: "https://noor-alislam.vercel.app/", img: "noor-alislam.png" },
    { id: 3, title: "Habit Flow", tag: "PRODUCTIVITY APP", desc: lang === 'en' ? "Habit tracking application with productivity analytics." : "تطبيق متكامل لتتبع العادات والروتين اليومي وتحليل الإنتاجية.", url: "https://habit-flow-ivory.vercel.app/", img: "1.png" },
    { id: 4, title: "DevFinder Pro", tag: "DEVELOPER TOOL", desc: lang === 'en' ? "GitHub developer search tool with advanced filters." : "منصة متقدمة للبحث عن المطورين واستعراض ملفاتهم على GitHub.", url: "https://devfinder-pro-tan.vercel.app/", img: "2.png" },
    { id: 5, title: lang === 'en' ? "Mahmoud Shaban Law Firm" : "منصة أ. محمود شعبان للمحاماة", tag: "LEGAL PORTAL", desc: lang === 'en' ? "Legal portal for case tracking and document management." : "منصة قانونية تفاعلية تتضمن استعلام الموكلين برقم الدعوى.", url: "https://mahmoud-shaban-legal.vercel.app/", img: "3.png" },
    { id: 6, title: lang === 'en' ? "Abdulhamid Legal Portal" : "منصة المستشار عبد الحميد أحمد", tag: "LEGAL PORTAL", desc: lang === 'en' ? "Digital portal for legal consultations with theme switcher." : "واجهة رقمية فخمة للخدمات الاستشارية والقانونية.", url: "https://abdulhamid-ahmed-lawyer.vercel.app/", img: "4.png" },
    { id: 7, title: lang === 'en' ? "Fattouh Legal Portal" : "منصة فتوح عبد الحميد القانونية", tag: "LEGAL PORTAL", desc: lang === 'en' ? "Legal drafting and contract management platform." : "موقع ويب متكامل لإدارة الخدمات القانونية وصياغة العقود.", url: "https://fattouh-abdelhamid.vercel.app/", img: "5.png" },
    { id: 8, title: lang === 'en' ? "Mohamed Saeed Law Portal" : "بوابة أ. محمد سعيد المحامي", tag: "LEGAL PORTAL", desc: lang === 'en' ? "Fast legal consultation portal across all devices." : "منصة استشارات قانونية سريعة تمتاز بدقة التصميم.", url: "https://mohamedsaeedlawyer.vercel.app/", img: "6.png" }
  ];

  const skillCategories = [
    { title: "Frontend Engineering", icon: "fa-code", skills: [{ name: "React.js", icon: "fa-brands fa-react", color: "#61dafb" }, { name: "Next.js", icon: "fa-solid fa-square-rss", color: "#000000" }, { name: "JavaScript", icon: "fa-brands fa-js", color: "#f7df1e" }, { name: "TypeScript", icon: "fa-solid fa-code", color: "#3178c6" }, { name: "HTML/CSS", icon: "fa-brands fa-html5", color: "#e34f26" }, { name: "Tailwind", icon: "fa-brands fa-css3-alt", color: "#38bdf8" }] },
    { title: "Backend & Cloud", icon: "fa-server", skills: [{ name: "Node.js", icon: "fa-brands fa-node-js", color: "#339933" }, { name: "Express", icon: "fa-solid fa-cubes", color: "#000000" }, { name: "NestJS", icon: "fa-solid fa-network-wired", color: "#e0234e" }, { name: "REST APIs", icon: "fa-solid fa-gears", color: "#0d9488" }, { name: "JWT Auth", icon: "fa-solid fa-key", color: "#a29bfe" }, { name: "Cloudinary", icon: "fa-solid fa-cloud-arrow-up", color: "#3448c5" }] },
    { title: "Databases", icon: "fa-database", skills: [{ name: "MongoDB", icon: "fa-solid fa-leaf", color: "#47a248" }, { name: "Firebase", icon: "fa-solid fa-fire", color: "#ffca28" }, { name: "PostgreSQL", icon: "fa-solid fa-database", color: "#336791" }] },
    { title: "Tools & Concepts", icon: "fa-wrench", skills: [{ name: "Git / GitHub", icon: "fa-brands fa-github", color: "#181717" }, { name: "Vercel", icon: "fa-solid fa-globe", color: "#000000" }, { name: "Clean Code", icon: "fa-solid fa-diagram-project", color: "#fd79a8" }, { name: "Responsive UI", icon: "fa-solid fa-mobile-screen-button", color: "#0d9488" }] }
  ];

  const faqs = [
    { q: lang === 'en' ? "What is the timeline for developing a website?" : "ما هي المدة الزمنية المتوقعة لتنفيذ موقع ويب؟", a: lang === 'en' ? "Landing pages take 3-5 days. Complete SaaS applications take 1-2 weeks." : "المواقع التعريفية تستغرق من 3 إلى 5 أيام، بينما المنصات الكاملة تستغرق أسبوعين." },
    { q: lang === 'en' ? "Do you deliver source code & post-launch support?" : "هل يتم تسليم الكود المصدري ودعم فني بعد التسليم؟", a: lang === 'en' ? "Yes! Clean source code via GitHub plus 30 days of free support." : "بالتأكيد! يتم تسليم الكود البرمجي كاملاً مع تقديم دعم وصيانة مجانية لمدة 30 يوماً." },
    { q: lang === 'en' ? "How do we track project development progress?" : "كيف يتم التواصل ومتابعة مراحل العمل؟", a: lang === 'en' ? "Via WhatsApp / Email with live staging preview links." : "يتم التواصل عبر الواتساب أو البريد الإلكتروني مع مشاركة رابط معاينة حي." }
  ];

  return (
    <div className="app-container">
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      {/* NAVBAR */}
      <header className="navbar-modern">
        <div className="nav-container">
          <div className="brand-logo">AMR.OTHMAN</div>

          {/* Sidebar Drawer Toggle Button Always on Left */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Sidebar Overlay & Drawer */}
        {mobileMenuOpen && <div className="sidebar-backdrop" onClick={() => setMobileMenuOpen(false)}></div>}
        <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-drawer-header">
            <span className="brand-logo">AMR.OTHMAN</span>
            <button className="close-drawer-btn" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="mobile-drawer-controls">
            <button className="theme-toggle-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button className="lang-toggle-btn" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
              {lang === 'en' ? 'العربية AR' : 'English EN'}
            </button>
            <a href="/CV.pdf" target="_blank" rel="noreferrer" className="btn-cv-nav">
              <i className="fa-solid fa-file-arrow-down"></i> {t.downloadCv}
            </a>
          </div>

          <div className="sidebar-links-wrapper">
            <a href="#home" onClick={() => setMobileMenuOpen(false)}><i className="fa-solid fa-house"></i> {t.home}</a>
            <a href="#guarantees" onClick={() => setMobileMenuOpen(false)}><i className="fa-solid fa-shield-check"></i> {t.guarantees}</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)}><i className="fa-solid fa-laptop-code"></i> {t.services}</a>
            <a href="#process" onClick={() => setMobileMenuOpen(false)}><i className="fa-solid fa-list-check"></i> {t.process}</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)}><i className="fa-solid fa-code"></i> {t.skills}</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)}><i className="fa-solid fa-layer-group"></i> {t.projects}</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)}><i className="fa-solid fa-star"></i> {t.reviews}</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}><i className="fa-solid fa-envelope"></i> {t.contact}</a>
          </div>
        </div>
      </header>

      {/* HERO ZONE */}
      <section className="hero-section" id="home">
        <div className="hero-avatar-wrapper">
          <div className="avatar-frame animate-float">
            <img src="profile.jpg" alt="Amr Othman" className="profile-img" />
          </div>
        </div>

        <div className="hero-content">
          <div className="badge-available">
            <span className="pulse-dot"></span>
            {t.availableBadge}
          </div>

          <h1 className="hero-title">
            {t.name} <br />
            <span className="gradient-text typewriter">{displayText}<span className="cursor">|</span></span>
          </h1>

          <p className="hero-subtitle">{t.heroSub}</p>
          
          <div className="hero-actions">
            <a href="https://wa.me/201009694831" target="_blank" rel="noreferrer" className="btn-primary-teal pulse-btn">
              <i className="fa-brands fa-whatsapp"></i> {t.whatsappBtn}
            </a>
            <a href="/CV.pdf" target="_blank" rel="noreferrer" className="btn-cv-hero">
              <i className="fa-solid fa-file-pdf"></i> {t.viewCvBtn}
            </a>
            <a href="https://linkedin.com/in/x-amr-othman-x1" target="_blank" rel="noreferrer" className="btn-secondary-outline">
              <i className="fa-brands fa-linkedin"></i> LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* METRICS BANNER */}
      <section className="metrics-banner">
        <div className="metrics-container">
          <div className="metric-box">
            <h3>+10</h3>
            <p>{t.liveProjects}</p>
          </div>
          <div className="metric-box">
            <h3>100%</h3>
            <p>{t.mobileResponsive}</p>
          </div>
          <div className="metric-box">
            <h3>REST / JWT</h3>
            <p>{t.securityStandards}</p>
          </div>
          <div className="metric-box">
            <h3>24/7</h3>
            <p>{t.support}</p>
          </div>
        </div>
      </section>

      {/* GUARANTEES */}
      <section className="section-wrapper" id="guarantees">
        <div className="section-header">
          <h2 className="section-head-title">{t.guaranteesTitle}</h2>
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

      {/* SERVICES */}
      <section className="section-wrapper" id="services">
        <div className="section-header">
          <h2 className="section-head-title">{t.servicesTitle}</h2>
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

      {/* WORK PROCESS */}
      <section className="section-wrapper" id="process">
        <div className="section-header">
          <h2 className="section-head-title">{t.processTitle}</h2>
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

      {/* SKILLS */}
      <section className="section-wrapper" id="skills">
        <div className="section-header">
          <h2 className="section-head-title">{t.skillsTitle}</h2>
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

      {/* PROJECTS */}
      <section className="section-wrapper" id="projects">
        <div className="section-header">
          <h2 className="section-head-title">{t.projectsTitle}</h2>
          <span className="section-badge">+8 Live Apps</span>
        </div>
        <div className="cards-grid">
          {projects.map((proj) => (
            <div className="saas-card" key={proj.id}>
              <div className="card-img-wrapper">
                <img src={proj.img} alt={proj.title} loading="lazy" />
                <div className="card-img-overlay">
                  <a href={proj.url} target="_blank" rel="noreferrer" className="overlay-btn">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> {lang === 'en' ? 'Open Preview' : 'فتح المعاينة'}
                  </a>
                </div>
              </div>
              <span className="card-tag">{proj.tag}</span>
              <h3 className="card-title">{proj.title}</h3>
              <p className="card-desc">{proj.desc}</p>
              <a href={proj.url} target="_blank" rel="noreferrer" className="card-link">
                {lang === 'en' ? 'Explore App' : 'معاينة المنصة'} <i className={`fa-solid ${lang === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section-wrapper" id="timeline">
        <div className="section-header">
          <h2 className="section-head-title">{t.timelineTitle}</h2>
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

      {/* REVIEWS */}
      <section className="section-wrapper" id="reviews">
        <div className="section-header">
          <h2 className="section-head-title">{t.reviewsTitle}</h2>
          <span className="section-badge">Live Reviews ({testimonials.length})</span>
        </div>

        <div className="add-review-box">
          <h3><i className="fa-solid fa-star-half-stroke"></i> {t.addReviewHeader}</h3>
          {reviewSubmitted && (
            <div className="toast-success">
              <i className="fa-solid fa-circle-check"></i> {lang === 'en' ? 'Thank you! Review published.' : 'شكراً لك! تم نشر تقييمك بنجاح.'}
            </div>
          )}
          <form onSubmit={handleAddReview} className="review-form-grid">
            <div className="form-group">
              <label>{t.yourName}</label>
              <input 
                type="text" 
                placeholder={lang === 'en' ? "e.g., Dr. Alex" : "مثال: د. أحمد علي"} 
                value={newReview.author} 
                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })} 
                required 
              />
            </div>

            <div className="form-group">
              <label>{t.yourRole}</label>
              <input 
                type="text" 
                placeholder={lang === 'en' ? "e.g., Client / Lawyer" : "مثال: عميل / محامٍ"} 
                value={newReview.role} 
                onChange={(e) => setNewReview({ ...newReview, role: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label>{t.starRating}</label>
              <select 
                value={newReview.stars} 
                onChange={(e) => setNewReview({ ...newReview, stars: Number(e.target.value) })}
                className="stars-select"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                <option value="4">⭐⭐⭐⭐ (4/5)</option>
                <option value="3">⭐⭐⭐ (3/5)</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>{t.reviewComment}</label>
              <textarea 
                rows="3" 
                placeholder={lang === 'en' ? "Write your experience here..." : "اكتب تجربتك في التعامل هنا..."} 
                value={newReview.quote} 
                onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })} 
                required 
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-teal btn-submit-review" disabled={isAddingReview}>
              <i className="fa-solid fa-paper-plane"></i> {t.submitReviewBtn}
            </button>
          </form>
        </div>

        <div className="testimonials-grid">
          {loadingReviews ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: 'span 2' }}>
              {lang === 'en' ? 'Fetching live reviews...' : 'جاري سحب التقييمات الحية...'}
            </p>
          ) : testimonials.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: 'span 2' }}>
              {lang === 'en' ? 'No reviews yet. Be the first!' : 'لا توجد تقييمات حتى الآن. كن أول من يضيف رأيه!'}
            </p>
          ) : (
            testimonials.map((tItem) => (
              <div className="testimonial-card" key={tItem.id || Math.random()}>
                <div className="stars-row">
                  {[...Array(tItem.stars || 5)].map((_, i) => (
                    <i className="fa-solid fa-star" key={i}></i>
                  ))}
                </div>
                <p className="quote-text">"{tItem.quote}"</p>
                <div className="author-info">
                  <h4>{tItem.author}</h4>
                  <span>{tItem.role || (lang === 'en' ? 'Verified Client' : 'عميل معتمد')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-wrapper" id="faq">
        <div className="section-header">
          <h2 className="section-head-title">{t.faqTitle}</h2>
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

      {/* CONTACT */}
      <section className="section-wrapper" id="contact">
        <div className="section-header">
          <h2 className="section-head-title">{t.contactHeader}</h2>
          <span className="section-badge">Get In Touch</span>
        </div>

        <div className="contact-section-grid">
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

          <form className="contact-form-box" onSubmit={handleFormSubmit}>
            {formStatus && (
              <div className="toast-success">
                <i className="fa-solid fa-circle-check"></i> {t.msgSuccess}
              </div>
            )}
            <div className="form-group">
              <label>{t.fullName}</label>
              <input 
                type="text" 
                name="name"
                placeholder={lang === 'en' ? "John Doe" : "أدخل اسمك الكريم"} 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>{t.emailAddr}</label>
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
              <label>{t.projectDetails}</label>
              <textarea 
                name="message"
                rows="4" 
                placeholder={lang === 'en' ? "Describe your project..." : "اكتب فكرة مشروعك هنا..."} 
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})} 
                required 
              ></textarea>
            </div>
            <button type="submit" className="btn-primary-teal btn-submit" disabled={isSubmitting}>
              <i className="fa-solid fa-paper-plane"></i> {t.sendMsgBtn}
            </button>
          </form>
        </div>
      </section>

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Return to top">
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}

      <footer className="footer-modern">
        <p>© 2026 ENG. AMR OTHMAN // ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

export default App;