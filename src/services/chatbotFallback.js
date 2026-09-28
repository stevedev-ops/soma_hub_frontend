/**
 * SomaHome Client-Side AI Reasoning, NLP Engine, and Agentic Action Executor
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

    // Auto dispatch UI sync event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('somahome:student-added', { detail: studentObj }));
    }

    return {
      response: `🎉 **Action Executed: ${childFirstName} has been added to your family dashboard!**\n\n• **Learner Name:** ${childFirstName} ${lastName}\n• **Grade & Curriculum:** ${gradeLevel} (${curriculumCode})\n• **Status:** Active & Ready for Term 1\n• **Sunday Print Pack:** Available to download now\n\nI have synchronized your parent dashboard. You can now select ${childFirstName} from the top learner dropdown anytime!`,
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

  // Standard Conversational NLP Fallbacks (if not action)
  if (['yes', 'yeah', 'yep', 'sure', 'please', 'ok', 'okay', 'show me', 'show me rubrics', 'view schedule'].includes(clean)) {
    if (isAuth) {
      return `📋 **Live Academic Portfolio & Today's Schedule for ${childName}:**\n\n🌟 **Recent Project Rubrics (KICD Competency Level):**\n• **Project:** *Water Filtration & Environmental Conservation*\n• **Score:** **Level 4: EE (Exceeding Expectations)**\n• **Assessor Feedback:** *'Outstanding critical thinking! Documented scientific principles accurately.'*\n\n📅 **Today's Daily Lesson Schedule:**\n1. **Mathematics:** Fractions & Decimals (Lesson 18 of 20) — ✅ *Completed*\n2. **Science & Tech:** Living Organisms & Habitats (Lesson 19) — ⏳ *In Progress*\n3. **Language & Literacy:** Creative Story Composition — 📌 *Scheduled (2:00 PM)*\n\nWould you like to export the official **PDF Report Card** or download the **Sunday Print Pack** for this week?`;
    } else {
      return `📋 **Sample Academic Rubric & Schedule (Demo):**\n\n🌟 **Sample Rubric Score:**\n• **Project:** *Science Lab Experiment (Water Cycle)*\n• **Evaluation:** **EE (Exceeding Expectations)**\n\n📅 **Sample Daily Schedule:**\n1. Math (45 min) • 2. Science Lab (60 min) • 3. English Composition (45 min)\n\n🔒 *Log in to your parent account to customize and track your learner's real-time schedule.*`;
    }
  }

  // Identity
  if (clean.includes('do you know me') || clean.includes('who am i') || clean.includes('my name') || clean.includes('my profile') || clean.includes('who is logged in')) {
    if (isAuth) {
      return `👤 **Yes, I know you! Here are your account details:**\n\n• **User / Account:** **${userName}**\n• **Role:** **${userRole}**\n• **Estate / Location:** ${estate}\n• **Linked Learner:** **${childName}** (${childGrade} • ${childCurriculum})\n• **Current Progress:** 34 of 40 lessons completed (85% Term 1)\n\nYou have full access to manage your learner's schedule, rubric scores, and Sunday print packs. How can I help you right now?`;
    } else {
      return `🌐 **You are currently browsing as a Guest Visitor** (not logged in).\n\nAs a guest, you can explore curriculum overviews, pricing, and tutor directories. To link your account and learner records, please **Log In** via the top navigation bar.`;
    }
  }

  // Dashboards
  if (clean.includes('which dashboard') || clean.includes('what dashboard') || clean.includes('dashboards are present') || clean.includes('dashboards exist')) {
    return `🖥️ **SomaHome features 5 specialized, role-based dashboards:**\n\n1️⃣ **👨‍👩‍👧 Parent Dashboard:** Multi-child overview, term progress, Sunday pack downloads, and report cards.\n2️⃣ **🎒 Student OS & Daily Hub:** Interactive timetable, quizzes, scratchpad, and worksheet submission.\n3️⃣ **👩‍🏫 Tutor & Facilitator Portal:** Rubric grading (EE/ME/AE/BE), session scheduling, and student feedback.\n4️⃣ **🎨 Creator & Marketplace:** Verified educators upload 12-week lesson bundles and earn royalties.\n5️⃣ **🛡️ Super Admin Control Center:** Platform intelligence, M-Pesa financial audit, and AI chat logs.\n\nYou can switch views anytime using the **Switch** button in the top navigation bar!`;
  }

  // Overview
  return `💡 **SomaHome AI Assistant:**\n\nI understand you are asking about: *"${raw}"*\n\nHere is how SomaHome supports you:\n• **Curriculum & Grades:** Comprehensive 12-week lesson plans for Kenya CBC (PP1–Grade 9) and British Cambridge (Stage 1–9).\n• **Learner Capacity:** You can enroll unlimited children under one parent account with separate portfolios for each.\n• **Sunday Print Packs:** Downloadable weekly homework and science lab worksheets.\n• **Tutors & Exam Registration:** Direct access to vetted Nairobi tutors and KNEC private candidate guidance.\n\nFeel free to ask any specific question about your grade, lessons, or fees!`;
};

export const generateClientBotResponse = generateLocalAIResponse;
