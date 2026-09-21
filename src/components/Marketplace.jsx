import React, { useState, useEffect } from 'react';
import SafetyGuaranteeModal from '../modules/marketplace/SafetyGuaranteeModal';
import { ShieldCheck, Lock, MapPin, Star, Calendar, Users, Phone, CheckCircle, MessageSquarePlus, Sparkles, Filter, AlertCircle, XCircle, CheckCircle2, Clock, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../modules/marketplace/BookingModal';
import { jobVacanciesService } from '../services/jobVacanciesStore';
import { Briefcase, MessageCircle, Send } from 'lucide-react';
import ReviewModal from '../modules/marketplace/ReviewModal';
import PodEscrowModal from '../modules/marketplace/PodEscrowModal';

const INITIAL_BOOKINGS = [];

export default function Marketplace({ tutors: initialTutors, pods, onNavigateTab }) {
  const { currentUser, setIsProfileModalOpen } = useAuth();
  const isTeacher = currentUser?.role === 'tutor';
  const isParent = currentUser?.role === 'parent';

  const [tutors, setTutors] = useState(initialTutors);
  const [selectedEstate, setSelectedEstate] = useState('ALL');
  const [activeTab, setActiveTab] = useState(isTeacher ? 'my_bookings' : 'tutors');
  // Vacancies & Job Board State
  const [vacancies, setVacancies] = useState(() => jobVacanciesService.getAll());
  const [isPostVacancyModalOpen, setIsPostVacancyModalOpen] = useState(false);
  const [vacancyFilter, setVacancyFilter] = useState('ALL'); // ALL, open, claimed
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [newVacancyForm, setNewVacancyForm] = useState({
    title: '',
    studentName: '',
    curriculum: 'KICD CBC Grade 4',
    subject: 'Science & Mathematics',
    schedule: '2 Days / Week • Tue & Thu 10:00 AM - 11:30 AM',
    sessionType: 'in_person',
    estate: 'Kilimani',
    hourlyRateKes: 2500,
    budgetTotalKes: 5000,
    requirements: ''
  });

  const handleMessageTeacher = (tutor) => {
    let targetChatId = 'direct_steve';
    const nameLower = (tutor.full_name || tutor.name || '').toLowerCase();
    if (nameLower.includes('brian')) targetChatId = 'direct_brian';
    else if (nameLower.includes('sarah')) targetChatId = 'direct_sarah';
    else if (nameLower.includes('kevin') || nameLower.includes('juma')) targetChatId = 'direct_kevin';
    
    localStorage.setItem('somahome_target_chat_teacher', targetChatId);
    if (onNavigateTab) {
      onNavigateTab('chat');
    } else {
      window.location.hash = '#chat';
    }
  };

  const handleMessageParent = (parentName) => {
    localStorage.setItem('somahome_target_chat_teacher', 'direct_steve');
    if (onNavigateTab) {
      onNavigateTab('chat');
    } else {
      window.location.hash = '#chat';
    }
  };

  const handlePostVacancySubmit = (e) => {
    e.preventDefault();
    if (!newVacancyForm.title.trim()) return;

    const created = jobVacanciesService.postVacancy({
      ...newVacancyForm,
      parentName: currentUser?.name || 'Steve Kariuki (Mama Liam)',
      parentPhone: '0712 345 678'
    });

    setVacancies(jobVacanciesService.getAll());
    setIsPostVacancyModalOpen(false);
    setNewVacancyForm({
      title: '',
      studentName: '',
      curriculum: 'KICD CBC Grade 4',
      subject: 'Science & Mathematics',
      schedule: '2 Days / Week • Tue & Thu 10:00 AM - 11:30 AM',
      sessionType: 'in_person',
      estate: 'Kilimani',
      hourlyRateKes: 2500,
      budgetTotalKes: 5000,
      requirements: ''
    });
    /* Vacancy broadcast confirmed */
  };

  const handleClaimJob = (job) => {
    const activeTeacher = {
      id: currentUser?.id || 1,
      name: currentUser?.name || 'Teacher Mercy Cherono',
      role: 'Certified Grade 4 CBC Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      tsc_number: 'TSC-881294'
    };

    jobVacanciesService.claimJob(job.id, activeTeacher);
    setVacancies(jobVacanciesService.getAll());

    // Also auto-create a confirmed booking in bookings state
    const newBooking = {
      id: `BKG-${Math.floor(9200 + Math.random() * 700)}`,
      tutorName: activeTeacher.name,
      studentName: job.studentName,
      parentName: job.parentName,
      parentPhone: job.parentPhone || '0712 345 678',
      date: 'This Week',
      timeSlot: job.schedule.split('•')[1]?.trim() || '10:00 AM - 11:30 AM',
      sessionType: job.sessionType,
      estateAddress: job.estate,
      focusSubject: `${job.curriculum}: ${job.subject}`,
      amount: job.budgetTotalKes || 5000,
      receipt: `SKM${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Confirmed'
    };

    setBookings(prev => [newBooking, ...prev]);
    /* Job claimed and confirmed in schedule */
  }; // my_bookings, tutors, pods

  // Persistent bookings list
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('somahome_client_bookings_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('somahome_client_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  // Modal states
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState(null);
  const [selectedTutorForReview, setSelectedTutorForReview] = useState(null);
  const [selectedPodForEscrow, setSelectedPodForEscrow] = useState(null);
  const [recentReviews, setRecentReviews] = useState({});

  const estates = [
    { value: 'ALL', label: '📍 All Nairobi Estates' },
    { value: 'Kilimani', label: 'Kilimani & Kileleshwa' },
    { value: 'Syokimau', label: 'Syokimau & Mombasa Rd' },
    { value: 'Karen', label: 'Karen & Langata' },
    { value: 'Lavington', label: 'Lavington & Ngong Rd' },
    { value: 'Runda', label: 'Runda, Gigiri & Ruaka' },
  ];

  const filteredTutors = selectedEstate === 'ALL'
    ? tutors
    : tutors.filter((t) => t.estates_covered?.some((e) => e.toLowerCase().includes(selectedEstate.toLowerCase())));

  const filteredPods = selectedEstate === 'ALL'
    ? pods
    : pods.filter((p) => p.estate?.toLowerCase().includes(selectedEstate.toLowerCase()));

  const handleBookingCreated = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this scheduled session? The client/tutor will be notified.")) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
      );
    }
  };

  const handleMarkDelivered = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Completed' } : b))
    );
  };

  const handleReviewSubmitted = (review) => {
    if (!selectedTutorForReview) return;
    const tutorId = selectedTutorForReview.id;

    setTutors((prev) =>
      prev.map((t) => {
        if (t.id === tutorId) {
          const currentCount = t.reviews_count || 1;
          const currentRating = parseFloat(t.rating) || 5.0;
          const newCount = currentCount + 1;
          const newRating = ((currentRating * currentCount + review.rating) / newCount).toFixed(1);
          return {
            ...t,
            rating: newRating,
            reviews_count: newCount
          };
        }
        return t;
      })
    );

    setRecentReviews((prev) => ({
      ...prev,
      [tutorId]: [review, ...(prev[tutorId] || [])]
    }));
  };

  return (
    <div>
      {/* Header & Dropdown Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="glass-pill" style={{ color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)', marginBottom: '8px', display: 'inline-block', fontSize: '0.72rem' }}>
            {isTeacher ? '👨‍🏫 Facilitator Client Desk & Network' : '🏡 Nairobi Homeschool Community & Marketplace'}
          </span>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 800 }}>
            {isTeacher ? 'My Client Bookings & Facilitator Directory' : 'Nairobi Homeschool Community & Marketplace'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            {isTeacher
              ? 'Review sessions booked by parents, manage appointments, and network with vetted colleagues'
              : 'Vetted travelling specialists, lab sessions & neighborhood micro-schooling pods'}
          </p>
        </div>

        {/* DROPDOWN FILTERS CONTAINER */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Subject Filter (when viewing tutors or vacancies) */}
          {(activeTab === 'tutors' || activeTab === 'vacancies') && (
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                Subject / Domain:
              </label>
              <select
                className="custom-select"
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                style={{ fontSize: '0.82rem' }}
              >
                <option value="ALL">📚 All Learning Domains</option>
                <option value="Science">🔬 Science & STEM</option>
                <option value="Mathematics">📐 Mathematics & Fractions</option>
                <option value="Robotics">🤖 Robotics & Coding</option>
                <option value="Kiswahili">🇰🇪 Kiswahili Lugha</option>
                <option value="Phonics">📖 Phonics & Literacy</option>
              </select>
            </div>
          )}
          
          {/* Directory Category Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              Select View:
            </label>
            <select
              className="custom-select"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              style={{ minWidth: '220px' }}
            >
              {isTeacher && (
                <option value="my_bookings">📋 My Client Bookings ({bookings.filter(b => b.status !== 'Cancelled').length})</option>
              )}
              {isParent && bookings.length > 0 && (
                <option value="my_bookings">📅 My Booked Sessions ({bookings.filter(b => b.status !== 'Cancelled').length})</option>
              )}
              <option value="tutors">👨‍🏫 {isTeacher ? 'Vetted Colleague Directory' : 'Verified Tutors'} ({tutors.length})</option>
              <option value="pods">🏡 Estate Learning Pods ({pods.length})</option>
            </select>
          </div>

          {/* Estate Dropdown */}
          {activeTab !== 'my_bookings' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                Filter by Estate:
              </label>
              <select
                className="custom-select"
                value={selectedEstate}
                onChange={(e) => setSelectedEstate(e.target.value)}
                style={{ minWidth: '210px' }}
              >
                {estates.map((est) => (
                  <option key={est.value} value={est.value}>{est.label}</option>
                ))}
              </select>
            </div>
          )}

        </div>
      </div>

      {/* CONTENT: CLIENT BOOKINGS VIEW (For Teachers to see who booked them, or Parents to see their appointments) */}
      {activeTab === 'my_bookings' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 800 }}>
              {isTeacher ? 'Families Who Have Booked Sessions With You' : 'Your Scheduled Homeschool Sessions'}
            </h3>
            <span className="glass-pill" style={{ fontSize: '0.75rem', color: '#10B981' }}>
              M-Pesa Escrow Protected
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {bookings.map((booking) => {
              const isCancelled = booking.status === 'Cancelled';
              const isCompleted = booking.status === 'Completed';

              return (
                <div
                  key={booking.id}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: isCancelled
                      ? '1px solid rgba(239, 68, 68, 0.3)'
                      : isCompleted
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid rgba(0, 166, 81, 0.3)',
                    opacity: isCancelled ? 0.65 : 1
                  }}
                >
                  <div>
                    {/* Header with Reference & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span className="glass-pill" style={{
                          fontSize: '0.72rem',
                          background: isCancelled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: isCancelled ? '#F87171' : '#10B981'
                        }}>
                          {isCancelled ? '❌ Cancelled' : isCompleted ? '✅ Delivered' : '🟢 Confirmed & Paid'}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Ref: {booking.id} • M-Pesa: <strong style={{ color: '#34D399' }}>{booking.receipt}</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F8FAFC' }}>
                          KES {booking.amount?.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1.5-hr Session</div>
                      </div>
                    </div>

                    {/* Student & Parent Info */}
                    <div style={{ marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '1.15rem', margin: '0 0 4px 0' }}>{booking.studentName}</h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        Parent: <strong>{booking.parentName || 'Steve Kariuki'}</strong> ({booking.parentPhone || '0712 345 678'})
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#38BDF8', marginTop: '2px', fontWeight: 600 }}>
                        📚 {booking.focusSubject}
                      </div>
                    </div>

                    {/* Schedule & Location */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="#F59E0B" />
                        <span><strong>Schedule:</strong> {booking.date} • {booking.timeSlot}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {booking.sessionType === 'in_person' ? <MapPin size={14} color="#10B981" /> : <Video size={14} color="#38BDF8" />}
                        <span><strong>Format:</strong> {booking.sessionType === 'in_person' ? `Home Visit (${booking.estateAddress})` : 'Live Virtual Classroom'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    {!isCancelled && !isCompleted && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="btn-secondary"
                          style={{ fontSize: '0.78rem', color: '#F87171', borderColor: 'rgba(239,68,68,0.3)', padding: '6px 12px' }}
                          title="Cancel this booking and notify client"
                        >
                          Cancel Session ❌
                        </button>

                        {isTeacher && (
                          <button
                            type="button"
                            onClick={() => handleMarkDelivered(booking.id)}
                            className="btn-primary"
                            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                          >
                            Mark Complete ✅
                          </button>
                        )}
                      </>
                    )}

                    {isCancelled && (
                      <span style={{ fontSize: '0.78rem', color: '#F87171' }}>
                        This session was cancelled.
                      </span>
                    )}

                    {isCompleted && (
                      <span style={{ fontSize: '0.78rem', color: '#10B981' }}>
                        Session delivered successfully.
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT: TUTORS VIEW */}
      {activeTab === 'tutors' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredTutors.map((tutor) => {
            const tutorSpecificReviews = recentReviews[tutor.id] || [];
            const isMyOwnCard = isTeacher && tutor.full_name?.toLowerCase().includes('mercy');

            return (
              <div key={tutor.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Header: Photo & Title */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                    <img
                      src={tutor.avatar_url}
                      alt={tutor.full_name}
                      style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: isMyOwnCard ? '2px solid #F59E0B' : '2px solid #00A651' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ fontSize: '1.15rem', margin: 0 }}>{tutor.full_name}</h3>
                        {isMyOwnCard && (
                          <span className="glass-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontSize: '0.68rem' }}>
                            ⭐ You
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 600 }}>{tutor.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <Star size={14} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{tutor.rating}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({tutor.reviews_count} parent reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Vetting Badges */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span className="glass-pill" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={12} /> Police Good Conduct Verified
                    </span>
                    <span className="glass-pill" style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} /> TSC Registered
                    </span>
                  </div>

                  {/* Bio */}
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {tutor.bio}
                  </p>

                  {/* Covered Estates */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                    <MapPin size={14} color="#F59E0B" />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Visits: {tutor.estates_covered?.join(', ')}
                    </span>
                  </div>

                  {/* Recent Parent Reviews Snippet */}
                  {tutorSpecificReviews.length > 0 ? (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.06)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      marginBottom: '16px',
                      fontSize: '0.8rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F59E0B', fontWeight: 700, marginBottom: '4px' }}>
                        <span>⭐ Latest Parent Review</span>
                        <span>{tutorSpecificReviews[0].rating}/5</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        "{tutorSpecificReviews[0].comment}"
                      </p>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        — {tutorSpecificReviews[0].reviewer} ({tutorSpecificReviews[0].createdAt})
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      marginBottom: '16px',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      fontStyle: 'italic'
                    }}>
                      💬 "Teacher Mercy was exceptionally patient explaining equivalent fractions to Liam. 5 stars!"
                    </div>
                  )}
                </div>

                {/* Bottom: Hourly Rate & Role-Adaptive Action Button */}
                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>HOURLY RATE</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC' }}>
                        KES {parseInt(tutor.hourly_rate_kes).toLocaleString()}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}> / hr</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTutorForReview(tutor)}
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      title="Rate teacher and leave star review"
                    >
                      <Star size={14} color="#F59E0B" />
                      <span>Review & Stars</span>
                    </button>
                  </div>

                  {/* ADAPTIVE ACTION BUTTON */}
                  {isTeacher ? (
                    isMyOwnCard ? (
                      <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="btn-gold"
                        style={{ width: '100%', fontSize: '0.9rem', padding: '10px 16px', justifyContent: 'center' }}
                      >
                        <span>Edit My Profile & Hourly Rate ✏️</span>
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleMessageTeacher(tutor)}
                          className="btn-secondary"
                          style={{ flex: 1, fontSize: '0.8rem', padding: '9px 12px', justifyContent: 'center', gap: '6px' }}
                        >
                          <MessageCircle size={14} color="#34D399" />
                          <span>Message Colleague</span>
                        </button>
                      </div>
                    )
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleMessageTeacher(tutor)}
                        className="btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '9px 10px', justifyContent: 'center', gap: '6px' }}
                        title="Open direct chat in Community Chat"
                      >
                        <MessageCircle size={15} color="#38BDF8" />
                        <span>Message</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTutorForBooking(tutor)}
                        className="btn-primary"
                        style={{ fontSize: '0.82rem', padding: '9px 12px', justifyContent: 'center', gap: '6px' }}
                      >
                        <Calendar size={15} />
                        <span>Book Session</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

            {/* CONTENT: VACANCIES & JOB BOARD VIEW */}
      {activeTab === 'vacancies' && (
        <div>
          {/* Top Banner with Post Vacancy CTA */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(14, 165, 233, 0.04) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Briefcase size={20} color="#38BDF8" />
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#F8FAFC' }}>
                  Homeschool Tutoring Job Vacancies & Gigs
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {isTeacher 
                  ? 'Browse open lesson requests posted by homeschool parents. Claim vacancies or contact parents directly.' 
                  : 'Post custom tutoring requirements and set your hourly budget. Verified teachers across Nairobi will apply.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['ALL', 'open', 'claimed'].map(statusKey => (
                  <button
                    key={statusKey}
                    onClick={() => setVacancyFilter(statusKey)}
                    className="glass-pill"
                    style={{
                      cursor: 'pointer',
                      fontSize: '0.74rem',
                      background: vacancyFilter === statusKey ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.03)',
                      color: vacancyFilter === statusKey ? '#38BDF8' : 'var(--text-muted)',
                      border: vacancyFilter === statusKey ? '1px solid #38BDF8' : '1px solid var(--border-subtle)',
                      padding: '4px 10px'
                    }}
                  >
                    {statusKey === 'ALL' ? 'All Gigs' : (statusKey === 'open' ? '🟢 Open Vacancies' : '✅ Claimed')}
                  </button>
                ))}
              </div>

              {isParent && (
                <button
                  onClick={() => setIsPostVacancyModalOpen(true)}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '9px 18px', gap: '6px' }}
                >
                  <Plus size={16} />
                  <span>Post a New Tutoring Vacancy</span>
                </button>
              )}
            </div>
          </div>

          {/* Vacancies Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
            {vacancies
              .filter(v => {
                if (vacancyFilter === 'open') return v.status === 'open';
                if (vacancyFilter === 'claimed') return v.status === 'claimed';
                return true;
              })
              .filter(v => {
                if (selectedEstate === 'ALL') return true;
                return v.estate?.toLowerCase().includes(selectedEstate.toLowerCase());
              })
              .filter(v => {
                if (selectedSubjectFilter === 'ALL') return true;
                return v.subject?.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
              })
              .map(job => {
                const isOpen = job.status === 'open';
                return (
                  <div
                    key={job.id}
                    className="glass-panel"
                    style={{
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: isOpen ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(16, 185, 129, 0.25)',
                      background: isOpen ? 'rgba(14, 21, 36, 0.7)' : 'rgba(10, 14, 23, 0.5)'
                    }}
                  >
                    <div>
                      {/* Badge & Rate */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <span className="glass-pill" style={{
                            fontSize: '0.68rem',
                            background: isOpen ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: isOpen ? '#38BDF8' : '#10B981',
                            borderColor: isOpen ? 'rgba(56, 189, 248, 0.4)' : 'rgba(16, 185, 129, 0.4)'
                          }}>
                            {isOpen ? '🟢 Open for Teachers' : '✅ Claimed & Assigned'}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Ref: {job.id} • Posted {job.postedDate}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>
                            KES {job.hourlyRateKes?.toLocaleString()}
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}> / hr</span>
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700 }}>
                            Budget: KES {job.budgetTotalKes?.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Title & Student Info */}
                      <h4 style={{ fontSize: '1.08rem', margin: '0 0 6px 0', color: '#F8FAFC' }}>
                        {job.title}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: '#38BDF8', fontWeight: 600, marginBottom: '4px' }}>
                        {job.curriculum} • {job.subject}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        Learner: <strong>{job.studentName}</strong> • Posted by: {job.parentName}
                      </div>

                      {/* Location & Schedule Card */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={13} color="#F59E0B" />
                          <span><strong>Schedule:</strong> {job.schedule}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {job.sessionType === 'in_person' ? <MapPin size={13} color="#10B981" /> : <Video size={13} color="#38BDF8" />}
                          <span><strong>Format:</strong> {job.sessionType === 'in_person' ? `Home Visit (${job.estate})` : 'Live Virtual Classroom'}</span>
                        </div>
                      </div>

                      {/* Requirements */}
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                        "{job.requirements}"
                      </p>
                    </div>

                    {/* Claimed Info OR Actions */}
                    <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                      {!isOpen && job.claimedBy && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={job.claimedBy.avatar}
                            alt={job.claimedBy.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10B981' }}>
                              Claimed by {job.claimedBy.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {job.claimedBy.tsc_number} • {job.claimedDate || 'Assigned'}
                            </div>
                          </div>
                        </div>
                      )}

                      {isOpen && (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => handleMessageParent(job.parentName)}
                            className="btn-secondary"
                            style={{ fontSize: '0.78rem', padding: '7px 12px', gap: '5px' }}
                          >
                            <MessageCircle size={14} color="#38BDF8" />
                            <span>Message Parent</span>
                          </button>

                          {isTeacher && (
                            <button
                              type="button"
                              onClick={() => handleClaimJob(job)}
                              className="btn-primary"
                              style={{ fontSize: '0.78rem', padding: '7px 14px', gap: '5px' }}
                            >
                              <CheckCircle2 size={14} />
                              <span>⚡ Accept & Claim Job</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
          </div>
        </div>
      )}


      {/* CONTENT: ESTATE PODS VIEW */}
      {activeTab === 'pods' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredPods.map((pod) => (
            <div key={pod.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span className="glass-pill badge-cbc" style={{ fontSize: '0.72rem' }}>
                      {pod.curriculum_code} • {pod.grade_target}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', marginTop: '6px', marginBottom: '2px' }}>{pod.name}</h3>
                    <div style={{ fontSize: '0.82rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {pod.estate}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>
                      {pod.current_enrolled}/{pod.max_children} Kids
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {pod.max_children - pod.current_enrolled} Seats Open
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {pod.description}
                </p>

                {/* Focus Areas */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {pod.focus_areas?.map((fa, i) => (
                    <span key={i} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px' }}>
                      ✨ {fa}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                  🗓️ Schedule: <strong style={{ color: 'var(--text-primary)' }}>{pod.meeting_days}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MONTHLY CO-OP SHARE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>
                    KES {parseInt(pod.monthly_share_kes).toLocaleString()}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}> / month</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPodForEscrow(pod)}
                  className="btn-gold"
                  style={{ fontSize: '0.85rem', padding: '8px 16px', gap: '6px' }}
                >
                  <Lock size={14} />
                  <span>Co-op Escrow & Join</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Interactive Booking Modal */}
      {selectedTutorForBooking && (
        <BookingModal
          tutor={selectedTutorForBooking}
          isOpen={!!selectedTutorForBooking}
          onClose={() => setSelectedTutorForBooking(null)}
          onBookingSuccess={handleBookingCreated}
        />
      )}

            {/* Interactive Pod Escrow Modal */}
      {selectedPodForEscrow && (
        <PodEscrowModal
          isOpen={!!selectedPodForEscrow}
          onClose={() => setSelectedPodForEscrow(null)}
          pod={{
            id: selectedPodForEscrow.id,
            name: selectedPodForEscrow.name,
            estate: selectedPodForEscrow.estate,
            tutor: selectedPodForEscrow.lead_teacher || 'Teacher Sarah Wambui (Lead STEM Specialist)',
            totalMonthlyFee: parseInt(selectedPodForEscrow.monthly_share_kes || 5000) * (selectedPodForEscrow.max_children || 5),
            perFamilyFee: parseInt(selectedPodForEscrow.monthly_share_kes || 5000),
            targetCapacity: selectedPodForEscrow.max_children || 5
          }}
        />
      )}

      {/* Interactive Review Modal */}
      {selectedTutorForReview && (
        <ReviewModal
          isOpen={!!selectedTutorForReview}
          targetType="tutor"
          targetTitle={selectedTutorForReview.full_name}
          targetSubtitle={selectedTutorForReview.title}
          onClose={() => setSelectedTutorForReview(null)}
          onSubmitReview={handleReviewSubmitted}
        />
      )}

    </div>
  );
}