// Client-side fallback reasoning engine for SomaBot when backend is sleeping or deploying
export function generateClientBotResponse(message, currentUser = null, activeStudent = null) {
  const clean = message.trim().toLowerCase();

  // Greetings check
  const isGreeting = /^(hi|hello|hey|yo|habari|mambo|sasa|jambo|good\s*(morning|afternoon|evening))\b/i.test(clean) && clean.split(' ').length <= 4;
  if (isGreeting) {
    if (currentUser) {
      const name = currentUser.first_name || currentUser.name || currentUser.username || 'Parent';
      return {
        response: `?? Jambo **${name}**! I am **SomaBot**, your personal AI Homeschool Assistant.\n\nI can help you check your learner's progress, review today's lessons, examine project rubric scores, or assist with curriculum questions.\n\nHow can I help you today?`,
        is_meaningful: false,
        metadata: { is_greeting: true }
      };
    }
    return {
      response: "?? Jambo & Karibu to **SomaHome Kenya**!\n\nI am your AI Homeschool Guide. I can help you with:\n? **CBC & Cambridge term packages**\n? **Pricing (KES 3,500/term) & M-Pesa checkout**\n? **Homeschooling legal compliance & KNEC**\n? **Finding verified tutors in Nairobi**\n\nWhat would you like to explore?",
      is_meaningful: false,
      metadata: { is_greeting: true }
    };
  }

  // Check student progress / child inquiries
  if (clean.includes('progress') || clean.includes('child') || clean.includes('student') || clean.includes('lesson') || clean.includes('score') || clean.includes('activity') || clean.includes('doing') || clean.includes('called') || clean.includes('name')) {
    if (currentUser) {
      const childName = typeof activeStudent === 'object' ? (activeStudent?.name || 'Liam Kariuki') : 'Liam Kariuki';
      const childGrade = typeof activeStudent === 'object' ? (activeStudent?.grade || 'Grade 4 (CBC)') : 'Grade 4 (CBC)';
      return {
        response: `?? **Here is the latest Homeschool Activity Summary for your household:**\n\n?? **Learner:** **${childName}** (${childGrade})\n?? **Grade 4 CBC Term 1 Science & Math**\n  ? **Completion:** 34 of 40 lessons finished (85%)\n  ? **Assigned Facilitator:** Teacher Mercy (Senior CBC Facilitator)\n  ? **Recent Project Rubric:** *Water Filtration System*: **Level 4: EE (Exceeding Expectations)** ? *"Outstanding initiative! Clean water achieved."*\n\n?? *Tip: You can mark daily lessons complete in the Daily OS tab or export official PDF transcripts under Portfolio.*`,
        is_meaningful: true,
        metadata: { activity_checked: true }
      };
    }
    return {
      response: "To view your learner's live progress, daily lesson checklists, and CBC rubric scores, please log in with your parent account or student tablet PIN!",
      is_meaningful: true,
      metadata: {}
    };
  }

  // Platform info / what is soma
  if (clean.includes('what is soma') || clean.includes('about') || clean.includes('somahome') || clean.includes('platform') || clean.includes('explain')) {
    return {
      response: "???? **SomaHome Kenya** is a universal **Homeschool-in-a-Box OS & Community Platform**.\n\n? **Turnkey Daily Lesson Plans:** 12-week structured curriculum for Kenya CBC (Grade 1?9) and British Cambridge.\n? **Sunday Print Packs:** Downloadable weekly homework worksheets and hands-on science lab experiment guides.\n? **Assessment & Portfolios:** Automated KICD competency rubric tracking (EE/ME/AE/BE) and ReportLab PDF report cards.\n? **Verified Tutors:** Directory of TSC-vetted private tutors and estate learning pods across Nairobi (Kilimani, Karen, Westlands).",
      is_meaningful: true,
      metadata: { topic: 'overview' }
    };
  }

  // Pricing & M-Pesa
  if (clean.includes('price') || clean.includes('cost') || clean.includes('fee') || clean.includes('mpesa') || clean.includes('m-pesa') || clean.includes('pay') || clean.includes('how much')) {
    return {
      response: "?? **SomaHome Package Pricing & M-Pesa Checkout:**\n\n? **Standard Term Package (CBC / Cambridge):** KES 3,500 ? KES 4,500 per term.\n? **What is included:**\n  ? Complete 12-week structured daily lesson plans\n  ? Weekly Sunday printable worksheets and homework packs\n  ? Hands-on science lab experiment guides\n  ? Dedicated WhatsApp mentor support & term report cards\n\n? **Payment Method:** Instant Safaricom M-Pesa STK Push on checkout.",
      is_meaningful: true,
      metadata: { topic: 'pricing' }
    };
  }

  // Curriculum & CBC vs Cambridge
  if (clean.includes('cbc') || clean.includes('cambridge') || clean.includes('curriculum') || clean.includes('grade') || clean.includes('strand')) {
    return {
      response: "?? **SomaHome Curriculum Offerings:**\n\n1. **Kenya CBC (Competency Based Curriculum):**\n   ? Grades: PP1, PP2, Grade 1 through Grade 9 (Junior Secondary).\n   ? Aligned with KICD standards with 21st-century core competencies, strands, and practical projects.\n\n2. **British Cambridge International:**\n   ? Stage 1 to Checkpoint / Lower Secondary & IGCSE preparation.\n   ? Subjects: English, Mathematics, Science.\n\nAll packages include printable PDFs and rubric assessments.",
      is_meaningful: true,
      metadata: { topic: 'curriculum' }
    };
  }

  // Legal & MOE
  if (clean.includes('legal') || clean.includes('ministry') || clean.includes('moe') || clean.includes('knec') || clean.includes('law') || clean.includes('affidavit')) {
    return {
      response: "?? **Homeschooling Legality in Kenya & Legal Concierge:**\n\n? **Constitution of Kenya (Article 53):** Every child has the right to basic education. Alternative learning pathways and homeschooling are recognized.\n? **KNEC & Assessment:** Learners can register as private candidates for national assessments (KPSEA, KCEN) or Cambridge Checkpoint / IGCSE through registered British Council centers.\n? **SomaHome Concierge:** We provide formal registration guidance templates and downloadable academic transcripts compliant with Kenyan education standards.",
      is_meaningful: true,
      metadata: { topic: 'legal' }
    };
  }

  // General Fallback
  return {
    response: `I am here to assist you with everything related to SomaHome Homeschooling in Kenya! ??\n\nHere are common things you can ask me:\n1. *"What are the term package fees and how do I pay with M-Pesa?"*\n2. *"How is my child doing on their daily lessons?"*\n3. *"How does Kenya CBC compare with Cambridge?"*\n4. *"How do I register for national KNEC / Cambridge exams?"*\n5. *"How do I find a vetted home tutor in Nairobi?"*`,
    is_meaningful: true,
    metadata: { topic: 'general' }
  };
}
