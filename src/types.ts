export interface ResumeData {
  name: string;
  title: string;
  school: string;
  contact1: string;
  contact2: string;
  basicInfo: {
    name: string;
    birthDate: string;
    kindergarten: string;
    tags: string;
    address1: string;
    address2: string;
  };
  introQuote: string;
  family: {
    father: {
      role: string;
      education: string;
      phone: string;
      company: string;
      talent: string;
    };
    mother: {
      role: string;
      education: string;
      phone: string;
      company: string;
      talent: string;
    };
    philosophy: {
      title1: string;
      desc1: string;
      title2: string;
      desc2: string;
      title3: string;
      desc3: string;
    };
  };
  academic: {
    title1: string;
    desc1_1: string;
    desc1_2: string;
    teacherComments: string[];
    title2: string;
    desc2_1: string;
    desc2_2: string;
    desc2_3: string;
    desc2_4: string;
  };
  interests: {
    title1: string;
    desc1_1: string;
    desc1_2: string;
    desc1_3: string;
    title2: string;
    desc2_1: string;
    desc2_2: string;
    desc2_3: string;
    desc2_4: string;
  };
  recommendation: {
    childQuote: string;
    parentTitle: string;
    parentIntro: string;
    reason1Title: string;
    reason1Desc: string;
    reason2Title: string;
    reason2Desc: string;
    reason3Title: string;
    reason3Desc: string;
  };
}
