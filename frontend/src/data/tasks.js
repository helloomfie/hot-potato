export const initialTasks = [
  {
    id: 'potato-1',
    title: "📞 Call New Lead",
    description: "Call New Lead - Customer in Nassau County - Referred by Edison",
    holder: "nas",
    temperature: 85,
    passCount: 1,
    value: 1500,
    timeLeft: 90,
    difficulty: "rare",
    combo: 0,
    lastPasser: null,
    tags: ["sales", "new-lead", "nassau"],
    category: "Sales"
  },
  {
    id: 'potato-2',
    title: "📝 Write Notes on New Lead",
    description: "Lead Notes - 2,200 sqft Home - $210/month PSEG Long Island - South-facing Roof",
    holder: "nas",
    temperature: 70,
    passCount: 0,
    value: 800,
    timeLeft: 60,
    difficulty: "common",
    combo: 0,
    lastPasser: null,
    tags: ["sales", "notes", "pge"],
    category: "Sales"
  },
  {
    id: 'potato-3',
    title: "📅 Schedule Sales Appointment",
    description: "Book Sales Call - Thursday @ 3PM via Zoom - Sent Calendar Invite to Customer",
    holder: "nas",
    temperature: 90,
    passCount: 2,
    value: 1200,
    timeLeft: 45,
    difficulty: "rare",
    combo: 1,
    lastPasser: "ilan",
    tags: ["sales", "appointment", "zoom"],
    category: "Sales"
  },
  {
    id: 'potato-4',
    title: "📊 Complete Solar Design",
    description: "Design - 7.2kW System - 18 Panels - South-Facing Roof - Good Sun Access",
    holder: "brandon",
    temperature: 75,
    passCount: 1,
    value: 2200,
    timeLeft: 180,
    difficulty: "epic",
    combo: 0,
    lastPasser: "nas",
    tags: ["sales", "design", "7.2kw"],
    category: "Sales"
  },
  {
    id: 'potato-5',
    title: "💰 Complete Solar Quote",
    description: "Quote - 7.2kW System - Cash Option + 25-Year Loan - $0 Down",
    holder: "ilan",
    temperature: 80,
    passCount: 1,
    value: 1800,
    timeLeft: 120,
    difficulty: "rare",
    combo: 0,
    lastPasser: "brandon",
    tags: ["sales", "quote", "financing"],
    category: "Sales"
  },
  {
    id: 'potato-6',
    title: "📋 Deliver Solar Design",
    description: "Proposal Delivered - Sent PDF + Zoom Walkthrough - Awaiting Customer Response",
    holder: "ilan",
    temperature: 95,
    passCount: 3,
    value: 2500,
    timeLeft: 30,
    difficulty: "epic",
    combo: 2,
    lastPasser: "nas",
    tags: ["sales", "proposal", "urgent"],
    category: "Sales"
  },
  {
    id: 'potato-7',
    title: "📋 New Trello Customer",
    description: "Create Trello Card - New Project - Add Customer Info + Checklist",
    holder: "nas",
    temperature: 65,
    passCount: 0,
    value: 600,
    timeLeft: 90,
    difficulty: "common",
    combo: 0,
    lastPasser: null,
    tags: ["customer-intake", "trello", "setup"],
    category: "New Customer"
  },
  {
    id: 'potato-8',
    title: "📄 Request New Plans",
    description: "Requested Drafting - Sent Site Data to Drafter - Awaiting Plan Set",
    holder: "ilan",
    temperature: 70,
    passCount: 1,
    value: 1000,
    timeLeft: 240,
    difficulty: "rare",
    combo: 0,
    lastPasser: "nas",
    tags: ["customer-intake", "plans", "drafting"],
    category: "New Customer"
  },
  {
    id: 'potato-9',
    title: "📁 Add Files to Trello",
    description: "Uploaded Agreement, Utility Bill, and Site Photos to Project Card",
    holder: "nas",
    temperature: 60,
    passCount: 0,
    value: 500,
    timeLeft: 45,
    difficulty: "common",
    combo: 0,
    lastPasser: null,
    tags: ["customer-intake", "files", "documentation"],
    category: "New Customer"
  },
  {
    id: 'potato-10',
    title: "🏠 Complete Site Visit",
    description: "Site Visit Completed - Roof Measured - Electrical Panel Verified",
    holder: "ilan",
    temperature: 85,
    passCount: 2,
    value: 1500,
    timeLeft: 60,
    difficulty: "rare",
    combo: 1,
    lastPasser: "brandon",
    tags: ["customer-intake", "site-visit", "measurement"],
    category: "New Customer"
  },
  {
    id: 'potato-11',
    title: "📝 Deliver Site Visit Form",
    description: "Submitted Completed Site Visit Form - Uploaded to Trello and Notified Team",
    holder: "ilan",
    temperature: 80,
    passCount: 1,
    value: 800,
    timeLeft: 90,
    difficulty: "common",
    combo: 0,
    lastPasser: "nas",
    tags: ["customer-intake", "form", "completion"],
    category: "New Customer"
  },
  {
    id: 'potato-12',
    title: "📋 Create Material List",
    description: "Material List - 7.2kW System - Enphase IQ8 - Unirac Racking - Mid Clamps, Rails, Breakers",
    holder: "ilan",
    temperature: 75,
    passCount: 1,
    value: 1200,
    timeLeft: 150,
    difficulty: "rare",
    combo: 0,
    lastPasser: "brandon",
    tags: ["pre-construction", "materials", "enphase"],
    category: "Pre-Construction"
  },
  {
    id: 'potato-13',
    title: "📄 Send Permit Request",
    description: "Permit Submitted - Nassau County - Estimated Approval in 5 Business Days",
    holder: "nas",
    temperature: 90,
    passCount: 2,
    value: 1800,
    timeLeft: 120,
    difficulty: "epic",
    combo: 1,
    lastPasser: "ilan",
    tags: ["pre-construction", "permit", "nassau"],
    category: "Pre-Construction"
  },
  {
    id: 'potato-14',
    title: "🏗️ Schedule Installation",
    description: "Install Scheduled - July 12 - Crew A Confirmed - Materials Ready",
    holder: "nas",
    temperature: 95,
    passCount: 3,
    value: 3000,
    timeLeft: 30,
    difficulty: "epic",
    combo: 2,
    lastPasser: "ilan",
    tags: ["construction", "scheduling", "crew-a"],
    category: "Construction"
  },
  {
    id: 'potato-15',
    title: "✅ Request Sign Off",
    description: "Inspection Scheduled - July 17 - Assigned Inspector Confirmed",
    holder: "nas",
    temperature: 85,
    passCount: 1,
    value: 1500,
    timeLeft: 180,
    difficulty: "rare",
    combo: 0,
    lastPasser: "brandon",
    tags: ["post-construction", "inspection", "signoff"],
    category: "Post Construction"
  },
  {
    id: 'potato-16',
    title: "⚡ Begin Interconnection",
    description: "Submitted Interconnection to Utility - Awaiting Permission to Operate (PTO)",
    holder: "ilan",
    temperature: 80,
    passCount: 2,
    value: 2000,
    timeLeft: 240,
    difficulty: "epic",
    combo: 1,
    lastPasser: "nas",
    tags: ["post-construction", "interconnection", "pto"],
    category: "Post Construction"
  },
  {
    id: 'potato-17',
    title: "📞 Welcome Call & System Walkthrough",
    description: "Welcome Call Completed - Helped Customer Set Up Monitoring App - Explained First Utility Bill",
    holder: "juan",
    temperature: 70,
    passCount: 1,
    value: 1000,
    timeLeft: 90,
    difficulty: "rare",
    combo: 0,
    lastPasser: "ilan",
    tags: ["customer-satisfaction", "welcome", "monitoring"],
    category: "Customer Satisfaction"
  },
  {
    id: 'potato-18',
    title: "📋 Send Satisfaction Survey",
    description: "Survey Sent - Google Form Link Emailed to Customer",
    holder: "nas",
    temperature: 60,
    passCount: 0,
    value: 500,
    timeLeft: 60,
    difficulty: "common",
    combo: 0,
    lastPasser: null,
    tags: ["customer-satisfaction", "survey", "feedback"],
    category: "Customer Satisfaction"
  },
  {
    id: 'potato-19',
    title: "🔧 Address Customer Feedback",
    description: "Feedback Received - Concern About Monitoring Data - Logged and Escalated to Tech Team",
    holder: "juan",
    temperature: 85,
    passCount: 2,
    value: 1200,
    timeLeft: 120,
    difficulty: "rare",
    combo: 1,
    lastPasser: "nas",
    tags: ["customer-satisfaction", "feedback", "technical"],
    category: "Customer Satisfaction"
  },
  {
    id: 'potato-20',
    title: "⭐ Request Referral or Testimonial",
    description: "Requested Google Review + Referral - Sent Thank You + Review Link",
    holder: "nas",
    temperature: 75,
    passCount: 1,
    value: 1500,
    timeLeft: 180,
    difficulty: "rare",
    combo: 0,
    lastPasser: "juan",
    tags: ["customer-satisfaction", "referral", "review"],
    category: "Customer Satisfaction"
  },
  {
    id: 'potato-21',
    title: "🎁 Send Thank You Package",
    description: "Gift Sent - Branded Mug + Thank You Card - Delivered 7/20",
    holder: "juan",
    temperature: 65,
    passCount: 1,
    value: 600,
    timeLeft: 240,
    difficulty: "common",
    combo: 0,
    lastPasser: "nas",
    tags: ["customer-satisfaction", "gift", "branding"],
    category: "Customer Satisfaction"
  },
  {
    id: 'potato-22',
    title: "📅 Check-In at 3-Month Mark",
    description: "3-Month Follow-Up Call - Customer Reports Savings as Expected - No Service Issues",
    holder: "nas",
    temperature: 80,
    passCount: 2,
    value: 1000,
    timeLeft: 150,
    difficulty: "rare",
    combo: 1,
    lastPasser: "juan",
    tags: ["customer-satisfaction", "followup", "savings"],
    category: "Customer Satisfaction"
  },
  {
    id: 'potato-23',
    title: "📋 Confirm Material Delivery",
    description: "Materials Delivered - All Panels, Inverters, and Racking Received at Warehouse",
    holder: "nas",
    temperature: 75,
    passCount: 1,
    value: 1800,
    timeLeft: 120,
    difficulty: "rare",
    combo: 0,
    lastPasser: "brandon",
    tags: ["construction", "materials", "delivery"],
    category: "Construction"
  },
  {
    id: 'potato-24',
    title: "📞 Pre-Install Walkthrough",
    description: "Pre-Install Call - Reviewed Install Day Expectations with Customer - Answered Questions",
    holder: "juan",
    temperature: 70,
    passCount: 0,
    value: 1200,
    timeLeft: 90,
    difficulty: "common",
    combo: 0,
    lastPasser: null,
    tags: ["construction", "walkthrough", "customer"],
    category: "Construction"
  },
  {
    id: 'potato-25',
    title: "📦 Crew Briefing & Packet",
    description: "Install Packet Prepared - Site Plan, Material List, Customer Notes Shared with Crew Lead",
    holder: "nas",
    temperature: 85,
    passCount: 2,
    value: 1500,
    timeLeft: 60,
    difficulty: "rare",
    combo: 1,
    lastPasser: "juan",
    tags: ["construction", "crew", "briefing"],
    category: "Construction"
  },
  {
    id: 'potato-26',
    title: "🏗️ Installation Day Coordination",
    description: "Install Day - On-Site Arrival Confirmed - Crew Clock-In & Safety Checklist Completed",
    holder: "juan",
    temperature: 90,
    passCount: 3,
    value: 2500,
    timeLeft: 45,
    difficulty: "epic",
    combo: 2,
    lastPasser: "nas",
    tags: ["construction", "installation", "coordination"],
    category: "Construction"
  },
  {
    id: 'potato-27',
    title: "📝 Daily Installation Log / Report",
    description: "Install Report Submitted - Day 1 - Panels Mounted, Wiring Started - No Issues",
    holder: "juan",
    temperature: 80,
    passCount: 1,
    value: 1000,
    timeLeft: 120,
    difficulty: "common",
    combo: 0,
    lastPasser: "brandon",
    tags: ["construction", "report", "progress"],
    category: "Construction"
  },
  {
    id: 'potato-28',
    title: "✅ Final Quality Check",
    description: "QC Check - Verified All Components Installed as Designed - Passed Internal Checklist",
    holder: "juan",
    temperature: 85,
    passCount: 2,
    value: 2200,
    timeLeft: 180,
    difficulty: "epic",
    combo: 1,
    lastPasser: "nas",
    tags: ["construction", "quality", "inspection"],
    category: "Construction"
  },
  {
    id: 'potato-29',
    title: "👥 Customer Walkthrough Post-Install",
    description: "Customer Walkthrough - Explained System Function - Verified Work Area Clean",
    holder: "juan",
    temperature: 75,
    passCount: 1,
    value: 1500,
    timeLeft: 90,
    difficulty: "rare",
    combo: 0,
    lastPasser: "ilan",
    tags: ["construction", "customer", "completion"],
    category: "Construction"
  },
  {
    id: 'potato-30',
    title: "🏛️ Close Permit with AHJ",
    description: "Permit Closed - Passed Final Inspection - Uploaded Sign-Off Docs",
    holder: "nas",
    temperature: 80,
    passCount: 2,
    value: 1800,
    timeLeft: 240,
    difficulty: "rare",
    combo: 1,
    lastPasser: "juan",
    tags: ["post-construction", "permit", "ahj"],
    category: "Post Construction"
  },
  {
    id: 'potato-31',
    title: "⚡ Submit Interconnection",
    description: "Utility Interconnection Submitted - PG&E Application ID: 4567XYZ",
    holder: "nas",
    temperature: 85,
    passCount: 1,
    value: 2000,
    timeLeft: 180,
    difficulty: "epic",
    combo: 0,
    lastPasser: "brandon",
    tags: ["post-construction", "interconnection", "utility"],
    category: "Post Construction"
  },
  {
    id: 'potato-32',
    title: "📊 Confirm Net Metering",
    description: "Utility Confirmed NEM Enrollment - Customer to Receive PTO in 5-7 Days",
    holder: "juan",
    temperature: 75,
    passCount: 1,
    value: 1500,
    timeLeft: 150,
    difficulty: "rare",
    combo: 0,
    lastPasser: "nas",
    tags: ["post-construction", "net-metering", "nem"],
    category: "Post Construction"
  },
  {
    id: 'potato-33',
    title: "🔌 Receive PTO (Permission to Operate)",
    description: "PTO Received - Forwarded Email to Customer - Monitoring Now Live",
    holder: "nas",
    temperature: 90,
    passCount: 3,
    value: 2500,
    timeLeft: 30,
    difficulty: "epic",
    combo: 2,
    lastPasser: "juan",
    tags: ["post-construction", "pto", "activation"],
    category: "Post Construction"
  },
  {
    id: 'potato-34',
    title: "💻 Activate Monitoring Portal",
    description: "Monitoring Activated - Customer Logged In Successfully to Enphase Portal",
    holder: "juan",
    temperature: 70,
    passCount: 0,
    value: 1000,
    timeLeft: 90,
    difficulty: "common",
    combo: 0,
    lastPasser: null,
    tags: ["post-construction", "monitoring", "portal"],
    category: "Post Construction"
  },
  {
    id: 'potato-35',
    title: "📄 Send Final Documentation Packet",
    description: "Final Docs Sent - Includes Warranty, PTO Letter, As-Built Plan Set",
    holder: "nas",
    temperature: 65,
    passCount: 1,
    value: 800,
    timeLeft: 120,
    difficulty: "common",
    combo: 0,
    lastPasser: "juan",
    tags: ["post-construction", "documentation", "final"],
    category: "Post Construction"
  }
];

// Task Management Functions
export const createNewTask = (formData, selectedEmoji) => {
  const finalTitle = selectedEmoji ? `${selectedEmoji} ${formData.title}` : `🥔 ${formData.title}`;
  
  return {
    id: `potato-${Date.now()}`,
    title: finalTitle,
    description: formData.description,
    holder: formData.holder,
    temperature: Math.floor(Math.random() * 40) + 30, // Random temp between 30-70
    passCount: 0,
    value: formData.value,
    timeLeft: formData.timeLeft,
    difficulty: formData.value > 2000 ? "epic" : formData.value > 1200 ? "rare" : "common",
    combo: 0,
    lastPasser: null,
    tags: [formData.category.toLowerCase().replace(' ', '-'), "new"],
    category: formData.category
  };
};

// Task Utility Functions
export const getTasksByCategory = (tasks, category) => {
  return tasks.filter(task => task.category === category);
};

export const getTasksByHolder = (tasks, holder) => {
  return tasks.filter(task => task.holder === holder);
};

export const getHotTasks = (tasks, temperatureThreshold = 80) => {
  return tasks.filter(task => task.temperature >= temperatureThreshold);
};

export const sortTasksByPriority = (tasks, currentUser) => {
  return tasks.sort((a, b) => {
    // First, prioritize current user's tasks
    if (a.holder === currentUser && b.holder !== currentUser) return -1;
    if (b.holder === currentUser && a.holder !== currentUser) return 1;
    
    // If both belong to current user or both don't, sort by temperature (hottest first)
    return b.temperature - a.temperature;
  });
};

// Categories for easy reference
export const taskCategories = [
  'Sales',
  'New Lead',
  'New Customer',
  'Pre-Construction',
  'Construction',
  'Post Construction',
  'Customer Satisfaction'
];

// Popular emojis for task creation
export const popularEmojis = [
  '📞', '📝', '📅', '📊', '💰', '📋', '📄', '📁', '🏠', '✅',
  '⚡', '🔧', '⭐', '🎁', '📈', '🏗️', '🔥', '💡', '📱', '🎯'
];