import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Trash2, X, Loader2, Wand2, Printer, Settings } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { defaultData } from './defaultData';
import { EditorPanel } from './components/EditorPanel';
import { ResumeData } from './types';

const AIModal = ({ 
  isOpen, 
  onClose, 
  onGenerate, 
  isGenerating 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-theme-heading font-bold text-[var(--color-theme-primary)] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--color-theme-secondary)]" />
            AI 智能生图
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              描述你想要的图片画面
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：一个可爱的小女孩在森林里观察昆虫，水彩绘本风格..."
              className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-theme-secondary)] focus:border-[var(--color-theme-secondary)] outline-none resize-none text-slate-700"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              取消
            </button>
            <button
              onClick={() => {
                if (prompt.trim()) {
                  onGenerate(prompt);
                }
              }}
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-2 bg-[var(--color-theme-secondary)] hover:opacity-80 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  开始生成
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageSlot = ({ 
  image, 
  onChange, 
  onDelete, 
  aspect = "aspect-square",
  className = "",
  imageClassName = "object-cover"
}: { 
  image: string; 
  onChange: (img: string) => void; 
  onDelete: () => void;
  aspect?: string;
  className?: string;
  imageClassName?: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64EncodeString}`;
          onChange(imageUrl);
          setIsAIModalOpen(false);
          break;
        }
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("图片生成失败，请稍后重试。");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!image) {
    return (
      <>
        <div className={`border border-dashed border-slate-300 rounded-[var(--radius-theme)] flex flex-col items-center justify-center text-slate-400 hover:bg-[var(--color-theme-secondary-light)] hover:border-[var(--color-theme-secondary)] hover:text-[var(--color-theme-primary)] transition-colors cursor-pointer print:hidden ${aspect} ${className}`}>
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <Upload className="w-6 h-6" />
            <span className="text-xs font-medium">点击上传图片</span>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 text-slate-600 text-xs flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> 本地
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAIModalOpen(true);
                }}
                className="px-3 py-1.5 bg-[var(--color-theme-secondary-light)] border border-[var(--color-theme-border)] rounded-md shadow-sm hover:opacity-80 text-[var(--color-theme-primary)] text-xs flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> AI
              </button>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        <AIModal 
          isOpen={isAIModalOpen} 
          onClose={() => setIsAIModalOpen(false)} 
          onGenerate={handleAIGenerate}
          isGenerating={isGenerating}
        />
      </>
    );
  }

  return (
    <div className={`relative group rounded-[var(--radius-theme)] overflow-hidden border border-slate-200 ${aspect} ${className} print:border-none`}>
      <img src={image} alt="Uploaded" className={`w-full h-full ${imageClassName}`} />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 print:hidden">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-2 bg-white text-slate-700 rounded-full hover:bg-slate-100 transition-colors shadow-sm"
          title="更换图片"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setIsAIModalOpen(true)}
          className="p-2 bg-[var(--color-theme-secondary-light)] text-[var(--color-theme-primary)] rounded-full hover:opacity-80 transition-colors shadow-sm"
          title="AI 重新生成"
        >
          <Sparkles className="w-4 h-4" />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-100 transition-colors shadow-sm"
          title="删除图片"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <AIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onGenerate={handleAIGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
};

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const A4Page = ({ children, isFlow = false }: { children: React.ReactNode, isFlow?: boolean, key?: React.Key }) => (
  <div className={`w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-md mb-8 p-[15mm] print:p-[12mm] text-slate-700 font-sans leading-relaxed print:shadow-none print:m-0 print:w-[210mm] ${isFlow ? 'print:min-h-[297mm]' : 'print:h-[296mm] print:overflow-hidden'} print:break-after-page box-border relative flex flex-col ${isFlow ? '' : 'overflow-hidden'} bg-[var(--color-theme-bg)]`}>
    <div className="absolute inset-[8mm] border border-[var(--color-theme-border)] pointer-events-none z-0" style={{ borderWidth: 'var(--border-width)', borderRadius: 'var(--radius-theme)' }}></div>
    <div className="absolute inset-[9mm] border border-[var(--color-theme-border)] opacity-60 pointer-events-none z-0" style={{ borderWidth: 'var(--border-width)', borderRadius: 'var(--radius-theme)' }}></div>
    <div className="relative z-10 flex-1 flex flex-col h-full">
      {children}
    </div>
  </div>
);

const SectionTitle = ({ title, subtitle, colorVar = "--color-theme-secondary" }: { title: string, subtitle: string, colorVar?: string }) => (
  <div className="mb-6 border-b border-slate-200 pb-2">
    <h2 className="text-2xl font-theme-heading font-bold text-[var(--color-theme-primary)] flex items-center gap-3">
      <span className="w-1.5 h-6 rounded-sm" style={{ backgroundColor: `var(${colorVar})` }}></span>
      {title}
      <span className="text-sm font-sans font-normal text-slate-400 ml-2 uppercase tracking-wider">{subtitle}</span>
    </h2>
  </div>
);

function App() {
  const [data, setData] = useState<ResumeData>(defaultData);
  const [theme, setTheme] = useState<string>("professional");
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [coverImage, setCoverImage] = useState("");
  const [profileImages, setProfileImages] = useState(["", ""]);
  const [academicImages, setAcademicImages] = useState(["", "", "", ""]);
  const [interestImages, setInterestImages] = useState(["", "", ""]);
  const [attachmentImages, setAttachmentImages] = useState<string[]>(Array(10).fill(""));
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const hasApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey && typeof window.aistudio.openSelectKey === 'function') {
          await window.aistudio.openSelectKey();
        }
      }
    };
    hasApiKey();
  }, []);

  const handleProfileImageChange = (index: number, img: string) => {
    const newImages = [...profileImages];
    newImages[index] = img;
    setProfileImages(newImages);
  };

  const handleAcademicImageChange = (index: number, img: string) => {
    const newImages = [...academicImages];
    newImages[index] = img;
    setAcademicImages(newImages);
  };

  const handleInterestImageChange = (index: number, img: string) => {
    const newImages = [...interestImages];
    newImages[index] = img;
    setInterestImages(newImages);
  };

  const updateAttachment = (index: number, img: string) => {
    const newImages = [...attachmentImages];
    newImages[index] = img;
    setAttachmentImages(newImages);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:py-0 print:bg-white flex">
      
      {isEditorOpen && (
        <EditorPanel data={data} onChange={setData} theme={theme} onThemeChange={setTheme} />
      )}

      <div className={`flex-1 transition-all duration-300 ${isEditorOpen ? 'ml-80' : 'ml-0'}`}>
        {/* Floating Actions */}
        <div className="fixed bottom-8 right-8 z-50 print:hidden flex flex-col gap-4">
          <button
            onClick={() => setIsEditorOpen(!isEditorOpen)}
            className="bg-white text-slate-700 p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center group border border-slate-200"
            title="编辑内容"
          >
            <Settings className="w-6 h-6" />
            <span className="absolute right-full mr-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {isEditorOpen ? '关闭编辑' : '编辑内容'}
            </span>
          </button>
          <button
            onClick={() => setShowPrintModal(true)}
            className="bg-[var(--color-theme-secondary)] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center group"
            title="打印简历"
          >
            <Printer className="w-6 h-6" />
            <span className="absolute right-full mr-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              导出 PDF / 打印
            </span>
          </button>
        </div>

        {/* Print Warning Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6">
              <h3 className="font-theme-heading font-bold text-[var(--color-theme-primary)] text-xl mb-4 flex items-center gap-2">
                <Printer className="w-5 h-5 text-[var(--color-theme-secondary)]" />
                打印提示
              </h3>
              <div className="space-y-4 text-slate-600 text-sm mb-6">
                <p>为了获得最佳的打印和 PDF 导出效果，请在浏览器的打印设置中：</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                  <li>将 <strong>纸张尺寸</strong> 设置为 <strong>A4</strong></li>
                  <li>将 <strong>边距</strong> 设置为 <strong>无 (None)</strong></li>
                  <li>勾选 <strong>背景图形 (Background graphics)</strong></li>
                </ul>
                <p className="text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200 mt-4">
                  ⚠️ 注意：当前预览环境可能运行在 iframe 中，直接点击打印可能无法正常工作。建议您点击右上角的“在新标签页中打开”按钮，然后在独立页面中进行打印。
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  我知道了
                </button>
                <button 
                  onClick={() => {
                    setShowPrintModal(false);
                    window.print();
                  }}
                  className="px-4 py-2 bg-[var(--color-theme-secondary-light)] text-[var(--color-theme-primary)] font-medium rounded-lg border border-[var(--color-theme-border)] hover:opacity-80 transition-colors shadow-sm"
                >
                  强制尝试
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cover Page */}
        <A4Page>
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-10">
            <div className="w-64 h-80 bg-white p-2 border border-[var(--color-theme-border)] shadow-sm mb-12 relative" style={{ borderRadius: 'var(--radius-theme)' }}>
              <ImageSlot image={coverImage} onChange={setCoverImage} onDelete={() => setCoverImage("")} aspect="aspect-[3/4]" className="w-full h-full border border-slate-100" />
            </div>
            <div className="text-center mb-12">
              <h1 className="text-5xl font-theme-heading font-bold text-[var(--color-theme-primary)] mb-6 tracking-widest">{data.name}</h1>
              <h2 className="text-xl font-theme-heading text-slate-600 tracking-widest border-t border-b border-[var(--color-theme-border)] py-3 inline-block px-8">
                {data.title}
              </h2>
            </div>
            <div className="text-center text-sm text-slate-500 space-y-2">
              <p className="text-base font-bold text-[var(--color-theme-primary)] mb-4">{data.school}</p>
              <p>{data.contact1}</p>
              <p>{data.contact2}</p>
            </div>
          </div>
        </A4Page>

        {/* Page 1: Profile & Family */}
        <A4Page>
          <div className="flex flex-col md:flex-row gap-8 flex-1 h-full">
            {/* Left Column */}
            <div className="w-full md:w-[35%] flex flex-col gap-4">
              <div className="bg-white p-5 border border-[var(--color-theme-border)] shadow-sm" style={{ borderRadius: 'var(--radius-theme)' }}>
                <h3 className="font-theme-heading font-bold text-[var(--color-theme-primary)] mb-4 text-lg border-b border-slate-100 pb-2">基本资料</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex flex-col"><span className="text-slate-400 text-xs mb-0.5">姓名</span><span className="font-medium text-slate-800">{data.basicInfo.name}</span></li>
                  <li className="flex flex-col"><span className="text-slate-400 text-xs mb-0.5">出生年月</span><span className="font-medium text-slate-800">{data.basicInfo.birthDate}</span></li>
                  <li className="flex flex-col"><span className="text-slate-400 text-xs mb-0.5">就读幼儿园</span><span className="font-medium text-slate-800">{data.basicInfo.kindergarten}</span></li>
                  <li className="flex flex-col"><span className="text-slate-400 text-xs mb-0.5">性格标签</span><span className="font-medium text-slate-800 leading-relaxed">{data.basicInfo.tags}</span></li>
                  <li className="flex flex-col">
                    <span className="text-slate-400 text-xs mb-0.5">户籍所在地</span>
                    <span className="font-medium text-slate-800 text-xs leading-tight">{data.basicInfo.address1}</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-slate-400 text-xs mb-0.5">日常居住地址</span>
                    <span className="font-medium text-slate-800 text-xs leading-tight">{data.basicInfo.address2}</span>
                  </li>
                </ul>
              </div>
              <div className={`flex flex-col gap-3 flex-1 min-h-0 ${!profileImages[0] && !profileImages[1] ? 'print:hidden' : ''}`}>
                <ImageSlot image={profileImages[0]} onChange={(img) => handleProfileImageChange(0, img)} onDelete={() => handleProfileImageChange(0, "")} aspect="flex-1 min-h-0" className={`w-full bg-white p-1.5 border border-[var(--color-theme-border)] shadow-sm ${!profileImages[0] ? 'print:hidden' : ''}`} />
                <ImageSlot image={profileImages[1]} onChange={(img) => handleProfileImageChange(1, img)} onDelete={() => handleProfileImageChange(1, "")} aspect="flex-1 min-h-0" className={`w-full bg-white p-1.5 border border-[var(--color-theme-border)] shadow-sm ${!profileImages[1] ? 'print:hidden' : ''}`} />
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-[65%] flex flex-col">
              <div className="mb-8 p-5 bg-[var(--color-theme-secondary-light)] border-l-4 border-[var(--color-theme-secondary)]" style={{ borderTopRightRadius: 'var(--radius-theme)', borderBottomRightRadius: 'var(--radius-theme)' }}>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  {data.introQuote}
                </p>
              </div>

              <SectionTitle title="家庭背景" subtitle="Family Background" colorVar="--color-theme-accent1" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 border border-slate-200 shadow-sm" style={{ borderRadius: 'var(--radius-theme)' }}>
                  <p className="font-theme-heading font-bold text-[var(--color-theme-primary)] mb-3 border-b border-slate-100 pb-2">父亲</p>
                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-slate-400 inline-block w-16">职业:</span> <span className="font-medium text-slate-700">{data.family.father.role}</span></p>
                    <p><span className="text-slate-400 inline-block w-16">学历:</span> <span className="font-medium text-slate-700">{data.family.father.education}</span></p>
                    <p><span className="text-slate-400 inline-block w-16">电话:</span> <span className="font-medium text-slate-700">{data.family.father.phone}</span></p>
                    <p><span className="text-slate-400 inline-block w-16">单位:</span> <span className="font-medium text-slate-700">{data.family.father.company}</span></p>
                    <p><span className="text-slate-400 inline-block w-16">人才认定:</span> <span className="font-medium text-[var(--color-theme-accent1)]">{data.family.father.talent}</span></p>
                  </div>
                </div>
                <div className="bg-white p-4 border border-slate-200 shadow-sm" style={{ borderRadius: 'var(--radius-theme)' }}>
                  <p className="font-theme-heading font-bold text-[var(--color-theme-primary)] mb-3 border-b border-slate-100 pb-2">母亲</p>
                  <div className="space-y-1.5 text-xs">
                    <p><span className="text-slate-400 inline-block w-16">职业:</span> <span className="font-medium text-slate-700">{data.family.mother.role}</span></p>
                    <p><span className="text-slate-400 inline-block w-16">学历:</span> <span className="font-medium text-slate-700">{data.family.mother.education}</span></p>
                    <p><span className="text-slate-400 inline-block w-16">电话:</span> <span className="font-medium text-slate-700">{data.family.mother.phone}</span></p>
                    <p><span className="text-slate-400 inline-block w-16">单位:</span> <span className="font-medium text-slate-700">{data.family.mother.company}</span></p>
                    <p><span className="text-slate-400 inline-block w-16">人才认定:</span> <span className="font-medium text-[var(--color-theme-accent1)]">{data.family.mother.talent}</span></p>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-theme-heading font-bold text-[var(--color-theme-primary)] mb-4 text-base">家庭教育理念</h3>
                <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                  <div className="pl-4 border-l-2 border-[var(--color-theme-secondary)]">
                    <p className="font-bold text-slate-800 mb-1">{data.family.philosophy.title1}</p>
                    <p>{data.family.philosophy.desc1}</p>
                  </div>
                  <div className="pl-4 border-l-2 border-[var(--color-theme-accent1)]">
                    <p className="font-bold text-slate-800 mb-1">{data.family.philosophy.title2}</p>
                    <p>{data.family.philosophy.desc2}</p>
                  </div>
                  <div className="pl-4 border-l-2 border-[var(--color-theme-accent3)]">
                    <p className="font-bold text-slate-800 mb-1">{data.family.philosophy.title3}</p>
                    <p>{data.family.philosophy.desc3}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </A4Page>

        {/* Page 2: Academic */}
        <A4Page>
          <SectionTitle title="学习能力与校园表现" subtitle="Academic Performance" colorVar="--color-theme-accent2" />
          <div className="flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-theme-heading font-bold text-[var(--color-theme-primary)] mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-sm bg-[var(--color-theme-accent2)] text-white flex items-center justify-center text-xs">1</span>
                    {data.academic.title1}
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="pl-3 border-l border-slate-200">
                      {data.academic.desc1_1}
                    </li>
                    <li className="pl-3 border-l border-slate-200">
                      {data.academic.desc1_2}
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 border border-[var(--color-theme-border)] shadow-sm" style={{ borderRadius: 'var(--radius-theme)' }}>
                  <h3 className="text-sm font-theme-heading font-bold text-[var(--color-theme-primary)] mb-2">老师评价</h3>
                  <ul className="list-disc list-outside ml-4 text-xs space-y-1.5 text-slate-600 italic">
                    {data.academic.teacherComments.map((comment, idx) => (
                      <li key={idx}>{comment}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-base font-theme-heading font-bold text-[var(--color-theme-primary)] mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-sm bg-[var(--color-theme-secondary)] text-white flex items-center justify-center text-xs">2</span>
                  {data.academic.title2}
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="pl-3 border-l border-slate-200">
                    {data.academic.desc2_1}
                  </li>
                  <li className="pl-3 border-l border-slate-200">
                    {data.academic.desc2_2}
                  </li>
                  <li className="pl-3 border-l border-slate-200">
                    {data.academic.desc2_3}
                  </li>
                  <li className="pl-3 border-l border-slate-200">
                    {data.academic.desc2_4}
                  </li>
                </ul>
              </div>
            </div>

            {/* 4 Images Grid (田字格) */}
            <div className={`grid grid-cols-2 gap-4 mt-auto pt-4 ${academicImages.every(img => !img) ? 'print:hidden' : ''}`}>
              {academicImages.map((img, i) => (
                <div key={i} className={`bg-white p-1.5 border border-[var(--color-theme-border)] shadow-sm aspect-[4/3] ${!img ? 'print:hidden' : ''}`} style={{ borderRadius: 'var(--radius-theme)' }}>
                  <ImageSlot image={img} onChange={(newImg) => handleAcademicImageChange(i, newImg)} onDelete={() => handleAcademicImageChange(i, "")} aspect="aspect-auto" className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        </A4Page>

        {/* Page 3: Interests */}
        <A4Page>
          <SectionTitle title="兴趣爱好与个人成就" subtitle="Interests & Achievements" colorVar="--color-theme-accent3" />
          <div className="flex flex-col gap-8 flex-1 h-full">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-[60%] space-y-8">
                <div>
                  <h3 className="text-base font-theme-heading font-bold text-[var(--color-theme-primary)] mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-sm bg-[var(--color-theme-secondary)] text-white flex items-center justify-center text-xs">1</span>
                    {data.interests.title1}
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="pl-3 border-l border-slate-200">
                      {data.interests.desc1_1}
                    </li>
                    <li className="pl-3 border-l border-slate-200">
                      {data.interests.desc1_2}
                    </li>
                    <li className="pl-3 border-l border-slate-200">
                      {data.interests.desc1_3}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-theme-heading font-bold text-[var(--color-theme-primary)] mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-sm bg-[var(--color-theme-accent1)] text-white flex items-center justify-center text-xs">2</span>
                    {data.interests.title2}
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="pl-3 border-l border-slate-200">
                      {data.interests.desc2_1}
                    </li>
                    <li className="pl-3 border-l border-slate-200">
                      {data.interests.desc2_2}
                    </li>
                    <li className="pl-3 border-l border-slate-200">
                      {data.interests.desc2_3}
                    </li>
                    <li className="pl-3 border-l border-slate-200">
                      {data.interests.desc2_4}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="w-full md:w-[40%]">
                <div className="bg-white p-1.5 border border-[var(--color-theme-border)] shadow-sm aspect-[4/6]" style={{ borderRadius: 'var(--radius-theme)' }}>
                  <ImageSlot image={interestImages[0]} onChange={(img) => handleInterestImageChange(0, img)} onDelete={() => handleInterestImageChange(0, "")} aspect="h-full w-full" className="w-full h-full" />
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-2 gap-4 mt-auto ${!interestImages[1] && !interestImages[2] ? 'print:hidden' : ''}`}>
              <div className={`bg-white p-1.5 border border-[var(--color-theme-border)] shadow-sm aspect-[4/3] ${!interestImages[1] ? 'print:hidden' : ''}`} style={{ borderRadius: 'var(--radius-theme)' }}>
                <ImageSlot image={interestImages[1]} onChange={(img) => handleInterestImageChange(1, img)} onDelete={() => handleInterestImageChange(1, "")} aspect="aspect-auto" className="w-full h-full" />
              </div>
              <div className={`bg-white p-1.5 border border-[var(--color-theme-border)] shadow-sm aspect-[4/3] ${!interestImages[2] ? 'print:hidden' : ''}`} style={{ borderRadius: 'var(--radius-theme)' }}>
                <ImageSlot image={interestImages[2]} onChange={(img) => handleInterestImageChange(2, img)} onDelete={() => handleInterestImageChange(2, "")} aspect="aspect-auto" className="w-full h-full" />
              </div>
            </div>
          </div>
        </A4Page>

        {/* Page 4: Recommendation */}
        <A4Page>
          <SectionTitle title="自荐信" subtitle="Recommendation & Statement" colorVar="--color-theme-secondary" />
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <div className="w-full max-w-2xl space-y-12">
              
              <div className="relative p-8 bg-white border border-[var(--color-theme-border)] shadow-sm" style={{ borderRadius: 'var(--radius-theme)' }}>
                <div className="absolute -top-6 -left-4 text-6xl text-[var(--color-theme-secondary)] font-theme-heading opacity-50">"</div>
                <h3 className="text-lg font-theme-heading font-bold text-[var(--color-theme-primary)] mb-4 text-center border-b border-slate-100 pb-3">孩子的心里话</h3>
                <p className="text-slate-700 leading-relaxed italic relative z-10 text-center text-sm">
                  {data.recommendation.childQuote}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-theme-heading font-bold text-[var(--color-theme-primary)] mb-6 text-center">{data.recommendation.parentTitle} <span className="text-sm font-sans font-normal text-slate-400 ml-1">Why Our School?</span></h3>
                <p className="text-sm text-slate-700 mb-6 text-center">{data.recommendation.parentIntro}</p>
                <ul className="space-y-6 text-sm text-slate-700">
                  <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-theme-secondary-light)] text-[var(--color-theme-primary)] flex items-center justify-center shrink-0 font-bold">1</div>
                    <div>
                      <p className="font-bold text-slate-800 mb-1">{data.recommendation.reason1Title}</p>
                      <p className="leading-relaxed">{data.recommendation.reason1Desc}</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-theme-accent1-light)] text-[var(--color-theme-accent1)] flex items-center justify-center shrink-0 font-bold">2</div>
                    <div>
                      <p className="font-bold text-slate-800 mb-1">{data.recommendation.reason2Title}</p>
                      <p className="leading-relaxed">{data.recommendation.reason2Desc}</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-theme-accent2-light)] text-[var(--color-theme-accent2)] flex items-center justify-center shrink-0 font-bold">3</div>
                    <div>
                      <p className="font-bold text-slate-800 mb-1">{data.recommendation.reason3Title}</p>
                      <p className="leading-relaxed">{data.recommendation.reason3Desc}</p>
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </A4Page>

        {/* Page 6: Attachments 1 */}
        <A4Page isFlow={false}>
          <SectionTitle title="附件清单" subtitle="Attachments" colorVar="--color-theme-accent1" />
          <div className="grid grid-rows-3 gap-4 flex-1 min-h-0 mt-4">
            {[0, 1].map((i) => (
              <div key={i} className={`bg-white p-2 border border-[var(--color-theme-border)] shadow-sm h-full min-h-0 ${!attachmentImages[i] ? 'print:hidden' : ''}`} style={{ borderRadius: 'var(--radius-theme)' }}>
                <ImageSlot image={attachmentImages[i]} onChange={(newImg) => updateAttachment(i, newImg)} onDelete={() => updateAttachment(i, "")} aspect="h-full w-full" className="w-full h-full" imageClassName="object-contain" />
              </div>
            ))}
          </div>
        </A4Page>

        {/* Pages 7, 8, 9: Attachments 2-4 */}
        {[
          [2, 3, 4],
          [5, 6, 7],
          [8, 9]
        ].map((indices, pageIndex) => (
          <A4Page key={pageIndex} isFlow={false}>
            <div className="invisible">
              <SectionTitle title="附件清单" subtitle="Attachments" colorVar="--color-theme-accent1" />
            </div>
            <div className="grid grid-rows-3 gap-4 flex-1 min-h-0 mt-4">
              {indices.map((i) => (
                <div key={i} className={`bg-white p-2 border border-[var(--color-theme-border)] shadow-sm h-full min-h-0 ${!attachmentImages[i] ? 'print:hidden' : ''}`} style={{ borderRadius: 'var(--radius-theme)' }}>
                  <ImageSlot image={attachmentImages[i]} onChange={(newImg) => updateAttachment(i, newImg)} onDelete={() => updateAttachment(i, "")} aspect="h-full w-full" className="w-full h-full" imageClassName="object-contain" />
                </div>
              ))}
            </div>
          </A4Page>
        ))}

        {/* Back Cover */}
        <A4Page>
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-10">
            <div className="bg-white p-12 border border-[var(--color-theme-border)] shadow-sm w-full max-w-lg text-center" style={{ borderRadius: 'var(--radius-theme)' }}>
              <h1 className="text-4xl font-theme-heading font-bold text-[var(--color-theme-primary)] mb-8 tracking-widest">
                感谢老师的翻阅
              </h1>
              <div className="w-16 h-px bg-[var(--color-theme-secondary)] mx-auto mb-8"></div>
              <div className="space-y-3 text-sm text-slate-600">
                <p>{data.contact1}</p>
                <p>{data.contact2}</p>
              </div>
            </div>
          </div>
        </A4Page>

      </div>
    </div>
  );
}

export default App;
