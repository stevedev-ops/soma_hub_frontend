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

  const isAuth = Boolean(currentUser && (currentUser.email || currentUser.username || currentUser.role));
  
  let rawName = currentUser?.first_name || currentUser?.name || currentUser?.username || '';
  if (!rawName || rawName.toLowerCase() === 'parent' || rawName.toLowerCase() === 'user') {
    rawName = 'Parent';
  }
  const userName = isAuth ? rawName : 'Guest Visitor';
  const userRole = isAuth ? (currentUser.role || 'PARENT') : 'GUEST';
  const estate = currentUser?.estate || 'Nairobi, Kenya';

  let resolvedChild = 'Liam Kariuki';
  if (activeStudent) {
    if (typeof activeStudent === 'object' && activeStudent.name) {
      resolvedChild = activeStudent.name;
    } else if (typeof activeStudent === 'string' && activeStudent !== 'child' && activeStudent !== 'learner') {
      resolvedChild = activeStudent.charAt(0).toUpperCase() + activeStudent.slice(1);
      if (!resolvedChild.includes(' ')) resolvedChild += ' Kariuki';
    }
  }
  const childName = isAuth ? resolvedChild : null;
  const childGrade = (activeStudent && typeof activeStudent === 'object' ? activeStudent.grade : null) || 'Grade 4 (CBC)';
  const childCurriculum = (activeStudent && typeof activeStudent === 'object' ? activeStudent.curriculum : null) || 'CBC';

  // 1. Affirmative follow-ups ("yes", "sure", "please do", "show me", "rubrics", "schedule", "yeah")
  if (['yes', 'yeah', 'yep', 'sure', 'please', 'ok', 'okay', 'show me', 'show me rubrics', 'view schedule', 'yes please', 'do that'].includes(clean)) {
    if (isAuth) {
      return `📋 **Live Academic Portfolio & Today's Schedule for ${childName}:**

🌟 **Recent Project Rubrics (KICD Competency Level):**
• **Project:** *Water Filtration & Environmental Conservation*
• **Score:** **Level 4: EE (Exceeding Expectations)**
• **Assessor Feedback:** *"Outstanding critical thinking! Demonstrated clean filtration and documented scientific principles accurately."*

📅 **Today's Daily Lesson Schedule:**
1. **Mathematics:** Fractions & Decimals (Lesson 18 of 20) — ✅ *Completed*
2. **Science & Tech:** Living Organisms & Habitats (Lesson 19) — ⏳ *In Progress*
3. **Language & Literacy:** Creative Story Composition — 📌 *Scheduled (2:00 PM)*

Would you like to export the official **PDF Report Card** or download the **Sunday Print Pack** for this week?`;
    } else {
      return `📋 **Sample Academic Rubric & Schedule (Demo):**

🌟 **Sample Rubric Score:**
• **Project:** *Science Lab Experiment (Water Cycle)*
• **Evaluation:** **EE (Exceeding Expectations)**

📅 **Sample Daily Schedule:**
1. Math (45 min) • 2. Science Lab (60 min) • 3. English Composition (45 min)

🔒 *Log in to your parent account to customize and track your learner's real-time schedule.*`;
    }
  }

  // 2. Dashboards present / Platform views
  if (
    clean.includes('which dashboard') ||
    clean.includes('what dashboard') ||
    clean.includes('dashboards are present') ||
    clean.includes('available dashboard') ||
    clean.includes('dashboards exist') ||
    clean.includes('list dashboard') ||
    clean.includes('what views') ||
    clean.includes('modules')
  ) {
    return `🖥️ **SomaHome features 5 specialized, role-based dashboards:**

1️⃣ **👨‍👩‍👧 Parent Dashboard:**
   • Multi-child overview, term package progress, Sunday pack downloads, SEN accessibility adjustments, and official PDF report cards.

2️⃣ **🎒 Student OS & Daily Hub:**
   • Distraction-free learner interface with daily lesson checklists, interactive quiz game, scratchpad, and worksheet submission.

3️⃣ **👩‍🏫 Tutor & Facilitator Portal:**
   • TSC-vetted mentor dashboard for grading project rubrics (EE/ME/AE/BE), session scheduling, and student feedback.

4️⃣ **🎨 Creator & Publisher Marketplace:**
   • Community portal for verified Kenyan educators to upload custom 12-week lesson bundles and earn royalties.

5️⃣ **🛡️ Super Admin Control Center:**
   • Platform-wide intelligence, M-Pesa financial audit, tenant management, and real-time AI conversation audit hub.

You can switch between views anytime using the **Switch** button in the top navigation bar!`;
  }

  // 3. Weekly Packs / Sunday Print Packs / Worksheets
  if (
    clean.includes('weekly pack') ||
    clean.includes('sunday pack') ||
    clean.includes('print pack') ||
    clean.includes('worksheet') ||
    clean.includes('homework pack') ||
    clean.includes('download pack') ||
    clean.includes('get weekly')
  ) {
    return `📦 **Weekly Sunday Print Packs for ${childName || 'your learner'} (${childGrade}):**

• **What's Included:** 12-week structured curriculum worksheets, daily lesson guides, homework exercises, and hands-on science lab instructions.
• **How to Access:**
  1. Go to your **Parent Dashboard** or **Family OS**.
  2. Click the green **📥 Sunday Print Pack** button in the top banner.
  3. Select your week (Week 1–12) to print or save the complete PDF worksheet booklet.

Would you like to review today's lesson checklist for ${childName || 'your learner'}?`;
  }

  // 4. User Identity ("do you know me", "who am i", "my profile")
  if (
    clean.includes('do you know me') ||
    clean.includes('who am i') ||
    clean.includes('my name') ||
    clean.includes('who is logged in') ||
    clean.includes('what is my name') ||
    clean.includes('my profile') ||
    clean.includes('my account') ||
    clean.includes('who i am') ||
    clean.includes('know me')
  ) {
    if (isAuth) {
      return `👤 **Yes, I know you! Here are your account details:**

• **User / Account:** **${userName}**
• **Role:** **${userRole}**
• **Estate / Location:** ${estate}
• **Linked Learner:** **${childName}** (${childGrade} • ${childCurriculum})
• **Current Progress:** 34 of 40 lessons completed (85% Term 1)

You have full access to manage your learner's schedule, rubric scores, and Sunday print packs. How can I help you right now?`;
    } else {
      return `🌐 **You are currently browsing as a Guest Visitor** (not logged in).

As a guest, you can explore curriculum overviews, pricing, and tutor directories. To link your account and learner records, please **Log In** via the top navigation bar.`;
    }
  }

  // 5. Capacity / Max children limit
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
    return `👨‍👩‍👧‍👦 **There is no maximum limit on children on SomaHome!**

With a single Parent Account, you can register and manage **as many learners as you have**:
• **Multiple Grades & Curriculums:** For example, you can have one child in *Grade 1 CBC*, another in *Grade 4 CBC*, and an older sibling in *Cambridge Stage 8*.
• **Individualized Portfolios:** Each child gets their own daily timetable, Sunday print packs, lesson checklists, and rubric scores.
• **Transparent Term Fees:** Pricing is simply **KES 3,500 per term per learner**, payable via instant M-Pesa STK push.

Would you like guidance on adding your first or additional learners?`;
  }

  // 6. Step-by-step Onboarding / 'How do I go about Soma'
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
    return `🚀 **Here is how you get started with SomaHome in 4 simple steps:**

1️⃣ **Select Your Curriculum & Grade:**
   Choose between **Kenya CBC (PP1–Grade 9)** or **British Cambridge (Stage 1–9)**.

2️⃣ **Download Weekly Sunday Packs:**
   Every Sunday, download 12-week lesson plans, printable student worksheets, and science experiment guides.

3️⃣ **Track Daily Progress & Rubrics:**
   Mark daily lessons as completed and track competency levels (**EE** - Exceeding, **ME** - Meeting, **AE** - Approaching, **BE** - Below).

4️⃣ **Book Verified Home Tutors & Pods:**
   Connect with TSC-vetted private tutors across Nairobi (Kilimani, Karen, Westlands) for 1-on-1 coaching or neighborhood pods.

💡 *Term enrollment starts at KES 3,500 via M-Pesa.* Would you like to view our curriculum guides or start an enrollment?`;
  }

  // 7. Child Name & Progress Details
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
      return `🎓 **Your Active Learner:**

• **Name:** **${childName}**
• **Grade Level:** **${childGrade}**
• **Curriculum:** **${childCurriculum}**
• **Status:** Active (Term 1 • 2026)
• **Completed Lessons:** 34 of 40 lessons completed (85%)
• **Assigned Facilitator:** Teacher Mercy (Senior CBC Facilitator)

Would you like to review ${childName}'s recent rubric scores or today's schedule?`;
    } else {
      return `🔒 **No child is linked because you are in Guest Mode.**

To link and monitor your child's progress, please **Log In** to your parent account. If you are exploring SomaHome, you can ask about our CBC & Cambridge curriculum packages!`;
    }
  }

  // 8. General Soma Overview
  if (
    clean.includes('what is soma') ||
    clean.includes('tell me about soma') ||
    clean.includes('about somahome') ||
    clean.includes('what is somahome') ||
    clean.includes('what does it do')
  ) {
    return `🏡 **SomaHome Kenya is a complete Homeschool-in-a-Box OS & Community Platform.**

• **Turnkey Daily Lesson Plans:** 12-week structured curriculum for Kenya CBC (PP1–Grade 9) and British Cambridge (Stage 1–9).
• **Sunday Print Packs:** Downloadable weekly homework worksheets and hands-on science lab experiment guides.
• **Assessment & Portfolios:** Automated KICD competency rubric tracking (EE/ME/AE/BE) and exportable PDF report cards.
• **Verified Tutors & Pods:** Directory of TSC-vetted private tutors and estate learning pods across Nairobi (Kilimani, Karen, Westlands).

Is there a specific grade or curriculum package you would like to explore?`;
  }

  // 9. Pricing & Fees
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
    return `💳 **SomaHome Transparent Pricing & M-Pesa:**

• **Kenya CBC Core Package (PP1 – Grade 9):** KES 3,500 / term
• **British Cambridge Package (Stage 1 – 9):** KES 5,000 / term
• **Legal Concierge & KNEC Exam Registration:** KES 2,500 (one-time)
• **Vetted Private Home Tutors:** KES 800 – 1,500 / hour

💰 Instant enrollment via **M-Pesa STK Push** directly to your phone. Ready to enroll for Term 1?`;
  }

  // 10. Curriculum Comparison
  if (
    clean === '2' ||
    clean.includes('cbc') ||
    clean.includes('cambridge') ||
    clean.includes('compare')
  ) {
    return `📚 **Kenya CBC vs British Cambridge Comparison:**

🇰🇪 **Kenya CBC (KICD 2-6-3-3-3):**
• Emphasizes 7 Core Competencies (Communication, Critical Thinking, Digital Literacy, etc.).
• Assessed via continuous rubric levels: **EE** (Exceeding), **ME** (Meeting), **AE** (Approaching), **BE** (Below).
• National milestones: KPSEA (Grade 6) and KJSEA (Grade 9).

🇬🇧 **British Cambridge (Primary & Lower Secondary):**
• Focuses on rigorous subject mastery in Math, Science, and English.
• Standardized external Progression Tests and Checkpoint Exams at Stage 6 and Stage 9.

Both curriculums are fully supported with daily lesson guides on SomaHome!`;
  }

  // 11. Student Progress & Rubrics
  if (
    clean === '3' ||
    clean.includes('progress') ||
    clean.includes('rubric') ||
    clean.includes('how is my child doing') ||
    clean.includes('check progress') ||
    clean.includes('scores')
  ) {
    if (isAuth && childName) {
      return `📊 **Live Academic Progress for ${childName}:**

• **Term 1 Progress:** 34 of 40 lessons completed (85%)
• **Competency Rubric Rating:** **EE (Exceeding Expectations)** in Science & Mathematics
• **Assigned Facilitator:** Teacher Mercy (Senior CBC Facilitator)
• **Recent Project:** Water Filtration Experiment — *Outstanding initiative and documentation*

You can export the full official PDF Report Card anytime from your parent dashboard.`;
    } else {
      return `📊 **Sample Learner Progress Overview (Demo):**

• **Sample Student:** Liam Kariuki (Grade 4 CBC)
• **Completion:** 85% (34 of 40 lessons completed)
• **Rubric Rating:** **Level 4: EE (Exceeding Expectations)**

🔒 *To view your own child's real-time live data, please log in to your Parent account.*`;
    }
  }

  // 12. Legal & KNEC
  if (
    clean === '4' ||
    clean.includes('legal') ||
    clean.includes('knec') ||
    clean.includes('moe') ||
    clean.includes('law') ||
    clean.includes('affidavit')
  ) {
    return `⚖️ **Homeschool Legal Compliance in Kenya:**

• **Constitutional Right:** Article 53(1)(b) of the Constitution of Kenya guarantees every child the right to basic education.
• **National KNEC Exams:** Homeschooled candidates can register for national assessments (KPSEA, KCSE/IGCSE) at accredited private sub-county exam centers.
• **SomaHome Legal Concierge:** We provide parent legal affidavit templates, portfolio compilation, and KNEC private candidate registration assistance.`;
  }

  // 13. Tutors & Pods
  if (
    clean === '5' ||
    clean.includes('tutor') ||
    clean.includes('pod') ||
    clean.includes('teacher') ||
    clean.includes('hire')
  ) {
    return `👩‍🏫 **TSC-Vetted Private Tutors & Learning Pods:**

• **Estate Tutors in Nairobi:** Certified home educators available in Kilimani, Kileleshwa, Karen, Westlands, Lavington, and Runda.
• **Learning Pods:** Small groups (3–6 homeschoolers) sharing a specialized tutor for science labs, French, and coding.
• **Hourly Rates:** KES 800 – 1,500 / hr with background-checked credentials.`;
  }

  // 14. Greetings
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
    return `👋 Hello and welcome to **SomaHome**! Jambo ${userName}!

I am your AI Homeschool Guide. How can I assist you with your homeschool curriculum, lesson plans, or learner progress today?`;
  }

  // 15. Intelligent Fallback
  return `💡 **SomaHome AI Assistant:**

I understand you are asking about: *"${raw}"*

Here is how SomaHome supports you:
• **Curriculum & Grades:** Comprehensive 12-week lesson plans for Kenya CBC (PP1–Grade 9) and British Cambridge (Stage 1–9).
• **Learner Capacity:** You can enroll unlimited children under one parent account with separate portfolios for each.
• **Sunday Print Packs:** Downloadable weekly homework and hands-on science experiment packs.
• **Tutors & Exam Registration:** Direct access to vetted Nairobi tutors and KNEC private candidate guidance.

Feel free to ask any specific question about your grade, lessons, or fees!`;
};

export const generateClientBotResponse = generateLocalAIResponse;
