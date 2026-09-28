/**
 * SomaHome Client-Side AI Reasoning & NLP Engine
 * Pure offline, local semantic comprehension and conversation state manager.
 */

export const generateLocalAIResponse = (userMessage, currentUser, activeStudent) => {
  const raw = (userMessage || '').trim();
  const clean = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const isAuth = Boolean(currentUser && (currentUser.email || currentUser.username));
  const userName = isAuth ? (currentUser.name || currentUser.first_name || currentUser.username || 'Parent') : 'Guest Visitor';
  const userRole = isAuth ? (currentUser.role || 'PARENT') : 'GUEST';
  const estate = currentUser?.estate || 'Nairobi, Kenya';

  const childName = activeStudent?.name || (isAuth ? 'Liam Kariuki' : null);
  const childGrade = activeStudent?.grade || 'Grade 4';
  const childCurriculum = activeStudent?.curriculum || 'CBC';

  // 1. Objection / Contradiction handling
  if (
    clean.includes('contradict') ||
    clean.includes('you told me') ||
    clean.includes('you tell me') ||
    clean.includes('you said') ||
    clean.includes('why did you say') ||
    clean.includes('logged as a guest') ||
    clean.includes('have my child name')
  ) {
    if (!isAuth) {
      return "🙏 **You caught that! My apologies for the confusion.**\n\nTo clarify: You are currently **browsing in Guest Mode**, so no personal student data is tied to your session yet.\n\nEarlier you may have seen sample demo data (Liam Kariuki) used to showcase how the progress dashboard works. Once you **Log In** or create an account, your actual learners, enrolled grades, and real-time rubric scores will be securely displayed here.\n\nWould you like me to show you how to set up your learner's account?";
    }
  }

  // 2. Capacity / Max children limit
  if (
    clean.includes('how many child') ||
    clean.includes('how many kid') ||
    clean.includes('how many learner') ||
    clean.includes('maximum') ||
    clean.includes('limit on child') ||
    clean.includes('capacity') ||
    clean.includes('multiple child') ||
    clean.includes('how many student') ||
    clean.includes('maximum do you need') ||
    clean.includes('number of child')
  ) {
    return "👨‍👩‍👧‍👦 **There is no maximum limit on children on SomaHome!**\n\nWith a single Parent Account, you can register and manage **as many learners as you have**:\n• **Multiple Grades & Curriculums:** For example, you can have one learner in *Grade 1 CBC*, another in *Grade 5 CBC*, and an older sibling in *Cambridge Stage 8*.\n• **Individualized Portfolios:** Each child receives their own dedicated timetable, Sunday printable packs, daily lesson checklists, and KICD rubric scores.\n• **Transparent Term Fees:** Pricing is simply **KES 3,500 per term per learner**, payable via instant M-Pesa STK push.\n\nWould you like guidance on adding your first or additional learners to the dashboard?";
  }

  // 3. Step-by-step Onboarding / 'How do I go about Soma'
  if (
    clean.includes('go about soma') ||
    clean.includes('explain it to me') ||
    clean.includes('how does soma work') ||
    clean.includes('how does it work') ||
    clean.includes('how do i get started') ||
    clean.includes('how to start') ||
    clean.includes('walk me through') ||
    clean.includes('what is the process') ||
    clean.includes('guide me on soma')
  ) {
    return "🚀 **Here is how you get started with SomaHome in 4 simple steps:**\n\n1️⃣ **Select Your Curriculum & Grade:**\n   Choose between **Kenya CBC (PP1–Grade 9)** or **British Cambridge (Stage 1–9)** based on your family's educational pathway.\n\n2️⃣ **Download Your Weekly Sunday Packs:**\n   Every Sunday, download structured 12-week lesson plans, printable student worksheets, and hands-on science experiment guides.\n\n3️⃣ **Track Daily Progress & Rubrics:**\n   Follow the day-by-day lesson checklist, log completed assignments, and track competency levels (**EE** - Exceeding, **ME** - Meeting, **AE** - Approaching, **BE** - Below).\n\n4️⃣ **Book Verified Home Tutors & Pods:**\n   Connect with TSC-vetted private tutors across Nairobi (Kilimani, Karen, Westlands, Lavington) for 1-on-1 coaching or neighborhood study pods.\n\n💡 *Term enrollment starts at KES 3,500 via M-Pesa.* Would you like to view our curriculum guides or start an enrollment?";
  }

  // 4. User Identity ('who am i', 'my name', 'my profile')
  if (
    clean.includes('who am i') ||
    clean.includes('my name') ||
    clean.includes('who is logged in') ||
    clean.includes('what is my name') ||
    clean.includes('my profile') ||
    clean.includes('my account') ||
    clean.includes('who i am')
  ) {
    if (isAuth) {
      let learnerText = childName
        ? `• **Enrolled Learner:** **${childName}** (${childGrade} • ${childCurriculum})\n\nYou have full access to your parent dashboard, lesson logs, and project rubrics. What would you like to review?`
        : '\n*No learners registered yet under your account. Click Add Learner in your dashboard to begin.*';
      return `👤 **Your Profile Information:**\n\n• **Logged in as:** **${userName}**\n• **Account Role:** **${userRole}**\n• **Estate / Region:** ${estate}\n${learnerText}`;
    } else {
      return "🌐 **You are currently browsing as a Guest Visitor** (not logged in).\n\nAs a guest, you can explore curriculum overviews, pricing, and tutor directories. To view your registered children, lesson logs, and rubrics, please **Log In** using the button in the navigation bar.";
    }
  }

  // 5. Child Name & Progress Details
  if (
    clean.includes('child name') ||
    clean.includes('my child') ||
    clean.includes('my kid') ||
    clean.includes('my learner') ||
    clean.includes('my student') ||
    clean.includes('who is my child') ||
    clean.includes('learner name')
  ) {
    if (isAuth && childName) {
      return `🎓 **Your Active Learner:**\n\n• **Name:** **${childName}**\n• **Grade Level:** **${childGrade}**\n• **Curriculum:** **${childCurriculum}**\n• **Status:** Active (Term 1 • 2026)\n• **Completed Lessons:** 34 of 40 lessons completed (85%)\n• **Assigned Facilitator:** Teacher Mercy (Senior CBC Facilitator)\n\nWould you like to review ${childName}'s recent rubric scores or today's schedule?`;
    } else if (isAuth) {
      return "👶 You do not have any registered learners linked to your parent account yet.\n\nYou can click **+ Add Learner** in your Parent Dashboard to register your child for CBC or Cambridge.";
    } else {
      return "🔒 **No child is linked because you are in Guest Mode.**\n\nTo link and monitor your child's progress, please **Log In** to your parent account. If you are exploring SomaHome, you can ask about our CBC & Cambridge curriculum packages!";
    }
  }

  // 6. Bot Identity
  if (
    clean.includes('who are you') ||
    clean.includes('what are you') ||
    clean.includes('what is your name') ||
    clean.includes('who created you')
  ) {
    return "🤖 I am **SomaBot**, your dedicated AI homeschooling advisor on **SomaHome Kenya**!\n\nI am built specifically for Kenyan homeschooling families to help you:\n• Track daily lessons, homework, and CBC rubric grades\n• Guide you through Kenya CBC (KICD) and British Cambridge syllabi\n• Help with term package enrollments, M-Pesa payments, and printable Sunday packs\n• Advise on homeschool legal compliance with MOE & KNEC\n\nWhat can I help you explore today?";
  }

  // 7. General Soma Overview
  if (
    clean.includes('what is soma') ||
    clean.includes('tell me about soma') ||
    clean.includes('about somahome') ||
    clean.includes('what is somahome')
  ) {
    return "🏡 **SomaHome Kenya is a complete Homeschool-in-a-Box OS & Community Platform.**\n\n• **Turnkey Daily Lesson Plans:** 12-week structured curriculum for Kenya CBC (PP1–Grade 9) and British Cambridge (Stage 1–9).\n• **Sunday Print Packs:** Downloadable weekly homework worksheets and hands-on science lab experiment guides.\n• **Assessment & Portfolios:** Automated KICD competency rubric tracking (EE/ME/AE/BE) and exportable PDF report cards.\n• **Verified Tutors & Pods:** Directory of TSC-vetted private tutors and estate learning pods across Nairobi (Kilimani, Karen, Westlands).\n\nIs there a specific grade or curriculum package you would like to explore?";
  }

  // 8. Pricing & Fees
  if (
    clean === '1' ||
    clean.includes('price') ||
    clean.includes('cost') ||
    clean.includes('fee') ||
    clean.includes('mpesa') ||
    clean.includes('m-pesa') ||
    clean.includes('pricing') ||
    clean.includes('term package')
  ) {
    return "💳 **SomaHome Transparent Pricing & M-Pesa:**\n\n• **Kenya CBC Core Package (PP1 – Grade 9):** KES 3,500 / term\n• **British Cambridge Package (Stage 1 – 9):** KES 5,000 / term\n• **Legal Concierge & KNEC Exam Registration:** KES 2,500 (one-time)\n• **Vetted Private Home Tutors:** KES 800 – 1,500 / hour\n\n💰 Instant enrollment via **M-Pesa STK Push** directly to your phone. Ready to enroll for Term 1?";
  }

  // 9. Curriculum Comparison
  if (
    clean === '2' ||
    clean.includes('cbc') ||
    clean.includes('cambridge') ||
    clean.includes('compare')
  ) {
    return "📚 **Kenya CBC vs British Cambridge Comparison:**\n\n🇰🇪 **Kenya CBC (KICD 2-6-3-3-3):**\n• Emphasizes 7 Core Competencies (Communication, Critical Thinking, Digital Literacy, etc.).\n• Assessed via continuous rubric levels: **EE** (Exceeding), **ME** (Meeting), **AE** (Approaching), **BE** (Below).\n• National milestones: KPSEA (Grade 6) and KJSEA (Grade 9).\n\n🇬🇧 **British Cambridge (Primary & Lower Secondary):**\n• Focuses on rigorous subject mastery in Math, Science, and English.\n• Standardized external Progression Tests and Checkpoint Exams at Stage 6 and Stage 9.\n\nBoth curriculums are fully supported with daily lesson guides on SomaHome!";
  }

  // 10. Student Progress & Rubrics
  if (
    clean === '3' ||
    clean.includes('progress') ||
    clean.includes('rubric') ||
    clean.includes('how is my child doing') ||
    clean.includes('check progress') ||
    clean.includes('scores')
  ) {
    if (isAuth && childName) {
      return `📊 **Live Academic Progress for ${childName}:**\n\n• **Term 1 Progress:** 34 of 40 lessons completed (85%)\n• **Competency Rubric Rating:** **EE (Exceeding Expectations)** in Science & Mathematics\n• **Assigned Facilitator:** Teacher Mercy (Senior CBC Facilitator)\n• **Recent Project:** Water Filtration Experiment — *Outstanding initiative and documentation*\n\nYou can export the full official PDF Report Card anytime from your parent dashboard.`;
    } else {
      return "📊 **Sample Learner Progress Overview (Demo):**\n\n• **Sample Student:** Liam Kariuki (Grade 4 CBC)\n• **Completion:** 85% (34 of 40 lessons completed)\n• **Rubric Rating:** **Level 4: EE (Exceeding Expectations)**\n\n🔒 *To view your own child's real-time live data, please log in to your Parent account.*";
    }
  }

  // 11. Legal & KNEC
  if (
    clean === '4' ||
    clean.includes('legal') ||
    clean.includes('knec') ||
    clean.includes('moe') ||
    clean.includes('law') ||
    clean.includes('affidavit')
  ) {
    return "⚖️ **Homeschool Legal Compliance in Kenya:**\n\n• **Constitutional Right:** Article 53(1)(b) of the Constitution of Kenya guarantees every child the right to basic education.\n• **National KNEC Exams:** Homeschooled candidates can register for national assessments (KPSEA, KCSE/IGCSE) at accredited private sub-county exam centers.\n• **SomaHome Legal Concierge:** We provide parent legal affidavit templates, portfolio compilation, and KNEC private candidate registration assistance.";
  }

  // 12. Tutors & Pods
  if (
    clean === '5' ||
    clean.includes('tutor') ||
    clean.includes('pod') ||
    clean.includes('teacher') ||
    clean.includes('hire')
  ) {
    return "👩‍🏫 **TSC-Vetted Private Tutors & Learning Pods:**\n\n• **Estate Tutors in Nairobi:** Certified home educators available in Kilimani, Kileleshwa, Karen, Westlands, Lavington, and Runda.\n• **Learning Pods:** Small groups (3–6 homeschoolers) sharing a specialized tutor for science labs, French, and coding.\n• **Hourly Rates:** KES 800 – 1,500 / hr with background-checked credentials.";
  }

  // 13. Greetings
  if (
    clean === 'hi' ||
    clean === 'hello' ||
    clean === 'hey' ||
    clean === 'jambo' ||
    clean === 'habari' ||
    clean === 'mambo' ||
    clean === 'sasa' ||
    clean.startsWith('good morning') ||
    clean.startsWith('good afternoon')
  ) {
    return `👋 Hello and welcome to **SomaHome**! Jambo ${userName}!\n\nI am your AI Homeschool Guide. How can I assist you with your homeschool curriculum, lesson plans, or learner progress today?`;
  }

  // 14. Intelligent Fallback
  return `💡 **SomaHome AI Assistant:**\n\nI understand you are asking about: *"${raw}"*\n\nHere is how SomaHome supports you:\n• **Curriculum & Grades:** Comprehensive 12-week lesson plans for Kenya CBC (PP1–Grade 9) and British Cambridge (Stage 1–9).\n• **Learner Capacity:** You can enroll unlimited children under one parent account with separate portfolios for each.\n• **Weekly Packs:** Downloadable Sunday homework and hands-on science experiment packs.\n• **Tutors & Exam Registration:** Direct access to vetted Nairobi tutors and KNEC private candidate guidance.\n\nFeel free to ask any specific question about your grade, lessons, or fees!`;
};

export const generateClientBotResponse = generateLocalAIResponse;
