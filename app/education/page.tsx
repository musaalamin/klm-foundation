// app/education/page.tsx
import Image from 'next/image';

const EducationPage = () => {
  return (
    <div className="p-8">
      <h2 className="text-4xl font-playfair font-bold text-[#064E3B] mb-4">Education Initiatives</h2>
      <p className="mb-8">In 2025, KLM Foundation sponsored JAMB registration for over 1,000 students across Zamfara.</p>
      
      {/* Photo Gallery Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="relative h-64 rounded-xl overflow-hidden shadow-lg border-2 border-amber-100">
             <Image 
               src={`/images/jamb-2025-${idx}.jpg`} 
               alt="Student Benefit Registration" 
               fill 
               className="object-cover hover:scale-105 transition-transform" 
             />
          </div>
        ))}
      </div>
    </div>
  );
};