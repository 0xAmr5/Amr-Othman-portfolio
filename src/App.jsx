import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
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

  const canvasRef = useRef(null);
  const heroCardRef = useRef(null);

  // Apply Theme & Direction
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('app_theme', theme);
    localStorage.setItem('app_lang', lang);
  }, [theme, lang]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'));

  // 3D Tilt Effect for Hero Card
  const handleMouseMove = (e) => {
    const card = heroCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = heroCardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  // Cosmic 3D Starfield Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.alpha += star.speed;
        const currentAlpha = (Math.sin(star.alpha) + 1) / 2;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'dark' 
          ? `rgba(255, 255, 255, ${currentAlpha * 0.75})`
          : `rgba(13, 148, 136, ${currentAlpha * 0.4})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Firebase Realtime Reviews Listener
  useEffect(() => {
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTestimonials(fetched);
        setLoadingReviews(false);
      }, () => setLoadingReviews(false));
      return () => unsubscribe();
    } catch {
      setLoadingReviews(false);
    }
  }, []);

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const cur = window.scrollY;
      setScrollProgress((cur / total) * 100);
      setShowScrollTop(cur > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText('amrothman154@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.author || !newReview.quote) return;
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
    } catch {
      alert(lang === 'en' ? "Error saving review." : "حدث خطأ أثناء حفظ التقييم.");
    } finally {
      setIsAddingReview(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("https://formspree.io/f/moeaelpn", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormStatus(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus(false), 5000);
      }
    } catch {
      alert(lang === 'en' ? "Error sending message." : "حدث خطأ أثناء إرسال الرسالة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Multilingual Dictionary
  const t = {
    brand: "AMR OTHMAN",
    badgeHire: lang === 'en' ? "AVAILABLE FOR WORK & FREELANCE" : "متاح للعمل الحر والتعاقدات",
    navServices: lang === 'en' ? "Services" : "الخدمات",
    navExperience: lang === 'en' ? "Experience" : "الخبرة",
    navProjects: lang === 'en' ? "Projects" : "المشاريع",
    navStack: lang === 'en' ? "Stack" : "المهارات",
    navTestimonials: lang === 'en' ? "Testimonials" : "التقييمات",
    navContact: lang === 'en' ? "Contact" : "تواصل معي",
    heroRole: lang === 'en' ? "Full-Stack Software Engineer" : "مهندس برمجيات فول ستاك",
    heroLocation: lang === 'en' ? "based in Egypt 🇪🇬" : "مقيم في مصر 🇪🇬",
    downloadCv: lang === 'en' ? "DOWNLOAD CV" : "تحميل الـ CV",
    scroll: lang === 'en' ? "SCROLL" : "مرر لأسفل",
    whatIDo: lang === 'en' ? "WHAT I DO /" : "الخدمات والحلول /",
    servicesTag: lang === 'en' ? "( SERVICES )" : "( الخدمات البرمجية )",
    servicesQuote: lang === 'en' 
      ? '"Intuitive, scalable architectures do not happen by chance. I engineer robust solutions that make your business workflow effortless and ultra-fast."'
      : '"الأنظمة البرمجية القوية وسريعة الاستجابة لا تحدث بالصدفة. أقوم ببناء حلول هندسية متكاملة ترفع كفاءة أعمالك وتجعلها فائقة السرعة."',
    marquee: lang === 'en'
      ? "FULL-STACK SOFTWARE ENGINEER ✦ REACT.JS ✦ NODE.JS & NESTJS ✦ CLOUD ARCHITECTURE ✦ FULL-STACK SOFTWARE ENGINEER ✦ REACT.JS ✦ NODE.JS & NESTJS ✦"
      : "مهندس برمجيات فول ستاك ✦ متخصص REACT.JS ✦ معمارية NODE.JS & NESTJS ✦ أنظمة سحابية متكاملة ✦ مهندس برمجيات فول ستاك ✦",
    careerTitle: lang === 'en' ? "CAREER & EXPERIENCE /" : "مسار الخبرة البرمجية /",
    roadmapTag: lang === 'en' ? "( ROADMAP )" : "( المسار المهني )",
    selectedProjects: lang === 'en' ? "SELECTED PROJECTS /" : "أبرز الأعمال والمشاريع /",
    projectsSubtext: lang === 'en'
      ? "Featured production SaaS applications and commercial systems crafted with precision."
      : "منظومات وتطبيقات سحابية حية تم بناؤها بمعايير هندسية متطورة.",
    livePreview: lang === 'en' ? "Live Preview" : "معاينة حية",
    openProject: lang === 'en' ? "Open Project" : "فتح المنصة",
    myStack: lang === 'en' ? "MY STACK /" : "الترسانة والمهارات /",
    arsenalTag: lang === 'en' ? "( ARSENAL )" : "( الأدوات والتقنيات )",
    testimonialsTitle: lang === 'en' ? "TESTIMONIALS /" : "آراء وتقييمات العملاء /",
    testimonialsSub: lang === 'en' ? "Feedback and reviews from satisfied clients & collaborators." : "تقييمات وآراء العملاء وأصحاب المشاريع المنفذة.",
    leaveReview: lang === 'en' ? "Leave a Direct Review" : "أضف تقييمك وانطباعك عن الخدمة",
    namePlace: lang === 'en' ? "Your Name / Organization" : "الاسم أو الجهة",
    rolePlace: lang === 'en' ? "Your Role / Service Received" : "المسمى الوظيفي / الخدمة المنفذة",
    quotePlace: lang === 'en' ? "Share your experience working with me..." : "اكتب رأيك وتجربتك في العمل هنا...",
    saveReview: lang === 'en' ? (isAddingReview ? "Saving to Cloud..." : "Publish Review") : (isAddingReview ? "جاري الحفظ..." : "نشر التقييم فوراً"),
    reviewSuccess: lang === 'en' ? "Thank you! Your feedback has been published to Firebase Cloud." : "شكراً لك! تم نشر تقييمك سحابياً.",
    getInTouch: lang === 'en' ? "GET IN TOUCH /" : "تواصل مباشر /",
    directTag: lang === 'en' ? "( DIRECT )" : "( طلب مشروع )",
    talkTitle: lang === 'en' ? "LET'S TALK ABOUT YOUR PROJECT." : "دعنا نبني مشروعك البرمجي القادم.",
    talkSub: lang === 'en'
      ? "Have an idea or looking for a Full-Stack Software Engineer? Let's connect and build something scalable together."
      : "هل لديك فكرة منصة أو تبحث عن مهندس برمجيات لتنفيذ مشروعك؟ تواصل معي وسنحول فكرتك إلى واقع تقني متميز.",
    nameLabel: lang === 'en' ? "YOUR NAME" : "الاسم الكريم",
    emailLabel: lang === 'en' ? "EMAIL ADDRESS" : "البريد الإلكتروني",
    msgLabel: lang === 'en' ? "HOW CAN I HELP?" : "تفاصيل المشروع أو الاستفسار",
    sendBtn: lang === 'en' ? (isSubmitting ? "SENDING..." : "SEND MESSAGE") : (isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"),
    msgSentSuccess: lang === 'en' ? "Message sent successfully! I will reply shortly." : "تم إرسال رسالتك بنجاح وسأقوم بالرد عليك سريعاً!",
    buildFuture: lang === 'en' ? "LET'S BUILD THE FUTURE." : "لنبنِ المستقبل معاً.",
    allRights: "© 2026 ENG. AMR OTHMAN // ALL RIGHTS RESERVED."
  };

  const services = [
    {
      num: "01",
      title: lang === 'en' ? "Web & SaaS Architecture" : "تطوير تطبيقات الويب و SaaS",
      desc: lang === 'en' 
        ? "Engineering scalable, high-performance web systems and intuitive enterprise portals tailored for speed and reliability."
        : "بناء تطبيقات ويب سريعة وقابلة للتوسع وأنظمة إدارة مخصصة لرفع كفاءة أعمالك وإدارتها بسلاسة.",
      bullets: lang === 'en' 
        ? ["React.js & Next.js Architecture", "Fluid 3D Micro-Interactions", "SEO & Performance Optimization"]
        : ["معماريات React.js و Next.js", "تفاعلات حركية 3D ناعمة", "تهيئة لمحركات البحث والسرعة"]
    },
    {
      num: "02",
      title: lang === 'en' ? "Full-Stack & Cloud Systems" : "معمارية الفول ستاك والأنظمة السحابية",
      desc: lang === 'en' 
        ? "Developing robust Node.js & NestJS backend pipelines, RESTful APIs, and secure database layers with real-time sync."
        : "إنشاء محركات باك إند قوية بـ Node.js & NestJS، واجهات برمجة RESTful، وتأمين البيانات مع المزامنة اللحظية.",
      bullets: lang === 'en' 
        ? ["Node.js & NestJS Microservices", "JWT Security & Role-Based Access", "PostgreSQL & MongoDB Cloud Sync"]
        : ["سيرفرات Node.js و NestJS", "أمان JWT وصلاحيات المستخدمين", "قواعد بيانات سحابية متزامنة"]
    },
    {
      num: "03",
      title: lang === 'en' ? "Optimization & Responsive Fit" : "تحسين الأداء والتجاوب الشامل",
      desc: lang === 'en' 
        ? "Auditing and optimizing application responsiveness across viewports, eliminating layout shifts and maximizing speed."
        : "تحسين الأداء البرمجي لسرعة تحميل فائقة وتوافق تام مع كافة مقاسات الشاشات والهواتف الذكية بدون أخطاء.",
      bullets: lang === 'en' 
        ? ["100% Mobile Viewport Fit", "Zero Layout Overflow", "Clean Architecture Standards"]
        : ["تجاوب تام مع كافة الشاشات", "منع الإزاحة والسكرول العرضي", "معايير الكود النظيف"]
    }
  ];

  const experience = [
    {
      role: lang === 'en' ? "Full-Stack Software Engineer" : "مهندس برمجيات فول ستاك",
      company: lang === 'en' ? "Self-Employed / Freelance" : "عمل حر ومشاريع مؤسسية",
      period: "2025 - Present",
      desc: lang === 'en'
        ? "Delivering production-grade SaaS platforms, legal CRM platforms, and transit fleet control ecosystems with responsive modern UI and real-time backend engines."
        : "تطوير وتسليم منصات سحابية تجارية، أنظمة إدارة لمكاتب المحاماة، ومنظومات النقل وإدارة الأساطيل بأعلى معايير السرعة والأمان."
    },
    {
      role: lang === 'en' ? "Frontend & UI Developer" : "مطور واجهات ومستخدم",
      company: lang === 'en' ? "Commercial Contract Projects" : "مشاريع تعاقدية",
      period: "2024 - 2025",
      desc: lang === 'en'
        ? "Engineered responsive client portals, legal management dashboards, and health directory applications with sub-second page performance."
        : "بناء واجهات مستخدم تفاعلية وبوابات إلكترونية مخصصة للمؤسسات والدليل الطبي وتطبيقات إدارة المهام."
    }
  ];

  const projects = [
    {
      num: "01.",
      title: lang === 'en' ? "TRANSITFLOW FLEET ECOSYSTEM" : "منظومة TRANSITFLOW للنقل وإدارة الأساطيل",
      desc: lang === 'en' ? "Cloud transit & fleet management system with driver accounting, real-time revenue audits, and expense tracking." : "منظومة سحابية متقدمة لإدارة أساطيل النقل، حسابات السائقين، والتدقيق المالي الفوري.",
      stack: ["JavaScript (ES6+)", "HTML5 / CSS3", "Firebase Realtime DB", "Vercel"],
      url: "https://transitflow-system.vercel.app/",
      img: "/transitflow.png"
    },
    {
      num: "02.",
      title: lang === 'en' ? "MAHMOUD SHABAAN LAW FIRM" : "منصة أ. محمود شعبان للمحاماة",
      desc: lang === 'en' ? "Enterprise legal SaaS platform digitizing case archiving, session calendars, and client tracking." : "المنظومة الرقمية المتكاملة لمكتب المحاماة؛ لأتمتة ملفات الدعاوى والجلسات وبوابة الموكلين.",
      stack: ["React.js", "Cloud Firestore", "Cloudinary", "JWT Security"],
      url: "https://mahmoud-shabaan-law-firm.vercel.app/",
      img: "/mahmoud-shabaan.png"
    },
    {
      num: "03.",
      title: lang === 'en' ? "DAIRUT DOCTORS DIRECTORY" : "دليل أطباء ديروط",
      desc: lang === 'en' ? "Comprehensive medical SaaS directory for clinics & diagnostic labs with instant cloud search." : "منصة طبية سحابية شاملة للاستعلام عن الأطباء والعيادات والمعامل مع مزامنة لحظية.",
      stack: ["React.js", "Firebase", "Tailwind CSS", "SPA"],
      url: "https://dairut-doctors-directory.vercel.app/",
      img: "/dairut-doctors.png"
    },
    {
      num: "04.",
      title: lang === 'en' ? "NOOR AL-ISLAM PLATFORM" : "منصة نور الإسلام",
      desc: lang === 'en' ? "Ad-free Islamic ecosystem featuring audio/text Quran, prayer schedules, and daily Athkar." : "تطبيق ويب إسلامي شامل وبدون إعلانات يضم القرآن الكريم والأذكار ومواقيت الصلاة.",
      stack: ["React.js", "Audio Streaming", "Vite", "Responsive UI"],
      url: "https://noor-alislam.vercel.app/",
      img: "/noor-alislam.png"
    },
    {
      num: "05.",
      title: lang === 'en' ? "HABIT FLOW APPLICATION" : "تطبيق HABIT FLOW",
      desc: lang === 'en' ? "Interactive productivity tracker with progress analytics, responsive bento grids, and persistent data." : "تطبيق متكامل لتتبع العادات والروتين اليومي وتحليل الإنتاجية بأسلوب تفاعلي وجذاب.",
      stack: ["React.js", "State Management", "LocalStorage", "Bento Grid"],
      url: "https://habit-flow-ivory.vercel.app/",
      img: "/habit-flow.png"
    },
    {
      num: "06.",
      title: lang === 'en' ? "DEVFINDER PRO AGGREGATOR" : "منصة DEVFINDER PRO",
      desc: lang === 'en' ? "Advanced developer search tool querying GitHub REST API with real-time dynamic data filter logic." : "منصة متقدمة للبحث عن المطورين واستعراض ملفاتهم على GitHub وخوارزميات فلترة ذكية.",
      stack: ["JavaScript (ES6+)", "GitHub REST API", "Async Pipelines", "Vercel"],
      url: "https://devfinder-pro-tan.vercel.app/",
      img: "/devfinder.png"
    },
    {
      num: "07.",
      title: lang === 'en' ? "ABDULHAMID LEGAL ADVISORY" : "منصة المستشار عبد الحميد أحمد",
      desc: lang === 'en' ? "Executive legal consultation portal with dual theme integration and direct appointment intake." : "واجهة رقمية فخمة للخدمات الاستشارية والقانونية مع دعم تحويل المود التفاعلي.",
      stack: ["JavaScript", "HTML5", "CSS Tokens", "Vercel"],
      url: "https://abdulhamid-ahmed-lawyer.vercel.app/",
      img: "/abdulhamid-lawyer.png"
    },
    {
      num: "08.",
      title: lang === 'en' ? "FATTOUH LEGAL PORTAL" : "منصة فتوح عبد الحميد القانونية",
      desc: lang === 'en' ? "Specialized legal services portal focusing on contract drafting and corporate litigation." : "موقع ويب متكامل لإدارة الخدمات القانونية، صياغة العقود، والتواصل المباشر مع الموكلين.",
      stack: ["Frontend Architecture", "CSS3", "DOM API", "Vercel"],
      url: "https://fattouh-abdelhamid.vercel.app/",
      img: "/fattouh.png"
    },
    {
      num: "09.",
      title: lang === 'en' ? "MOHAMED SAEED LAW PRACTICE" : "بوابة أ. محمد سعيد المحامي",
      desc: lang === 'en' ? "High-performance digital law advisory portal featuring practice discovery and consultation booking." : "منصة استشارات قانونية سريعة تمتاز بدقة التصميم وسلاسة التواصل عبر كافة الأجهزة.",
      stack: ["JavaScript", "Responsive UI", "Flex/Grid", "Vercel"],
      url: "https://mohamedsaeedlawyer.vercel.app/",
      img: "/mohamed-saeed.png"
    }
  ];

  // Extended Technical Stack
  const stackCategories = [
    {
      name: lang === 'en' ? "FRONTEND" : "تطوير الواجهات (FRONTEND)",
      skills: ["React.js", "Next.js", "JavaScript (ES6+)", "TypeScript", "Tailwind CSS", "Redux Toolkit", "HTML5 / CSS3", "Responsive UI/UX"]
    },
    {
      name: lang === 'en' ? "BACKEND & CLOUD" : "الباك إند والسحابة (BACKEND & CLOUD)",
      skills: ["Node.js", "NestJS", "Express.js", "RESTful APIs", "JWT Security", "Cloudinary", "Prisma ORM", "Microservices Architecture"]
    },
    {
      name: lang === 'en' ? "DATABASES" : "قواعد البيانات (DATABASES)",
      skills: ["PostgreSQL", "MongoDB & Atlas", "Firebase Firestore", "Firebase Realtime DB", "Mongoose ODM", "Redis Caching"]
    },
    {
      name: lang === 'en' ? "TOOLS & DEVOPS" : "الأدوات والـ DEVOPS",
      skills: ["Git & GitHub", "Docker Basics", "Vercel Deployment", "Clean Architecture", "Postman", "CI / CD Pipelines", "OOP & Design Patterns"]
    }
  ];

  // Default Reviews
  const defaultReviews = [
    {
      id: "def-1",
      author: lang === 'en' ? "Dr. Mahmoud Shaban" : "أ. محمود شعبان",
      role: lang === 'en' ? "Managing Partner — Law Firm" : "المستشار القانوني ومؤسس المنصة",
      quote: lang === 'en' 
        ? "Eng. Amr delivered an outstanding legal management platform. The session tracking and client indexing saved us countless administrative hours."
        : "مهندس عمرو بنى لنا منصة قانونية متكاملة وإدارتها غاية في السرعة والسهولة، وفّرت علينا مجهود ضخم في متابعة الجلسات وأرشفة القضايا.",
      stars: 5
    },
    {
      id: "def-2",
      author: lang === 'en' ? "Eng. Hazem El-Sayed" : "م. حازم السيد",
      role: lang === 'en' ? "Operations Director — Transit Logistics" : "مدير تشغيل — منظومة النقل الذكي",
      quote: lang === 'en'
        ? "TransitFlow transformed our fleet auditing. Real-time accounting and driver manifest tracking gave us full control over our daily revenue."
        : "منظومة TransitFlow نظمت حركة الباصات والعهد المالية بشكل فوري ودقيق جداً، الشغل طالع باحترافية عالية والتزام ممتاز في المواعيد.",
      stars: 5
    },
    {
      id: "def-3",
      author: lang === 'en' ? "Dr. Ahmed Mansour" : "د. أحمد منصور",
      role: lang === 'en' ? "Healthcare Director — Dairut Clinics" : "استشاري ورئيس دليل العيادات",
      quote: lang === 'en'
        ? "The medical directory platform is lightning fast. Real-time search and clean responsive UI made it extremely helpful for thousands of patients."
        : "المنصة الطبية فائقة السرعة والتجاوب مع الموبايل، والربط السحابي مع Firebase شغال بسلاسة وبدون أي مشاكل تقنية.",
      stars: 5
    }
  ];

  const displayedReviews = testimonials.length > 0 ? testimonials : defaultReviews;

  return (
    <div className="dark-theme-root">
      {/* Background Starfield Canvas */}
      <canvas ref={canvasRef} className="starfield-canvas" />

      {/* Dynamic Ambient Glow Mesh */}
      <div className="glow-sphere-1" />
      <div className="glow-sphere-2" />

      {/* Scroll Progress Bar */}
      <div className="scroll-progress-line" style={{ width: `${scrollProgress}%` }} />

      {/* TOP NAVBAR */}
      <header className="site-header">
        <div className="header-inner">
          <a href="#home" className="logo-brand">{t.brand}</a>

          <div className="badge-hire-status">
            <span className="dot-pulse" />
            <span>{t.badgeHire}</span>
          </div>

          <nav className="desktop-menu">
            <a href="#services">{t.navServices}</a>
            <a href="#experience">{t.navExperience}</a>
            <a href="#projects">{t.navProjects}</a>
            <a href="#stack">{t.navStack}</a>
            <a href="#testimonials">{t.navTestimonials}</a>
            <a href="#contact">{t.navContact}</a>
          </nav>

          <div className="header-actions">
            {/* Theme Toggle Button */}
            <button className="btn-control-pill" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Language Toggle Button */}
            <button className="btn-control-pill" onClick={toggleLang}>
              {lang === 'en' ? 'AR' : 'EN'}
            </button>

            <button className="menu-toggle-circle" onClick={() => setMenuOpen(!menuOpen)}>
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Drawer Menu */}
        <div className={`drawer-overlay ${menuOpen ? 'open' : ''}`}>
          <div className="drawer-controls-row">
            <button className="btn-control-pill" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button className="btn-control-pill" onClick={toggleLang}>
              {lang === 'en' ? 'العربية AR' : 'English EN'}
            </button>
          </div>
          <div className="drawer-links">
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#services" onClick={() => setMenuOpen(false)}>{t.navServices}</a>
            <a href="#experience" onClick={() => setMenuOpen(false)}>{t.navExperience}</a>
            <a href="#projects" onClick={() => setMenuOpen(false)}>{t.navProjects}</a>
            <a href="#stack" onClick={() => setMenuOpen(false)}>{t.navStack}</a>
            <a href="#testimonials" onClick={() => setMenuOpen(false)}>{t.navTestimonials}</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>{t.navContact}</a>
            <a href="/CV.pdf" target="_blank" rel="noreferrer" className="btn-drawer-cv">{t.downloadCv}</a>
          </div>
        </div>
      </header>

      {/* HERO 3D SECTION */}
      <section className="hero-viewport" id="home">
        <div className="hero-grid-layout">
          {/* Left: 3D Tilting Banner Card */}
          <div 
            className="hero-banner-visual"
            ref={heroCardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="banner-3d-card">
              <div className="banner-media-container">
                <img src="/profile.jpg" alt="Amr Othman" className="banner-photo" />
                <div className="banner-lighting-glare" />
              </div>
              
              <div className="hero-signature-row">
                <div className="signature-font">Amr Othman</div>
                <div className="hero-social-strip">
                  <a href="https://github.com/0xAmr5" target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fa-brands fa-github" /></a>
                  <a href="https://linkedin.com/in/x-amr-othman-x1" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin" /></a>
                  <a href="https://wa.me/201009694831" target="_blank" rel="noreferrer" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp" /></a>
                  <button onClick={copyEmail} className="btn-copy-icon" title="Copy Email"><i className="fa-solid fa-envelope" /></button>
                </div>
              </div>
            </div>
            {copied && <span className="toast-copied">{lang === 'en' ? 'Email Copied!' : 'تم نسخ الإيميل!'}</span>}
          </div>

          {/* Right: Bold Heavy Typography */}
          <div className="hero-typography">
            <h1 className="hero-headline">
              AMR <br />
              <span className="hero-stroke-text">OTHMAN</span>
            </h1>
            <p className="hero-tagline">
              {t.heroRole} <br />
              <span className="location-pill">{t.heroLocation}</span>
            </p>
            <div className="hero-cta-row">
              <a href="/CV.pdf" target="_blank" rel="noreferrer" className="btn-cv-pill">
                {t.downloadCv}
              </a>
              <a href="#projects" className="btn-scroll-arrow">
                <span>{t.scroll}</span> <i className="fa-solid fa-arrow-down" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT I DO / SERVICES */}
      <section className="section-block" id="services">
        <div className="section-title-row">
          <h2>{t.whatIDo}</h2>
          <span className="section-tag-muted">{t.servicesTag}</span>
        </div>
        <p className="section-lead-quote">{t.servicesQuote}</p>

        <div className="services-vertical-list">
          {services.map((item) => (
            <div className="service-row-item card-3d-hover" key={item.num}>
              <div className="service-col-num">{item.num}</div>
              <div className="service-col-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="service-bullets">
                  {item.bullets.map((b, idx) => (
                    <span key={idx}><i className="fa-solid fa-asterisk" /> {b}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CAREER & EXPERIENCE */}
      <section className="section-block" id="experience">
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {t.marquee}
          </div>
        </div>

        <div className="section-title-row mt-12">
          <h2>{t.careerTitle}</h2>
          <span className="section-tag-muted">{t.roadmapTag}</span>
        </div>

        <div className="experience-timeline-cards">
          {experience.map((exp, idx) => (
            <div className="experience-card card-3d-hover" key={idx}>
              <div className="exp-header">
                <span className="exp-role">{exp.role}</span>
                <span className="exp-period">{exp.period}</span>
              </div>
              <span className="exp-company">{exp.company}</span>
              <p className="exp-desc">{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SELECTED PROJECTS */}
      <section className="section-block" id="projects">
        <div className="section-title-row">
          <h2>{t.selectedProjects}</h2>
          <span className="section-tag-muted">({projects.length})</span>
        </div>
        <p className="section-subtext">{t.projectsSubtext}</p>

        <div className="projects-showcase-list">
          {projects.map((proj) => (
            <div className="project-display-card card-3d-hover" key={proj.num}>
              <div className="proj-num-big">{proj.num}</div>
              <div className="proj-media-viewport">
                <img src={proj.img} alt={proj.title} loading="lazy" />
                <a href={proj.url} target="_blank" rel="noreferrer" className="btn-preview-floating">
                  <i className="fa-solid fa-arrow-up-right-from-square" /> {t.livePreview}
                </a>
              </div>
              <div className="proj-details-panel">
                <h3>{proj.title}</h3>
                <p>{proj.desc}</p>
                <div className="proj-stack-tags">
                  {proj.stack.map((st, i) => (
                    <span key={i}>{st}</span>
                  ))}
                </div>
                <a href={proj.url} target="_blank" rel="noreferrer" className="proj-direct-link">
                  {t.openProject} <i className={`fa-solid ${lang === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'}`} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="section-block" id="stack">
        <div className="section-title-row">
          <h2>{t.myStack}</h2>
          <span className="section-tag-muted">{t.arsenalTag}</span>
        </div>

        <div className="stack-bento-grid">
          {stackCategories.map((cat, idx) => (
            <div className="stack-bento-box card-3d-hover" key={idx}>
              <span className="stack-cat-title">{cat.name}</span>
              <div className="stack-tags-cloud">
                {cat.skills.map((skill, i) => (
                  <span className="stack-pill" key={i}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-block" id="testimonials">
        <div className="section-title-row">
          <h2>{t.testimonialsTitle}</h2>
          <span className="section-tag-muted">({displayedReviews.length})</span>
        </div>
        <p className="section-subtext">{t.testimonialsSub}</p>

        <div className="review-composer-box card-3d-hover">
          <h3>{t.leaveReview}</h3>
          {reviewSubmitted && (
            <div className="toast-saved">{t.reviewSuccess}</div>
          )}
          <form onSubmit={handleAddReview} className="composer-grid">
            <input 
              type="text" 
              placeholder={t.namePlace}
              value={newReview.author} 
              onChange={(e) => setNewReview({ ...newReview, author: e.target.value })} 
              required 
            />
            <input 
              type="text" 
              placeholder={t.rolePlace}
              value={newReview.role} 
              onChange={(e) => setNewReview({ ...newReview, role: e.target.value })} 
            />
            <select 
              value={newReview.stars} 
              onChange={(e) => setNewReview({ ...newReview, stars: Number(e.target.value) })}
              className="rating-select"
            >
              <option value="5">★★★★★ (5/5)</option>
              <option value="4">★★★★☆ (4/5)</option>
              <option value="3">★★★☆☆ (3/5)</option>
            </select>
            <textarea 
              rows="3" 
              placeholder={t.quotePlace}
              value={newReview.quote} 
              onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })} 
              required 
              className="full-col"
            />
            <button type="submit" className="btn-send-review" disabled={isAddingReview}>
              {t.saveReview}
            </button>
          </form>
        </div>

        <div className="testimonials-masonry">
          {loadingReviews && testimonials.length === 0 ? (
            <p className="text-muted">{lang === 'en' ? 'Loading live reviews...' : 'جاري تحميل التقييمات...'}</p>
          ) : (
            displayedReviews.map((tItem) => (
              <div className="testimonial-item-card card-3d-hover" key={tItem.id || Math.random()}>
                <div className="stars-row">
                  {[...Array(tItem.stars || 5)].map((_, i) => (
                    <i className="fa-solid fa-star" key={i} />
                  ))}
                </div>
                <p className="testimonial-text">"{tItem.quote}"</p>
                <div className="testimonial-author">
                  <h4>{tItem.author}</h4>
                  <span>{tItem.role || (lang === 'en' ? 'Verified Client' : 'عميل معتمد')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section-block" id="contact">
        <div className="section-title-row">
          <h2>{t.getInTouch}</h2>
          <span className="section-tag-muted">{t.directTag}</span>
        </div>

        <div className="contact-split-layout">
          <div className="contact-callout">
            <h3 className="big-talk-title">{t.talkTitle}</h3>
            <p>{t.talkSub}</p>
            
            <div className="direct-channels-list">
              <a href="mailto:amrothman154@gmail.com" className="channel-item card-3d-hover">
                <i className="fa-solid fa-envelope" />
                <div>
                  <span className="label">EMAIL</span>
                  <span className="value">amrothman154@gmail.com</span>
                </div>
              </a>
              <a href="https://wa.me/201009694831" target="_blank" rel="noreferrer" className="channel-item card-3d-hover">
                <i className="fa-brands fa-whatsapp" />
                <div>
                  <span className="label">WHATSAPP</span>
                  <span className="value">+20 100 969 4831</span>
                </div>
              </a>
              <div className="channel-item card-3d-hover">
                <i className="fa-solid fa-location-dot" />
                <div>
                  <span className="label">LOCATION</span>
                  <span className="value">Cairo, Egypt</span>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form-minimal card-3d-hover" onSubmit={handleFormSubmit}>
            {formStatus && <div className="toast-saved">{t.msgSentSuccess}</div>}
            <div className="form-field">
              <label>{t.nameLabel}</label>
              <input 
                type="text" 
                placeholder={lang === 'en' ? "Enter your name" : "أدخل اسمك الكريم"}
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                required 
              />
            </div>
            <div className="form-field">
              <label>{t.emailLabel}</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
              />
            </div>
            <div className="form-field">
              <label>{t.msgLabel}</label>
              <textarea 
                rows="4" 
                placeholder={lang === 'en' ? "Tell me about your project scope..." : "اكتب فكرة مشروعك أو استفسارك هنا..."}
                value={formData.message} 
                onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                required 
              />
            </div>
            <button type="submit" className="btn-send-message" disabled={isSubmitting}>
              {t.sendBtn} <i className={`fa-solid ${lang === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'}`} />
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="future-footer">
        <h2 className="footer-giant-title">{t.buildFuture}</h2>
        <div className="footer-bar-bottom">
          <p>{t.allRights}</p>
          <div className="footer-links-row">
            <a href="https://github.com/0xAmr5" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/x-amr-othman-x1" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://wa.me/201009694831" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </footer>

      {/* Floating Scroll */}
      {showScrollTop && (
        <button className="floating-scroll-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="fa-solid fa-arrow-up" />
        </button>
      )}
    </div>
  );
}

export default App;