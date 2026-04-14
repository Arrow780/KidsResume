import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Colors
content = content.replace(/bg-\[#c5e86c\]/g, 'bg-slate-100');
content = content.replace(/bg-\[#ffe47a\]/g, 'bg-amber-50');
content = content.replace(/bg-\[#7ec8f9\]/g, 'bg-blue-50');
content = content.replace(/bg-\[#ff9eb5\]/g, 'bg-rose-50');
content = content.replace(/bg-\[#e5e5e5\]/g, 'bg-slate-50');

// Borders and Shadows
content = content.replace(/border-2 border-stone-900/g, 'border border-slate-300');
content = content.replace(/border-4 border-stone-900/g, 'border border-slate-300');
content = content.replace(/shadow-\[4px_4px_0px_#1c1917\]/g, 'shadow-sm');
content = content.replace(/shadow-\[8px_8px_0px_#1c1917\]/g, 'shadow-lg');
content = content.replace(/shadow-\[2px_2px_0px_#1c1917\]/g, 'shadow-sm');
content = content.replace(/shadow-\[0px_0px_0px_#1c1917\]/g, 'shadow-none');

// Text Colors
content = content.replace(/text-stone-900/g, 'text-slate-800');
content = content.replace(/text-stone-800/g, 'text-slate-700');
content = content.replace(/text-stone-600/g, 'text-slate-500');
content = content.replace(/text-stone-400/g, 'text-slate-400');
content = content.replace(/text-stone-700/g, 'text-slate-600');

// Border Colors
content = content.replace(/border-stone-900/g, 'border-slate-300');
content = content.replace(/border-stone-200/g, 'border-slate-200');
content = content.replace(/border-stone-300/g, 'border-slate-300');
content = content.replace(/border-stone-100/g, 'border-slate-100');

// Background Colors
content = content.replace(/bg-stone-900/g, 'bg-slate-800');
content = content.replace(/bg-stone-100/g, 'bg-slate-50');
content = content.replace(/bg-stone-50/g, 'bg-slate-50');
content = content.replace(/bg-stone-200/g, 'bg-slate-200');
content = content.replace(/bg-stone-300/g, 'bg-slate-300');

// Emerald/Teal/Cyan accents on cover
content = content.replace(/text-emerald-900/g, 'text-slate-800');
content = content.replace(/text-emerald-800/g, 'text-slate-700');
content = content.replace(/bg-emerald-50/g, 'bg-slate-100');
content = content.replace(/bg-teal-50/g, 'bg-slate-50');
content = content.replace(/bg-cyan-50/g, 'bg-slate-100');
content = content.replace(/border-emerald-100/g, 'border-slate-200');
content = content.replace(/border-teal-100/g, 'border-slate-200');
content = content.replace(/border-cyan-100/g, 'border-slate-200');
content = content.replace(/bg-emerald-400/g, 'bg-slate-400');
content = content.replace(/bg-emerald-600/g, 'bg-slate-600');
content = content.replace(/hover:bg-emerald-700/g, 'hover:bg-slate-700');
content = content.replace(/hover:text-emerald-600/g, 'hover:text-slate-600');
content = content.replace(/border-emerald-200/g, 'border-slate-200');

// Specific hex colors in SVG and dots
content = content.replace(/#1c1917/g, '#334155'); // stone-900 -> slate-700
content = content.replace(/#c5e86c/g, '#f1f5f9'); // lime -> slate-100
content = content.replace(/#ffe47a/g, '#fffbeb'); // yellow -> amber-50
content = content.replace(/#7ec8f9/g, '#eff6ff'); // blue -> blue-50
content = content.replace(/#ff9eb5/g, '#fff1f2'); // pink -> rose-50

fs.writeFileSync('src/App.tsx', content, 'utf-8');
console.log('Replacements complete');
