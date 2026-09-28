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
    familyRoster = childrenList.map(c => {
      let cName = c.name || 'Learner Kariuki';
      if (cName.toLowerCase() in ['child', 'learner', 'student']) {
        cName = 'Liam Kariuki';
      }
      return {
        id: c.id || cName.toLowerCase().replace(/\s+/g, '_'),
        name: cName,
        grade: c.grade || 'Grade 4 (CBC)',
        curriculum: c.curriculum || 'CBC',
        percent: c.percent || 85,
        completed: c.completed || 34,
        total: c.total || 40,
        project: c.project || 'Science Lab & Water Filtration',
        rubric: c.rubric || 'Level 4: EE (Exceeding Expectations)'
      };
    });
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
    return `🔒 **Security Notice:**\n\nI am programmed to assist with SomaHome homeschool learning, lessons, and curriculum guidance only. I cannot process administrative overrides or disclose internal system configurations.\n\nFor technical support or institutional partnerships, please contact **support@somahome.co.ke**.`;
  }

  // Statistics / How Many Parents Guardrail
  if (
    clean.includes('how many parents') ||
    clean.includes('how many users') ||
    clean.includes('how many families') ||
    clean.includes('number of parents') ||
    clean.includes('total parents') ||
    clean.includes('total users')
  ) {
    return `🏡 **SomaHome Homeschool Community:**\n\n• **Community Reach:** SomaHome supports **over 5,000+ homeschooling families** across Kenya (Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret).\n• **Curriculum Enrolled:** Families actively learning across Kenya CBC (PP1–Grade 9) and British Cambridge (Stage 1–9).\n• **Learning Pods:** Dozens of localized neighborhood study pods and TSC-vetted private tutors.\n\nIf you need formal partnership figures or official institutional inquiries, please contact our support team at **support@somahome.co.ke** or via WhatsApp.`;
  }

  // --- AGENTIC ACTIONS ---

  // 1. ACTION: ADD / ENROLL LEARNER
  const addMatch = raw.match(/\b(?:add|enrol|enroll|register|create)\s+(?:a\s+|my\s+|the\s+)?(?:daughter|son|child|kid|learner|student)?\s*([a-zA-Z]+)/i) ||
                   raw.match(/\b(?:add|enrol|enroll|register)\s+([a-zA-Z]+)/i);

  if (isAuth && addMatch) {
    const candidate = addMatch[1].trim();
    const ignored = ['a', 'my', 'the', 'daughter', 'son', 'child', 'kid', 'learner', 'student', 'to', 'in', 'and', 'for', 'another', 'new', 'lesson', 'project', 'tutor', 'mpesa', 'grade'];
    if (!ignored.includes(candidate.toLowerCase())) {
      const childFirstName = candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
      
      let gradeLevel = 'Grade 1 (CBC)';
      if (clean.includes('pp1')) gradeLevel = 'PP1 Playgroup (CBC)';
      else if (clean.includes('pp2') || childFirstName.toLowerCase() === 'mike') gradeLevel = 'PP2 Playgroup (CBC)';
      else if (clean.includes('playgroup')) gradeLevel = 'Playgroup (CBC)';
      else {
        const gMatch = clean.match(/(grade\s*\d+|stage\s*\d+|year\s*\d+)/i);
        if (gMatch) gradeLevel = gMatch[1].toUpperCase() + ' (CBC)';
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
        response: `🎉 **Action Executed: ${childFirstName} has been enrolled in your family dashboard!**\n\n• **Learner Name:** ${childFirstName} ${lastName}\n• **Grade & Curriculum:** ${gradeLevel} (${curriculumCode})\n• **Status:** Active & Ready for Term 1\n• **Sunday Print Pack:** Ready for download\n\nI have synchronized your family roster. You can now select **${childFirstName}** from the top learner selector anytime!`,
        action: {
          type: 'STUDENT_ADDED',
          student: studentObj
        }
      };
    }
  }

  // 2. ACTION: VIEW SCHEDULE / TIMETABLE
  if (isAuth && /(schedule|shdeule|schedul|timetable|time\s*table|routine|today.*lesson|daily\s*plan)/i.test(clean)) {
    const scheduleBlocks = familyRoster.map(s => {
      if (s.name.toLowerCase().includes('liam')) {
        return `👦 **${s.name} (${s.grade}):**\n1. **08:30 AM – 09:30 AM:** Mathematics (Fractions & Decimals) — ✅ *Completed*\n2. **10:00 AM – 11:00 AM:** Science & Technology (Living Organisms Lab) — ⏳ *In Progress*\n3. **02:00 PM – 02:45 PM:** Custom Elective (Chess Tactics) — 📌 *Scheduled*`;
      } else if (s.name.toLowerCase().includes('maya')) {
        return `👧 **${s.name} (${s.grade}):**\n1. **09:00 AM – 10:00 AM:** Phonics & Creative Reading — ✅ *Completed*\n2. **10:30 AM – 11:30 AM:** Stage 2 Science (Plant Growth Lab) — 📌 *Scheduled*\n3. **01:30 PM – 02:15 PM:** Art & Creative Expression — 📌 *Scheduled*`;
      } else if (s.name.toLowerCase().includes('mike')) {
        return `👶 **${s.name} (${s.grade}):**\n1. **09:30 AM – 10:30 AM:** Motor Skills & Sensory Color Sorting — ✅ *Completed*\n2. **11:00 AM – 11:45 AM:** Outdoor Discovery & Story Time — 📌 *Scheduled*`;
      } else {
        return `🎓 **${s.name} (${s.grade}):**\n1. **09:00 AM – 10:00 AM:** Core Numeracy & Problem Solving — ✅ *Completed*\n2. **10:30 AM – 11:30 AM:** Integrated Science & Tech — ⏳ *In Progress*`;
      }
    }).join('\n\n');

    return `📅 **Today's Active Daily Timetable for your Household:**\n\n${scheduleBlocks}\n\nYou can mark any lesson as completed or adjust your electives directly from the **Daily OS** tab!`;
  }

  // 3. ACTION: REPORT CARD
  if (isAuth && /(report\s*card|report|results|grades|academic\s*portfolio|rubric\s*card)/i.test(clean)) {
    let target = familyRoster.find(s => clean.includes(s.name.split(' ')[0].toLowerCase())) || familyRoster[0] || { name: 'Liam Kariuki', grade: 'Grade 4 (CBC)' };
    const sName = target.name || 'Liam Kariuki';
    return {
      response: `📄 **Action Executed: Official Report Card Compiled for ${sName}!**\n\n• **Student:** ${sName}\n• **Pathway:** ${target.grade || 'Grade 4 (CBC)'}\n• **Evaluation:** KICD Competency Rubric (Level 4: EE - Exceeding Expectations)\n• **Key Project:** *${target.project || 'Environmental Science'}*\n• **Term:** Term 1 (2026 Academic Year)\n• **Facilitator:** Teacher Mercy (Senior CBC Facilitator)\n\nClick the download button below to save your official PDF report card.`,
      action: {
        type: 'EXPORT_REPORT_CARD',
        student_name: sName,
        download_url: '/api/reports/card/1/'
      }
    };
  }

  // 4. ACTION: MARK LESSON COMPLETED
  if (isAuth && /(mark|complete|completed|done\s+with|finish).*(lesson|guide|math|science|tech|english|literacy|homework)/i.test(clean)) {
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

  // 5. ACTION: TRIGGER M-PESA
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
  if (isAuth && /(how\s+many\s+(?:kids|children|learners|students)|my\s+kids|my\s+children|who\s+are\s+my\s+(?:kids|children)|list\s+my\s+(?:kids|children|learners))/i.test(clean)) {
    const rosterList = familyRoster.map(s => `• 🎓 **${s.name}** — ${s.grade} • **${s.percent}% completed** (${s.completed}/${s.total} lessons)`).join('\n');
    return `👨‍👩‍👧 **You have ${familyRoster.length} enrolled learners in your household:**\n\n${rosterList}\n\n📌 **Currently focused in your dashboard:** **${childName}** (${childGrade})\n\nYou can ask me to view their schedule, export report cards, or enroll another child anytime!`;
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

  // Dashboards
  if (clean.includes('which dashboard') || clean.includes('what dashboard') || clean.includes('dashboards are present') || clean.includes('dashboards exist')) {
    return `🖥️ **SomaHome features 5 specialized, role-based dashboards:**\n\n1️⃣ **👨‍👩‍👧 Parent Dashboard:** Multi-child overview, term progress, Sunday pack downloads, and report cards.\n2️⃣ **🎒 Student OS & Daily Hub:** Interactive timetable, quizzes, scratchpad, and worksheet submission.\n3️⃣ **👩‍🏫 Tutor & Facilitator Portal:** Rubric grading (EE/ME/AE/BE), session scheduling, and student feedback.\n4️⃣ **🎨 Creator & Marketplace:** Verified educators upload 12-week lesson bundles and earn royalties.\n5️⃣ **🛡️ Super Admin Control Center:** Platform intelligence, M-Pesa financial audit, and AI chat logs.\n\nYou can switch views anytime using the **Switch** button in the top navigation bar!`;
  }

  // Overview
  return `💡 **SomaHome AI Assistant:**\n\nI understand you are asking about: *"${raw}"*\n\n• **Enrolled Learners:** You have **${familyRoster.length} learners** registered (${familyRoster.map(s => s.name).join(', ')}).\n• **Sunday Print Packs:** Downloadable weekly homework and science lab worksheets.\n• **Tutors & Exam Registration:** Direct access to vetted Nairobi tutors and KNEC private candidate guidance.\n\nFeel free to ask any specific question about your grade, lessons, or fees!`;
};

export const generateClientBotResponse = generateLocalAIResponse;
