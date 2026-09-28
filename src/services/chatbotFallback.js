// Intelligent Context-Aware Conversational AI Engine for SomaHome
export async function generateClientBotResponse(message, currentUser = null, activeStudent = null) {
  const raw = message.trim();
  const clean = raw.toLowerCase().replace(/['"??]/g, '').trim();

  // Extract Context
  const userName = currentUser ? (currentUser.first_name || currentUser.name || currentUser.username || 'Parent') : 'Visitor';
  const userRole = currentUser?.role ? currentUser.role.toUpperCase() : 'GUEST';
  const userEstate = currentUser?.estate || 'Kilimani, Nairobi';

  const childName = typeof activeStudent === 'object' ? (activeStudent?.name || 'Liam Kariuki') : (activeStudent || 'Liam Kariuki');
  const childGrade = typeof activeStudent === 'object' ? (activeStudent?.grade || 'Grade 4 (CBC)') : 'Grade 4 (CBC)';
  const childCurriculum = typeof activeStudent === 'object' ? (activeStudent?.curriculum || 'CBC') : 'CBC';

  // 1. If Gemini API Key is configured in environment, use generative LLM
  const GEMINI_KEY = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_GEMINI_API_KEY : null;
  if (GEMINI_KEY) {
    try {
      const systemPrompt = `You are SomaBot, an intelligent, empathetic, Kenyan homeschool AI assistant on SomaHome Kenya.
Context:
- Current User: ${userName} (Role: ${userRole}, Location: ${userEstate})
- Active Learner: ${childName} (${childGrade}, Curriculum: ${childCurriculum})
- Platform Info: Kenya CBC (PP1-Grade 9), British Cambridge Stage 1-9, KES 3,500/term M-Pesa STK push, KNEC exam center registration, TSC vetted home tutors in Nairobi.
Instructions:
- Answer naturally, conversationally, and accurately to the user's specific question.
- Do NOT output robotic repetitive menus unless the user asks for available commands.
- If asked about user identity or child, use the provided context.`;

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${raw}` }] }
          ]
        })
      });
      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return { response: generatedText, is_meaningful: true, metadata: { provider: 'gemini' } };
        }
      }
    } catch (e) {
      // Fall through to smart conversational NLP
    }
  }

  // 2. Identity Queries ("who am i", "my profile", "who is logged in", "my account")
  if (clean.includes('who am i') || clean.includes('my name') || clean.includes('who is logged in') || clean.includes('what is my name') || clean.includes('my profile') || clean.includes('my account') || clean === 'me') {
    if (currentUser) {
      return {
        response: `?? **Your Profile Information:**\n\n? **Name / Username:** **${userName}**\n? **Account Role:** **${userRole}**\n? **Estate / Location:** ${userEstate}\n? **Active Learner Enrolled:** **${childName}** (${childGrade} ? ${childCurriculum})\n\nYou are currently managing your homeschool dashboard for **${childName}**. How can I assist you with lessons or activities today?`,
        is_meaningful: true,
        metadata: { intent: 'identity' }
      };
    } else {
      return {
        response: "?? You are currently browsing as a **Guest Visitor** (not logged in).\n\nIf you have an account, click **Log In** to access your children's dashboard and saved progress!",
        is_meaningful: true,
        metadata: { intent: 'identity_guest' }
      };
    }
  }

  // 3. Bot Identity ("who are you", "what are you", "what is your name")
  if (clean.includes('who are you') || clean.includes('what are you') || clean.includes('what is your name') || clean.includes('who created you')) {
    return {
      response: `?? I am **SomaBot**, your dedicated AI homeschooling advisor on **SomaHome Kenya**!\n\nI am designed specifically for Kenyan homeschooling families to help you:\n? Track your learner's daily lessons, quiz scores, and CBC rubric grades\n? Guide you through Kenya CBC (KICD) and British Cambridge syllabi\n? Help with term package enrollments, M-Pesa payments, and printable packs\n? Advise on homeschool legal compliance with the Ministry of Education & KNEC\n\nWhat can I help you with today?`,
      is_meaningful: true,
      metadata: { intent: 'bot_identity' }
    };
  }

  // 4. Child Name / Child Info ("my child name", "who is my child", "my kid", "tell me about my learner")
  if (clean.includes('child name') || clean.includes('my child') || clean.includes('my kid') || clean.includes('my learner') || clean.includes('my student') || clean.includes('who is my child') || clean.includes('who is child')) {
    return {
      response: `?? **Your Active Learner:**\n\n? **Name:** **${childName}**\n? **Grade Level:** **${childGrade}**\n? **Curriculum:** **${childCurriculum}**\n? **Status:** Active (Term 1 ? 2026)\n? **Completion:** 34 of 40 lessons completed (85%)\n? **Assigned Facilitator:** Teacher Mercy (Senior CBC Facilitator)\n\nWould you like to see ${childName}'s recent project rubrics, today's schedule, or export a report card?`,
      is_meaningful: true,
      metadata: { activity_checked: true }
    };
  }

  // 5. Progress / Scores / Activities / Rubrics ("3", "number 3", "how is my child doing", "progress")
  if (clean === '3' || clean === 'number 3' || clean === 'option 3' || clean.includes('progress') || clean.includes('score') || clean.includes('rubric') || clean.includes('activity') || clean.includes('how is he') || clean.includes('how is she') || clean.includes('doing') || clean.includes('lesson')) {
    return {
      response: `?? **Latest Homeschool Progress Report for ${childName}:**\n\n?? **Learner:** **${childName}** (${childGrade} ? ${childCurriculum})\n?? **Grade 4 CBC Term 1 Science & Math**\n  ? **Completed Lessons:** 34 of 40 lessons finished (85% progress)\n  ? **Assigned Mentor:** Teacher Mercy (Senior CBC Facilitator)\n  ? **Recent Project Rubric:** *Water Filtration Model*: **Level 4: EE (Exceeding Expectations)** ? *"Outstanding initiative! Clear filtration layers achieved."*\n\n?? *Tip: You can check off today's lessons in the Daily OS tab or generate an official stamped PDF report card in the Reports tab.*`,
      is_meaningful: true,
      metadata: { activity_checked: true }
    };
  }

  // 6. Pricing, Fees & M-Pesa ("1", "number 1", "how much", "fees", "cost", "mpesa")
  if (clean === '1' || clean === 'number 1' || clean === 'option 1' || clean.includes('price') || clean.includes('cost') || clean.includes('fee') || clean.includes('mpesa') || clean.includes('m-pesa') || clean.includes('pay') || clean.includes('how much') || clean.includes('subscribe')) {
    return {
      response: `?? **SomaHome Package Pricing & M-Pesa Details:**\n\n? **Standard Term Package (CBC / Cambridge):** **KES 3,500 ? KES 4,500 per term**.\n? **What You Receive:**\n  ? Complete 12-week daily structured lesson plans (3 hours/day)\n  ? Weekly Sunday printable homework packs & worksheets\n  ? Hands-on science lab experiment guides\n  ? Dedicated WhatsApp facilitator support & stamped PDF report cards\n\n? **Payment Method:** Instant Safaricom M-Pesa STK Push. Enter your phone number on checkout and enter your M-Pesa PIN on your phone. Access is unlocked instantly!`,
      is_meaningful: true,
      metadata: { topic: 'pricing' }
    };
  }

  // 7. Curriculum & CBC vs Cambridge ("2", "number 2", "cbc", "cambridge", "syllabus")
  if (clean === '2' || clean === 'number 2' || clean === 'option 2' || clean.includes('cbc') || clean.includes('cambridge') || clean.includes('curriculum') || clean.includes('strand') || clean.includes('subject') || clean.includes('difference')) {
    return {
      response: `?? **Curriculum Pathways on SomaHome:**\n\n1. **Kenya CBC (Competency Based Curriculum):**\n   ? Grades: PP1, PP2, Grade 1 through Grade 9 (Junior Secondary).\n   ? Aligned with KICD standards with 21st-century core competencies, strands, substrands, and practical local community service projects.\n\n2. **British Cambridge International:**\n   ? Stage 1 to Checkpoint / Lower Secondary & IGCSE preparation.\n   ? Subjects: English First/Second Language, Cambridge Primary Mathematics, Cambridge Science.\n\nBoth curricula feature printable weekly homework packs, daily 3-hour lesson plans, and KICD/Cambridge rubric assessments.`,
      is_meaningful: true,
      metadata: { topic: 'curriculum' }
    };
  }

  // 8. Legal Compliance & KNEC Exams ("4", "number 4", "legal", "ministry", "moe", "knec", "law")
  if (clean === '4' || clean === 'number 4' || clean === 'option 4' || clean.includes('legal') || clean.includes('ministry') || clean.includes('moe') || clean.includes('knec') || clean.includes('law') || clean.includes('affidavit') || clean.includes('register') || clean.includes('exam')) {
    return {
      response: `?? **Homeschooling Legality in Kenya & Exam Registration:**\n\n? **Constitution of Kenya (Article 53):** Every child has the right to basic education. Alternative learning pathways and homeschooling are recognized.\n? **KNEC & KPSEA Assessments:** Learners can register as private candidates for national assessments (KPSEA, KCEN) or Cambridge Checkpoint / IGCSE through registered British Council centers.\n? **SomaHome Concierge:** We provide formal registration guidance templates, portfolio trackers, and downloadable academic transcripts compliant with Kenyan education standards.`,
      is_meaningful: true,
      metadata: { topic: 'legal' }
    };
  }

  // 9. Tutors & Learning Pods ("5", "number 5", "tutor", "teacher", "pod", "hire")
  if (clean === '5' || clean === 'number 5' || clean === 'option 5' || clean.includes('tutor') || clean.includes('teacher') || clean.includes('pod') || clean.includes('marketplace') || clean.includes('hire') || clean.includes('kilimani') || clean.includes('karen') || clean.includes('westlands')) {
    return {
      response: `????? **SomaHome Tutor & Learning Pod Directory:**\n\n? Connect with verified, TSC-registered CBC facilitators and Cambridge-certified private tutors.\n? Available for home 1-on-1 sessions or neighbourhood Learning Pods across Nairobi (Kilimani, Karen, Kileleshwa, Westlands, Runda, Kiambu).\n? Filter tutors by hourly rate (KES 1,200 - 2,500/hr), curriculum specialty, and verified parent reviews in the **Marketplace** tab.`,
      is_meaningful: true,
      metadata: { topic: 'marketplace' }
    };
  }

  // 10. Platform Overview ("what is soma", "about", "explain platform")
  if (clean.includes('what is soma') || clean.includes('what is this') || clean.includes('about') || clean.includes('explain') || clean.includes('soma')) {
    return {
      response: `???? **SomaHome Kenya** is a universal **Homeschool-in-a-Box OS & Community Platform** tailored for Kenyan families.\n\n? **Turnkey Daily Lesson Plans:** 12-week structured curriculum for Kenya CBC (PP1?Grade 9) and British Cambridge.\n? **Sunday Print Packs:** Downloadable weekly homework worksheets and hands-on science lab experiment guides.\n? **Assessment & Portfolios:** Automated KICD competency rubric tracking (EE/ME/AE/BE) and ReportLab PDF report cards.\n? **Verified Tutors & Pods:** Directory of TSC-vetted private tutors and estate learning pods across Nairobi.\n\nIs there a specific grade or curriculum you are planning for?`,
      is_meaningful: true,
      metadata: { topic: 'overview' }
    };
  }

  // 11. Homeschool Advice / Routine / How Many Hours
  if (clean.includes('hour') || clean.includes('routine') || clean.includes('schedule') || clean.includes('how to homeschool') || clean.includes('advice') || clean.includes('hard') || clean.includes('balance')) {
    return {
      response: `?? **Homeschooling Guidance & Daily Routine Advice:**\n\n? **Recommended Daily Time:** For primary learners (Grade 1?6), **2.5 to 3.5 hours of focused study per day** is ideal. Homeschooling is 1-on-1, so it is 2x more efficient than classroom lectures.\n? **Structure on SomaHome:** We divide your day into 3 blocks:\n  1. *Morning Core (45 mins):* Mathematics Activities\n  2. *Mid-Morning (45 mins):* Science & Tech or English Language\n  3. *Afternoon Practical (45 mins):* Creative Arts, Agriculture, or Local Community Projects\n? **Flexibility:** You can adapt the timetable around your family's schedule in the **Daily OS** tab!`,
      is_meaningful: true,
      metadata: { topic: 'pedagogy_advice' }
    };
  }

  // 12. Greetings
  if (/^(hi|hello|hey|yo|habari|mambo|sasa|jambo|good\s*(morning|afternoon|evening))\b/i.test(clean)) {
    return {
      response: `?? Jambo **${userName}**! How can I assist you today?\n\nYou can ask me about **${childName}**'s progress, lessons, CBC/Cambridge curricula, term fees, legal registration, or finding a tutor in Nairobi!`,
      is_meaningful: false,
      metadata: { is_greeting: true }
    };
  }

  // 13. General Conversational Contextual Reply (Never rigid repetitive menus!)
  return {
    response: `I understand you are asking about *"**${raw}**"*.\n\nAs your SomaHome AI assistant, I can help you with anything regarding **${childName}**'s learning progress, CBC/Cambridge syllabi, KES 3,500 term packages, legal KNEC registration, or booking TSC-vetted tutors in Nairobi.\n\nCould you tell me a bit more about what you'd like to check or do?`,
    is_meaningful: true,
    metadata: { topic: 'conversational' }
  };
}
