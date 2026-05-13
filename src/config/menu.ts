import { 
  LayoutDashboard,
  BrainCircuit,
  Calendar,
  Users,
  Briefcase,
  Heart,
  AlertTriangle,
  Clock,
  CalendarDays,
  Banknote,
  Award,
  UserPlus,
  CheckSquare,
  Target,
  Network,
  GraduationCap,
  PieChart,
  Settings
} from 'lucide-react';

export interface MenuItem {
  id: string;
  path?: string;
  name: string;
  icon?: any;
  isConfidential?: boolean;
  category?: string;
  subItems?: { id: string; name: string; path: string; isConfidential?: boolean }[];
}

export const MENU_ITEMS: MenuItem[] = [
  // Top Level
  { id: 'dashboard', path: '/', name: 'DCC HOME', icon: LayoutDashboard, category: 'TOP' },
  { id: 'copilot', path: '/copilot', name: 'AI COPILOT', icon: BrainCircuit, category: 'TOP' },
  { id: 'calendar', path: '/calendar', name: 'CALENDAR', icon: Calendar, category: 'TOP' },
  
  // DOCUMENT CONTROL
  { 
    id: 'document_control_dar', 
    name: 'DOCUMENT REQUEST (DAR)', 
    icon: Briefcase, 
    category: 'DOCUMENT CONTROL',
    subItems: [
      { id: 'dar_form', name: 'DOCUMENT REQUEST FORM', path: '/docs/requests/form' },
      { id: 'dar_pending', name: 'DAR PENDING APPROVALS', path: '/docs/requests/pending' }
    ]
  },
  { 
    id: 'document_control_masterlist', 
    name: 'MASTER LIST', 
    icon: CheckSquare, 
    category: 'DOCUMENT CONTROL',
    subItems: [
      { id: 'ml_doc_list', name: 'DOCUMENT LIST', path: '/docs/master-list/documents' },
      { id: 'ml_record_list', name: 'RECORD LIST', path: '/docs/master-list/records' },
      { id: 'ml_doc_history', name: 'DOCUMENT HISTORY', path: '/docs/master-list/history' },
      { id: 'ml_ext_docs', name: 'EXTERNAL DOCUMENTS', path: '/docs/master-list/external' }
    ]
  },
  { 
    id: 'document_control_distribution', 
    name: 'DOCUMENT DISTRIBUTION', 
    icon: Network, 
    category: 'DOCUMENT CONTROL',
    subItems: [
      { id: 'dist_pending', name: 'DISTRIBUTION PENDING', path: '/docs/distribution/pending' },
      { id: 'dist_log', name: 'DISTRIBUTION LOG', path: '/docs/distribution/log' }
    ]
  },
  { 
    id: 'document_control_destruction', 
    name: 'RECORD DESTRUCTION', 
    icon: Target, 
    category: 'DOCUMENT CONTROL',
    subItems: [
      { id: 'destruct_pending', name: 'DESTRUCTION PENDING', path: '/docs/destruction/pending' },
      { id: 'destruct_log', name: 'DESTRUCTION LOG', path: '/docs/destruction/log' }
    ]
  },

  // AUDIT CENTER
  { 
    id: 'audit_center_plan', 
    name: 'AUDIT PLAN & SCHEDULE', 
    icon: CalendarDays, 
    category: 'AUDIT CENTER',
    subItems: [
      { id: 'audit_plan_yearly', name: 'AUDIT PLAN (YEARLY)', path: '/audit/plan/yearly' },
      { id: 'audit_schedule', name: 'AUDIT SCHEDULE', path: '/audit/schedule' }
    ]
  },
  { 
    id: 'audit_center_ca', 
    name: 'CA REQUEST', 
    icon: AlertTriangle, 
    category: 'AUDIT CENTER',
    subItems: [
      { id: 'ca_entry', name: 'CA Request Entry', path: '/audit/ca-request/entry' },
      { id: 'car_pending', name: 'CAR PENDING', path: '/audit/ca-request/pending' },
      { id: 'car_log', name: 'CAR LOG', path: '/audit/ca-request/log' }
    ]
  },
  { 
    id: 'audit_center_report', 
    name: 'AUDIT REPORT', 
    icon: PieChart, 
    category: 'AUDIT CENTER',
    subItems: [
      { id: 'team_audit_report', name: 'TEAM AUDIT REPORT', path: '/audit/report/team' },
      { id: 'team_report_log', name: 'TEAM REPORT LOG', path: '/audit/report/team-log' },
      { id: 'summary_ia_report', name: 'SUMMARY IA REPORT', path: '/audit/report/summary-ia' },
      { id: 'summary_report_log', name: 'SUMMARY REPORT LOG', path: '/audit/report/summary-log' },
      { id: '2nd_party_report', name: '2nd PARTY REPORT LOG', path: '/audit/report/2nd-party' },
      { id: '3rd_party_report', name: '3rd PARTY REPORT LOG', path: '/audit/report/3rd-party' }
    ]
  },
  { 
    id: 'audit_center_auditor', 
    name: 'AUDITOR', 
    icon: Users, 
    category: 'AUDIT CENTER',
    subItems: [
      { id: 'qualified_auditors', name: 'Qualified Auditors', path: '/audit/auditor/qualified' },
      { id: 'auditor_log', name: 'Auditor Audit Log', path: '/audit/auditor/log' }
    ]
  },

  // RISK MANAGEMENT CENTER
  { 
    id: 'risk_management_nav', 
    name: 'RISK MANAGEMENT', 
    icon: AlertTriangle, 
    category: 'RISK MANAGEMENT CENTER',
    subItems: [
      { id: 'risk_assessment', name: 'RISK ASSESSMENT', path: '/risk/assessment' },
      { id: 'risk_register', name: 'RISK REGISTER', path: '/risk/register' }
    ]
  },

  // PERFORMANCE & IMPROVEMENT
  { 
    id: 'performance_nav', 
    name: 'PERFORMANCE MGT.', 
    icon: Target, 
    category: 'PERFORMANCE & IMPROVEMENT',
    subItems: [
      { id: 'kpi_tracking', name: 'OBJECTIVES & KPI', path: '/performance/kpi' },
      { id: 'management_review', name: 'MANAGEMENT REVIEW', path: '/performance/management-review' }
    ]
  },

  // ADMINISTRATION
  { 
    id: 'settings', 
    name: 'SETTINGS', 
    icon: Settings, 
    category: 'ADMINISTRATION',
    subItems: [
      { id: 'user_permission', name: 'USER PERMISSION', path: '/permissions' },
      { id: 'system_config', name: 'SYSTEM CONFIG', path: '/settings' }
    ]
  }
];
