/**
 * SomaHome Client-Side AI Reasoning, NLP Engine, and Agentic Action Executor
 */

export const generateLocalAIResponse = (userMessage, currentUser, activeStudent, childrenList = []) => {
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
  const estate = currentUser?.estate || 'Kilimani, Nairobi';

  // Build complete multi-child household list
  let familyRoster = [
    { id: 'liam', name: 'Liam Kariuki', grade: 'Grade 4 (CBC)', curriculum: 'CBC', percent: 85, completed: 34, total: 40, project: 'Science Lab & Water Filtration', rubric: 'Level 4: EE (Exceeding Expectations)' },
    { id: 'maya', name: 'Maya Kariuki', grade: 'Grade 2 (Cambridge)', curriculum: 'Cambridge', percent: 90, completed: 36, total: 40, project: 'Phonics & Creative Expression', rubric: 'Level 4: EE (Exceeding Expectations)' },
    { id: 'mike', name: 'Mike Kariuki', grade: 'PP2 Playgroup (CBC)', curriculum: 'CBC', percent: 75, completed: 30, total: 40, project: 'Motor Skills & Color Sorting', rubric: 'Level 3: ME (Meeting Expectations)' }
  ];

  if (Array.isArray(childrenList) && childrenList.length > 0) {
    familyRoster = childrenList.map(c => ({
      id: c.id || c.name?.toLowerCase()?.replace(/\s+/g, '_'),
      name: c.name || 'Learner Kariuki',
      grade: c.grade || 'Grade 4 (CBC)',
      curriculum: c.curriculum || 'CBC',
      percent: c.percent || 85,
      completed: c.completed || 34,
      total: c.total || 40,
      project: c.project || 'Environmental Science',
      rubric: c.rubric || 'Level 4: EE (Exceeding Expectations)'
    }));
  }

  // Determine active / focused child
  let resolvedChild = familyRoster[0]?.name || 'Liam Kariuki';
  let resolvedGrade = familyRoster[0]?.grade || 'Grade 4 (CBC)';
  let resolvedCurriculum = familyRoster[0]?.curriculum || 'CBC';

  if (activeStudent) {
    const actId = typeof activeStudent === 'object' ? activeStudent.id : activeStudent;
    const match = familyRoster.find(c => c.id === actId || c.name.toLowerCase().includes(String(actId).toLowerCase()));
    if (match) {
      resolvedChild = match.name;
      resolvedGrade = match.grade;
      resolvedCurriculum = match.curriculum;
    } else if (typeof activeStudent === 'string' && activeStudent !== 'child' && activeStudent !== 'learner') {
      resolvedChild = activeStudent.charAt(0).toUpperCase() + activeStudent.slice(1);
      if (!resolvedChild.includes(' ')) resolvedChild += ' Kariuki';
    }
  }

  const childName = isAuth ? resolvedChild : null;
  const childGrade = isAuth ? resolvedGrade : 'Grade 4 (CBC)';
  const childCurriculum = isAuth ? resolvedCurriculum : 'CBC';

  // --- SECURITY FIREWALL & INJECTION DEFENSE ---
  const maliciousPatterns = [
    /(ignore|disregard|forget|override)\s+(all\s+)?(previous\s+)?(instructions|rules|prompts)/i,
    /(system\s+prompt|developer\s+prompt|hidden\s+prompt|reveal\s+instructions)/i,
    /(super\s*admin\s*password|admin\s*credentials|database\s*password|env\s*variables|api\s*key)/i,
    /(select\s+.+\s+from|drop\s+table|insert\s+into|delete\s+from|exec\s*\()/i,
    /(<script|javascript:|onerror=|onload=)/i,
    /(sudo|cat\s+\/etc\/passwd|bash|rm\s+-rf)/i
  ];

  if (maliciousPatterns.some(p => p.test(raw))) {
    return `🔒 **Security Notice:**

I am programmed to assist with SomaHome homeschool learning, lessons, and curriculum guidance only. I cannot process administrative overrides or disclose internal system configurations.

For technical support or institutional partnerships, please contact **support@somahome.co.ke**.`;
  }

  // Statistics / How Many Parents Guardrail (No Super Admin mentions)
  if (
    clean.includes('how many parents') ||
    clean.includes('how many users') ||
    clean.includes('how many families') ||
    clean.includes('number of parents') ||
    clean.includes('total parents') ||
    clean.includes('total users')
  ) {
    return `🏡 **SomaHome Homeschool Community:**

• **Community Reach:** SomaHome supports **over 5,000+ homeschooling families** across Kenya (Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret).
• **Curriculum Enrolled:** Families actively learning across Kenya CBC (PP1–Grade 9) and British Cambridge (Stage 1–9).
• **Learning Pods:** Dozens of localized neighborhood study pods and TSC-vetted private tutors.

If you need formal partnership figures or official institutional inquiries, please contact our support team at **support@somahome.co.ke** or via WhatsApp.`;
  }

  // --- AGENTIC ACTIONS ---

  // 1. Action: ADD LEARNER
  if (isAuth && (clean.includes('add my daughter') || clean.includes('add my son') || clean.includes('add child') || clean.includes('add kid') || clean.includes('add learner') || clean.includes('register my child') || clean.includes('enroll my child'))) {
    const nameMatch = raw.match(/(?:daughter|son|child|kid|learner|name\s+is|named|called)\s+([a-zA-Z]+)/i);
    const childFirstName = nameMatch ? (nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1).toLowerCase()) : 'New Learner';
    
    let gradeLevel = 'Grade 1';
    if (clean.includes('pp1')) gradeLevel = 'PP1';
    else if (clean.includes('pp2')) gradeLevel = 'PP2';
    else if (clean.includes('playgroup')) gradeLevel = 'Playgroup';
    else {
      const gMatch = clean.match(/(grade\s*\d+|stage\s*\d+|year\s*\d+)/i);
      if (gMatch) gradeLevel = gMatch[1].toUpperCase();
    }

    const curriculumCode = (clean.includes('cambridge') || clean.includes('british')) ? 'Cambridge' : 'CBC';
    const lastName = currentUser?.last_name || 'Kariuki';
    const newId = 'child_' + Date.now();

    const studentObj = {
      id: newId,
      name: `${childFirstName} ${lastName}`,
      first_name: childFirstName,
      last_name: lastName,
      grade: gradeLevel,
      curriculum: curriculumCode,
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('somahome:student-added', { detail: studentObj }));
    }

    return {
      response: `🎉 **Action Executed: ${childFirstName} has been enrolled in your family dashboard!**\n\n• **Learner Name:** ${childFirstName} ${lastName}\n• **Grade & Curriculum:** ${gradeLevel} (${curriculumCode})\n• **Status:** Active & Ready for Term 1\n• **Sunday Print Pack:** Available to download now\n\nI have synchronized your parent dashboard. You can now select ${childFirstName} from the top learner dropdown anytime!`,
      action: {
        type: 'STUDENT_ADDED',
        student: studentObj
      }
    };
  }

  // 2. Action: MARK LESSON COMPLETED
  if (isAuth && (clean.includes('mark lesson') || clean.includes('complete lesson') || clean.includes('mark as completed') || clean.includes('mark today') || clean.includes('mark math') || clean.includes('mark science'))) {
    let lessonName = 'Daily Lesson Guide';
    if (clean.includes('math')) lessonName = 'Mathematics (Lesson 18)';
    else if (clean.includes('science')) lessonName = 'Science & Tech (Lesson 19)';
    else if (clean.includes('english') || clean.includes('literacy')) lessonName = 'English Literacy (Lesson 20)';

    return {
      response: `✅ **Action Executed: ${lessonName} has been marked as Completed!**\n\n• **Learner:** ${childName || 'Liam Kariuki'}\n• **Lesson:** ${lessonName}\n• **Status:** Completed (5/5 Stars ⭐⭐⭐⭐⭐)\n• **Updated Progress:** 88% term completion (35 of 40 lessons completed)\n\nYour parent progress chart and the student OS timetable have been updated in real-time.`,
      action: {
        type: 'LESSON_COMPLETED',
        lesson: lessonName
      }
    };
  }

  // 3. Action: EXPORT REPORT CARD
  if (clean.includes('export report') || clean.includes('download report') || clean.includes('get report card') || clean.includes('generate report') || clean.includes('pdf report')) {
    const sName = childName || 'Liam Kariuki';
    return {
      response: `📄 **Action Executed: Official Report Card Compiled for ${sName}!**\n\n• **Student:** ${sName}\n• **Evaluation:** KICD Competency Rubric (EE - Exceeding Expectations)\n• **Term:** Term 1 (2026 Academic Year)\n\nClick the download button below to save your official PDF report card.`,
      action: {
        type: 'EXPORT_REPORT_CARD',
        student_name: sName,
        download_url: '/api/reports/card/1/'
      }
    };
  }

  // 4. Action: TRIGGER M-PESA
  if (clean.includes('pay mpesa') || clean.includes('pay via mpesa') || clean.includes('pay 3500') || clean.includes('pay term fee') || clean.includes('trigger mpesa')) {
    const phoneMatch = clean.match(/(07\d{8}|2547\d{8}|01\d{8})/);
    const phone = phoneMatch ? phoneMatch[1] : '0712345678';

    return {
      response: `💳 **Action Ready: M-Pesa STK Push of KES 3,500 Prepared!**\n\n• **Package:** Term 1 Curriculum & Sunday Print Packs\n• **Amount:** KES 3,500\n• **Phone Number:** ${phone}\n\nTap the **Confirm M-Pesa Payment** button below to send the prompt directly to your phone.`,
      action: {
        type: 'TRIGGER_MPESA',
        amount: 3500,
        phone: phone
      }
    };
  }

  // --- MULTI-CHILD SPECIFIC INQUIRIES ---
  if (isAuth && (clean.includes('how many kids') || clean.includes('how many children') || clean.includes('my kids') || clean.includes('my children') || clean.includes('who are my kids') || clean.includes('who are my children') || clean.includes('list my kids') || clean.includes('list my children') || clean.includes('my learners'))) {
    const rosterList = familyRoster.map(s => `• 🎓 **${s.name}** — ${s.grade} • **${s.percent}% completed** (${s.completed}/${s.total} lessons)`).join('\n');
    return `👨‍👩‍👧 **You have ${familyRoster.length} enrolled learners in your household:**\n\n${rosterList}\n\n📌 **Currently focused in your dashboard:** **${childName}** (${childGrade})\n\nYou can ask me about any child's specific lessons, schedule, or project rubrics!`;
  }

  // Specific Child Inquiries: Maya
  if (isAuth && clean.includes('maya')) {
    const maya = familyRoster.find(c => c.name.toLowerCase().includes('maya')) || { grade: 'Grade 2 (Cambridge)', percent: 90, completed: 36, total: 40, project: 'Phonics & Creative Expression' };
    return `👧 **Maya Kariuki's Academic Overview:**\n\n• **Pathway:** ${maya.grade}\n• **Term 1 Progress:** **${maya.percent}% Completed** (${maya.completed} of ${maya.total} lessons)\n• **Recent Project:** *${maya.project}* — **Level 4: EE (Exceeding Expectations)**\n• **Next Scheduled Activity:** Stage 2 Science Lab (Plant Life Cycles)\n\nWould you like to switch to Maya's dashboard or download her Sunday Print Pack?`;
  }

  // Specific Child Inquiries: Mike
  if (isAuth && clean.includes('mike')) {
    const mike = familyRoster.find(c => c.name.toLowerCase().includes('mike')) || { grade: 'PP2 Playgroup (CBC)', percent: 75, completed: 30, total: 40, project: 'Motor Skills & Color Sorting' };
    return `👶 **Mike Kariuki's Early Years Overview:**\n\n• **Pathway:** ${mike.grade}\n• **Term 1 Progress:** **${mike.percent}% Completed** (${mike.completed} of ${mike.total} lessons)\n• **Recent Project:** *${mike.project}* — **Level 3: ME (Meeting Expectations)**\n• **Focus Area:** Gross & Fine Motor Development, Phonics Listening\n\nWould you like to download Mike's Early Years Activity Playbook?`;
  }

  // Specific Child Inquiries: Liam
  if (isAuth && clean.includes('liam')) {
    const liam = familyRoster.find(c => c.name.toLowerCase().includes('liam')) || { grade: 'Grade 4 (CBC)', percent: 85, completed: 34, total: 40, project: 'Environmental Science & Water Filtration' };
    return `👦 **Liam Kariuki's Academic Overview:**\n\n• **Pathway:** ${liam.grade}\n• **Term 1 Progress:** **${liam.percent}% Completed** (${liam.completed} of ${liam.total} lessons)\n• **Recent Project:** *${liam.project}* — **Level 4: EE (Exceeding Expectations)**\n• **Today's Next Lesson:** Science & Tech (Lesson 19: Living Organisms)\n\nWould you like to view Liam's full schedule or export his Term 1 Report Card?`;
  }

  // Identity / Profile
  if (clean.includes('do you know me') || clean.includes('who am i') || clean.includes('my name') || clean.includes('my profile') || clean.includes('who is logged in')) {
    if (isAuth) {
      const rosterList = familyRoster.map(s => `  - **${s.name}**: ${s.grade} (${s.percent}% progress)`).join('\n');
      return `👤 **Yes, I know you! Here are your account details:**\n\n• **Parent / Account:** **${userName}**\n• **Role:** **${userRole}**\n• **Location:** ${estate}\n• **Enrolled Children (${familyRoster.length} total):**\n${rosterList}\n• **Active Learner in View:** **${childName}** (${childGrade})\n\nHow can I help you manage your learners' studies today?`;
    } else {
      return `🌐 **You are currently browsing as a Guest Visitor** (not logged in).\n\nAs a guest, you can explore curriculum overviews, pricing, and tutor directories. To link your account and learner records, please **Log In** via the top navigation bar.`;
    }
  }

  if (['yes', 'yeah', 'yep', 'sure', 'please', 'ok', 'okay', 'show me', 'show me rubrics', 'view schedule'].includes(clean)) {
    if (isAuth) {
      return `📋 **Live Academic Portfolio & Today's Schedule for ${childName}:**\n\n🌟 **Recent Project Rubrics (KICD Competency Level):**\n• **Project:** *Water Filtration & Environmental Conservation*\n• **Score:** **Level 4: EE (Exceeding Expectations)**\n• **Assessor Feedback:** *'Outstanding critical thinking! Documented scientific principles accurately.'*\n\n📅 **Today's Daily Lesson Schedule:**\n1. **Mathematics:** Fractions & Decimals (Lesson 18 of 20) — ✅ *Completed*\n2. **Science & Tech:** Living Organisms & Habitats (Lesson 19) — ⏳ *In Progress*\n3. **Language & Literacy:** Creative Story Composition — 📌 *Scheduled (2:00 PM)*\n\nWould you like to export the official **PDF Report Card** or download the **Sunday Print Pack** for this week?`;
    } else {
      return `📋 **Sample Academic Rubric & Schedule (Demo):**\n\n🌟 **Sample Rubric Score:**\n• **Project:** *Science Lab Experiment (Water Cycle)*\n• **Evaluation:** **EE (Exceeding Expectations)**\n\n📅 **Sample Daily Schedule:**\n1. Math (45 min) • 2. Science Lab (60 min) • 3. English Composition (45 min)\n\n🔒 *Log in to your parent account to customize and track your learner's real-time schedule.*`;
    }
  }

  // Dashboards
  if (clean.includes('which dashboard') || clean.includes('what dashboard') || clean.includes('dashboards are present') || clean.includes('dashboards exist')) {
    return `🖥️ **SomaHome features 5 specialized, role-based dashboards:**\n\n1️⃣ **👨‍👩‍👧 Parent Dashboard:** Multi-child overview, term progress, Sunday pack downloads, and report cards.\n2️⃣ **🎒 Student OS & Daily Hub:** Interactive timetable, quizzes, scratchpad, and worksheet submission.\n3️⃣ **👩‍🏫 Tutor & Facilitator Portal:** Rubric grading (EE/ME/AE/BE), session scheduling, and student feedback.\n4️⃣ **🎨 Creator & Marketplace:** Verified educators upload 12-week lesson bundles and earn royalties.\n5️⃣ **🛡️ Super Admin Control Center:** Platform intelligence, M-Pesa financial audit, and AI chat logs.\n\nYou can switch views anytime using the **Switch** button in the top navigation bar!`;
  }

  // Overview
  return `💡 **SomaHome AI Assistant:**\n\nI understand you are asking about: *"${raw}"*\n\n• **Enrolled Learners:** You have **${familyRoster.length} learners** registered (${familyRoster.map(s => s.name).join(', ')}).\n• **Sunday Print Packs:** Downloadable weekly homework and science lab worksheets.\n• **Tutors & Exam Registration:** Direct access to vetted Nairobi tutors and KNEC private candidate guidance.\n\nFeel free to ask any specific question about your grade, lessons, or fees!`;
};

export const generateClientBotResponse = generateLocalAIResponse;
