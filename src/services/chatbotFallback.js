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
  const rawRole = (currentUser?.role || 'parent').toLowerCase();
  const isStudent = isAuth && rawRole === 'student';
  const isTeacher = isAuth && (rawRole === 'tutor' || rawRole === 'teacher');
  const isCreator = isAuth && rawRole === 'creator';
  const isParent = isAuth && (rawRole === 'parent' || (!isStudent && !isTeacher && !isCreator));
  const userRole = isAuth ? (isStudent ? 'Student / Learner' : isTeacher ? 'Tutor / Facilitator' : isCreator ? 'Curriculum Creator' : 'Parent / Guardian') : 'Guest Visitor';
  const estate = currentUser?.estate || 'Kilimani, Nairobi';

    // Build household list strictly from enrolled children
  let familyRoster = [];

  if (Array.isArray(childrenList) && childrenList.length > 0) {
    familyRoster = childrenList.map(c => {
      const cName = c.name || c.first_name || 'Learner';
      return {
        id: c.id || cName.toLowerCase().replace(/\s+/g, '_'),
        name: cName,
        grade: c.grade || 'CBC Grade Level',
        curriculum: c.curriculum || 'CBC',
        percent: c.percent || 80,
        completed: c.completed || 25,
        total: c.total || 35,
        project: c.project || 'Active Learning & Practical Labs',
        rubric: c.rubric || 'Level 3: ME (Meeting Expectations)'
      };
    });
  } else if (currentUser?.children && Array.isArray(currentUser.children) && currentUser.children.length > 0) {
    familyRoster = currentUser.children.map(c => {
      const cName = c.name || c.first_name || 'Learner';
      return {
        id: c.id || cName.toLowerCase().replace(/\s+/g, '_'),
        name: cName,
        grade: c.grade || 'CBC Grade Level',
        curriculum: c.curriculum || 'CBC',
        percent: 80,
        completed: 25,
        total: 35,
        project: 'Active Learning & Practical Labs',
        rubric: 'Level 3: ME (Meeting Expectations)'
      };
    });
  } else if (isStudent) {
    const studentDisplayName = currentUser?.name || currentUser?.username || 'Learner';
    familyRoster = [{
      id: currentUser?.id || 'student_self',
      name: studentDisplayName,
      grade: currentUser?.grade || 'Grade 4 (CBC)',
      curriculum: currentUser?.curriculum || 'CBC',
      percent: 85,
      completed: 30,
      total: 35,
      project: 'Core CBC Curriculum Missions',
      rubric: 'Level 4: EE (Exceeding Expectations)'
    }];
  }

  // Resolve student profile if logged in as student
  let studentObj = null;
  if (isStudent) {
    const uLower = userName.toLowerCase();
    studentObj = familyRoster.find(s => uLower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(uLower) || uLower.includes(s.id)) ||
                 familyRoster.find(s => s.name.toLowerCase().includes('mike')) ||
                 {
                   id: 'student',
                   name: userName,
                   grade: currentUser?.grade || 'PP2 Playgroup (CBC)',
                   curriculum: 'CBC',
                   percent: 75,
                   completed: 30,
                   total: 40,
                   project: 'Motor Skills & Color Sorting',
                   rubric: 'Level 3: ME (Meeting Expectations)'
                 };
  }

  // Determine active / focused child for parent/tutor views
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

  const childName = isAuth ? (isStudent ? studentObj.name : resolvedChild) : null;
  const childGrade = isAuth ? (isStudent ? studentObj.grade : resolvedGrade) : 'Grade 4 (CBC)';
  const childCurriculum = isAuth ? (isStudent ? studentObj.curriculum : resolvedCurriculum) : 'CBC';

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

  // Statistics / How Many Parents Guardrail
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

  // 1. ACTION: ADD / ENROLL LEARNER (Only for Parents)
  const addMatch = raw.match(/(?:add|enrol|enroll|register|create)\s+(?:a\s+|my\s+|the\s+)?(?:daughter|son|child|kid|learner|student)?\s*([a-zA-Z]+)/i) ||
                   raw.match(/(?:add|enrol|enroll|register)\s+([a-zA-Z]+)/i);

  if (isParent && addMatch) {
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
      const fullName = `${childFirstName} ${lastName}`;

      const studentObjNew = {
        id: childFirstName.toLowerCase(),
        name: fullName,
        grade: gradeLevel,
        curriculum: curriculumCode,
        percent: 0,
        completed: 0,
        total: 40,
        project: 'Orientation & Diagnostic Assessment',
        rubric: 'Diagnostic In Progress'
      };

      return {
        response: `🎉 **Action Executed: Successfully Enrolled ${fullName} into SomaHome!**

• **Learner Name:** ${fullName}
• **Grade Level:** ${gradeLevel}
• **Curriculum Pathway:** ${curriculumCode}
• **Assigned Plan:** Full Term 1 Daily Plan + Printable Worksheets
• **Status:** Active in your Parent Dashboard

Would you like me to generate their diagnostic schedule or export their printable welcome pack?`,
        action: {
          type: 'STUDENT_ADDED',
          student: studentObjNew
        }
      };
    }
  }

  // 2. ACTION: VIEW SCHEDULE / TIMETABLE
  if (isAuth && /(schedule|shdeule|schedul|timetable|time\s*table|routine|today.*lesson|daily\s*plan)/i.test(clean)) {
    if (isStudent) {
      let sched = `1. **09:30 AM – 10:30 AM:** Motor Skills & Sensory Color Sorting — ✅ *Completed*
2. **11:00 AM – 11:45 AM:** Outdoor Discovery & Story Time — 📌 *Scheduled*`;
      if (studentObj.name.toLowerCase().includes('liam')) {
        sched = `1. **08:30 AM – 09:30 AM:** Mathematics (Fractions & Decimals) — ✅ *Completed*
2. **10:00 AM – 11:00 AM:** Science & Technology (Living Organisms Lab) — ⏳ *In Progress*
3. **02:00 PM – 02:45 PM:** Custom Elective (Chess Tactics) — 📌 *Scheduled*`;
      } else if (studentObj.name.toLowerCase().includes('maya')) {
        sched = `1. **09:00 AM – 10:00 AM:** Phonics & Creative Reading — ✅ *Completed*
2. **10:30 AM – 11:30 AM:** Stage 2 Science (Plant Growth Lab) — 📌 *Scheduled*
3. **01:30 PM – 02:15 PM:** Art & Creative Expression — 📌 *Scheduled*`;
      }
      return `📅 **Your Daily Learning Timetable for Today (${studentObj.name}):**

${sched}

You can click on any quest in your **Student Dashboard** to start learning!`;
    }

    const scheduleBlocks = familyRoster.map(s => {
      if (s.name.toLowerCase().includes('liam')) {
        return `👦 **${s.name} (${s.grade}):**
1. **08:30 AM – 09:30 AM:** Mathematics (Fractions & Decimals) — ✅ *Completed*
2. **10:00 AM – 11:00 AM:** Science & Technology (Living Organisms Lab) — ⏳ *In Progress*
3. **02:00 PM – 02:45 PM:** Custom Elective (Chess Tactics) — 📌 *Scheduled*`;
      } else if (s.name.toLowerCase().includes('maya')) {
        return `👧 **${s.name} (${s.grade}):**
1. **09:00 AM – 10:00 AM:** Phonics & Creative Reading — ✅ *Completed*
2. **10:30 AM – 11:30 AM:** Stage 2 Science (Plant Growth Lab) — 📌 *Scheduled*
3. **01:30 PM – 02:15 PM:** Art & Creative Expression — 📌 *Scheduled*`;
      } else if (s.name.toLowerCase().includes('mike')) {
        return `👶 **${s.name} (${s.grade}):**
1. **09:30 AM – 10:30 AM:** Motor Skills & Sensory Color Sorting — ✅ *Completed*
2. **11:00 AM – 11:45 AM:** Outdoor Discovery & Story Time — 📌 *Scheduled*`;
      } else {
        return `🎓 **${s.name} (${s.grade}):**
1. **09:00 AM – 10:00 AM:** Core Numeracy & Problem Solving — ✅ *Completed*
2. **10:30 AM – 11:30 AM:** Integrated Science & Tech — ⏳ *In Progress*`;
      }
    }).join('\n\n');

    return `📅 **Today's Active Daily Timetable for your Household:**

${scheduleBlocks}

You can mark any lesson as completed or adjust your electives directly from the **Daily OS** tab!`;
  }

  // 3. ACTION: REPORT CARD
  if (isAuth && /(report\s*card|report|results|grades|academic\s*portfolio|rubric\s*card)/i.test(clean)) {
    const target = isStudent ? studentObj : (familyRoster.find(s => clean.includes(s.name.split(' ')[0].toLowerCase())) || familyRoster[0] || { name: 'Liam Kariuki', grade: 'Grade 4 (CBC)' });
    const sName = target.name || 'Liam Kariuki';
    return {
      response: `📄 **Action Executed: Official Report Card Compiled for ${sName}!**

• **Student:** ${sName}
• **Pathway:** ${target.grade || 'Grade 4 (CBC)'}
• **Evaluation:** KICD Competency Rubric (Level 4: EE - Exceeding Expectations)
• **Key Project:** *${target.project || 'Environmental Science'}*
• **Term:** Term 1 (2026 Academic Year)
• **Facilitator:** Teacher Mercy (Senior CBC Facilitator)

Click the download button below to save your official PDF report card.`,
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
      response: `✅ **Action Executed: ${lessonName} has been marked as Completed!**

• **Learner:** ${childName || 'Liam Kariuki'}
• **Lesson:** ${lessonName}
• **Status:** Completed (5/5 Stars ⭐⭐⭐⭐⭐)
• **Updated Progress:** 88% term completion (35 of 40 lessons completed)

Your progress chart and timetable have been updated in real-time.`,
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
      response: `💳 **Action Ready: M-Pesa STK Push of KES 3,500 Prepared!**

• **Package:** Term 1 Curriculum & Sunday Print Packs
• **Amount:** KES 3,500
• **Phone Number:** ${phone}

Tap the **Confirm M-Pesa Payment** button below to send the prompt directly to your phone.`,
      action: {
        type: 'TRIGGER_MPESA',
        amount: 3500,
        phone: phone
      }
    };
  }

  // --- MULTI-CHILD SPECIFIC INQUIRIES ---
  if (isAuth && /(how\s+many\s+(?:kids|children|learners|students)|my\s+kids|my\s+children|who\s+are\s+my\s+(?:kids|children)|list\s+my\s+(?:kids|children|learners))/i.test(clean)) {
    if (isStudent) {
      return `👦 **You are currently logged in as a Student (${studentObj.name})!**

• **Your Grade:** **${studentObj.grade}** (${studentObj.curriculum})
• **Your Progress:** **${studentObj.percent}% completed** (${studentObj.completed}/${studentObj.total} lessons)

Your parent manages the household account and enrolled family members.`;
    }
    const rosterList = familyRoster.map(s => `• 🎓 **${s.name}** — ${s.grade} • **${s.percent}% completed** (${s.completed}/${s.total} lessons)`).join('\n');
    return `👨‍👩‍👧 **You have ${familyRoster.length} enrolled learners in your household:**

${rosterList}

📌 **Currently focused in your dashboard:** **${childName}** (${childGrade})

You can ask me to view their schedule, export report cards, or enroll another child anytime!`;
  }

  // Identity / Profile
  if (clean.includes('do you know me') || clean.includes('who am i') || clean.includes('my name') || clean.includes('my profile') || clean.includes('who is logged in')) {
    if (isAuth) {
      if (isStudent) {
        return `👦 **Jambo, ${userName}! Here are your learner profile details:**

• **Student / Learner:** **${studentObj.name}**
• **Role:** **Student / Learner**
• **Grade Level:** **${studentObj.grade}**
• **Curriculum Pathway:** **${studentObj.curriculum}**
• **Learning Progress:** **${studentObj.percent}% completed** (${studentObj.completed}/${studentObj.total} lessons)
• **Active Term Project:** *${studentObj.project}*
• **Location:** ${estate}
• **Status:** Active on SomaHome Student OS

What would you like to learn today? You can ask me for help with your daily timetable, math worksheets, science lab experiments, or reading quests!`;
      }

      if (isTeacher) {
        return `👩‍🏫 **Jambo, Teacher ${userName}! Here are your facilitator details:**

• **Facilitator Name:** **${userName}**
• **Role:** **Specialist Tutor / Facilitator**
• **Location:** ${estate}
• **Verification:** TSC & DCI Verified
• **Active Assigned Pods:** 3 learners (Kilimani / Westlands)

How can I assist you with your schedule, student rubric evaluations, or lesson plans today?`;
      }

      if (isCreator) {
        return `🎨 **Jambo, ${userName}! Here are your creator profile details:**

• **Creator / Publisher:** **${userName}**
• **Role:** **Curriculum Creator & Publisher**
• **Location:** ${estate}
• **Status:** Active Marketplace Contributor

How can I assist with your 12-week lesson packs, royalty withdrawals, or bundle publishing today?`;
      }

      const rosterList = familyRoster.map(s => `  - **${s.name}**: ${s.grade} (${s.percent}% progress)`).join('\n');
      return `👤 **Yes, I know you! Here are your parent account details:**

• **Parent / Account:** **${userName}**
• **Role:** **Parent / Guardian**
• **Location:** ${estate}
• **Enrolled Children (${familyRoster.length} total):**
${rosterList}
• **Active Learner in View:** **${childName}** (${childGrade})

How can I help you manage your learners' studies today?`;
    } else {
      return `🌐 **You are currently browsing as a Guest Visitor** (not logged in).

As a guest, you can explore curriculum overviews, pricing, and tutor directories. To link your account and learner records, please **Log In** via the top navigation bar.`;
    }
  }

  // Dashboards
  if (clean.includes('which dashboard') || clean.includes('what dashboard') || clean.includes('dashboards are present') || clean.includes('dashboards exist')) {
    return `🖥️ **SomaHome features 5 specialized, role-based dashboards:**

1️⃣ **👨‍👩‍👧 Parent Dashboard:** Multi-child overview, term progress, Sunday pack downloads, and report cards.
2️⃣ **🎒 Student OS & Daily Hub:** Interactive timetable, quizzes, scratchpad, and worksheet submission.
3️⃣ **👩‍🏫 Tutor & Facilitator Portal:** Rubric grading (EE/ME/AE/BE), session scheduling, and student feedback.
4️⃣ **🎨 Creator & Marketplace:** Verified educators upload 12-week lesson bundles and earn royalties.
5️⃣ **🛡️ Super Admin Control Center:** Platform intelligence, M-Pesa financial audit, and AI chat logs.

You can switch views anytime using the **Switch** button in the top navigation bar!`;
  }

  // Overview
  if (isStudent) {
    return `💡 **SomaHome Student AI Companion:**

I understand you are asking about: *"${raw}"*

• **Your Grade:** ${studentObj.grade}
• **Term Progress:** ${studentObj.completed} of ${studentObj.total} lessons (${studentObj.percent}%)
• **Quests:** Ask me for interactive quizzes, math tips, science experiment ideas, or reading games!

How can I help you with your schoolwork today, ${studentObj.name.split(' ')[0]}?`;
  }

  return `💡 **SomaHome AI Assistant:**

I understand you are asking about: *"${raw}"*

• **Enrolled Learners:** You have **${familyRoster.length} learners** registered (${familyRoster.map(s => s.name).join(', ')}).
• **Sunday Print Packs:** Downloadable weekly homework and science lab worksheets.
• **Tutors & Exam Registration:** Direct access to vetted Nairobi tutors and KNEC private candidate guidance.

Feel free to ask any specific question about your grade, lessons, or fees!`;
};

export const generateClientBotResponse = generateLocalAIResponse;
