import React from 'react';
import { ResumeData } from '../types';

interface EditorPanelProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ data, onChange, theme, onThemeChange }) => {
  const handleChange = (path: string[], value: string) => {
    const newData = { ...data };
    let current: any = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onChange(newData);
  };

  const handleArrayChange = (path: string[], index: number, value: string) => {
    const newData = { ...data };
    let current: any = newData;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    current[index] = value;
    onChange(newData);
  };

  return (
    <div className="w-80 bg-white h-screen overflow-y-auto border-r border-slate-200 p-4 fixed left-0 top-0 z-40 print:hidden shadow-lg flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">简历设置</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">主题风格</label>
          <select 
            value={theme} 
            onChange={(e) => onThemeChange(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="professional">专业风格 (默认)</option>
            <option value="playful">活泼风格</option>
            <option value="minimalist">简约风格</option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-700 border-b pb-1">封面信息</h3>
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="姓名" value={data.name} onChange={(e) => handleChange(['name'], e.target.value)} />
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="简历标题" value={data.title} onChange={(e) => handleChange(['title'], e.target.value)} />
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="目标学校" value={data.school} onChange={(e) => handleChange(['school'], e.target.value)} />
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="联系方式1" value={data.contact1} onChange={(e) => handleChange(['contact1'], e.target.value)} />
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="联系方式2" value={data.contact2} onChange={(e) => handleChange(['contact2'], e.target.value)} />
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-slate-700 border-b pb-1">基本资料</h3>
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="姓名" value={data.basicInfo.name} onChange={(e) => handleChange(['basicInfo', 'name'], e.target.value)} />
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="出生年月" value={data.basicInfo.birthDate} onChange={(e) => handleChange(['basicInfo', 'birthDate'], e.target.value)} />
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="就读幼儿园" value={data.basicInfo.kindergarten} onChange={(e) => handleChange(['basicInfo', 'kindergarten'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="性格标签" value={data.basicInfo.tags} onChange={(e) => handleChange(['basicInfo', 'tags'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="户籍所在地" value={data.basicInfo.address1} onChange={(e) => handleChange(['basicInfo', 'address1'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="日常居住地址" value={data.basicInfo.address2} onChange={(e) => handleChange(['basicInfo', 'address2'], e.target.value)} />
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-slate-700 border-b pb-1">引言</h3>
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-24" placeholder="引言" value={data.introQuote} onChange={(e) => handleChange(['introQuote'], e.target.value)} />
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-slate-700 border-b pb-1">家庭背景</h3>
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">父亲</p>
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="职业" value={data.family.father.role} onChange={(e) => handleChange(['family', 'father', 'role'], e.target.value)} />
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="学历" value={data.family.father.education} onChange={(e) => handleChange(['family', 'father', 'education'], e.target.value)} />
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="电话" value={data.family.father.phone} onChange={(e) => handleChange(['family', 'father', 'phone'], e.target.value)} />
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="单位" value={data.family.father.company} onChange={(e) => handleChange(['family', 'father', 'company'], e.target.value)} />
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="人才认定" value={data.family.father.talent} onChange={(e) => handleChange(['family', 'father', 'talent'], e.target.value)} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">母亲</p>
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="职业" value={data.family.mother.role} onChange={(e) => handleChange(['family', 'mother', 'role'], e.target.value)} />
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="学历" value={data.family.mother.education} onChange={(e) => handleChange(['family', 'mother', 'education'], e.target.value)} />
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="电话" value={data.family.mother.phone} onChange={(e) => handleChange(['family', 'mother', 'phone'], e.target.value)} />
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="单位" value={data.family.mother.company} onChange={(e) => handleChange(['family', 'mother', 'company'], e.target.value)} />
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="人才认定" value={data.family.mother.talent} onChange={(e) => handleChange(['family', 'mother', 'talent'], e.target.value)} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">教育理念 1</p>
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="标题" value={data.family.philosophy.title1} onChange={(e) => handleChange(['family', 'philosophy', 'title1'], e.target.value)} />
            <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-20" placeholder="描述" value={data.family.philosophy.desc1} onChange={(e) => handleChange(['family', 'philosophy', 'desc1'], e.target.value)} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">教育理念 2</p>
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="标题" value={data.family.philosophy.title2} onChange={(e) => handleChange(['family', 'philosophy', 'title2'], e.target.value)} />
            <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-20" placeholder="描述" value={data.family.philosophy.desc2} onChange={(e) => handleChange(['family', 'philosophy', 'desc2'], e.target.value)} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">教育理念 3</p>
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="标题" value={data.family.philosophy.title3} onChange={(e) => handleChange(['family', 'philosophy', 'title3'], e.target.value)} />
            <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-20" placeholder="描述" value={data.family.philosophy.desc3} onChange={(e) => handleChange(['family', 'philosophy', 'desc3'], e.target.value)} />
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-slate-700 border-b pb-1">学习能力与校园表现</h3>
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm font-bold" placeholder="模块1标题" value={data.academic.title1} onChange={(e) => handleChange(['academic', 'title1'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述1" value={data.academic.desc1_1} onChange={(e) => handleChange(['academic', 'desc1_1'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述2" value={data.academic.desc1_2} onChange={(e) => handleChange(['academic', 'desc1_2'], e.target.value)} />
          
          <p className="text-xs font-medium text-slate-500">老师评价</p>
          {data.academic.teacherComments.map((comment, idx) => (
            <textarea key={idx} className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder={`评价 ${idx + 1}`} value={comment} onChange={(e) => handleArrayChange(['academic', 'teacherComments'], idx, e.target.value)} />
          ))}

          <input className="w-full p-2 border border-slate-300 rounded-md text-sm font-bold mt-4" placeholder="模块2标题" value={data.academic.title2} onChange={(e) => handleChange(['academic', 'title2'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述1" value={data.academic.desc2_1} onChange={(e) => handleChange(['academic', 'desc2_1'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述2" value={data.academic.desc2_2} onChange={(e) => handleChange(['academic', 'desc2_2'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述3" value={data.academic.desc2_3} onChange={(e) => handleChange(['academic', 'desc2_3'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述4" value={data.academic.desc2_4} onChange={(e) => handleChange(['academic', 'desc2_4'], e.target.value)} />
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-slate-700 border-b pb-1">兴趣爱好与个人成就</h3>
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm font-bold" placeholder="模块1标题" value={data.interests.title1} onChange={(e) => handleChange(['interests', 'title1'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述1" value={data.interests.desc1_1} onChange={(e) => handleChange(['interests', 'desc1_1'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述2" value={data.interests.desc1_2} onChange={(e) => handleChange(['interests', 'desc1_2'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述3" value={data.interests.desc1_3} onChange={(e) => handleChange(['interests', 'desc1_3'], e.target.value)} />

          <input className="w-full p-2 border border-slate-300 rounded-md text-sm font-bold mt-4" placeholder="模块2标题" value={data.interests.title2} onChange={(e) => handleChange(['interests', 'title2'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述1" value={data.interests.desc2_1} onChange={(e) => handleChange(['interests', 'desc2_1'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述2" value={data.interests.desc2_2} onChange={(e) => handleChange(['interests', 'desc2_2'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述3" value={data.interests.desc2_3} onChange={(e) => handleChange(['interests', 'desc2_3'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="描述4" value={data.interests.desc2_4} onChange={(e) => handleChange(['interests', 'desc2_4'], e.target.value)} />
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="font-semibold text-slate-700 border-b pb-1">自荐信</h3>
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-24" placeholder="孩子的话" value={data.recommendation.childQuote} onChange={(e) => handleChange(['recommendation', 'childQuote'], e.target.value)} />
          <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="家长自荐信标题" value={data.recommendation.parentTitle} onChange={(e) => handleChange(['recommendation', 'parentTitle'], e.target.value)} />
          <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-16" placeholder="家长自荐信引言" value={data.recommendation.parentIntro} onChange={(e) => handleChange(['recommendation', 'parentIntro'], e.target.value)} />
          
          <div className="space-y-2">
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="理由1标题" value={data.recommendation.reason1Title} onChange={(e) => handleChange(['recommendation', 'reason1Title'], e.target.value)} />
            <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-20" placeholder="理由1描述" value={data.recommendation.reason1Desc} onChange={(e) => handleChange(['recommendation', 'reason1Desc'], e.target.value)} />
          </div>
          <div className="space-y-2">
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="理由2标题" value={data.recommendation.reason2Title} onChange={(e) => handleChange(['recommendation', 'reason2Title'], e.target.value)} />
            <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-20" placeholder="理由2描述" value={data.recommendation.reason2Desc} onChange={(e) => handleChange(['recommendation', 'reason2Desc'], e.target.value)} />
          </div>
          <div className="space-y-2">
            <input className="w-full p-2 border border-slate-300 rounded-md text-sm" placeholder="理由3标题" value={data.recommendation.reason3Title} onChange={(e) => handleChange(['recommendation', 'reason3Title'], e.target.value)} />
            <textarea className="w-full p-2 border border-slate-300 rounded-md text-sm h-20" placeholder="理由3描述" value={data.recommendation.reason3Desc} onChange={(e) => handleChange(['recommendation', 'reason3Desc'], e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};
