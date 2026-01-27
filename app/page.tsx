"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Menu, X, Twitter, Linkedin, Instagram, Facebook, Youtube, 
  CheckCircle, LayoutDashboard, Users, RefreshCcw, Lock, Key, 
  Target, Phone, Info, Book
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
      {/* SIDEBAR NAVIGATION */}
      <nav className="w-16 md:w-20 bg-white border-r flex flex-col items-center py-6 z-50">
        <button onClick={() => setIsNavOpen(true)} className="mb-10 text-black hover:scale-110 transition-transform"><Menu size={24} /></button>
        <div className="flex-1 flex flex-col gap-6 text-gray-400">
          <Twitter size={14} className="hover:text-black cursor-pointer" /><Instagram size={14} className="hover:text-black cursor-pointer" /><Facebook size={14} className="hover:text-black cursor-pointer" />
        </div>
        <div className="mt-auto mb-8 rotate-180 [writing-mode:vertical-lr] text-[8px] tracking-[0.5em] font-black text-gray-300 uppercase">VISIONARY 2031</div>
      </nav>

      {/* FULLSCREEN MENU */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed inset-0 bg-black z-[100] flex flex-col p-12 text-white font-black italic">
            <button onClick={() => setIsNavOpen(false)} className="self-end p-4"><X size={40} /></button>
            <div className="flex flex-col gap-4 mt-6">
              {["HOME", "ABOUT", "PROJECTS", "AGENDA", "REGISTER", "CONTACT", "ADMIN"].map((item) => (
                <button key={item} onClick={() => { setView(item.toLowerCase() as any); setIsNavOpen(false); }} className="text-5xl md:text-7xl hover:text-[#D97706] text-left tracking-tighter uppercase">{item}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto relative bg-[#E5E7EB] flex flex-col">
        {/* LOGO */}
        <div className="absolute top-8 left-8 z-40 bg-[#064E3B] px-6 py-3 text-white shadow-2xl flex items-center gap-3">
           <div className="w-1 h-8 bg-[#D97706]"></div>
           <div className="flex flex-col leading-none uppercase font-black">
             <span className="text-[8px] tracking-widest opacity-60">Foundation</span>
             <span className="text-2xl tracking-tighter">KLM</span>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {/* HOME VIEW */}
          {view === "home" && (
            <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col md:flex-row">
              <div className="flex-1 p-12 md:p-24 flex flex-col justify-center items-start gap-4 z-10">
                <span className="text-[#D97706] tracking-[0.6em] text-[10px] font-black underline italic uppercase">The People's Mandate</span>
                <h1 className="text-7xl md:text-[9rem] font-black text-[#064E3B] leading-[0.8] tracking-tighter uppercase">Jagaban <br /> Zamfara</h1>
                <p className="max-w-md text-gray-500 font-bold text-lg mt-4 border-l-4 border-[#D97706] pl-4 italic leading-tight uppercase">Leading with Purpose. <br /> Building for Generations.</p>
                <button onClick={() => setView("register")} className="group flex items-center gap-5 text-[10px] font-black tracking-[0.3em] mt-10 text-black uppercase tracking-widest font-bold"><div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all"><ChevronRight size={24} /></div>JOIN THE MOVEMENT</button>
              </div>
              <div className="flex-1 relative bg-gray-300">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#E5E7EB] via-[#E5E7EB]/30 to-transparent z-10"></div>
                 <img src="/jagaban.jpg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Jagaban" />
              </div>
            </motion.div>
          )}

          {/* PROJECTS VIEW - UPDATED WITH SCHOOL PHOTOS */}
{view === "projects" && (
  <motion.div key="p" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-12 md:p-24 bg-white min-h-full">
    <h2 className="text-6xl font-black text-[#064E3B] tracking-tighter mb-12 italic border-b-8 border-black pb-4 uppercase">Major Initiatives</h2>
    <div className="space-y-24">
      
      {/* PROJECT: WRITING MATERIALS */}
      <section>
        <div className="flex flex-col mb-8 gap-2">
          <h3 className="text-3xl font-black text-[#D97706] uppercase italic">Educational Outreach</h3>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Equitable Access to Resources</p>
        </div>

        {/* Updated Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-50 group">
              <img 
                src={`/school${i}.jpg`} 
                alt={`Birnin Magaji School Outreach ${i}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  // This part shows a placeholder if the image file is missing
                  e.currentTarget.src = "https://via.placeholder.com/400?text=Upload+School+Photo";
                }}
              />
            </div>
          ))}
        </div>

        <div className="border-l-8 border-[#064E3B] pl-8 py-4 bg-gray-50 rounded-r-2xl max-w-4xl">
          <p className="text-lg font-black text-[#064E3B] leading-tight italic lowercase first-letter:uppercase">
            The strategic allocation of educational resources within the public secondary school system of Birnin Magaji Local Government.
          </p>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* JAMB SPACE (STILL PENDING) */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-3xl font-black text-[#D97706] uppercase italic">02. Education: JAMB 2025</h3>
          <p className="text-xs font-bold text-gray-400 uppercase">Gallery Pending</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 opacity-30 grayscale">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center italic text-[10px] text-gray-400">
              [JAMB Photo {i}]
            </div>
          ))}
        </div>
      </section>
    </div>
  </motion.div>
)}

          {/* AGENDA VIEW */}
          {view === "agenda" && (
            <motion.div key="ag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 md:p-24 bg-[#064E3B] text-white min-h-full flex flex-col justify-center">
              <span className="text-[#D97706] tracking-[0.5em] font-black text-xs mb-4 uppercase">Visionary 2031</span>
              <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-12 italic leading-none uppercase">The <br /> Jagaban <br /> Agenda</h2>
              <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
                <div className="border-l-2 border-white/20 pl-6"><h4 className="font-black text-[#D97706] mb-2 text-xl italic uppercase">01. Agriculture</h4><p className="text-xs font-bold opacity-60 uppercase">Modernizing farming through AI and sustainable irrigation to ensure food security across all 14 LGAs.</p></div>
                <div className="border-l-2 border-white/20 pl-6"><h4 className="font-black text-[#D97706] mb-2 text-xl italic uppercase">02. Digital Economy</h4><p className="text-xs font-bold opacity-60 uppercase">Equipping youth with multimedia and innovation skills to compete in the global tech market.</p></div>
              </div>
            </motion.div>
          )}

         {/* ABOUT VIEW - PROFESSIONAL NARRATIVE */}
{view === "about" && (
  <motion.div key="ab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 md:p-24 bg-white min-h-full flex flex-col md:flex-row gap-16 items-center">
    <div className="flex-1 space-y-8 uppercase">
      <h2 className="text-6xl font-black text-[#064E3B] tracking-tighter italic">The Visionary</h2>
      <div className="space-y-6 text-sm font-bold text-gray-600 leading-relaxed italic">
         <p className="border-l-4 border-[#D97706] pl-4">
           Jagaban Zamfara is a distinguished philanthropist, a strategic political leader, and a dedicated social advocate committed to the holistic development of Zamfara State.
         </p>
         <p>
           Driven by a mission of service, his work through the KLM Foundation focuses on creating sustainable pathways for the youth, providing equitable educational resources, and fostering grassroots innovation. 
         </p>
         <p>
           As a visionary leader, he prioritizes data driven social impact, ensuring that every initiative from agricultural support to educational sponsorships reaches those who need it most, building a stronger future for the next generation.
         </p>
      </div>
    </div>
    
    {/* PORTRAIT SECTION */}
    <div className="flex-1 aspect-square bg-gray-100 rounded-full border-[20px] border-[#064E3B]/5 overflow-hidden shadow-2xl relative group">
       <img 
         src="/about-portrait.jpg" 
         alt="Jagaban Zamfara" 
         className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110"
         onError={(e) => {
           e.currentTarget.src = "https://via.placeholder.com/600x600?text=Jagaban+Portrait";
         }}
       />
       <div className="absolute inset-0 bg-[#064E3B]/10 group-hover:bg-transparent transition-colors"></div>
    </div>
  </motion.div>
)}

          {/* CONTACT VIEW */}
          {view === "contact" && (
            <motion.div key="co" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 md:p-24 bg-[#E5E7EB] min-h-full flex flex-col justify-center uppercase">
              <h2 className="text-6xl font-black text-[#064E3B] tracking-tighter mb-12 italic">Direct Channel</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border"><Phone className="text-[#D97706] mb-4" /><p className="text-[10px] font-black text-gray-400 mb-1 tracking-widest">Phone</p><p className="font-black text-xs">+234 816 189 9308</p></div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border"><Target className="text-[#D97706] mb-4" /><p className="text-[10px] font-black text-gray-400 mb-1 tracking-widest">Office</p><p className="font-black text-xs italic">Gusau, Zamfara State</p></div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border"><Info className="text-[#D97706] mb-4" /><p className="text-[10px] font-black text-gray-400 mb-1 tracking-widest">Socials</p><p className="font-black text-xs italic">@JagabanZamfara</p></div>
              </div>
            </motion.div>
          )}

          {/* REGISTER VIEW */}
          {view === "register" && (
            <motion.div key="r" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1 }} className="min-h-full bg-white p-12 md:p-24 uppercase">
              <h2 className="text-5xl font-black text-[#064E3B] mb-12 tracking-tighter italic">Register Credentials</h2>
              <form className="grid md:grid-cols-2 gap-10 max-w-4xl" onSubmit={handleFormSubmit}>
                <input name="name" type="text" placeholder="FULL NAME" required className="border-b-2 p-3 outline-none focus:border-[#D97706] font-bold text-xs" />
                <input name="email" type="email" placeholder="EMAIL ADDRESS" required className="border-b-2 p-3 outline-none focus:border-[#D97706] font-bold text-xs lowercase" />
                <input name="phone" type="tel" placeholder="PHONE NUMBER" required className="border-b-2 p-3 outline-none focus:border-[#D97706] font-bold text-xs" />
                <div className="flex flex-col gap-1"><label className="text-[8px] font-black text-gray-400 tracking-widest uppercase font-bold">Date of Birth</label><input name="dob" type="date" required className="border-b-2 p-3 outline-none focus:border-[#D97706] font-bold text-xs" /></div>
                <input name="nin" type="text" placeholder="NIN NUMBER" required className="border-b-2 p-3 outline-none focus:border-[#D97706] font-bold text-xs" />
                <select name="education" required className="border-b-2 p-3 outline-none font-black text-[10px] bg-white">
                  <option value="">EDUCATION LEVEL</option>
                  {["Primary Cert", "SSCE", "NCE", "Diploma", "HND", "Bsc", "None"].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
                <select required onChange={(e) => {setSelectedLGA(e.target.value); setIsOtherWard(false);}} className="border-b-2 p-3 outline-none font-black text-[10px] bg-white"><option value="">SELECT LGA</option>{Object.keys(zamfaraData).map(lga => <option key={lga} value={lga}>{lga}</option>)}</select>
                <select name="ward" required disabled={!selectedLGA} onChange={(e) => setIsOtherWard(e.target.value === "other")} className="border-b-2 p-3 outline-none font-black text-[10px] bg-white disabled:opacity-30">
                  <option value="">SELECT WARD</option>
                  {selectedLGA && (zamfaraData[selectedLGA as keyof typeof zamfaraData]).map(ward => <option key={ward} value={ward}>{ward}</option>)}
                  <option value="other" className="text-amber-600 font-bold">+ WARD NOT LISTED</option>
                </select>
                {isOtherWard && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full"><input name="custom_ward" type="text" placeholder="ENTER WARD NAME" required className="w-full border-b-2 p-3 border-[#D97706] outline-none font-black text-xs uppercase" /></motion.div>}
                <div className="col-span-full space-y-4">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="benefit" onChange={(e) => setHasBenefited(e.target.checked)} className="w-5 h-5 accent-[#064E3B]" />
                    <label htmlFor="benefit" className="text-[10px] font-black text-gray-400 tracking-widest cursor-pointer">Benefited before?</label>
                  </div>
                  {hasBenefited && <input name="benefit_details" type="text" placeholder="PROGRAM NAME (E.G. JAMB 2025)" className="w-full border-b-2 p-3 border-[#D97706] outline-none font-black text-xs uppercase" />}
                </div>
                <button className="col-span-full bg-[#064E3B] text-white py-6 font-black tracking-[0.2em] text-[10px] hover:bg-[#D97706] transition-all shadow-xl">SUBMIT TO DATABASE</button>
              </form>
            </motion.div>
          )}

          {/* ADMIN PORTAL */}
          {view === "admin" && (
            <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full bg-[#F9FAFB]">
              {!isAdminAuthenticated ? (
                <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center uppercase">
                  <div className="bg-white p-10 rounded-[2rem] shadow-2xl max-w-sm w-full border font-bold">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#064E3B]"><Lock size={32} /></div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic leading-none">Command Center Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4 mt-8">
                      <div className="relative"><Key size={14} className="absolute left-4 top-4 text-gray-400" /><input type="password" placeholder="Admin Secret" onChange={(e) => setPasswordInput(e.target.value)} className="w-full h-12 pl-12 bg-gray-50 border rounded-xl outline-none font-black text-[10px] tracking-widest" /></div>
                      <button className="w-full h-12 bg-[#064E3B] text-white rounded-xl font-black text-[10px] tracking-widest">VERIFY</button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="p-8 md:p-16 space-y-12 uppercase">
                  <div className="flex justify-between items-end border-b-4 border-black pb-8">
                    <div><h2 className="text-6xl font-black text-[#064E3B] tracking-tighter uppercase italic">Intelligence</h2><button onClick={fetchAdminData} className="flex items-center gap-2 text-[9px] font-black text-[#D97706] uppercase tracking-widest mt-4 font-bold"><RefreshCcw size={12} className={isLoading ? "animate-spin" : ""} /> Refresh Data</button></div>
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border-l-[12px] border-[#D97706] text-right font-bold"><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact Size</p><p className="text-5xl font-black text-[#064E3B]">{beneficiaries.length}</p></div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] shadow-sm border h-96"><ResponsiveContainer width="100%" height="100%"><BarChart data={realStats}><XAxis dataKey="name" fontSize={9} angle={-45} textAnchor="end" height={60} stroke="#000" fontStyle="italic" /><YAxis stroke="#000" fontSize={10} /><Tooltip cursor={{fill: '#f8fafc'}} /><Bar dataKey="count" fill="#064E3B" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
                  <div className="bg-white rounded-[2rem] shadow-2xl border overflow-x-auto"><table className="w-full text-left"><thead className="bg-[#064E3B] text-white text-[9px] font-black uppercase italic"><tr><th className="p-6">Name</th><th className="p-6">LGA</th><th className="p-6">Education</th><th className="p-6">Phone</th><th className="p-6">NIN</th></tr></thead><tbody className="text-[11px] font-bold text-gray-600 divide-y uppercase">{beneficiaries.map((user, i) => (<tr key={i} className="hover:bg-gray-50 uppercase"><td className="p-6 text-black">{user.full_name}</td><td className="p-6">{user.lga}</td><td className="p-6">{user.education_level}</td><td className="p-6 font-mono tracking-tighter">{user.phone_number}</td><td className="p-6 font-mono text-gray-300">{user.nin_number}</td></tr>))}</tbody></table></div>
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
              <CheckCircle size={80} className="mx-auto mb-8 text-[#D97706]" />
              <h1 className="text-6xl font-black uppercase tracking-tighter italic">Credential Secured</h1>
              <p className="text-white/50 my-8 font-bold text-[10px] tracking-[0.4em]">Jagaban database has been updated</p>
              <button onClick={() => {setIsSubmitted(false); setView("home");}} className="border-2 border-white px-12 py-4 text-[10px] font-black tracking-widest hover:bg-white hover:text-[#064E3B] transition-all font-bold">RETURN HOME</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}