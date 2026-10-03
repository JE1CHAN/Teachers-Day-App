import { forwardRef } from 'react';
import { Heart, Star } from 'lucide-react';
import FitText from './FitText';
import { DEPARTMENTS } from '@/lib/departments';

// Fills its parent. Parent decides the size (preview, slide, or export frame).
const MessageCard = forwardRef(function MessageCard({ to, message, from, dept, maxFont = 64 }, ref) {
  const d = DEPARTMENTS[dept];
  return (
    <div ref={ref} className={`relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border-4 ${d.border} bg-white p-[6%] shadow-xl`}>
      <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full ${d.soft}`} />
      <Star className={`absolute right-[7%] top-[5%] h-8 w-8 ${d.text}`} fill="currentColor" />
      <span className={`z-10 w-fit rounded-full ${d.accent} px-4 py-1 text-sm font-extrabold text-white`}>{dept}</span>
      <p className={`z-10 mt-4 text-[clamp(1.1rem,3vw,2rem)] font-black ${d.text}`}>
        Dear {to?.trim() || 'Teacher'},
      </p>
      <div className="z-10 my-3 min-h-0 flex-1 font-semibold text-stone-700">
        <FitText text={message?.trim() || 'Your message will appear here…'} max={maxFont} />
      </div>
      <div className="z-10 flex items-center justify-end gap-2 font-extrabold text-stone-600">
        <Heart className={`h-5 w-5 ${d.text}`} fill="currentColor" />
        <span>with love, {from?.trim() || 'Anonymous'}</span>
      </div>
    </div>
  );
});
export default MessageCard;
