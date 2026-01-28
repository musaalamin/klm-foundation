"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Menu, X, Twitter, Instagram, Facebook, 
  CheckCircle, LayoutDashboard, Users, RefreshCcw, Lock, Key, 
  Phone, Info
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";
import { supabase } from "./supabase";

const zamfaraData = {
  "Anka": ["Anka Salami", "Waramu"], "Bakura": ["Bakura Central", "Dakarko"],
  "Birnin Magaji": ["Birnin Magaji", "Kiyawa"], "Bungudu": ["Bungudu Central", "Kwatarkwashi"],
  "Gummi": ["Gummi Central", "Gayari"], "Gusau": ["Galadima", "Madawaki", "Sabon Gari"],
  "Kaura Namoda": ["Kaura Central", "Kurya"], "Maradun": ["Maradun North", "Dosara"],
  "Maru": ["Maru Central", "Dansadau"], "Shinkafi": ["Shinkafi North", "Katuru"],
  "Talata Mafara": ["Mafara Central", "Garbadu"], "Tsafe": ["Tsafe Central", "Yandoto"],
  "Zurmi": ["Zurmi Central", "Dauran"]
};

export default function JagabanPlatform() {
  const [view, setView] = useState<"home" | "register" | "admin" | "projects" | "about" | "agenda" | "contact">("home");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedLGA, setSelectedLGA] = useState("");
  const [isOtherWard, setIsOtherWard] = useState(false);
  const [hasBenefited, setHasBenefited] = useState(false);

  // --- AUTH & DATA ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const ADMIN_PASSWORD = "KLM_Jagaban_2031"; 
  const [realStats, setRealStats] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdminData = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('beneficiaries').select('*').order('created_at', { ascending: false });
    if (data) {
      setBeneficiaries(data);
      const counts = data.reduce((acc: any, curr: any) => { acc[curr.lga] = (acc[curr.lga] || 0) + 1; return acc; }, {});
      setRealStats(Object.keys(counts).map(key => ({ name: key, count: counts[key] })));
    }
    setIsLoading(false);
  };

  useEffect(() => { if (view === "admin" && isAdminAuthenticated) fetchAdminData(); }, [view, isAdminAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) setIsAdminAuthenticated(true);
    else alert("Invalid Access Credentials.");
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const registration = {
      full_name: formData.get("name"),
      email: formData.get("email"),
      phone_number: formData.get("phone"),
      nin_number: formData.get("nin"),
      dob: formData.get("dob"),
      education_level: formData.get("education"),
      lga: selectedLGA,
      ward: isOtherWard ? formData.get("custom_ward") : formData.get("ward"),
      benefited_before: hasBenefited,
      benefit_details: formData.get("benefit_details") || ""
    };
    const { error } = await supabase.from('beneficiaries').insert([registration]);
    if (error) alert(error.code === '23505' ? "NIN/Email already registered." : error.message);
    else setIsSubmitted(true);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden font-sans uppercase">
      {/* SIDEBAR NAVIGATION - Hidden on Mobile */}
      <nav className="hidden md:flex w-20 bg-white border-r flex-col items-center py-6 z-50">
        <button onClick={() => setIsNavOpen(true)} className="mb-10 text-black hover:scale-110 transition-transform"><Menu size={24} /></button>
        <div className="flex-1 flex flex-col gap-6 text-gray-400">
          <Twitter size={14} /><Instagram size={14} /><Facebook size={14} />
        </div>
        <div className="mt-auto mb-8 rotate-180 [writing-mode:vertical-lr] text-[8px] tracking-[0.5em] font-black text-gray-300">VISIONARY 2031</div>
      </nav>

      {/* MOBILE MENU BUTTON */}
      <div className="md:hidden fixed top-6 right-6 z-[60] bg-[#064E3B] p-3 rounded-full text-white shadow-xl" onClick={() => setIsNavOpen(true)}>
        <Menu size={24} />
      </div>

      {/* FULLSCREEN MENU */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[100] flex flex-col p-8 md:p-12 text-white font-black italic">
            <button onClick={() => setIsNavOpen(false)} className="self-end p-4"><X size={40} /></button>
            <div className="flex flex-col gap-4 mt-6">
              {["HOME", "ABOUT", "PROJECTS", "AGENDA", "REGISTER", "CONTACT", "ADMIN"].map((item) => (
                <button key={item} onClick={() => { setView(item.toLowerCase() as any); setIsNavOpen(false); }} className="text-4xl md:text-7xl hover:text-[#D97706] text-left tracking-tighter uppercase">{item}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto relative bg-[#E5E7EB] flex flex-col">
        {/* LOGO */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-40 bg-[#064E3B] px-4 py-2 md:px-6 md:py-3 text-white shadow-2xl flex items-center gap-3">
           <div className="w-1 h-6 md:h-8 bg-[#D97706]"></div>
           <div className="flex flex-col leading-none uppercase font-black">
             <span className="text-[6px] md:text-[8px] tracking-widest opacity-60">Foundation</span>
             <span className="text-lg md:text-2xl tracking-tighter">KLM</span>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {/* HOME VIEW */}
          {view === "home" && (
            <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full flex flex-col md:flex-row">
              <div className="flex-1 p-8 pt-32 md:p-24 flex flex-col justify-center items-start gap-4 z-10">
                <span className="text-[#D97706] tracking-[0.4em] md:tracking-[0.6em] text-[8px] md:text-[10px] font-black underline italic uppercase">The People's Mandate</span>
                <h1 className="text-5xl md:text-[9rem] font-black text-[#064E3B] leading-[0.9] md:leading-[0.8] tracking-tighter uppercase">Jagaban <br /> Zamfara</h1>
                <p className="max-w-xs md:max-w-md text-gray-500 font-bold text-sm md:text-lg mt-2 md:mt-4 border-l-4 border-[#D97706] pl-4 italic leading-tight uppercase">Leading with Purpose. <br className="hidden md:block" /> Building for Generations.</p>
                <button onClick={() => setView("register")} className="group flex items-center gap-5 text-[8px] md:text-[10px] font-black tracking-[0.3em] mt-8 md:mt-10 text-black uppercase tracking-widest font-bold">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all"><ChevronRight size={20} /></div>
                  JOIN THE MOVEMENT
                </button>
              </div>
              <div className="flex-1 relative min-h-[40vh] md:min-h-full">
                 <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#E5E7EB] via-[#E5E7EB]/30 to-transparent z-10"></div>
                 <img src="/jagaban.jpg" className="w-full h-full object-cover grayscale" alt="Jagaban" />
              </div>
            </motion.div>
          )}

          {/* ABOUT VIEW */}
          {view === "about" && (
            <motion.div key="ab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 pt-32 md:p-24 bg-white min-h-full flex flex-col-reverse md:flex-row gap-12 md:gap-16 items-center">
              <div className="flex-1 space-y-6 md:space-y-8 uppercase">
                <h2 className="text-4xl md:text-6xl font-black text-[#064E3B] tracking-tighter italic">The Visionary</h2>
                <div className="space-y-4 text-xs md:text-sm font-bold text-gray-600 leading-relaxed md:leading-loose">
                   <p>Jagaban Zamfara is a distinguished philanthropist, a strategic political leader, and a dedicated social advocate committed to the holistic development of Zamfara State.</p>
                   <p>Driven by a mission of service, his work through the KLM Foundation focuses on creating sustainable pathways for the youth, providing equitable educational resources, and fostering grassroots innovation.</p>
                   <p>As a visionary leader, he prioritizes data-driven social impact, ensuring that every initiative reaches those who need it most.</p>
                </div>
              </div>
              <div className="w-48 h-48 md:w-96 md:h-96 aspect-square bg-gray-100 rounded-full border-[10px] md:border-[20px] border-[#064E3B]/5 overflow-hidden shadow-2xl">
                 <img src="/about-portrait.jpg" className="w-full h-full object-cover" alt="Portrait" />
              </div>
            </motion.div>
          )}

          {/* PROJECTS VIEW */}
          {view === "projects" && (
            <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 pt-32 md:p-24 bg-white min-h-full">
              <h2 className="text-4xl md:text-6xl font-black text-[#064E3B] tracking-tighter mb-8 md:mb-12 italic border-b-4 md:border-b-8 border-black pb-4 uppercase">Major Initiatives</h2>
              <section className="space-y-12">
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl md:text-3xl font-black text-[#D97706] uppercase italic">Educational Outreach</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Equitable Access to Resources</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-50">
                      <img src={`/school${i}.jpg`} className="w-full h-full object-cover" alt="School Outreach" />
                    </div>
                  ))}
                </div>
                <div className="border-l-4 md:border-l-8 border-[#064E3B] pl-4 md:pl-8 py-4 bg-gray-50 rounded-r-2xl">
                   <p className="text-sm md:text-lg font-black text-[#064E3B] leading-tight italic lowercase first-letter:uppercase">The strategic allocation of educational resources within the public secondary school system of Birnin Magaji local government.</p>
                </div>
              </section>
            </motion.div>
          )}

          {/* REGISTER VIEW */}
          {view === "register" && (
            <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full bg-white p-8 pt-32 md:p-24 uppercase">
              <h2 className="text-4xl md:text-5xl font-black text-[#064E3B] mb-8 md:mb-12 tracking-tighter italic">Register Credentials</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-4xl" onSubmit={handleFormSubmit}>
                <input name="name" type="text" placeholder="FULL NAME" required className="border-b-2 p-3 outline-none focus:border-[#D97706] font-bold text-[10px] md:text-xs" />
                <input name="email" type="email" placeholder="EMAIL ADDRESS" required className="border-b-2 p-3 outline-none focus:border-[#D97706] font-bold text-[10px] md:text-xs lowercase" />
                <input name="phone" type="tel" placeholder="PHONE NUMBER" required className="border-b-2 p-3 outline-none focus:border-[#D97706] font-bold text-[10px] md:text-xs" />
                <div className="flex flex-col gap-1 text-[8px] font-black text-gray-400"><label>DATE OF BIRTH</label><input name="dob" type="date" required className="border-b-2 p-3 outline-none focus:border-[#D97706] font-bold text-[10px] text-black" /></div>
                <input name="nin" type="text" placeholder="NIN NUMBER" required className="border-b-2 p-3 outline-none focus:border-[#D97706] font-bold text-[10px] md:text-xs" />
                <select name="education" required className="border-b-2 p-3 outline-none font-black text-[10px] bg-white"><option value="">EDUCATION LEVEL</option>{["Primary Cert", "SSCE", "NCE", "Diploma", "HND", "Bsc"].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}</select>
                <select required onChange={(e) => {setSelectedLGA(e.target.value); setIsOtherWard(false);}} className="border-b-2 p-3 outline-none font-black text-[10px] bg-white"><option value="">SELECT LGA</option>{Object.keys(zamfaraData).map(lga => <option key={lga} value={lga}>{lga}</option>)}</select>
                <select name="ward" required disabled={!selectedLGA} onChange={(e) => setIsOtherWard(e.target.value === "other")} className="border-b-2 p-3 outline-none font-black text-[10px] bg-white disabled:opacity-30">
                  <option value="">SELECT WARD</option>
                  {selectedLGA && (zamfaraData[selectedLGA as keyof typeof zamfaraData]).map(ward => <option key={ward} value={ward}>{ward}</option>)}
                  <option value="other" className="text-amber-600 font-bold">+ WARD NOT LISTED</option>
                </select>
                {isOtherWard && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full"><input name="custom_ward" type="text" placeholder="ENTER WARD NAME" required className="w-full border-b-2 p-3 border-[#D97706] outline-none font-black text-[10px]" /></motion.div>}
                <button className="col-span-full bg-[#064E3B] text-white py-5 md:py-6 font-black tracking-[0.2em] text-[10px] hover:bg-[#D97706] transition-all shadow-xl mt-4">SUBMIT TO DATABASE</button>
              </form>
            </motion.div>
          )}

          {/* ADMIN LOGIN */}
          {view === "admin" && (
            <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full bg-[#F9FAFB] flex flex-col justify-center items-center p-8">
               {!isAdminAuthenticated ? (
                  <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl max-w-sm w-full border text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#064E3B]"><Lock size={24} /></div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-6 italic">Command Center Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4 font-bold text-[10px]"><div className="relative"><Key size={14} className="absolute left-4 top-4 text-gray-400" /><input type="password" placeholder="Admin Secret" onChange={(e) => setPasswordInput(e.target.value)} className="w-full h-12 pl-12 bg-gray-50 border rounded-xl outline-none" /></div><button className="w-full h-12 bg-[#064E3B] text-white rounded-xl font-black tracking-widest uppercase">Verify Access</button></form>
                  </div>
               ) : (
                  <div className="w-full max-w-6xl space-y-8 py-32 md:py-0">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-black pb-8 gap-4">
                      <div><h2 className="text-4xl md:text-6xl font-black text-[#064E3B] tracking-tighter uppercase italic">Intelligence</h2><button onClick={fetchAdminData} className="flex items-center gap-2 text-[8px] font-black text-[#D97706] uppercase tracking-widest mt-4"><RefreshCcw size={12} className={isLoading ? "animate-spin" : ""} /> Refresh Data</button></div>
                      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-l-[12px] border-[#D97706]"><p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact Size</p><p className="text-3xl md:text-5xl font-black text-[#064E3B]">{beneficiaries.length}</p></div>
                    </div>
                    <div className="bg-white p-4 md:p-10 rounded-[2rem] shadow-sm border h-80 md:h-96"><ResponsiveContainer width="100%" height="100%"><BarChart data={realStats}><XAxis dataKey="name" fontSize={8} angle={-45} textAnchor="end" height={60} stroke="#000" /><YAxis stroke="#000" fontSize={10} /><Tooltip cursor={{fill: '#f8fafc'}} /><Bar dataKey="count" fill="#064E3B" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
                  </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-[#064E3B] flex items-center justify-center p-6 text-center uppercase">
            <div className="text-white">
              <CheckCircle size={64} className="mx-auto mb-6 text-[#D97706]" />
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Credential Secured</h1>
              <button onClick={() => {setIsSubmitted(false); setView("home");}} className="border-2 border-white px-10 py-4 text-[10px] font-black tracking-widest hover:bg-white hover:text-[#064E3B] transition-all font-bold mt-8">RETURN HOME</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}