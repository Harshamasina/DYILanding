'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    Bell,
    BookOpen,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    ChevronDown,
    CircleDollarSign,
    Clock3,
    Download,
    FileClock,
    FileSearch,
    FileText,
    Folder,
    Globe2,
    Grid2X2,
    History,
    Import,
    LayoutDashboard,
    List,
    Mail,
    MoreVertical,
    Plus,
    Search,
    Settings,
    ShieldCheck,
    SquarePen,
    UploadCloud,
    Users,
    X,
} from 'lucide-react';
import { BrowserMockupChrome } from './BrowserMockupChrome';

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const MOCKUP_HEIGHT = 'h-[540px] sm:h-[640px] lg:h-[720px]';

const T_DASHBOARD = 500;
const T_NOTIFICATIONS = 3000;
const T_NPE_TABLE = 5600;
const T_NPE_SELECT = 7600;
const T_NPE_DROPDOWN = 9300;
const T_NPE_MODAL = 11200;
const T_NPE_UPDATED = 13500;
const T_OFFICE_ACTIONS = 15800;
const T_ANNUITIES = 18100;
const T_AUDIT = 20400;
const T_FADEOUT = 22800;
const T_RESET = 23500;
const T_LOOP = 24100;

type Phase =
    | 'idle'
    | 'dashboard'
    | 'notifications'
    | 'npeTable'
    | 'npeSelect'
    | 'npeDropdown'
    | 'npeModal'
    | 'npeUpdated'
    | 'officeActions'
    | 'annuities'
    | 'audit'
    | 'fadeout';

type NavId =
    | 'dashboard'
    | 'calendar'
    | 'families'
    | 'priorArt'
    | 'lens'
    | 'prv'
    | 'pct'
    | 'npe'
    | 'officeActions'
    | 'annuities'
    | 'costs'
    | 'firms'
    | 'documents'
    | 'import'
    | 'reminders'
    | 'audit'
    | 'map'
    | 'settings';

type StatusTone = 'blue' | 'amber' | 'green' | 'red' | 'slate' | 'purple';

interface NavItem {
    id: NavId;
    label: string;
    section: 'MAIN' | 'IP MANAGEMENT' | 'OPERATIONS' | 'ADMIN';
    icon: ReactNode;
}

interface ActivityRow {
    family: string;
    type: string;
    action: string;
    when: string;
}

interface NotificationItem {
    group: string;
    title: string;
    matter: string;
    due: string;
    score: number;
    tone: 'red' | 'amber' | 'green';
}

interface DeadlineRow {
    type: string;
    score: number;
    title: string;
    matter: string;
    due: string;
    priority?: string;
    tone: 'red' | 'amber' | 'green';
}

interface NpeCaseRow {
    app: string;
    title: string;
    status: string;
    statusTone: StatusTone;
    family: string;
    jurisdiction: string;
    filing: string;
    grant: string;
    grantNumber: string;
    expiry: string;
}

interface OfficeActionRow {
    action: string;
    status: string;
    statusTone: StatusTone;
    grant: string;
    issued: string;
    due: string;
    received: string;
    response: string;
}

interface AnnuityRow {
    grant: string;
    status: string;
    statusTone: StatusTone;
    amount: string;
    due: string;
    paid: string;
    year: string;
    renewal: string;
    grace: string;
}

interface AuditRow {
    timestamp: string;
    actor: string;
    action: string;
    actionTone: StatusTone;
    entity: string;
    changes: string;
    reason: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'dashboard', section: 'MAIN', label: 'Dashboard', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
    { id: 'calendar', section: 'MAIN', label: 'Calendar', icon: <CalendarDays className="h-3.5 w-3.5" /> },
    { id: 'families', section: 'IP MANAGEMENT', label: 'Families', icon: <Folder className="h-3.5 w-3.5" /> },
    { id: 'priorArt', section: 'IP MANAGEMENT', label: 'Prior Art Search', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { id: 'lens', section: 'IP MANAGEMENT', label: 'Lens Search', icon: <FileSearch className="h-3.5 w-3.5" /> },
    { id: 'prv', section: 'IP MANAGEMENT', label: 'PRV', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { id: 'pct', section: 'IP MANAGEMENT', label: 'PCT', icon: <Globe2 className="h-3.5 w-3.5" /> },
    { id: 'npe', section: 'IP MANAGEMENT', label: 'NPE Cases', icon: <FileText className="h-3.5 w-3.5" /> },
    { id: 'officeActions', section: 'IP MANAGEMENT', label: 'Office Actions', icon: <FileClock className="h-3.5 w-3.5" /> },
    { id: 'annuities', section: 'IP MANAGEMENT', label: 'Annuity Fees', icon: <CircleDollarSign className="h-3.5 w-3.5" /> },
    { id: 'costs', section: 'OPERATIONS', label: 'Costs', icon: <CircleDollarSign className="h-3.5 w-3.5" /> },
    { id: 'firms', section: 'OPERATIONS', label: 'Firms', icon: <BriefcaseBusiness className="h-3.5 w-3.5" /> },
    { id: 'documents', section: 'OPERATIONS', label: 'Documents', icon: <FileText className="h-3.5 w-3.5" /> },
    { id: 'import', section: 'OPERATIONS', label: 'Import Portfolio', icon: <Import className="h-3.5 w-3.5" /> },
    { id: 'reminders', section: 'OPERATIONS', label: 'Reminders', icon: <Bell className="h-3.5 w-3.5" /> },
    { id: 'audit', section: 'OPERATIONS', label: 'Audit Log', icon: <History className="h-3.5 w-3.5" /> },
    { id: 'map', section: 'OPERATIONS', label: 'Patent World Map', icon: <Globe2 className="h-3.5 w-3.5" /> },
    { id: 'settings', section: 'ADMIN', label: 'Settings', icon: <Settings className="h-3.5 w-3.5" /> },
];

const ACTIVITY: ActivityRow[] = [
    { family: 'QNTM-SEN-014', type: 'Application Family', action: 'UPDATE', when: 'an hour ago' },
    { family: 'BIOC-CRB-022', type: 'NPE Case', action: 'CREATE', when: '4 hours ago' },
    { family: 'SOLR-GRID-009', type: 'Prior Art Reference', action: 'CREATE', when: 'yesterday' },
    { family: 'MEDX-DEL-031', type: 'PCT Filing', action: 'UPDATE', when: '2 days ago' },
    { family: 'ROBO-VIS-017', type: 'NPE Case', action: 'CREATE', when: '3 days ago' },
    { family: 'AERO-ICE-006', type: 'Application Family', action: 'UPDATE', when: '4 days ago' },
    { family: 'CARB-CAP-011', type: 'NPE Case', action: 'CREATE', when: '5 days ago' },
    { family: 'NANO-MEM-004', type: 'PCT Filing', action: 'CREATE', when: '6 days ago' },
    { family: 'NEUR-STIM-029', type: 'Office Action', action: 'UPDATE', when: '7 days ago' },
    { family: 'THER-ION-018', type: 'Annuity Fee', action: 'CREATE', when: '8 days ago' },
    { family: 'AGRO-IMG-012', type: 'Application Family', action: 'UPDATE', when: '9 days ago' },
    { family: 'MICR-FLUD-033', type: 'NPE Case', action: 'CREATE', when: '10 days ago' },
];

const NOTIFICATIONS: NotificationItem[] = [
    { group: 'Annuity Fees', title: 'Annuity Fee Due - EP 3584421', matter: 'QNTM-SEN-014 · 2026-05-26', due: '1 day late', score: 82, tone: 'red' },
    { group: 'Annuity Fees', title: 'Annuity Fee Due - US 11,204,557', matter: 'MEDX-DEL-031 · 2026-05-27', due: 'due today', score: 70, tone: 'amber' },
    { group: 'Annuity Fees', title: 'Grace period check - GB 2612345', matter: 'THER-ION-018 · 2026-05-30', due: 'in 3 days', score: 62, tone: 'amber' },
    { group: 'Annuity Fees', title: 'Renewal payment - JP 7012345', matter: 'NEUR-STIM-029 · 2026-06-04', due: 'in 8 days', score: 54, tone: 'amber' },
    { group: 'Annuity Fees', title: 'Maintenance window - CN ZL2021..817', matter: 'BIOC-CRB-022 · 2026-07-22', due: 'in 56 days', score: 28, tone: 'green' },
    { group: 'Office Actions', title: 'OA Response Due - 18/452,118', matter: 'SOLR-GRID-009 · 2026-05-26', due: '1 day late', score: 88, tone: 'red' },
    { group: 'Office Actions', title: 'Non-final OA response', matter: 'ROBO-VIS-017 · 2026-05-29', due: 'in 2 days', score: 73, tone: 'amber' },
    { group: 'Office Actions', title: 'Final OA response - JP 2024-187612', matter: 'NEUR-STIM-029 · 2026-06-04', due: 'in 8 days', score: 66, tone: 'amber' },
    { group: 'Office Actions', title: 'Restriction response review', matter: 'NEUR-STIM-029 · 2026-06-01', due: 'in 5 days', score: 57, tone: 'amber' },
    { group: 'Office Actions', title: 'Rule 71(3) approval window', matter: 'AERO-ICE-006 · 2026-06-10', due: 'in 14 days', score: 41, tone: 'green' },
    { group: 'Reminders', title: 'Inventor declaration follow-up', matter: 'BIOC-CRB-022 · 2026-05-31', due: 'in 4 days', score: 43, tone: 'amber' },
    { group: 'Reminders', title: 'Foreign associate filing packet', matter: 'AERO-ICE-006 · 2026-06-03', due: 'in 7 days', score: 34, tone: 'green' },
    { group: 'Reminders', title: 'Client approval for EP validation list', matter: 'AGRO-IMG-012 · 2026-06-07', due: 'in 11 days', score: 31, tone: 'green' },
    { group: 'Reminders', title: 'Outside counsel budget update', matter: 'QNTM-SEN-014 · 2026-06-12', due: 'in 16 days', score: 29, tone: 'green' },
    { group: 'Reminders', title: 'PCT national-phase entry decision', matter: 'NANO-MEM-004 · 2026-06-15', due: 'in 19 days', score: 26, tone: 'green' },
];

const DEADLINES: DeadlineRow[] = [
    { type: 'Annuity Fee', score: 82, title: 'Annuity Fee Due - EP 3584421', matter: 'QNTM-SEN-014 · 2026-05-26', due: '1 day late', tone: 'red' },
    { type: 'Office Action', score: 88, title: 'OA Response Due - 18/452,118', matter: 'SOLR-GRID-009 · 2026-05-26', due: '1 day late', tone: 'red' },
    { type: 'Reminder', score: 49, title: 'Inventor declaration follow-up', matter: 'BIOC-CRB-022 · 2026-05-26', due: '1 day late', priority: 'Medium', tone: 'amber' },
    { type: 'Annuity Fee', score: 70, title: 'Annuity Fee Due - US 11,204,557', matter: 'MEDX-DEL-031 · 2026-05-27', due: 'Due today', tone: 'amber' },
    { type: 'Office Action', score: 73, title: 'OA Response Due - EP 4180092', matter: 'ROBO-VIS-017 · 2026-05-28', due: 'in 1 day', tone: 'amber' },
    { type: 'Office Action', score: 63, title: 'Examiner interview summary due', matter: 'AERO-ICE-006 · 2026-05-30', due: 'in 3 days', tone: 'amber' },
    { type: 'Reminder', score: 38, title: 'Foreign associate filing packet', matter: 'CARB-CAP-011 · 2026-06-03', due: 'in 7 days', priority: 'Low', tone: 'green' },
    { type: 'Annuity Fee', score: 61, title: 'Renewal payment confirmation - JP 7012345', matter: 'NEUR-STIM-029 · 2026-06-04', due: 'in 8 days', tone: 'amber' },
    { type: 'Office Action', score: 58, title: 'Restriction requirement response', matter: 'THER-ION-018 · 2026-06-05', due: 'in 9 days', tone: 'amber' },
    { type: 'Reminder', score: 36, title: 'Client approval for EP validation list', matter: 'AGRO-IMG-012 · 2026-06-07', due: 'in 11 days', priority: 'Low', tone: 'green' },
    { type: 'Annuity Fee', score: 33, title: 'Maintenance fee docket check - CA 3,187,934', matter: 'MICR-FLUD-033 · 2026-06-09', due: 'in 13 days', tone: 'green' },
    { type: 'Reminder', score: 29, title: 'Outside counsel budget update', matter: 'QNTM-SEN-014 · 2026-06-12', due: 'in 16 days', priority: 'Low', tone: 'green' },
];

const NPE_ROWS: NpeCaseRow[] = [
    { app: 'KR10-2023-7038921', title: 'Wireless inductive power transfer coil assembly', status: 'Response Filed', statusTone: 'blue', family: 'QNTM-SEN-014', jurisdiction: 'KR', filing: '2023-10-14', grant: 'Pending', grantNumber: 'Pending', expiry: '2043-10-14 (est.)' },
    { app: '18/035,487', title: 'Stacked thin-film transistor display driver', status: 'Examination Requested', statusTone: 'amber', family: 'ROBO-VIS-017', jurisdiction: 'US', filing: '2024-02-18', grant: 'Pending', grantNumber: 'Pending', expiry: '2044-02-18 (est.)' },
    { app: 'EP22735921.8', title: 'Predictive arc-fault detection circuit', status: 'Examination Requested', statusTone: 'amber', family: 'SOLR-GRID-009', jurisdiction: 'EP', filing: '2023-11-30', grant: 'Pending', grantNumber: 'Pending', expiry: '2043-11-30 (est.)' },
    { app: '202217028154', title: 'Adaptive protective relay coordination system', status: 'Granted', statusTone: 'green', family: 'AERO-ICE-006', jurisdiction: 'IN', filing: '2022-05-18', grant: '2025-03-21', grantNumber: 'IN 498,273', expiry: '2040-11-18' },
    { app: 'EP20904125.7', title: 'Adaptive protective relay coordination system', status: 'Granted', statusTone: 'green', family: 'AERO-ICE-006', jurisdiction: 'EP', filing: '2022-05-18', grant: '2024-11-12', grantNumber: 'EP 3 987 654 B1', expiry: '2040-11-18' },
    { app: 'AU2022348712', title: 'Context-aware retrieval augmented generation', status: 'Filed', statusTone: 'blue', family: 'MEDX-DEL-031', jurisdiction: 'AU', filing: '2024-05-01', grant: 'Pending', grantNumber: 'Pending', expiry: '2044-05-01 (est.)' },
    { app: 'KR10-2025-7024891', title: 'Adaptive token compression for long-context models', status: 'Filed', statusTone: 'blue', family: 'NANO-MEM-004', jurisdiction: 'KR', filing: '2025-08-06', grant: 'Pending', grantNumber: 'Pending', expiry: '2045-08-06 (est.)' },
    { app: 'CA3,187,934', title: 'Predictive arc-fault detection circuit', status: 'Filed', statusTone: 'blue', family: 'SOLR-GRID-009', jurisdiction: 'CA', filing: '2023-12-01', grant: 'Pending', grantNumber: 'Pending', expiry: '2043-12-01 (est.)' },
    { app: 'CN202180069817.8', title: 'Low-power CMOS biosensor front end', status: 'Granted', statusTone: 'green', family: 'BIOC-CRB-022', jurisdiction: 'CN', filing: '2023-04-12', grant: '2025-07-22', grantNumber: 'ZL 2021 8 0069817.8', expiry: '2041-10-13' },
    { app: 'JP2024-187612', title: 'Closed-loop neuromodulation pulse programmer', status: 'Filed', statusTone: 'blue', family: 'NEUR-STIM-029', jurisdiction: 'JP', filing: '2024-08-19', grant: 'Pending', grantNumber: 'Pending', expiry: '2044-08-19 (est.)' },
    { app: 'GB2418920.4', title: 'Ion-exchange thermal storage module', status: 'Examination Requested', statusTone: 'amber', family: 'THER-ION-018', jurisdiction: 'GB', filing: '2024-10-03', grant: 'Pending', grantNumber: 'Pending', expiry: '2044-10-03 (est.)' },
    { app: 'MX/a/2025/004812', title: 'Multispectral crop stress image classifier', status: 'Filed', statusTone: 'blue', family: 'AGRO-IMG-012', jurisdiction: 'MX', filing: '2025-03-14', grant: 'Pending', grantNumber: 'Pending', expiry: '2045-03-14 (est.)' },
    { app: 'BR112025018421', title: 'Microfluidic reagent metering cartridge', status: 'Filed', statusTone: 'blue', family: 'MICR-FLUD-033', jurisdiction: 'BR', filing: '2025-04-22', grant: 'Pending', grantNumber: 'Pending', expiry: '2045-04-22 (est.)' },
    { app: 'IN202541028733', title: 'Battery health estimation using acoustic signatures', status: 'Granted', statusTone: 'green', family: 'QNTM-SEN-014', jurisdiction: 'IN', filing: '2023-06-10', grant: '2026-02-05', grantNumber: 'IN 512,044', expiry: '2043-06-10' },
];

const OFFICE_ACTIONS: OfficeActionRow[] = [
    { action: 'Advisory Action', status: 'Open', statusTone: 'blue', grant: 'CN2026756757', issued: '2026-04-11', due: '2026-06-30', received: '2026-04-30', response: 'Awaiting' },
    { action: 'Notice of Allowance', status: 'Open', statusTone: 'blue', grant: 'US202621323', issued: '2026-03-05', due: '2026-06-12', received: '2026-05-22', response: 'Awaiting' },
    { action: 'Examiner Interview Summary', status: 'Open', statusTone: 'blue', grant: 'IN20234535332', issued: '2026-01-08', due: '2026-03-25', received: '2026-01-22', response: 'Awaiting' },
    { action: 'Extended European Search Report', status: 'Open', statusTone: 'blue', grant: 'EP4180092', issued: '2026-03-04', due: '2026-05-28', received: '2026-03-07', response: 'Awaiting' },
    { action: 'Preliminary Rejection', status: 'Responded', statusTone: 'green', grant: 'KR10-2024-7019003', issued: '2025-11-04', due: '2026-01-03', received: '2025-11-07', response: '2025-12-31' },
    { action: 'Non-Final Office Action', status: 'Open', statusTone: 'blue', grant: 'US 18/452,118', issued: '2026-03-09', due: '2026-06-09', received: '2026-03-11', response: 'Awaiting' },
    { action: 'Post-Grant Opposition Notice', status: 'Closed', statusTone: 'green', grant: 'AU3000604', issued: '2026-02-20', due: '2026-06-22', received: '2026-02-23', response: '2026-05-19' },
    { action: 'Restriction Requirement', status: 'Open', statusTone: 'blue', grant: 'US18/035487', issued: '2026-04-18', due: '2026-07-18', received: '2026-04-19', response: 'Awaiting' },
    { action: 'Written Opinion', status: 'Open', statusTone: 'blue', grant: 'PCT/US2025/018734', issued: '2026-04-02', due: '2026-07-02', received: '2026-04-06', response: 'Awaiting' },
    { action: 'Unity Objection', status: 'Responded', statusTone: 'green', grant: 'EP22735921.8', issued: '2026-01-24', due: '2026-04-24', received: '2026-01-27', response: '2026-04-20' },
    { action: 'Notice to File Corrected Papers', status: 'Open', statusTone: 'blue', grant: 'CA3187934', issued: '2026-05-03', due: '2026-06-03', received: '2026-05-04', response: 'Awaiting' },
    { action: 'Final Office Action', status: 'Open', statusTone: 'blue', grant: 'JP2024-187612', issued: '2026-04-26', due: '2026-07-26', received: '2026-04-29', response: 'Awaiting' },
    { action: 'Communication Under Rule 71(3)', status: 'Closed', statusTone: 'green', grant: 'EP3987654B1', issued: '2025-10-18', due: '2026-02-18', received: '2025-10-21', response: '2026-02-10' },
];

const ANNUITIES: AnnuityRow[] = [
    { grant: 'EP42364234', status: 'Due', statusTone: 'amber', amount: 'EUR 1,500.00', due: '2026-06-26', paid: 'Awaiting', year: '2', renewal: '2', grace: '2026-12-26' },
    { grant: 'US202621323', status: 'Paid', statusTone: 'green', amount: 'USD 2,000.00', due: '2026-04-11', paid: '2026-05-22', year: '1', renewal: '1', grace: '2026-06-12' },
    { grant: 'JP7012345B2', status: 'Due', statusTone: 'amber', amount: 'JPY 22,400.00', due: '2026-05-28', paid: 'Awaiting', year: '2', renewal: '2', grace: '2026-08-26' },
    { grant: 'AU300604', status: 'Due', statusTone: 'amber', amount: 'AUD 450.00', due: '2026-06-25', paid: 'Awaiting', year: '2', renewal: '2', grace: '2026-09-23' },
    { grant: 'EP3000101', status: 'Paid', statusTone: 'green', amount: 'EUR 1,240.00', due: '2025-10-05', paid: '2025-10-02', year: '2', renewal: '2', grace: '2026-01-03' },
    { grant: 'GB2612345B', status: 'Due', statusTone: 'amber', amount: 'GBP 380.00', due: '2026-05-16', paid: 'Awaiting', year: '2', renewal: '2', grace: '2026-08-14' },
    { grant: 'US12097284B2', status: 'Paid', statusTone: 'green', amount: 'USD 1,600.00', due: '2025-09-25', paid: '2025-09-22', year: '2', renewal: '2', grace: '2025-12-24' },
    { grant: 'EP3987654B1', status: 'Due', statusTone: 'amber', amount: 'EUR 1,705.00', due: '2026-06-18', paid: 'Awaiting', year: '3', renewal: '3', grace: '2026-12-18' },
    { grant: 'IN498273', status: 'Paid', statusTone: 'green', amount: 'INR 42,000.00', due: '2026-03-21', paid: '2026-03-18', year: '4', renewal: '4', grace: '2026-09-21' },
    { grant: 'CN202180069817.8', status: 'Due', statusTone: 'amber', amount: 'CNY 1,200.00', due: '2026-07-22', paid: 'Awaiting', year: '5', renewal: '5', grace: '2027-01-22' },
    { grant: 'KR102718920B1', status: 'Due', statusTone: 'amber', amount: 'KRW 420,000.00', due: '2026-06-02', paid: 'Awaiting', year: '3', renewal: '3', grace: '2026-12-02' },
    { grant: 'CA3187934', status: 'Paid', statusTone: 'green', amount: 'CAD 510.00', due: '2026-02-01', paid: '2026-01-28', year: '2', renewal: '2', grace: '2026-08-01' },
    { grant: 'MX401772B', status: 'Due', statusTone: 'amber', amount: 'MXN 8,900.00', due: '2026-07-14', paid: 'Awaiting', year: '2', renewal: '2', grace: '2027-01-14' },
];

const AUDIT_ROWS: AuditRow[] = [
    { timestamp: '2026-05-27 14:12', actor: 'Maya Rao', action: 'Update', actionTone: 'blue', entity: 'NPE Case: 18/035,487', changes: 'Changed: Status', reason: 'Updating from Examination Requested to OA Pending after EPO search report review.' },
    { timestamp: '2026-05-27 14:12', actor: 'Maya Rao', action: 'Update', actionTone: 'blue', entity: 'NPE Case: EP22735921.8', changes: 'Changed: Status', reason: 'Updating from Examination Requested to OA Pending after EPO search report review.' },
    { timestamp: '2026-05-27 12:45', actor: 'Ethan Caldwell', action: 'Create', actionTone: 'green', entity: 'Reminder: Foreign associate filing packet', changes: 'Created reminder', reason: 'Packet requested by outside counsel.' },
    { timestamp: '2026-05-27 10:20', actor: 'Priya Menon', action: 'Search', actionTone: 'slate', entity: 'Prior Art Search: solar inverter safety', changes: 'Changed: query, provider, result count', reason: 'Routine prior-art sweep for the solar inverter portfolio.' },
    { timestamp: '2026-05-26 18:04', actor: 'Avery Brooks', action: 'Update', actionTone: 'blue', entity: 'Annuity Fee: JP7012345B2', changes: 'Changed: amount, grace period', reason: 'Corrected fee after local-agent estimate.' },
    { timestamp: '2026-05-26 15:16', actor: 'Maya Rao', action: 'Export', actionTone: 'purple', entity: 'Deadline report', changes: 'Exported CSV', reason: 'Weekly client status meeting.' },
    { timestamp: '2026-05-26 11:38', actor: 'Noah Kim', action: 'Update', actionTone: 'blue', entity: 'Office Action: Restriction Requirement', changes: 'Changed: due date, assignee', reason: 'Updated after docketing confirmation from U.S. counsel.' },
    { timestamp: '2026-05-25 16:09', actor: 'Priya Menon', action: 'Create', actionTone: 'green', entity: 'NPE Case: JP2024-187612', changes: 'Created case record', reason: 'National phase entry imported from foreign associate packet.' },
    { timestamp: '2026-05-25 13:57', actor: 'Ethan Caldwell', action: 'Update', actionTone: 'blue', entity: 'Application Family: THER-ION-018', changes: 'Changed: lead attorney, client matter', reason: 'Ownership transferred to energy storage prosecution team.' },
    { timestamp: '2026-05-24 09:31', actor: 'Maya Rao', action: 'Create', actionTone: 'green', entity: 'Annuity Fee: MX401772B', changes: 'Created fee record', reason: 'Renewal estimate received from Mexico local agent.' },
    { timestamp: '2026-05-23 17:42', actor: 'Avery Brooks', action: 'Update', actionTone: 'blue', entity: 'Reminder: Client approval', changes: 'Changed: due date', reason: 'Client requested review after board meeting.' },
    { timestamp: '2026-05-23 12:05', actor: 'Noah Kim', action: 'Export', actionTone: 'purple', entity: 'NPE case table', changes: 'Exported DOCX', reason: 'Portfolio status packet for quarterly counsel review.' },
];

const STATUS_OPTIONS = ['Filed', 'Examination Requested', 'OA Pending', 'Response Filed', 'Allowed', 'Granted'];

const STATUS_TONES: Record<StatusTone, string> = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-50 text-red-600',
    slate: 'bg-slate-100 text-slate-600',
    purple: 'bg-indigo-50 text-indigo-600',
};

const SCORE_TONES = {
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
};

export function AnimatedDocketingWorkflow() {
    const [phase, setPhase] = useState<Phase>('idle');

    const runCycle = useCallback(() => {
        setPhase('idle');
        const timers: ReturnType<typeof setTimeout>[] = [];
        timers.push(setTimeout(() => setPhase('dashboard'), T_DASHBOARD));
        timers.push(setTimeout(() => setPhase('notifications'), T_NOTIFICATIONS));
        timers.push(setTimeout(() => setPhase('npeTable'), T_NPE_TABLE));
        timers.push(setTimeout(() => setPhase('npeSelect'), T_NPE_SELECT));
        timers.push(setTimeout(() => setPhase('npeDropdown'), T_NPE_DROPDOWN));
        timers.push(setTimeout(() => setPhase('npeModal'), T_NPE_MODAL));
        timers.push(setTimeout(() => setPhase('npeUpdated'), T_NPE_UPDATED));
        timers.push(setTimeout(() => setPhase('officeActions'), T_OFFICE_ACTIONS));
        timers.push(setTimeout(() => setPhase('annuities'), T_ANNUITIES));
        timers.push(setTimeout(() => setPhase('audit'), T_AUDIT));
        timers.push(setTimeout(() => setPhase('fadeout'), T_FADEOUT));
        timers.push(setTimeout(() => setPhase('idle'), T_RESET));
        return timers;
    }, []);

    useEffect(() => {
        let timers = runCycle();
        const interval = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, T_LOOP);

        return () => {
            timers.forEach(clearTimeout);
            clearInterval(interval);
        };
    }, [runCycle]);

    const activeNav = getActiveNav(phase);
    const visible = phase !== 'idle' && phase !== 'fadeout';
    const browserUrl = getDocketingWorkflowBrowserUrl(phase);

    return (
        <div
            aria-hidden="true"
            role="img"
            className={`relative flex flex-col overflow-hidden rounded-xl border border-card-border bg-[#f8f8fa] shadow-2xl shadow-black/10 select-none ${MOCKUP_HEIGHT}`}
        >
            <BrowserMockupChrome url={browserUrl} />
            <motion.div
                className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden sm:grid-cols-[170px_minmax(0,1fr)] lg:grid-cols-[190px_minmax(0,1fr)]"
                initial={false}
                animate={{ opacity: visible ? 1 : 0.18 }}
                transition={{ duration: 0.3, ease: EASE }}
            >
                <DocketSidebar activeNav={activeNav} />
                <div className="flex min-w-0 flex-col overflow-hidden">
                    <TopBar phase={phase} />
                    <main className="min-h-0 flex-1 overflow-hidden bg-[#f4f5f7] p-2 sm:p-3 lg:p-4" style={{ fontFamily: 'var(--font-dashboard)' }}>
                        <AnimatePresence mode="wait">
                            {phase === 'dashboard' && <DashboardFrame key="dashboard" />}
                            {phase === 'notifications' && <NotificationsFrame key="notifications" />}
                            {['npeTable', 'npeSelect', 'npeDropdown', 'npeModal', 'npeUpdated'].includes(phase) && (
                                <NpeFrame key="npe" phase={phase} />
                            )}
                            {phase === 'officeActions' && <OfficeActionsFrame key="oa" />}
                            {phase === 'annuities' && <AnnuityFrame key="annuity" />}
                            {phase === 'audit' && <AuditFrame key="audit" />}
                        </AnimatePresence>
                    </main>
                </div>
            </motion.div>

            <AnimatePresence>
                {(phase === 'npeSelect' || phase === 'npeDropdown') && (
                    <BulkStatusBar dropdown={phase === 'npeDropdown'} shell />
                )}
            </AnimatePresence>
            <AnimatePresence>{phase === 'npeModal' && <ReasonModal />}</AnimatePresence>
        </div>
    );
}

function getDocketingWorkflowBrowserUrl(phase: Phase) {
    if (phase === 'dashboard') return 'app.designyourinvention.com/docketing/dashboard';
    if (phase === 'notifications') return 'app.designyourinvention.com/docketing/deadlines';
    if (phase === 'npeSelect' || phase === 'npeDropdown') return 'app.designyourinvention.com/docketing/npe-cases/bulk-status';
    if (phase === 'npeModal') return 'app.designyourinvention.com/docketing/npe-cases/change-status';
    if (phase === 'npeUpdated') return 'app.designyourinvention.com/docketing/npe-cases?status=updated';
    if (phase === 'npeTable') return 'app.designyourinvention.com/docketing/npe-cases';
    if (phase === 'officeActions') return 'app.designyourinvention.com/docketing/office-actions';
    if (phase === 'annuities') return 'app.designyourinvention.com/docketing/annuity-fees';
    if (phase === 'audit') return 'app.designyourinvention.com/docketing/audit-log';
    return 'app.designyourinvention.com/docketing';
}

function getActiveNav(phase: Phase): NavId {
    if (phase === 'notifications') return 'calendar';
    if (['npeTable', 'npeSelect', 'npeDropdown', 'npeModal', 'npeUpdated'].includes(phase)) return 'npe';
    if (phase === 'officeActions') return 'officeActions';
    if (phase === 'annuities') return 'annuities';
    if (phase === 'audit') return 'audit';
    return 'dashboard';
}

function DocketSidebar({ activeNav }: { activeNav: NavId }) {
    const sections = useMemo(() => {
        const grouped = new Map<NavItem['section'], NavItem[]>();
        NAV_ITEMS.forEach((item) => {
            grouped.set(item.section, [...(grouped.get(item.section) ?? []), item]);
        });
        return Array.from(grouped.entries());
    }, []);

    return (
        <aside className="hidden min-w-0 flex-col border-r border-card-border bg-white sm:flex" style={{ fontFamily: 'var(--font-dashboard)' }}>
            <div className="flex h-14 shrink-0 items-center gap-2 border-b border-card-border px-2 sm:h-16 sm:px-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
                    <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-[12px] font-bold text-text-primary">Northstar IP</p>
                    <p className="text-[9px] text-primary">Portfolio Management</p>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden px-1 py-2 sm:px-2">
                {sections.map(([section, items]) => (
                    <div key={section} className="mb-3">
                        <p className="mb-1 hidden px-2 text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:block">{section}</p>
                        <div className="space-y-0.5">
                            {items.map((item) => {
                                const active = activeNav === item.id;
                                return (
                                    <motion.div
                                        key={item.id}
                                        className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-[11px] font-semibold transition-colors sm:justify-start ${
                                            active ? 'bg-primary/10 text-primary' : 'text-slate-600'
                                        }`}
                                        animate={active ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                                        transition={{ duration: 0.35, ease: EASE }}
                                    >
                                        <span className={active ? 'text-primary' : 'text-slate-500'}>{item.icon}</span>
                                        <span className="hidden truncate sm:inline">{item.label}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden shrink-0 border-t border-card-border p-3 sm:block">
                <p className="truncate text-[11px] font-bold text-text-primary">Maya Rao</p>
                <p className="truncate text-[9px] text-slate-500">Docketing Manager</p>
            </div>
        </aside>
    );
}

function TopBar({ phase }: { phase: Phase }) {
    const iconPulse = phase === 'notifications';
    const mobileTitle =
        ['npeTable', 'npeSelect', 'npeDropdown', 'npeModal', 'npeUpdated'].includes(phase)
            ? 'NPE Cases'
            : phase === 'officeActions'
              ? 'Office Actions'
              : phase === 'annuities'
                ? 'Annuity Fees'
                : phase === 'audit'
                  ? 'Audit Log'
                  : phase === 'notifications'
                    ? 'Deadline Center'
                    : 'Dashboard';

    return (
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-card-border bg-white px-2 sm:px-4" style={{ fontFamily: 'var(--font-dashboard)' }}>
            <div className="flex min-w-0 flex-1 items-center">
                <div className="flex min-w-0 items-center gap-2 sm:hidden">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/20">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[12px] font-bold text-text-primary">{mobileTitle}</p>
                        <p className="truncate text-[9px] text-primary">Northstar IP</p>
                    </div>
                </div>
                <div className="hidden h-9 w-full max-w-[420px] items-center gap-2 rounded-lg border border-card-border bg-white px-3 text-[11px] text-slate-400 sm:flex">
                    <Search className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate">Search families, PRV, PCT, NPE, UUID</span>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                <span className="hidden rounded-full border border-card-border px-3 py-1.5 text-[11px] text-slate-600 sm:inline-flex">2026-05-27</span>
                <Globe2 className="hidden h-4 w-4 text-slate-500 md:block" />
                <CalendarDays className="hidden h-4 w-4 text-slate-500 md:block" />
                <motion.span
                    className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-primary"
                    animate={iconPulse ? { boxShadow: ['0 0 0 0 rgba(79,70,229,0)', '0 0 0 5px rgba(79,70,229,0.14)', '0 0 0 0 rgba(79,70,229,0)'] } : {}}
                    transition={{ duration: 1, repeat: iconPulse ? Infinity : 0 }}
                >
                    <Bell className="h-4 w-4" />
                    <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1 text-[8px] font-bold text-white">91</span>
                </motion.span>
                <div className="hidden items-center gap-2 sm:flex">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-text-primary">Maya Rao</p>
                        <p className="text-[9px] text-primary">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

function DashboardFrame() {
    return (
        <FrameShell>
            <div className="flex h-full flex-col overflow-hidden">
                <ActionStrip />
                <div className="mt-3 grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-[minmax(0,1fr)]">
                    <div className="flex min-w-0 flex-col overflow-hidden">
                        <div className="grid shrink-0 grid-cols-2 gap-2 lg:grid-cols-4">
                        <KpiCard label="Total Families" value="48" sub="As of 2026-05-27" icon={<Folder className="h-4 w-4" />} tone="purple" />
                        <KpiCard label="Pending Deadlines" value="186" sub="Next 30 days" icon={<CalendarDays className="h-4 w-4" />} tone="amber" />
                        <KpiCard label="Overdue Items" value="11" sub="Requires attention" icon={<AlertTriangle className="h-4 w-4" />} tone="red" />
                        <KpiCard label="Fees Due" value="72" sub="Current cycle" icon={<CircleDollarSign className="h-4 w-4" />} tone="amber" />
                    </div>
                        <div className="mt-3 grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)] lg:grid-rows-[minmax(0,1fr)]">
                            <Panel title="Recent Family Activity" action="View all families" className="min-h-0" bodyClassName="min-h-0 flex-1 p-3">
                                <div className="h-full overflow-hidden">
                                {ACTIVITY.map((row, index) => (
                                    <motion.div
                                        key={row.family}
                                            className="grid grid-cols-[92px_minmax(0,1fr)_62px] items-center gap-2 border-b border-card-border/60 py-1.5 text-[10px] last:border-b-0"
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.22, delay: index * 0.04, ease: EASE }}
                                    >
                                        <span className="font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>{row.family}</span>
                                        <span className="truncate">
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">{row.type}</span>
                                            <span className={`ml-1.5 rounded px-1.5 py-0.5 ${row.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>{row.action}</span>
                                        </span>
                                        <span className="truncate text-right text-slate-500">{row.when}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </Panel>
                            <Panel title="Active NPE Cases by Country" className="hidden min-h-0 lg:flex" bodyClassName="flex min-h-0 flex-1 flex-col justify-center p-3">
                                <DonutChart />
                        </Panel>
                    </div>
                </div>
                    <NotificationsPanel compact={false} />
                </div>
            </div>
        </FrameShell>
    );
}

function NotificationsFrame() {
    const overdue = DEADLINES.slice(0, 3);
    const today = DEADLINES.slice(3, 4);
    const week = DEADLINES.slice(4);

    return (
        <FrameShell>
            <FilterBar action="Custom Reminder" />
            <DeadlineBucket title="Overdue" count={overdue.length} accent="#dc2626" rows={overdue} />
            <DeadlineBucket title="Today" count={today.length} accent="#6366f1" rows={today} />
            <DeadlineBucket title="This Week" count={week.length} accent="#d97706" rows={week} />
        </FrameShell>
    );
}

function NpeFrame({ phase }: { phase: Phase }) {
    const selected = phase === 'npeSelect' || phase === 'npeDropdown' || phase === 'npeModal';
    const updated = phase === 'npeUpdated';

    return (
        <FrameShell>
            <NpeFilterBar />
            <DataTable
                selectable
                columns={['Application Number', 'Title', 'Status', 'Family Ref', 'Jurisdiction', 'Filing Date', 'Grant Date', 'Grant Number', 'Patent Expiry', 'Actions']}
            >
                {NPE_ROWS.map((row, index) => {
                    const isTarget = index === 1 || index === 2;
                    const status = updated && isTarget ? 'OA Pending' : row.status;
                    const tone = updated && isTarget ? 'amber' : row.statusTone;
                    return (
                        <motion.tr
                            key={row.app}
                            className={`border-b border-card-border/60 text-[10px] ${selected && isTarget ? 'bg-indigo-50' : ''} ${updated && isTarget ? 'bg-amber-50/80' : ''}`}
                            initial={isTarget && (selected || updated) ? { backgroundColor: 'rgba(79,70,229,0.04)' } : false}
                            animate={isTarget && selected ? { backgroundColor: 'rgba(79,70,229,0.1)' } : isTarget && updated ? { backgroundColor: 'rgba(254,243,199,0.8)' } : undefined}
                            transition={{ duration: 0.25, ease: EASE }}
                        >
                            <td className="px-2 py-2"><Checkbox checked={selected && isTarget} /></td>
                            <td className="px-2 py-2 font-medium text-text-primary">{row.app}</td>
                            <td className="max-w-[130px] truncate px-2 py-2 sm:max-w-[220px]">{row.title}</td>
                            <td className="px-2 py-2"><StatusPill tone={tone}>{status}</StatusPill></td>
                            <td className="hidden px-2 py-2 sm:table-cell">{row.family}</td>
                            <td className="hidden px-2 py-2 lg:table-cell">{row.jurisdiction}</td>
                            <td className="hidden px-2 py-2 lg:table-cell">{row.filing}</td>
                            <td className="hidden px-2 py-2 xl:table-cell">{row.grant}</td>
                            <td className="hidden px-2 py-2 xl:table-cell">{row.grantNumber}</td>
                            <td className="hidden px-2 py-2 xl:table-cell">{row.expiry}</td>
                            <td className="hidden px-2 py-2 xl:table-cell"><ViewButton /></td>
                        </motion.tr>
                    );
                })}
            </DataTable>
        </FrameShell>
    );
}

function OfficeActionsFrame() {
    return (
        <FrameShell>
            <TableSearchBar placeholder="Search office actions by action type, grant number, or notes" />
            <DataTable columns={['Action Type', 'Status', 'NPE Grant #', 'Issued Date', 'Due Date', 'Received Date', 'Response Filed', 'Created', 'Actions']}>
                {OFFICE_ACTIONS.map((row) => (
                    <tr key={row.action + row.grant} className="border-b border-card-border/60 text-[10px]">
                        <td className="px-2 py-2 font-medium text-text-primary">{row.action}</td>
                        <td className="px-2 py-2"><StatusPill tone={row.statusTone}>{row.status}</StatusPill></td>
                        <td className="px-2 py-2">{row.grant}</td>
                        <td className="hidden px-2 py-2 sm:table-cell">{row.issued}</td>
                        <td className="hidden px-2 py-2 lg:table-cell">{row.due}</td>
                        <td className="hidden px-2 py-2 lg:table-cell">{row.received}</td>
                        <td className="hidden px-2 py-2 xl:table-cell">{row.response}</td>
                        <td className="hidden px-2 py-2 xl:table-cell">2026-03-21</td>
                        <td className="hidden px-2 py-2 xl:table-cell"><ViewButton /></td>
                    </tr>
                ))}
            </DataTable>
        </FrameShell>
    );
}

function AnnuityFrame() {
    return (
        <FrameShell>
            <DataTable columns={['NPE Grant #', 'Status', 'Amount', 'Due Date', 'Paid Date', 'Fee Year', 'Renewal Year', 'Grace Period End', 'Actions']}>
                {ANNUITIES.map((row) => (
                    <tr key={row.grant + row.due} className="border-b border-card-border/60 text-[10px]">
                        <td className="px-2 py-2 font-medium text-text-primary">{row.grant}</td>
                        <td className="px-2 py-2"><StatusPill tone={row.statusTone}>{row.status}</StatusPill></td>
                        <td className="px-2 py-2">{row.amount}</td>
                        <td className="hidden px-2 py-2 sm:table-cell">{row.due}</td>
                        <td className="hidden px-2 py-2 lg:table-cell">{row.paid}</td>
                        <td className="hidden px-2 py-2 lg:table-cell">{row.year}</td>
                        <td className="hidden px-2 py-2 lg:table-cell">{row.renewal}</td>
                        <td className="hidden px-2 py-2 xl:table-cell">{row.grace}</td>
                        <td className="hidden px-2 py-2 xl:table-cell"><ViewButton /></td>
                    </tr>
                ))}
            </DataTable>
        </FrameShell>
    );
}

function AuditFrame() {
    return (
        <FrameShell>
            <AuditFilters />
            <DataTable columns={['Timestamp', 'Actor', 'Action', 'Entity', 'Changes', 'Reason']}>
                {AUDIT_ROWS.map((row, index) => (
                    <motion.tr
                        key={row.timestamp + row.entity}
                        className={`border-b border-card-border/60 text-[10px] ${index < 2 ? 'bg-indigo-50' : ''}`}
                        initial={index < 2 ? { backgroundColor: 'rgba(79,70,229,0.04)' } : false}
                        animate={index < 2 ? { backgroundColor: 'rgba(79,70,229,0.1)' } : undefined}
                        transition={{ duration: 0.25, ease: EASE }}
                    >
                        <td className="px-2 py-3">{row.timestamp}</td>
                        <td className="px-2 py-3">{row.actor}</td>
                        <td className="px-2 py-3"><StatusPill tone={row.actionTone}>{row.action}</StatusPill></td>
                        <td className="hidden max-w-[180px] px-2 py-3 sm:table-cell">{row.entity}</td>
                        <td className="hidden px-2 py-3 lg:table-cell">{row.changes}</td>
                        <td className="hidden max-w-[300px] px-2 py-3 lg:table-cell">{row.reason}</td>
                    </motion.tr>
                ))}
            </DataTable>
        </FrameShell>
    );
}

function FrameShell({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="relative flex h-full flex-col overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

function ActionStrip() {
    const actions = ['Add Family', 'File PRV', 'File PCT', 'File NPE', 'Upload Document', 'Import Portfolio', 'Fee Schedule', 'Manage Members'];
    return (
        <div className="flex shrink-0 gap-2 overflow-hidden py-1">
            {actions.map((action, index) => (
                <motion.button
                    key={action}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/25 bg-white px-3 py-1.5 text-[10px] font-semibold text-primary"
                    animate={index === 3 ? { boxShadow: ['0 0 0 0 rgba(79,70,229,0)', '0 0 0 4px rgba(79,70,229,0.12)', '0 0 0 0 rgba(79,70,229,0)'] } : {}}
                    transition={{ duration: 1.2, repeat: index === 3 ? Infinity : 0 }}
                >
                    {index === 4 ? <UploadCloud className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    {action}
                </motion.button>
            ))}
        </div>
    );
}

function KpiCard({ label, value, sub, icon, tone }: { label: string; value: string; sub: string; icon: ReactNode; tone: 'purple' | 'amber' | 'red' }) {
    const toneClass = tone === 'red' ? 'border-red-200 text-red-600 bg-red-50' : tone === 'amber' ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-indigo-200 text-primary bg-indigo-50';
    return (
        <div className="rounded-lg border border-card-border bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-500">{label}</p>
                <span className={`rounded-lg border p-2 ${toneClass}`}>{icon}</span>
            </div>
            <p className="mt-4 text-[24px] font-bold text-text-primary">{value}</p>
            <p className="mt-2 text-[10px] text-slate-500">{sub}</p>
        </div>
    );
}

function Panel({
    title,
    action,
    children,
    className = '',
    bodyClassName = 'p-3',
}: {
    title: string;
    action?: string;
    children: ReactNode;
    className?: string;
    bodyClassName?: string;
}) {
    return (
        <section className={`flex flex-col overflow-hidden rounded-lg border border-card-border bg-white shadow-sm ${className}`}>
            <div className="flex items-center justify-between border-b border-card-border px-3 py-3">
                <h3 className="text-[12px] font-bold text-text-primary">{title}</h3>
                {action && <span className="text-[10px] font-semibold text-primary">{action}</span>}
            </div>
            <div className={bodyClassName}>{children}</div>
        </section>
    );
}

const NPE_BY_COUNTRY: { country: string; value: number; color: string }[] = [
    { country: 'US', value: 35, color: '#4338ca' },
    { country: 'EP', value: 35, color: '#4f46e5' },
    { country: 'JP', value: 22, color: '#6366f1' },
    { country: 'KR', value: 16, color: '#818cf8' },
    { country: 'AU', value: 11, color: '#a5b4fc' },
    { country: 'CN', value: 10, color: '#c7d2fe' },
    { country: 'IN', value: 9, color: '#ddd6fe' },
];

function DonutChart() {
    const size = 160;
    const sw = 30;
    const r = (size - sw) / 2;
    const circ = 2 * Math.PI * r;
    const total = NPE_BY_COUNTRY.reduce((sum, item) => sum + item.value, 0);

    /* Pre-compute cumulative start percentages for each segment */
    const segments: Array<{ country: string; value: number; color: string; startPct: number; midPct: number }> = [];
    let cumPct = 0;
    for (const seg of NPE_BY_COUNTRY) {
        const pct = (seg.value / total) * 100;
        segments.push({ ...seg, startPct: cumPct, midPct: cumPct + pct / 2 });
        cumPct += pct;
    }

    return (
        <div className="flex h-full w-full flex-col items-center">
            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
            <div className="relative h-32 w-32 sm:h-36 sm:w-36">
                <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
                    {/* Donut arcs - rotated so arcs start from 12 o'clock */}
                    <g transform={`rotate(-90, ${size / 2}, ${size / 2})`}>
                        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2ff" strokeWidth={sw} />
                        {segments.map((seg, i) => {
                            const pct = (seg.value / total) * 100;
                            const len = (pct / 100) * circ;
                            const off = -(seg.startPct / 100) * circ;
                            return (
                                <motion.circle
                                    key={seg.country}
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={r}
                                    fill="none"
                                    stroke={seg.color}
                                    strokeWidth={sw}
                                    strokeDasharray={`${len} ${circ - len}`}
                                    strokeDashoffset={off}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: EASE }}
                                />
                            );
                        })}
                    </g>
                    {/* On-segment labels - outside the rotated group so text stays upright */}
                    {segments.map((seg) => {
                        const angle = (seg.midPct / 100) * 2 * Math.PI - Math.PI / 2;
                        const lx = Math.round((size / 2 + r * Math.cos(angle)) * 100) / 100;
                        const ly = Math.round((size / 2 + r * Math.sin(angle)) * 100) / 100;
                        return (
                            <text
                                key={`lbl-${seg.country}`}
                                x={lx}
                                y={ly}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill="white"
                                fontSize="7"
                                fontWeight="bold"
                                style={{ fontFamily: 'var(--font-dashboard-mono)', pointerEvents: 'none' }}
                            >
                                {seg.country}: {seg.value}
                            </text>
                        );
                    })}
                </svg>
            </div>
            </div>
            <div className="mt-2 flex shrink-0 flex-wrap justify-center gap-x-3 gap-y-1">
                {NPE_BY_COUNTRY.map((item) => (
                    <span key={item.country} className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-600">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.country}
                    </span>
                ))}
            </div>
        </div>
    );
}

function NotificationsPanel({ compact }: { compact: boolean }) {
    const grouped = groupBy(NOTIFICATIONS, (item) => item.group);
    return (
        <section className={`min-h-0 overflow-hidden rounded-lg border border-card-border bg-white shadow-sm ${compact ? '' : 'hidden lg:flex lg:flex-col'}`}>
            <div className="shrink-0 border-b border-card-border px-3 py-2">
                <h3 className="text-[13px] font-bold text-text-primary">Notifications</h3>
            </div>
            <div className="min-h-0 flex-1 space-y-2.5 overflow-hidden px-3 py-2">
                {Array.from(grouped.entries()).map(([group, items]) => (
                    <div key={group}>
                        <div className="mb-1.5 flex items-center justify-between">
                            <p className="text-[11px] font-bold text-text-primary">{group} <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] text-white">{items.length}</span></p>
                            <span className="text-[9px] text-primary">View All</span>
                        </div>
                        <div className="space-y-1.5">
                            {items.map((item) => (
                                <div key={item.title} className="grid grid-cols-[8px_minmax(0,1fr)_34px] gap-2">
                                    <span className={`mt-1.5 h-2 w-2 rounded-full ${item.tone === 'red' ? 'bg-red-600' : item.tone === 'amber' ? 'bg-amber-600' : 'bg-emerald-600'}`} />
                                    <div className="min-w-0">
                                        <p className="truncate text-[10px] font-semibold text-text-primary">{item.title}</p>
                                        <p className="truncate text-[9px] text-slate-500">{item.matter}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`rounded px-1 py-0.5 text-[9px] font-bold ${SCORE_TONES[item.tone]}`}>{item.score}</span>
                                        <p className={`mt-1 text-[8px] ${item.tone === 'red' ? 'text-red-600' : 'text-slate-600'}`}>{item.due}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function FilterBar({ action }: { action: string }) {
    return (
        <div className="mb-3 shrink-0 rounded-lg border border-card-border bg-white p-2 shadow-sm sm:p-3">
            <div className="flex items-center gap-2 sm:hidden">
                <button className="flex min-w-0 flex-1 items-center justify-between rounded-lg border border-card-border bg-white px-3 py-2 text-left">
                    <span className="min-w-0">
                        <span className="block truncate text-[11px] font-bold text-text-primary">Deadline filters</span>
                        <span className="block truncate text-[9px] text-slate-500">All types · All priorities · Mine only</span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                </button>
                <motion.button
                    className="shrink-0 rounded-lg bg-primary px-3 py-2 text-[10px] font-bold text-white shadow-lg shadow-primary/20"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                >
                    + {action}
                </motion.button>
            </div>
            <div className="hidden gap-2 sm:grid sm:grid-cols-[1fr_1fr_110px] lg:grid-cols-[200px_200px_120px_minmax(260px,1fr)_160px]">
                <FilterBox>All Types</FilterBox>
                <FilterBox>All Priorities</FilterBox>
                <label className="flex items-center gap-2 text-[11px] text-text-primary">
                    <span className="h-4 w-4 rounded border border-card-border" />
                    Mine Only
                </label>
                <FilterBox>2026-05-27 {'->'} 2026-07-25</FilterBox>
                <motion.button
                    className="rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-primary/20"
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                >
                    + {action}
                </motion.button>
            </div>
        </div>
    );
}

function DeadlineBucket({ title, count, accent, rows }: { title: string; count: number; accent: string; rows: DeadlineRow[] }) {
    return (
        <section className="mb-3 last:mb-0">
            <div className="mb-2 flex items-center gap-2">
                <h3 className="text-[13px] font-bold text-text-primary">{title}</h3>
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">{count}</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-card-border bg-white shadow-sm" style={{ borderLeftColor: accent, borderLeftWidth: 3 }}>
                {rows.map((row) => (
                    <div key={row.title} className="grid grid-cols-[110px_minmax(0,1fr)_90px] items-center gap-3 border-b border-card-border/70 px-3 py-3 text-[11px] last:border-b-0 sm:grid-cols-[120px_minmax(0,1fr)_90px_80px]">
                        <div className="flex items-center gap-2">
                            <StatusPill tone={row.type === 'Office Action' ? 'blue' : row.type === 'Annuity Fee' ? 'purple' : 'amber'}>{row.type}</StatusPill>
                            <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${SCORE_TONES[row.tone]}`}>{row.score}</span>
                        </div>
                        <div className="min-w-0">
                            <p className="truncate font-semibold text-text-primary">{row.title}</p>
                            <p className="truncate text-[10px] text-slate-500">{row.matter}</p>
                        </div>
                        {row.priority && <StatusPill tone="amber">{row.priority}</StatusPill>}
                        <p className={`text-right text-[10px] ${row.tone === 'red' ? 'text-red-600' : 'text-amber-700'}`}>{row.due}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function NpeFilterBar() {
    return (
        <div className="mb-3 shrink-0 rounded-lg border border-card-border bg-white p-2 shadow-sm sm:p-3">
            <div className="flex items-center gap-2 lg:hidden">
                <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-card-border bg-white px-3">
                    <Search className="h-4 w-4 shrink-0 text-slate-500" />
                    <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold text-text-primary">NPE case filters</p>
                        <p className="truncate text-[9px] text-slate-500">All statuses · All jurisdictions · Latest first</p>
                    </div>
                </div>
                <button className="flex h-10 shrink-0 items-center gap-1 rounded-lg border border-primary/25 bg-indigo-50 px-3 text-[10px] font-bold text-primary">
                    Filters
                    <ChevronDown className="h-3.5 w-3.5" />
                </button>
            </div>
            <div className="hidden gap-2 lg:grid lg:grid-cols-[minmax(260px,1fr)_150px_150px_150px_56px]">
                <TableSearchBar placeholder="Search NPE cases by title, application number, or family reference" noWrap />
                <FilterBox>All</FilterBox>
                <FilterBox>Select jurisdiction</FilterBox>
                <FilterBox>Latest First</FilterBox>
                <div className="hidden items-center justify-end gap-1 lg:flex">
                    <Grid2X2 className="h-4 w-4 text-slate-400" />
                    <List className="h-4 w-4 text-text-primary" />
                </div>
            </div>
        </div>
    );
}

function TableSearchBar({ placeholder, noWrap }: { placeholder: string; noWrap?: boolean }) {
    const input = (
        <div className="flex h-10 items-center gap-2 rounded-lg border border-card-border bg-white px-3 text-[11px] text-slate-400">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="truncate">{placeholder}</span>
        </div>
    );
    if (noWrap) return input;
    return <div className="mb-3 shrink-0 rounded-lg border border-card-border bg-white p-3 shadow-sm">{input}</div>;
}

function AuditFilters() {
    return (
        <div className="mb-3 shrink-0 rounded-lg border border-card-border bg-white p-2 shadow-sm sm:p-3">
            <button className="flex w-full items-center justify-between rounded-lg border border-card-border bg-white px-3 py-2 text-left sm:hidden">
                <span className="min-w-0">
                    <span className="block truncate text-[11px] font-bold text-text-primary">Audit filters</span>
                    <span className="block truncate text-[9px] text-slate-500">All entities · All actions · Current quarter</span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
            <div className="hidden gap-2 sm:grid sm:grid-cols-3 xl:grid-cols-6">
                {['Entity Type', 'Entity ID', 'Action', 'Actor', 'Date From', 'Date To'].map((label, index) => (
                    <div key={label}>
                        <p className="mb-1 text-[10px] text-slate-500">{label}</p>
                        <FilterBox>{index === 0 || index === 2 ? 'All' : index === 3 ? 'Select actor' : index > 3 ? 'Select date' : 'Entity UUID'}</FilterBox>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DataTable({
    columns,
    children,
    selectable = false,
    overlay,
}: {
    columns: string[];
    children: ReactNode;
    selectable?: boolean;
    overlay?: ReactNode;
}) {
    return (
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-card-border bg-white p-2 shadow-sm">
            <table className="w-full min-w-0 border-collapse text-left sm:min-w-[760px]">
                <thead>
                    <tr className="bg-slate-50 text-[10px] text-text-primary">
                        {selectable && <th className="w-8 px-2 py-3"><Checkbox checked={false} /></th>}
                        {columns.map((column, index) => {
                            const visibility = index > 5 ? 'hidden xl:table-cell' : index > 3 ? 'hidden lg:table-cell' : index > 2 ? 'hidden sm:table-cell' : '';
                            return (
                                <th key={column} className={`px-2 py-3 font-bold ${visibility}`}>{column}</th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-8 bg-gradient-to-l from-white to-transparent sm:block lg:hidden" />
            <AnimatePresence>{overlay}</AnimatePresence>
        </div>
    );
}

function BulkStatusBar({ dropdown, shell = false }: { dropdown: boolean; shell?: boolean }) {
    return (
        <motion.div
            className={`absolute z-50 grid grid-cols-[74px_minmax(0,1fr)_106px_32px] items-center gap-2 rounded-xl border border-primary/25 bg-white p-2.5 shadow-2xl shadow-black/20 sm:grid-cols-[92px_minmax(0,1fr)_132px_36px] sm:p-3 ${
                shell
                    ? 'bottom-4 left-3 right-3 sm:bottom-5 sm:right-auto sm:left-[calc(190px+(100%-190px)/2)] sm:w-[calc((100%-190px)*0.66)] sm:-translate-x-1/2'
                    : 'inset-x-3 bottom-16 sm:inset-x-auto sm:left-1/2 sm:w-[min(88%,720px)] sm:-translate-x-1/2'
            }`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.25, ease: EASE }}
        >
            <div>
                <p className="text-[10px] font-bold text-text-primary sm:text-[11px]">2 selected</p>
                <p className="hidden text-[9px] text-slate-500 sm:block">Bulk status</p>
            </div>
            <div className="relative">
                <motion.div
                    className="flex h-9 items-center justify-between rounded-lg border border-card-border px-2.5 text-[10px] text-slate-500 sm:h-10 sm:px-3 sm:text-[11px]"
                    animate={dropdown ? { borderColor: '#4f46e5', boxShadow: '0 0 0 2px rgba(79,70,229,0.12)' } : {}}
                >
                    <span className="truncate">{dropdown ? 'OA Pending' : 'Select status'}</span>
                    <ChevronDown className="h-4 w-4" />
                </motion.div>
                {dropdown && <StatusDropdown />}
            </div>
            <motion.button
                className="rounded-lg bg-primary px-2 py-2.5 text-[10px] font-bold text-white sm:px-3 sm:text-[11px]"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
            >
                <span className="hidden sm:inline">Change Status</span>
                <span className="sm:hidden">Change</span>
            </motion.button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-card-border sm:h-9 sm:w-9"><X className="h-4 w-4" /></button>
        </motion.div>
    );
}

function StatusDropdown() {
    return (
        <motion.div
            className="absolute bottom-12 left-0 z-30 w-full rounded-lg border border-card-border bg-white p-1.5 shadow-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
        >
            {STATUS_OPTIONS.map((option) => {
                const active = option === 'OA Pending';
                return (
                    <motion.div
                        key={option}
                        className="rounded-md px-3 py-2 text-[11px] text-text-primary"
                        animate={active ? { backgroundColor: ['#ffffff', '#eef2ff', '#eef2ff'], color: ['#0f172a', '#4f46e5', '#4f46e5'] } : {}}
                        transition={active ? { duration: 0.7, delay: 0.6, ease: EASE } : undefined}
                    >
                        {active ? <Check className="mr-2 inline h-3 w-3" /> : null}
                        {option}
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

function ReasonModal() {
    return (
        <motion.div
            className="absolute inset-0 z-40 flex items-start justify-center bg-black/45 px-3 py-6 backdrop-blur-[2px] sm:pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
        >
            <motion.div
                className="max-h-full w-[min(92vw,520px)] overflow-hidden rounded-xl bg-white p-3 shadow-2xl sm:p-5"
                style={{ fontFamily: 'var(--font-dashboard)' }}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.28, ease: EASE }}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-[14px] font-bold text-text-primary sm:text-[15px]">Provide Reason for Status Change</h3>
                        <p className="mt-2 text-[11px] text-slate-600 sm:text-[12px]">Status updates require a reason before submission.</p>
                    </div>
                    <X className="h-4 w-4 text-slate-500 sm:h-5 sm:w-5" />
                </div>
                <div className="mt-4 text-[12px]">
                    <p className="font-bold text-text-primary">Fields Being Changed</p>
                    <p className="mt-2 text-slate-700">· Status</p>
                </div>
                <p className="mt-4 text-[12px] font-bold text-text-primary">Reason for Change</p>
                <div className="mt-2 h-20 rounded-lg border border-primary p-3 text-[12px] leading-relaxed text-text-primary sm:h-24">
                    Updating from Examination Requested to OA Pending after attorney review of the search report.
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button className="rounded-lg border border-card-border bg-white px-4 py-2 text-[12px] text-text-primary">Cancel</button>
                    <motion.button
                        className="rounded-lg bg-primary px-4 py-2 text-[12px] font-bold text-white"
                        animate={{ boxShadow: ['0 0 0 0 rgba(79,70,229,0)', '0 0 0 6px rgba(79,70,229,0.14)', '0 0 0 0 rgba(79,70,229,0)'] }}
                        transition={{ duration: 0.9, repeat: Infinity }}
                    >
                        Change Status
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function FilterBox({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-10 items-center justify-between rounded-lg border border-card-border bg-white px-3 text-[11px] text-slate-500">
            <span className="truncate">{children}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        </div>
    );
}

function StatusPill({ tone, children }: { tone: StatusTone; children: ReactNode }) {
    return <span className={`inline-flex rounded-md px-2 py-1 text-[9px] font-semibold ${STATUS_TONES[tone]}`}>{children}</span>;
}

function Checkbox({ checked }: { checked: boolean }) {
    return (
        <span className={`inline-flex h-4 w-4 items-center justify-center rounded border ${checked ? 'border-primary bg-primary text-white' : 'border-card-border bg-white'}`}>
            {checked && <Check className="h-3 w-3" />}
        </span>
    );
}

function ViewButton() {
    return <button className="rounded-full border border-primary/30 bg-indigo-50 px-3 py-1 text-[10px] font-bold text-primary">View</button>;
}

function groupBy<T, K>(items: T[], keyFn: (item: T) => K): Map<K, T[]> {
    const map = new Map<K, T[]>();
    items.forEach((item) => {
        const key = keyFn(item);
        map.set(key, [...(map.get(key) ?? []), item]);
    });
    return map;
}
