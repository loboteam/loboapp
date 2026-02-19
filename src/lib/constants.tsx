import {
  LayoutDashboard,
  CalendarPlus,
  History,
  ShieldCheck,
  LogOut,
  Users,
  Settings,
  BarChart3,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Users2,
  AlertTriangle,
  Download,
  Star,
  Trash2,
  PlusCircle,
  FileText,
  Bell,
  RotateCcw
} from 'lucide-react';

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Reservations: <CalendarPlus size={20} />,
  MyReservations: <History size={20} />,
  Admin: <ShieldCheck size={20} />,
  Logout: <LogOut size={20} />,
  Users: <Users size={20} />,
  Settings: <Settings size={20} />,
  Stats: <BarChart3 size={20} />,
  Search: <Search size={20} />,
  Check: <CheckCircle2 size={20} />,
  Clock: <Clock size={20} />,
  Location: <MapPin size={20} />,
  Capacity: <Users2 size={20} />,
  Maintenance: <AlertTriangle size={20} />,
  Download: <Download size={20} />,
  Star: <Star size={16} />,
  StarFilled: <Star size={16} fill='currentColor' />,
  Trash: <Trash2 size={18} />,
  Plus: <PlusCircle size={18} />,
  File: <FileText size={18} />,
  Bell: <Bell size={18} />,
  Repeat: <RotateCcw size={18} />
};

export const MOCK_SPACES = [
    { id: '1', name: 'Sala de Estudio 1', type: 'Sala de Estudio', capacity: 4, location: 'Piso 2, Ala Norte', equipment: ['Pizarra', 'WiFi'], status: 'Disponible', occupancyToday: 45, rating: 4.8 },
    { id: '2', name: 'Sala de Estudio 2', type: 'Sala de Estudio', capacity: 6, location: 'Piso 2, Ala Sur', equipment: ['Monitor 27"', 'Pizarra'], status: 'Disponible', occupancyToday: 60, rating: 4.5 },
    { id: '3', name: 'Sala Audiovisual 1', type: 'Sala Audiovisual', capacity: 20, location: 'Piso 3, Centro', equipment: ['Proyector 4K', 'Audio 5.1'], status: 'Disponible', occupancyToday: 75, rating: 4.9 },
    { id: '4', name: 'Laboratorio 1', type: 'Laboratorio', capacity: 15, location: 'Piso 4, Ala Este', equipment: ['Workstations HP', 'Impresora 3D'], status: 'Mantenimiento', occupancyToday: 0, rating: 4.2 },
    { id: '5', name: 'Laboratorio 2', type: 'Laboratorio', capacity: 12, location: 'Piso 4, Ala Oeste', equipment: ['iMac Pro', 'VR Kits'], status: 'Disponible', occupancyToday: 30, rating: 4.7 }
];

export const APP_THEME = {
    accentColor: 'teal',
    accent: 'text-teal-400',
    bgAccent: 'bg-teal-400',
    gradientPrimary: 'from-teal-400 to-blue-500',
    glassBase: 'glass',
    glassDark: 'glass-dark'
};

export const ENDPOINTS = {
    login: {
        staff: "/login/staff",
        student: "/login/student"
    },
    getSpaces: "/spaces",
    newReservation: "",
    killReservation: "",
    ADMIN: {
        newPlace: "",
        killPlace: "",
        newAdmin: ""
    }
};