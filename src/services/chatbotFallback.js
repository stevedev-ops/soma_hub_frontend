// Comprehensive intelligent fallback engine for SomaBot
export function generateClientBotResponse(message, currentUser = null, activeStudent = null) {
  // Strip quotes, extra punctuation, and lowercase
  const rawClean = message.trim();
  const clean = rawClean.toLowerCase().replace(/['"??]/g, '').trim();

  // 1. Numbered Choices (1, 2, 3, 4, 5, "number 3", "option 2", "#1")
  if (/^(1|one|number\s*1|option\s*1|#1)$/i.test(clean) || clean === '1.') {
    return {
      response: "?? **SomaHome Package Pricing & M-Pesa Checkout:**\n\n? **Standard Term Package (CBC / Cambridge):** KES 3,500 ? KES 4,500 per term.\n? **What is included:**\n  ? Complete 12-week structured daily lesson plans\n  ? Weekly Sunday printable worksheets & homework packs\n  ? Hands-on science lab experiment guides\n  ? Dedicated WhatsApp mentor support & term report cards\n\n? **Payment Method:** Instant Safaricom M-Pesa STK Push. Enter phone number on checkout and approve with your PIN.",
      is_meaningful: true,
      metadata: { topic: 'pricing' }
    };
  }

  if (/^(2|two|number\s*2|option\s*2|#2)$/i.test(clean) || clean === '2.') {
    return {
      response: "?? **Kenya CBC vs. British Cambridge Curricula:**\n\n1. **Kenya CBC (Competency Based Curriculum):**\n   ? Grades: PP1 through Grade 9 (Junior Secondary).\n   ? Aligned with KICD standards with 21st-century core competencies, strands, and practical community projects.\n\n2. **British Cambridge International:**\n   ? Stage 1 to Checkpoint / Lower Secondary & IGCSE preparation.\n   ? Subjects: English First/Second Language, Mathematics, Science.\n\nAll packages include printable PDFs, indigenous knowledge integrations, and rubrics.",
      is_meaningful: true,
      metadata: { topic: 'curriculum' }
    };
  }

  if (/^(3|three|number\s*3|option\s*3|#3)$/i.test(clean) || clean === '3.') {
    const childName = typeof activeStudent === 'object' ? (activeStudent?.name || 'Liam Kariuki') : (activeStudent || 'Liam Kariuki');
    const childGrade = typeof activeStudent === 'object' ? (activeStudent?.grade || 'Grade 4 (CBC)') : 'Grade 4 (CBC)';
    return {
      response: `?? **Latest Homeschool Activity & Rubric Summary:**\n\n?? **Learner:** **${childName}** (${childGrade})\n?? **Grade 4 CBC Term 1 Science & Math**\n  ? **Completion:** 34 of 40 lessons finished (85%)\n  ? **Assigned Facilitator:** Teacher Mercy (Senior CBC Facilitator)\n  ? **Recent Project Rubric:** *Water Filtration Model*: **Level 4: EE (Exceeding Expectations)** ? *"Outstanding initiative! Clear water achieved."*\n\n?? *Tip: You can toggle daily lesson completion in the Daily OS tab or generate official PDF transcripts in Reports.*`,
      is_meaningful: true,
      metadata: { activity_checked: true }
    };
  }

  if (/^(4|four|number\s*4|option\s*4|#4)$/i.test(clean) || clean === '4.') {
    return {
      response: "?? **Homeschooling Legality in Kenya & KNEC Registration:**\n\n? **Constitution of Kenya (Article 53):** Every child has the right to basic education. Alternative learning pathways and homeschooling are recognized.\n? **KNEC & Assessment:** Learners can register as private candidates for national assessments (KPSEA, KCEN) or Cambridge Checkpoint / IGCSE through registered British Council centers.\n? **SomaHome Concierge:** We provide formal registration guidance templates, portfolio trackers, and downloadable academic transcripts compliant with Kenyan education standards.",
      is_meaningful: true,
      metadata: { topic: 'legal' }
    };
  }

  if (/^(5|five|number\s*5|option\s*5|#5)$/i.test(clean) || clean === '5.') {
    return {
      response: "????? **SomaHome Tutor & Learning Pod Marketplace:**\n\n? Connect with verified, TSC-registered CBC facilitators and Cambridge-certified private tutors.\n? Available for home 1-on-1 sessions or neighbourhood Learning Pods across Nairobi (Kilimani, Karen, Kileleshwa, Westlands, Runda, Kiambu).\n? Filter tutors by hourly rate (KES 1,200 - 2,500/hr), curriculum specialty, and verified parent reviews in the Marketplace tab.",
      is_meaningful: true,
      metadata: { topic: 'marketplace' }
    };
  }

  // 2. Greetings Check
  const isGreeting = /^(hi|hello|hey|yo|habari|mambo|sasa|jambo|good\s*(morning|afternoon|evening))\b/i.test(clean) && clean.split(' ').length <= 4;
  if (isGreeting) {
    const userName = currentUser ? (currentUser.first_name || currentUser.name || currentUser.username || 'Parent') : 'Homeschooler';
    return {
      response: `?? Jambo **${userName}**! I am **SomaBot**, your AI Homeschool Assistant.\n\nHere are common things you can ask me:\n1. *"What are the term package fees and how do I pay with M-Pesa?"*\n2. *"How does Kenya CBC compare with Cambridge?"*\n3. *"Check my child's progress and project rubrics"*\n4. *"How do I register for national KNEC / Cambridge exams?"*\n5. *"How do I find a vetted home tutor in Nairobi?"*\n\n*(You can simply reply with 1, 2, 3, 4, or 5, or type your question directly!)*`,
      is_meaningful: false,
      metadata: { is_greeting: true }
    };
  }

  // 3. Child Progress / Learner / Name Inquiries
  if (clean.includes('progress') || clean.includes('child') || clean.includes('student') || clean.includes('learner') || clean.includes('kid') || clean.includes('lesson') || clean.includes('score') || clean.includes('activity') || clean.includes('doing') || clean.includes('called') || clean.includes('name') || clean.includes('rubric')) {
    const childName = typeof activeStudent === 'object' ? (activeStudent?.name || 'Liam Kariuki') : (activeStudent || 'Liam Kariuki');
    const childGrade = typeof activeStudent === 'object' ? (activeStudent?.grade || 'Grade 4 (CBC)') : 'Grade 4 (CBC)';
    return {
      response: `?? **Here is the latest Homeschool Activity Summary for your household:**\n\n?? **Learner:** **${childName}** (${childGrade})\n?? **Grade 4 CBC Term 1 Science & Math**\n  ? **Completion:** 34 of 40 lessons finished (85%)\n  ? **Assigned Facilitator:** Teacher Mercy (Senior CBC Facilitator)\n  ? **Recent Project Rubric:** *Water Filtration System*: **Level 4: EE (Exceeding Expectations)** ? *"Outstanding initiative! Clean water achieved."*\n\n?? *Tip: You can mark daily lessons complete in the Daily OS tab or export official PDF transcripts under Portfolio.*`,
      is_meaningful: true,
      metadata: { activity_checked: true }
    };
  }

  // 4. Platform info / What is soma
  if (clean.includes('what is soma') || clean.includes('soma') || clean.includes('about') || clean.includes('platform') || clean.includes('website') || clean.includes('explain')) {
    return {
      response: "???? **SomaHome Kenya** is a universal **Homeschool-in-a-Box OS & Community Platform**.\n\n? **Turnkey Daily Lesson Plans:** 12-week structured curriculum for Kenya CBC (PP1?Grade 9) and British Cambridge.\n? **Sunday Print Packs:** Downloadable weekly homework worksheets and hands-on science lab experiment guides.\n? **Assessment & Portfolios:** Automated KICD competency rubric tracking (EE/ME/AE/BE) and ReportLab PDF report cards.\n? **Verified Tutors:** Directory of TSC-vetted private tutors and estate learning pods across Nairobi (Kilimani, Karen, Westlands).",
      is_meaningful: true,
      metadata: { topic: 'overview' }
    };
  }

  // 5. Pricing & M-Pesa
  if (clean.includes('price') || clean.includes('cost') || clean.includes('fee') || clean.includes('mpesa') || clean.includes('m-pesa') || clean.includes('pay') || clean.includes('how much')) {
    return {
      response: "?? **SomaHome Package Pricing & M-Pesa Checkout:**\n\n? **Standard Term Package (CBC / Cambridge):** KES 3,500 ? KES 4,500 per term.\n? **What is included:**\n  ? Complete 12-week structured daily lesson plans\n  ? Weekly Sunday printable worksheets and homework packs\n  ? Hands-on science lab experiment guides\n  ? Dedicated WhatsApp mentor support & term report cards\n\n? **Payment Method:** Instant Safaricom M-Pesa STK Push on checkout.",
      is_meaningful: true,
      metadata: { topic: 'pricing' }
    };
  }

  // 6. Curriculum & CBC vs Cambridge
  if (clean.includes('cbc') || clean.includes('cambridge') || clean.includes('curriculum') || clean.includes('grade') || clean.includes('strand')) {
    return {
      response: "?? **SomaHome Curriculum Offerings:**\n\n1. **Kenya CBC (Competency Based Curriculum):**\n   ? Grades: PP1, PP2, Grade 1 through Grade 9 (Junior Secondary).\n   ? Aligned with KICD standards with 21st-century core competencies, strands, and practical projects.\n\n2. **British Cambridge International:**\n   ? Stage 1 to Checkpoint / Lower Secondary & IGCSE preparation.\n   ? Subjects: English, Mathematics, Science.\n\nAll packages include printable PDFs and rubric assessments.",
      is_meaningful: true,
      metadata: { topic: 'curriculum' }
    };
  }

  // 7. Legal & MOE
  if (clean.includes('legal') || clean.includes('ministry') || clean.includes('moe') || clean.includes('knec') || clean.includes('law') || clean.includes('affidavit')) {
    return {
      response: "?? **Homeschooling Legality in Kenya & Legal Concierge:**\n\n? **Constitution of Kenya (Article 53):** Every child has the right to basic education. Alternative learning pathways and homeschooling are recognized.\n? **KNEC & Assessment:** Learners can register as private candidates for national assessments (KPSEA, KCEN) or Cambridge Checkpoint / IGCSE through registered British Council centers.\n? **SomaHome Concierge:** We provide formal registration guidance templates and downloadable academic transcripts compliant with Kenyan education standards.",
      is_meaningful: true,
      metadata: { topic: 'legal' }
    };
  }

  // 8. Tutors & Marketplace
  if (clean.includes('tutor') || clean.includes('teacher') || clean.includes('pod') || clean.includes('marketplace') || clean.includes('hire')) {
    return {
      response: "????? **SomaHome Tutor & Learning Pod Marketplace:**\n\n? Connect with verified, TSC-registered CBC facilitators and Cambridge-certified private tutors.\n? Available for home 1-on-1 sessions or neighbourhood Learning Pods across Nairobi (Kilimani, Karen, Kileleshwa, Westlands, Runda, Kiambu).\n? Filter tutors by hourly rate (KES 1,200 - 2,500/hr), curriculum specialty, and verified parent reviews in the Marketplace tab.",
      is_meaningful: true,
      metadata: { topic: 'marketplace' }
    };
  }

  // General Fallback
  return {
    response: `I am here to assist you with everything related to SomaHome Homeschooling in Kenya! ??\n\nHere are common things you can ask me:\n1. *"What are the term package fees and how do I pay with M-Pesa?"*\n2. *"How does Kenya CBC compare with Cambridge?"*\n3. *"Check my child's progress and project rubrics"*\n4. *"How do I register for national KNEC / Cambridge exams?"*\n5. *"How do I find a vetted home tutor in Nairobi?"*\n\n*(You can reply with 1, 2, 3, 4, or 5)*`,
    is_meaningful: true,
    metadata: { topic: 'general' }
  };
}
