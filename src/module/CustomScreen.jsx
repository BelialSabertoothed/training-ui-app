import React, { useState, useEffect, useRef } from "react";
import { Container, Alert, Badge } from "reactstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";
import gsap from "gsap";

// --- 1. SAMOSTATNÁ KOMPONENTA LOADERU ---
const SpaceLoader = ({ text }) => {
  const floatRef = useRef(null);

  useEffect(() => {
    // Nyní jsme v izolované komponentě, useEffect proběhne zaručeně jen jednou.
    const anim = gsap.to(floatRef.current, {
      y: -25,           // Vyjede o 25px nahoru
      rotation: 6,      // Mírně se nakloní
      duration: 1.5,    // Čas jedné cesty
      repeat: -1,       // Nekonečné opakování
      yoyo: true,       // Návrat zpět po stejné křivce
      ease: "sine.inOut" 
    });

    return () => anim.kill(); // Bezpečné odstranění animace při zmizení loaderu
  }, []);

  return (
    // Čistý inline Flexbox zaručí, že se prvek vycentruje ať se děje cokoliv
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      minHeight: "65vh" // Minimální výška kontejneru zajistí vertikální střed
    }}>
      <div ref={floatRef} style={{ marginBottom: "1.5rem" }}>
        <i className="bi bi-moon-stars" style={{ 
          fontSize: "5rem", 
          color: "#6366f1", // Indigo-500
          filter: "drop-shadow(0 15px 15px rgba(99, 102, 241, 0.3))" 
        }}></i>
      </div>
      
      <h4 style={{ 
        fontSize: "0.875rem", 
        fontWeight: "bold", 
        color: "#64748b", 
        letterSpacing: "0.25em", 
        textTransform: "uppercase", 
        marginBottom: "1.25rem" 
      }}>
        {text}
      </h4>
      
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <div className="animate-bounce" style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#6366f1", animationDelay: "0s" }}></div>
        <div className="animate-bounce" style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#6366f1", animationDelay: "0.15s" }}></div>
        <div className="animate-bounce" style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#6366f1", animationDelay: "0.3s" }}></div>
      </div>
    </div>
  );
};

// --- 2. HLAVNÍ KOMPONENTA OBRAZOVKY ---
export function CustomScreen() {
  const { t } = useTranslation();
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);
  
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  const fetchSpaceInfo = async () => {
    setLoading(true);
    setErrorType(null);
    try {
      const response = await axios.get("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
      setSpaceData(response.data);
    } catch (err) {
      if (err.response?.data?.error?.code === "OVER_RATE_LIMIT") {
        setErrorType('rate_limit');
      } else {
        setErrorType('generic');
      }
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchSpaceInfo();
  }, []);

  // Animace pro zobrazení dat (po načtení)
  useEffect(() => {
    if (!loading && spaceData && cardRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(cardRef.current, 
        { opacity: 0, scale: 0.98, y: 30 }, 
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "expo.out" }
      );
      tl.from(contentRef.current.children, {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");
    }
  }, [loading, spaceData]);

  // Použití naší nové izolované komponenty
  if (loading) {
    return (
      <Container fluid className="p-4 lg:p-12">
        <SpaceLoader text={t("Space|Loading") || "Navazuji spojení..."} />
      </Container>
    );
  }

  // Render samotných dat (Tvoje krásná karta)
  return (
    <Container fluid className="p-4 lg:p-12 min-h-screen bg-transparent">
      <div className="max-w-[1500px] mx-auto">
        
        {errorType && (
          <Alert color={errorType === 'rate_limit' ? "warning" : "danger"} className="mb-6 shadow-lg border-0 rounded-2xl p-4">
            <i className="bi bi-exclamation-octagon-fill me-2 text-xl align-middle"></i>
            <span className="align-middle font-medium">
              {errorType === 'rate_limit' ? t("Space|RateLimit") : t("Space|Error")}
            </span>
          </Alert>
        )}
        
        <div 
          ref={cardRef}
          className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden border border-slate-100 dark:border-slate-700 opacity-0"
        >
          {/* Header */}
          <div className="px-10 py-8 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
                <i className="bi bi-stars text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none mb-1">
                  {t("Space|Title")}
                </h2>
                <span className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">
                  NASA Explorer
                </span>
              </div>
            </div>
            <button 
              onClick={fetchSpaceInfo}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <i className="bi bi-arrow-clockwise text-2xl text-indigo-500 group-hover:rotate-180 transition-transform duration-700 block"></i>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row min-h-[800px]">
            {/* Visual Section */}
            <div className="lg:w-[65%] relative bg-black flex items-center justify-center group overflow-hidden">
              {spaceData?.media_type === "image" ? (
                <img
                  src={spaceData.url}
                  alt={spaceData.title}
                  className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
                />
              ) : (
                <div className="bg-slate-900 w-full h-full flex flex-col items-center justify-center p-20">
                  <i className="bi bi-play-circle-fill text-9xl text-indigo-500/50 mb-6 transition-transform group-hover:scale-110 duration-500"></i>
                  <p className="text-slate-400 font-bold tracking-widest uppercase">Video Stream</p>
                </div>
              )}
              <div className="absolute top-8 left-8">
                 <Badge color="dark" className="px-5 py-2.5 text-sm rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-2xl">
                   <i className="bi bi-calendar3 me-2 text-indigo-400"></i>
                   {spaceData?.date}
                 </Badge>
              </div>
            </div>

            {/* Content Section */}
            <div ref={contentRef} className="lg:w-[35%] p-12 lg:p-16 flex flex-col bg-white dark:bg-slate-800">
              <div className="mb-10">
                {spaceData?.copyright && (
                  <Badge color="primary" className="mb-6 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest">
                    {t("Space|NASA_Copyright")}: {spaceData.copyright}
                  </Badge>
                )}
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-0 leading-[1.1] tracking-tighter">
                  {spaceData?.title}
                </h1>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-1 w-10 bg-indigo-500 rounded-full"></div>
                   <h6 className="text-indigo-500 font-black uppercase text-xs tracking-[0.3em] mb-0">
                     {t("Space|Description")}
                   </h6>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xl leading-relaxed font-light text-justify lg:text-left">
                  {spaceData?.explanation}
                </p>
              </div>

              <div className="mt-16">
                <a 
                  href={spaceData?.hdurl || spaceData?.url} 
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center justify-center w-full px-10 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl rounded-3xl transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-25deg]"></div>
                  <i className="bi bi-rocket-takeoff me-3 text-2xl group-hover:animate-bounce"></i>
                  {t("Space|ViewHD")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}