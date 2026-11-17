import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('app_theme', theme);
    localStorage.setItem('app_lang', lang);
  }, [theme, lang]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 450);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveCaseStudy(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'));

  const copyEmail = () => {
    navigator.clipboard.writeText('amrothman154@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const t = {
    name: lang === 'en' ? "Amr Othman" : "عمرو عثمان",
    role: lang === 'en' ? "Full-Stack Software Engineer" : "مهندس برمجيات فول ستاك",
    location: lang === 'en' ? "Cairo, Egypt" : "القاهرة، مصر",
    navAbout: lang === 'en' ? 'Overview' : 'نظرة عامة',
    navProjects: lang === 'en' ? 'Work' : 'المشاريع',
    navPlayground: lang === 'en' ? 'API Sandbox' : 'محاكي الـ API',
    navStack: lang === 'en' ? 'Stack' : 'التقنيات',
    navEdu: lang === 'en' ? 'Background' : 'التعليم',
    navContact: lang === 'en' ? 'Contact' : 'تواصل معي',
    heroHeadline: lang === 'en'
      ? "Building production web systems, secure APIs, and real-time operational software."
      : "أبني أنظمة الويب الإنتاجية، وواجهات البرمجة الآمنة، والبرمجيات التشغيلية اللحظية.",
    heroSub: lang === 'en'
      ? "Full-Stack Software Engineer specializing in React.js, Node.js, Express, MongoDB, and Firebase. Focused on clean system architecture, role-based access control, and fast user interfaces."
      : "مهندس برمجيات فول ستاك متخصص في React.js و Node.js و Express و MongoDB و Firebase. أركز على المعمارية النظيفة للأنظمة، تأمين الصلاحيات، وسرعة واجهات المستخدم.",
    btnWork: lang === 'en' ? "Explore Selected Work" : "استعراض المشاريع",
    btnCv: lang === 'en' ? "Resume (PDF)" : "السيرة الذاتية (PDF)",
    bentoFocusTitle: lang === 'en' ? "Core Engineering Focus" : "التركيز الهندسي الأساسي",
    bentoFocusItems: lang === 'en'
      ? ["End-to-End SaaS Architecture", "RESTful APIs & JWT / RBAC Security", "Real-Time Cloud Sync & Dashboards"]
      : ["معمارية منصات SaaS المتكاملة", "تطوير RESTful APIs وتأمين الصلاحيات", "المزامنة السحابية اللحظية ولوحات التحكم"],
    bentoMetrics: [
      { num: "8+", text: lang === 'en' ? "Shipped Systems" : "أنظمة منشورة" },
      { num: "3+", text: lang === 'en' ? "Commercial SaaS" : "منصات تجارية" }
    ],
    projectsTitle: lang === 'en' ? "Selected Engineering Work" : "أبرز المشاريع الهندسية",
    projectsSub: lang === 'en'
      ? "Click 'Architecture' on any project to inspect system design and technical decisions."
      : "اضغط على 'المعمارية' في أي مشروع لاستعراض تصميم النظام والقرارات التقنية.",
    filterAll: lang === 'en' ? "All Work" : "الكل",
    filterFullstack: lang === 'en' ? "Full-Stack & SaaS" : "Full-Stack & SaaS",
    filterFrontend: lang === 'en' ? "Frontend & APIs" : "واجهات ومنصات",
    archBtn: lang === 'en' ? "Architecture" : "المعمارية",
    playgroundTitle: lang === 'en' ? "Interactive API & Security Sandbox" : "محاكي الـ APIs والأمان التفاعلي",
    playgroundSub: lang === 'en'
      ? "Test real endpoint structures and RBAC authorization flows from my backend architectures."
      : "جرّب هيكلة الـ Endpoints وتدفقات الصلاحيات (RBAC) من أنظمة الباك إند التي قمت ببنائها.",
    stackTitle: lang === 'en' ? "Technical Stack" : "المهارات والتقنيات",
    eduTitle: lang === 'en' ? "Education & Training" : "التعليم والتدريب الهندسي",
    reviewsTitle: lang === 'en' ? "Client Endorsements" : "آراء العملاء",
    contactTitle: lang === 'en' ? "Get in Touch" : "تواصل معي",
    contactSub: lang === 'en'
      ? "Open for Full-Stack / Backend software engineering roles and technical collaborations."
      : "متاح لفرص العمل الهندسية (Full-Stack / Backend) والتعاون في المشاريع البرمجية.",
    callsLabel: lang === 'en' ? "Direct Calls" : "للمكالمات الهاتفية",
    whatsappLabel: lang === 'en' ? "WhatsApp" : "واتساب",
    emailLabel: lang === 'en' ? "Email" : "البريد الإلكتروني",
    copiedText: lang === 'en' ? "Copied" : "تم النسخ",
    nameInput: lang === 'en' ? "Your Name" : "الاسم بالكامل",
    emailInput: lang === 'en' ? "Email Address" : "البريد الإلكتروني",
    msgInput: lang === 'en' ? "Describe your project or role..." : "اكتب تفاصيل مشروعك أو رسالتك...",
    sendBtn: lang === 'en' ? (isSubmitting ? "Sending..." : "Send Message") : (isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"),
    msgSent: lang === 'en' ? "Message sent. I will get back to you shortly." : "تم إرسال رسالتك بنجاح، سأرد عليك قريباً.",
    footerText: lang === 'en'
      ? `© ${new Date().getFullYear()} Amr Othman — Cairo, Egypt.`
      : `© ${new Date().getFullYear()} عمرو عثمان — القاهرة، مصر.`
  };

  const apiEndpoints = [
    {
      method: "POST",
      path: "/api/v1/auth/login",
      service: "SARAHA Backend API",
      status: "200 OK",
      latency: "42ms",
      headers: `{
  "Content-Type": "application/json",
  "X-RateLimit-Remaining": "98"
}`,
      response: `{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_89a4f12c",
    "role": "USER",
    "verified": true
  }
}`
    },
    {
      method: "GET",
      path: "/api/v1/cases/:caseId/documents",
      service: "Law Firm RBAC Guard",
      status: "200 OK",
      latency: "68ms",
      headers: `{
  "Authorization": "Bearer <JWT_LAWYER_TOKEN>",
  "X-Workspace-Role": "LAWYER_ASSIGNED"
}`,
      response: `{
  "caseId": "CASE-2026-409",
  "accessGranted": true,
  "documents": [
    {
      "name": "session_brief_final.pdf",
      "storage": "cloudinary_encrypted",
      "signedUrl": "https://res.cloudinary.com/..."
    }
  ]
}`
    },
    {
      method: "PATCH",
      path: "/api/v1/fleet/treasury/settle",
      service: "TransitFlow Realtime Engine",
      status: "200 OK",
      latency: "31ms",
      headers: `{
  "Authorization": "Bearer <ADMIN_TREASURY_KEY>",
  "X-Sync-Mode": "FIREBASE_RTDB"
}`,
      response: `{
  "shiftId": "SHF-902",
  "driverId": "DRV-14",
  "grossRevenue": 4850.00,
  "loggedExpenses": 620.00,
  "netProfitAudited": 4230.00,
  "syncedAt": "2026-11-17T05:30:00Z"
}`
    }
  ];

  const projects = [
    {
      id: 1,
      type: "fullstack",
      title: lang === 'en' ? "Mahmoud Shabaan Law Firm SaaS" : "منظومة مكتب أ. محمود شعبان للمحاماة",
      badge: "Commercial Legal SaaS",
      summary: lang === 'en'
        ? "Multi-role legal case management system with encrypted Cloudinary archiving, session scheduling, and client tracking."
        : "منظومة قانونية متعددة الصلاحيات لإدارة القضايا، جدولة الجلسات، وأرشفة المستندات المشفرة عبر Cloudinary.",
      stack: ["React 18", "Tailwind CSS", "Firestore", "Cloudinary", "JWT", "RBAC"],
      liveUrl: "https://mahmoud-shabaan-law-firm.vercel.app/",
      repoUrl: null,
      img: "/mahmoud-shabaan.png",
      architecture: {
        problem: lang === 'en'
          ? "Paper-based case files and manual court session tracking caused scheduling bottlenecks and slow document retrieval across lawyers."
          : "الاعتماد على الملفات الورقية والمتابعة اليدوية للجلسات كان يسبب تأخيراً في الوصول للمستندات وتنسيق العمل بين المحامين.",
        solution: lang === 'en'
          ? "Engineered a cloud SaaS workspace separating Admin and Lawyer permissions (RBAC), indexing cases in Cloud Firestore, and automating encrypted PDF/media uploads via Cloudinary."
          : "بناء منصة سحابية تفصل بين صلاحيات المدير والمحامين (RBAC)، مع فهرسة لحظية للقضايا في Firestore وأتمتة رفع المستندات عبر Cloudinary.",
        highlights: lang === 'en'
          ? [
              "Role-Based Access Control (RBAC) isolating administrative controls from assigned lawyer tasks.",
              "Client litigation portal providing real-time case status updates without exposing internal notes.",
              "Structured Firestore indexing for instant search by case number, client name, or court date."
            ]
          : [
              "نظام صلاحيات (RBAC) يفصل لوحة الإدارة عن مساحات عمل المحامين.",
              "بوابة للموكلين لمتابعة حالة القضايا لحظياً دون كشف الملاحظات الداخلية.",
              "فهرسة دقيقة في Firestore للبحث الفوري برقم الدعوى أو اسم الموكل أو تاريخ الجلسة."
            ]
      }
    },
    {
      id: 2,
      type: "fullstack",
      title: lang === 'en' ? "TransitFlow Fleet Operations" : "منظومة TransitFlow لإدارة الأساطيل",
      badge: "Real-Time Operations",
      summary: lang === 'en'
        ? "Real-time fleet dispatch and treasury auditing platform tracking daily bus manifests, driver settlements, and net profits."
        : "نظام سحابي لحظي لإدارة أساطيل النقل، حركة الباصات، عُهد السائقين، وحساب صافي الأرباح اليومية تلقائياً.",
      stack: ["JavaScript ES6+", "Firebase Realtime DB", "Role-Based Auth", "SPA"],
      liveUrl: "https://transitflow-system.vercel.app/",
      repoUrl: null,
      img: "/transitflow.png",
      architecture: {
        problem: lang === 'en'
          ? "Manual spreadsheet reconciliation for daily bus trips, fuel expenses, and driver cash collections led to accounting discrepancies."
          : "التسوية اليدوية لحركة الرحلات اليومية ومصروفات التشغيل وعُهد السائقين كانت تسبب أخطاء حسابية وتأخيراً في الجرد.",
        solution: lang === 'en'
          ? "Built a zero-dependency Single Page Application backed by Firebase Realtime Database with separate Driver Manifest portals and Admin Treasury dashboards."
          : "تطوير تطبيق SPA خفيف متصل بقاعدة بيانات Firebase اللحظية مع بوابة مستقلة للسائقين ولوحة تدقيق مالي للإدارة.",
        highlights: lang === 'en'
          ? [
              "Real-time WebSocket listeners updating dispatch status and treasury balances instantaneously.",
              "Automated net-profit engine calculating trip revenues minus logged operational expenses.",
              "Lightweight architecture optimized for fast mobile loading on cellular networks."
            ]
          : [
              "مزامنة لحظية لتحديث حالة الرحلات والأرصدة المالية فوراً دون إعادة تحميل الصفحة.",
              "محرك حسابي تلقائي لصافي الأرباح بعد خصم المصروفات التشغيلية المسجلة.",
              "بنية برمجية خفيفة وسريعة التحميل على الهواتف وشبكات البيانات المتوسطة."
            ]
      }
    },
    {
      id: 3,
      type: "fullstack",
      title: lang === 'en' ? "SARAHA APP — Backend REST API" : "تطبيق صراحة — Backend RESTful API",
      badge: "Backend Architecture",
      summary: lang === 'en'
        ? "Modular Node.js & Express REST API featuring JWT auth, email verification, Bcrypt hashing, and Cloudinary media pipelines."
        : "واجهة برمجية خلفية متكاملة بـ Node.js و Express تدعم المصادقة بـ JWT، تأكيد البريد، تشفير كلمات المرور، ورفع الصور.",
      stack: ["Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "Cloudinary"],
      liveUrl: null,
      repoUrl: "https://github.com/0xAmr5",
      img: null,
      architecture: {
        problem: lang === 'en'
          ? "Anonymous messaging platforms require strict endpoint protection against unauthorized inbox access, spam payloads, and weak credential storage."
          : "تطبيقات الرسائل المجهولة تتطلب حماية صارمة للـ Endpoints لمنع الوصول غير المصرح به للرسائل وتأمين بيانات الحسابات.",
        solution: lang === 'en'
          ? "Architected a layered Express.js backend with MongoDB/Mongoose schemas, JWT verification middleware, Bcrypt salting, and centralized error handling."
          : "تصميم خادم Express.js مقسم لطبقات مع قواعد بيانات MongoDB و Mongoose، ووسائط تحقق JWT وتشفير Bcrypt ومعالجة مركزية للأخطاء.",
        highlights: lang === 'en'
          ? [
              "Modular MVC folder structure separating routes, controllers, validation schemas, and services.",
              "Stateless JWT authentication with role verification and email confirmation workflows.",
              "Automated image upload and cleanup pipelines integrated with Cloudinary SDK."
            ]
          : [
              "هيكلة معيارية تفصل المسارات (Routes) عن منطق العمل (Controllers) وقواعد التحقق.",
              "مصادقة JWT آمنة مع تفعيل الحسابات عبر البريد الإلكتروني.",
              "إدارة آلية لرفع وتحديث الصور الشخصية عبر Cloudinary."
            ]
      }
    },
    {
      id: 4,
      type: "fullstack",
      title: lang === 'en' ? "Dairut Doctors Directory" : "دليل أطباء وعيادات ديروط",
      badge: "Healthcare Platform",
      summary: lang === 'en'
        ? "Centralized medical search platform indexing clinics, specialties, and diagnostic labs with live Firestore updates."
        : "منصة طبية شاملة للبحث عن العيادات والتخصصات ومعامل التحاليل مع تحديث لحظي للمواعيد والعناوين.",
      stack: ["React.js", "Firebase Firestore", "Tailwind CSS", "Vercel"],
      liveUrl: "https://dairut-doctors-directory.vercel.app/",
      repoUrl: null,
      img: "/dairut-doctors.png",
      architecture: {
        problem: lang === 'en'
          ? "Patients lacked a reliable, mobile-accessible directory to verify clinic hours, locations, and medical specialties."
          : "عدم وجود دليل رقمي موحد وسريع يتيح للمرضى معرفة مواعيد العيادات والتخصصات والعناوين بدقة.",
        solution: lang === 'en'
          ? "Developed a fast React & Firestore directory with multi-criteria client filtering and cloud-managed clinic profiles."
          : "تطوير منصة بحث سريعة بـ React و Firestore مع فلترة فورية حسب التخصص والمنطقة وإدارة سحابية للبيانات.",
        highlights: lang === 'en'
          ? [
              "Instant client-side filtering across specialties and clinic names with zero search lag.",
              "Cloud Firestore backend allowing real-time updates to clinic schedules and phone numbers.",
              "Mobile-first UI designed for accessibility across all screen sizes."
            ]
          : [
              "فلترة فورية حسب التخصص واسم الطبيب بدون أي تأخير.",
              "ربط سحابي مع Firestore لتحديث المواعيد وأرقام الحجز لحظياً.",
              "تصميم متجاوب بالكامل لسهولة الاستخدام من الهاتف."
            ]
      }
    },
    {
      id: 5,
      type: "frontend",
      title: "DevFinder Pro — GitHub Analytics",
      badge: "REST API & Caching",
      summary: lang === 'en'
        ? "GitHub developer lookup and repository analytics tool with client-side response caching and async error handling."
        : "أداة بحث وتحليل لحسابات المطورين على GitHub باستخدام REST API مع تخزين مؤقت لتسريع الاستجابة.",
      stack: ["JavaScript ES6+", "GitHub REST API", "Client Caching", "CSS3"],
      liveUrl: "https://devfinder-pro-tan.vercel.app/",
      repoUrl: "https://github.com/0xAmr5",
      img: "/devfinder.png",
      architecture: {
        problem: lang === 'en'
          ? "Unauthenticated GitHub API requests hit rate limits quickly when repeatedly querying developer profiles."
          : "الاستعلامات المتكررة على GitHub API بدون تخزين مؤقت تستهلك الحد المسموح للطلبات (Rate Limit) وتبطئ العرض.",
        solution: lang === 'en'
          ? "Implemented an in-memory & LocalStorage caching layer alongside debounced async fetch requests and graceful 404/rate-limit states."
          : "بناء طبقة تخزين مؤقت (Caching) مع معالجة ذكية لحالات الخطأ وتجاوز الحد المسموح للطلبات.",
        highlights: lang === 'en'
          ? [
              "Client-side caching eliminates duplicate network requests for previously searched profiles.",
              "Clean asynchronous state handling for loading, rate-limit warnings, and empty results.",
              "Responsive developer profile layout displaying repo stats, bio, and social links."
            ]
          : [
              "تخزين مؤقت يمنع تكرار طلبات الشبكة للحسابات التي تم البحث عنها مسبقاً.",
              "معالجة احترافية لحالات التحميل والأخطاء وتجاوز الحد المسموح.",
              "عرض منظم لإحصائيات المستودعات والبيانات التقنية للمطور."
            ]
      }
    },
    {
      id: 6,
      type: "frontend",
      title: lang === 'en' ? "Noor Al-Islam & Habit Flow" : "منصة نور الإسلام وتطبيق Habit Flow",
      badge: "Web Applications",
      summary: lang === 'en'
        ? "Production web apps demonstrating audio streaming APIs, prayer time calculations, and persistent client state."
        : "تطبيقات ويب إنتاجية تضم واجهات برمجة الصوتيات، مواقيت الصلاة، وإدارة الحالة المحلية المستمرة.",
      stack: ["React.js", "REST APIs", "LocalStorage", "Bento Grid"],
      liveUrl: "https://noor-alislam.vercel.app/",
      repoUrl: "https://github.com/0xAmr5",
      img: "/noor-alislam.png",
      architecture: {
        problem: lang === 'en'
          ? "Users need lightweight, ad-free utilities for daily Quran/prayer tracking and personal habit consistency."
          : "الحاجة إلى تطبيقات خفيفة وخالية من الإعلانات لمتابعة القرآن ومواقيت الصلاة والعادات اليومية.",
        solution: lang === 'en'
          ? "Built clean, responsive SPAs integrating external Islamic REST APIs, HTML5 audio streams, and persistent LocalStorage state."
          : "تطوير تطبيقات SPA متجاوبة ومتصلة بواجهات برمجة خارجية مع حفظ التقدم والبيانات محلياً.",
        highlights: lang === 'en'
          ? [
              "Seamless audio playback controls and dynamic prayer schedule fetching.",
              "Persistent state architecture preserving user habits and streaks across sessions.",
              "Zero-clutter UI optimized for daily mobile usage."
            ]
          : [
              "تشغيل صوتي سلس وجلب تلقائي لمواقيت الصلاة حسب الموقع.",
              "حفظ مستمر لسجل العادات اليومية ونسب الإنجاز.",
              "واجهة هادئة ومريحة للاستخدام اليومي على الهاتف."
            ]
      }
    }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.type === activeFilter);

  const skillCategories = [
    {
      title: lang === 'en' ? "Frontend" : "الواجهات الأمامية",
      items: ["React.js (v18)", "JavaScript (ES6+)", "TypeScript", "Tailwind CSS", "HTML5 / CSS3", "Vite", "SPA"]
    },
    {
      title: lang === 'en' ? "Backend & Security" : "الخوادم والأمان",
      items: ["Node.js", "Express.js", "RESTful APIs", "JWT Auth", "RBAC", "Bcrypt", "Middleware"]
    },
    {
      title: lang === 'en' ? "Databases & Cloud" : "قواعد البيانات والسحابة",
      items: ["MongoDB", "Mongoose", "Firebase Firestore", "Realtime DB", "Cloudinary", "AWS (EC2, S3)", "Vercel"]
    },
    {
      title: lang === 'en' ? "Languages & Tools" : "اللغات والأدوات",
      items: ["Java", "Python", "Git & GitHub", "Postman", "OOP", "Data Structures", "Algorithms"]
    }
  ];

  const reviews = [
    {
      author: lang === 'en' ? "Counsellor Mahmoud Shabaan" : "أ. محمود شعبان",
      role: lang === 'en' ? "Managing Partner — Law Firm" : "مؤسس مكتب محمود شعبان للمحاماة",
      quote: lang === 'en'
        ? "Amr engineered a complete legal management system for our firm. Session tracking, lawyer permissions, and document archiving saved us hours of daily administrative work."
        : "مهندس عمرو نفّذ لنا منظومة قانونية متكاملة لإدارة المكتب. متابعة الجلسات وصلاحيات المحامين وأرشفة الملفات وفّرت علينا ساعات من العمل الإداري اليومي."
    },
    {
      author: lang === 'en' ? "Eng. Hazem El-Sayed" : "م. حازم السيد",
      role: lang === 'en' ? "Operations Director — TransitFlow" : "مدير التشغيل — منظومة TransitFlow",
      quote: lang === 'en'
        ? "TransitFlow gave us real-time visibility over fleet schedules and driver settlements. Clean interface, zero downtime, and delivered right on schedule."
        : "منظومة TransitFlow نظمت حركة الأسطول وحسابات السائقين بشكل لحظي ودقيق جداً. واجهة سهلة وسريعة والتزام كامل بمواعيد التسليم."
    },
    {
      author: lang === 'en' ? "Dr. Ahmed Mansour" : "د. أحمد منصور",
      role: lang === 'en' ? "Medical Coordinator — Dairut" : "منسق طبي — دليل أطباء ديروط",
      quote: lang === 'en'
        ? "Fast, responsive, and easy for patients to search clinics on mobile. Cloud updates work smoothly without technical complexity."
        : "منصة سريعة ومتجاوبة جداً على الموبايل، والبحث عن العيادات والتخصصات وتحديث البيانات السحابية يعمل بكل سلاسة."
    }
  ];

  const currentApi = apiEndpoints[selectedEndpoint];

  return (
    <div className="app-shell">
      {/* Subtle Top Radial Spotlight */}
      <div className="top-spotlight" />

      {/* NAVBAR */}
      <header className="navbar">
        <div className="container nav-row">
          <a href="#overview" className="logo-mark">
            amr<span className="accent-dot">.</span>dev
          </a>

          <nav className="desktop-nav">
            <a href="#overview">{t.navAbout}</a>
            <a href="#work">{t.navProjects}</a>
            <a href="#sandbox">{t.navPlayground}</a>
            <a href="#stack">{t.navStack}</a>
            <a href="#background">{t.navEdu}</a>
            <a href="#contact">{t.navContact}</a>
          </nav>

          <div className="nav-actions">
            <button className="ctrl-btn" onClick={toggleTheme} aria-label="Toggle theme">
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
            </button>
            <button className="ctrl-btn font-mono" onClick={toggleLang}>
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <button className="burger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#overview" onClick={() => setMenuOpen(false)}>{t.navAbout}</a>
            <a href="#work" onClick={() => setMenuOpen(false)}>{t.navProjects}</a>
            <a href="#sandbox" onClick={() => setMenuOpen(false)}>{t.navPlayground}</a>
            <a href="#stack" onClick={() => setMenuOpen(false)}>{t.navStack}</a>
            <a href="#background" onClick={() => setMenuOpen(false)}>{t.navEdu}</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>{t.navContact}</a>
            <a href="/cv.pdf" target="_blank" rel="noreferrer" className="mobile-cv">
              {t.btnCv}
            </a>
          </div>
        )}
      </header>

      {/* BENTO HERO SECTION */}
      <section className="hero-section" id="overview">
        <div className="container">
          <div className="bento-hero-grid">
            {/* Main Bio Tile */}
            <div className="bento-tile tile-main">
              <div className="eyebrow-line">
                <span>{t.name}</span>
                <span>/</span>
                <span>{t.role}</span>
                <span>/</span>
                <span>{t.location}</span>
              </div>
              <h1 className="main-headline">{t.heroHeadline}</h1>
              <p className="sub-headline">{t.heroSub}</p>

              <div className="hero-btns">
                <a href="#work" className="btn-primary">
                  {t.btnWork}
                </a>
                <a href="/cv.pdf" target="_blank" rel="noreferrer" className="btn-secondary">
                  <i className="fa-solid fa-arrow-down" /> {t.btnCv}
                </a>
              </div>
            </div>

            {/* Portrait Tile */}
            <div className="bento-tile tile-photo">
              <img src="/profile.jpg" alt="Amr Othman" />
            </div>

            {/* Engineering Focus Tile */}
            <div className="bento-tile tile-focus">
              <span className="tile-label">{t.bentoFocusTitle}</span>
              <ul className="focus-list">
                {t.bentoFocusItems.map((item, idx) => (
                  <li key={idx}>
                    <i className="fa-solid fa-check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metrics & Links Tile */}
            <div className="bento-tile tile-stats">
              <div className="stats-pair">
                {t.bentoMetrics.map((m, idx) => (
                  <div className="stat-box" key={idx}>
                    <strong>{m.num}</strong>
                    <span>{m.text}</span>
                  </div>
                ))}
              </div>

              <div className="quick-links-bar">
                <a href="https://github.com/0xAmr5" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <i className="fa-brands fa-github" /> GitHub
                </a>
                <a href="https://linkedin.com/in/x-amr-othman-x1" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <i className="fa-brands fa-linkedin" /> LinkedIn
                </a>
                <button type="button" onClick={copyEmail} className="copy-email-chip">
                  <i className="fa-regular fa-copy" /> {copied ? t.copiedText : "Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="section-pad" id="work">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2>{t.projectsTitle}</h2>
              <p>{t.projectsSub}</p>
            </div>

            <div className="segmented-filter">
              <button
                className={activeFilter === 'all' ? 'active' : ''}
                onClick={() => setActiveFilter('all')}
              >
                {t.filterAll}
              </button>
              <button
                className={activeFilter === 'fullstack' ? 'active' : ''}
                onClick={() => setActiveFilter('fullstack')}
              >
                {t.filterFullstack}
              </button>
              <button
                className={activeFilter === 'frontend' ? 'active' : ''}
                onClick={() => setActiveFilter('frontend')}
              >
                {t.filterFrontend}
              </button>
            </div>
          </div>

          <div className="work-grid">
            {filteredProjects.map((project) => (
              <article className="work-card" key={project.id}>
                {project.img ? (
                  <div className="work-media">
                    <img src={project.img} alt={project.title} loading="lazy" />
                    <span className="work-badge">{project.badge}</span>
                  </div>
                ) : (
                  <div className="work-terminal">
                    <div className="term-bar">
                      <span /><span /><span />
                      <small>saraha-api — node</small>
                    </div>
                    <pre>{`POST /api/v1/auth/login 200 OK
Middleware: verifyJWT -> RBAC_PASS
Database: MongoDB Atlas Connected`}</pre>
                    <span className="work-badge">{project.badge}</span>
                  </div>
                )}

                <div className="work-body">
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>

                  <div className="work-tags">
                    {project.stack.map((tech, i) => (
                      <span key={i}>{tech}</span>
                    ))}
                  </div>

                  <div className="work-footer">
                    <button
                      type="button"
                      className="btn-arch"
                      onClick={() => setActiveCaseStudy(project)}
                    >
                      <i className="fa-solid fa-diagram-project" /> {t.archBtn}
                    </button>

                    <div className="work-ext-links">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer">
                          Live <i className="fa-solid fa-arrow-up-right-from-square" />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noreferrer">
                          Code <i className="fa-brands fa-github" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE API SANDBOX */}
      <section className="section-pad" id="sandbox">
        <div className="container">
          <div className="section-header">
            <h2>{t.playgroundTitle}</h2>
            <p>{t.playgroundSub}</p>
          </div>

          <div className="sandbox-wrapper">
            <div className="endpoint-selector">
              {apiEndpoints.map((ep, index) => (
                <button
                  key={index}
                  type="button"
                  className={`ep-tab ${selectedEndpoint === index ? 'selected' : ''}`}
                  onClick={() => setSelectedEndpoint(index)}
                >
                  <span className={`method-pill ${ep.method.toLowerCase()}`}>{ep.method}</span>
                  <div className="ep-meta">
                    <code>{ep.path}</code>
                    <small>{ep.service}</small>
                  </div>
                </button>
              ))}
            </div>

            <div className="response-viewer">
              <div className="viewer-header">
                <div className="status-group">
                  <span className="status-ok">{currentApi.status}</span>
                  <span className="latency-tag">{currentApi.latency}</span>
                </div>
                <span className="service-label">{currentApi.service}</span>
              </div>

              <div className="viewer-panes">
                <div className="pane-block">
                  <span className="pane-title">Request Headers</span>
                  <pre>{currentApi.headers}</pre>
                </div>
                <div className="pane-block">
                  <span className="pane-title">JSON Response Payload</span>
                  <pre className="json-out">{currentApi.response}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL STACK */}
      <section className="section-pad" id="stack">
        <div className="container">
          <div className="section-header">
            <h2>{t.stackTitle}</h2>
          </div>

          <div className="stack-columns">
            {skillCategories.map((cat, idx) => (
              <div className="stack-box" key={idx}>
                <h3>{cat.title}</h3>
                <div className="chip-list">
                  {cat.items.map((item, i) => (
                    <span className="chip" key={i}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION & ENDORSEMENTS */}
      <section className="section-pad" id="background">
        <div className="container">
          <div className="section-header">
            <h2>{t.eduTitle}</h2>
          </div>

          <div className="edu-row">
            <div className="edu-item">
              <span className="mono-date">09/2023 – Present</span>
              <h3>{lang === 'en' ? "Bachelor of Computer Science" : "بكالوريوس علوم الحاسب"}</h3>
              <p className="org-name">Arab Open University – Egypt (Cairo, El Shorouk)</p>
              <p className="org-desc">
                {lang === 'en'
                  ? "Core coursework in Software Engineering, OOP, Data Structures, Algorithms, and Database Design."
                  : "دراسة هندسة البرمجيات، البرمجة كائنية التوجه، هياكل البيانات، الخوارزميات، وتصميم قواعد البيانات."}
              </p>
            </div>

            <div className="edu-item">
              <span className="mono-date">Route Academy</span>
              <h3>{lang === 'en' ? "Backend Software Development Diploma (Node.js)" : "دبلومة تطوير الخوادم (Node.js)"}</h3>
              <p className="org-name">Node.js • Express • MongoDB • JWT</p>
              <p className="org-desc">
                {lang === 'en'
                  ? "Intensive engineering training in RESTful API architecture, authentication security, NoSQL modeling, and cloud storage."
                  : "تدريب عملي مكثف في بناء RESTful APIs وتأمين المصادقة وهيكلة قواعد البيانات السحابية."}
              </p>
            </div>

            <div className="edu-item">
              <span className="mono-date">Frontend Architecture</span>
              <h3>{lang === 'en' ? "Frontend Web Development & UI Engineering" : "تطوير الواجهات الأمامية ومعمارية الـ UI"}</h3>
              <p className="org-name">React.js • Modern ES6+ • Responsive Systems</p>
              <p className="org-desc">
                {lang === 'en'
                  ? "Component-driven architecture, state management, REST API integration, and performance optimization."
                  : "بناء واجهات تفاعلية قائمة على المكونات وإدارة الحالة والربط مع الـ APIs وتحسين الأداء."}
              </p>
            </div>
          </div>

          <div className="reviews-subblock">
            <h3 className="sub-block-title">{t.reviewsTitle}</h3>
            <div className="reviews-row">
              {reviews.map((rev, idx) => (
                <div className="quote-card" key={idx}>
                  <p>"{rev.quote}"</p>
                  <div className="quote-meta">
                    <strong>{rev.author}</strong>
                    <span>{rev.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section-pad" id="contact">
        <div className="container">
          <div className="contact-panel">
            <div className="contact-info">
              <h2>{t.contactTitle}</h2>
              <p>{t.contactSub}</p>

              <div className="direct-list">
                <div className="d-row">
                  <span className="d-label">{t.emailLabel}</span>
                  <div className="d-val-group">
                    <strong>amrothman154@gmail.com</strong>
                    <button type="button" onClick={copyEmail} className="mini-copy">
                      {copied ? t.copiedText : <i className="fa-regular fa-copy" />}
                    </button>
                  </div>
                </div>

                <div className="d-row">
                  <span className="d-label">{t.callsLabel}</span>
                  <a href="tel:+201018622861"><strong>+20 101 862 2861</strong></a>
                </div>

                <div className="d-row">
                  <span className="d-label">{t.whatsappLabel}</span>
                  <a href="https://wa.me/201009694831" target="_blank" rel="noreferrer">
                    <strong>+20 100 969 4831</strong>
                  </a>
                </div>
              </div>
            </div>

            <form className="contact-inputs" onSubmit={handleFormSubmit}>
              {formStatus && <div className="sent-banner">{t.msgSent}</div>}
              <input
                type="text"
                placeholder={t.nameInput}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder={t.emailInput}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <textarea
                rows="4"
                placeholder={t.msgInput}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <button type="submit" className="btn-primary full-w" disabled={isSubmitting}>
                {t.sendBtn}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-row">
          <span>{t.footerText}</span>
          <div className="footer-nav">
            <a href="https://github.com/0xAmr5" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/x-amr-othman-x1" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="/Cv.pdf" target="_blank" rel="noreferrer">Resume</a>
          </div>
        </div>
      </footer>

      {/* CASE STUDY MODAL */}
      {activeCaseStudy && (
        <div className="modal-backdrop" onClick={() => setActiveCaseStudy(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div>
                <span className="modal-badge">{activeCaseStudy.badge}</span>
                <h3>{activeCaseStudy.title}</h3>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setActiveCaseStudy(null)}
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="modal-content">
              <div className="cs-block">
                <h4>{lang === 'en' ? "The Problem" : "المشكلة التشغيلية"}</h4>
                <p>{activeCaseStudy.architecture.problem}</p>
              </div>

              <div className="cs-block">
                <h4>{lang === 'en' ? "System Architecture & Solution" : "معمارية الحل التقني"}</h4>
                <p>{activeCaseStudy.architecture.solution}</p>
              </div>

              <div className="cs-block">
                <h4>{lang === 'en' ? "Key Engineering Decisions" : "أبرز القرارات الهندسية"}</h4>
                <ul>
                  {activeCaseStudy.architecture.highlights.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="cs-stack">
                {activeCaseStudy.stack.map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            </div>

            <div className="modal-bottom">
              {activeCaseStudy.liveUrl && (
                <a href={activeCaseStudy.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  <i className="fa-solid fa-arrow-up-right-from-square" /> Live Demo
                </a>
              )}
              {activeCaseStudy.repoUrl && (
                <a href={activeCaseStudy.repoUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                  <i className="fa-brands fa-github" /> Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button
          className="to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <i className="fa-solid fa-arrow-up" />
        </button>
      )}
    </div>
  );
}

export default App;