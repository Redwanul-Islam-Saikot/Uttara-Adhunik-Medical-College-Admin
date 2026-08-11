'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Users,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronRight,
  LogOut,
  Layers,
  ArrowRight,
  ArrowUpRight,
  X,
  Image as ImageIcon,
  BookOpen,
  BarChart3,
  LucideIcon,
} from 'lucide-react';

interface SubDropdownItem {
  name: string;
  href: string;
}

interface DropdownItem {
  name: string;
  href: string;
  icon?: LucideIcon;
  hasDropdown?: boolean;
  dropdownItems?: SubDropdownItem[];
}

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
  hasDropdown: boolean;
  dropdownItems?: DropdownItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Menu items list
  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard', hasDropdown: false },
    {
      name: 'HOME SECTION',
      icon: Briefcase,
      href: '/admin/hero',
      hasDropdown: true,
      dropdownItems: [
        { name: 'HEADER', icon: ImageIcon, href: '/admin/header-info', hasDropdown: false },
        { name: 'HERO SECTION', icon: ImageIcon, href: '/admin/hero', hasDropdown: false },
        { name: 'STATS BANNER', icon: BarChart3, href: '/admin/stat', hasDropdown: false },
        { name: 'DEPARTMENTS', icon: BarChart3, href: '/admin/department-section', hasDropdown: false },
        { name: 'UAMC ADMISSIONS', icon: BarChart3, href: '/admin/admission-banner', hasDropdown: false },
        { name: 'PRINCIPAL MASSAGE', icon: BarChart3, href: '/admin/principal-massage', hasDropdown: false },
        { name: 'CAMPUS LIFE', icon: BarChart3, href: '/admin/campus-life', hasDropdown: false },
        { name: 'ALUMNI EVENTS', icon: BarChart3, href: '/admin/alumni-events', hasDropdown: false },
        { name: 'NEWS', icon: BarChart3, href: '/admin/news', hasDropdown: false },
        { name: 'Contact Us', icon: BarChart3, href: '/admin/contact-info', hasDropdown: false },
        { name: 'CAREER', icon: Briefcase, href: '/admin/jobs', hasDropdown: false },
        { name: 'Notice & Media', icon: BarChart3, href: '/admin/notice-media', hasDropdown: false },
      ],
    },
    {
      name: 'NOTICE BOARD',
      icon: FileText,
      href: '/admin/notice/genaral',
      hasDropdown: true,
      dropdownItems: [
        { name: 'General Notice', href: '/admin/notice/genaral' },
        { name: 'Admission Notice', href: '/admin/notice/admission' },
        { name: 'Reports', href: '/admin/notice/reports' },
        { name: 'Job Circular', href: '/admin/notice/job-circular' },
      ],
    },
    {
      name: 'PUBLICATIONS',
      icon: BookOpen,
      href: '/admin/publications/journal',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Journal', href: '/admin/publications/journal' },
        { name: 'Tenders', href: '/admin/publications/tenders' },
      ],
    },
    {
      name: 'ABOUT UAMC',
      icon: Building2,
      href: '/admin/about',
      hasDropdown: true,
      dropdownItems: [
        {
          name: 'Overview',
          href: '/admin/about/overview',
          hasDropdown: true,
          dropdownItems: [
            { name: 'Overview Hero', href: '/admin/about/overview/hero' },
            { name: 'Visiting At UAMC', href: '/admin/about/overview/visiting' },
            { name: 'Admission & Aid', href: '/admin/about/overview/admission-aid' },
            { name: 'Sustainability at UAMC', href: '/admin/about/overview/sustainability' },
          ],
        },
        {
          name: 'History of UAMC',
          href: '/admin/about/history',
          hasDropdown: true,
          dropdownItems: [
            { name: 'History of UAMC', href: '/admin/about/history/historyUAMC' },
            { name: 'Evolution', href: '/admin/about/history/timeline' },
          ],
        },
        { name: 'Vision & Mission', href: '/admin/about/vision' },
        { name: 'Aim & Objective', href: '/admin/about/aim-objective' },
        { name: 'Founder Members', href: '/admin/about/founder-members' },
        { name: 'EC Members', href: '/admin/about/ec-members' },
        { name: 'GB Members', href: '/admin/about/gb-members' },
      ],
    },
    {
      name: 'OUR FACILITIES',
      icon: Layers,
      href: '#',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Hostel', href: '/admin/our-facilities/hostel' },
        { name: 'Laboratory', href: '/admin/our-facilities/laboratory' },
        { name: 'Hospital Service', href: '/admin/our-facilities/hospital-service' },
        { name: 'Cafeteria', href: '/admin/our-facilities/cafeteria' },
        { name: 'Training', href: '/admin/our-facilities/training' },
        { name: 'Medical Education Unit', href: '/admin/our-facilities/unit' },
        { name: 'Departments', href: '/admin/our-facilities/deparments' },
        { name: 'Publications', href: '/admin/our-facilities/publications' },
        { name: 'Seminar', href: '/admin/our-facilities/seminar' },
      ],
    },
    {
      name: 'FACILITIES',
      icon: Layers,
      href: '/admin/facilities/hospital-service',
      hasDropdown: true,
      dropdownItems: [
        {
          name: 'Hospital Service',
          href: '/admin/facilities/hospital-service',
          hasDropdown: true,
          dropdownItems: [
            { name: 'About The Hospital', href: '/admin/facilities/hospital-service/hospital-info' },
            { name: 'UAMC Facilities', href: '/admin/facilities/hospital-service/uamc-facilities' },
            { name: 'Medical Services', href: '/admin/facilities/hospital-service/medical-services' },
            { name: 'Emergency Care', href: '/admin/facilities/hospital-service/emergency-care' },
          ],
        },
        { name: 'Departments', href: '/admin/facilities/departments' },
        { name: 'Library', href: '/admin/facilities/library' },
        { name: 'Medical Education Unit', href: '/admin/facilities/me-unit' },
        { name: 'Training', href: '/admin/facilities/training' },
        { name: 'Seminar', href: '/admin/facilities/seminar' },
        { name: 'Hostel', href: '/admin/facilities/hostel' },
        { name: 'Laboratory', href: '/admin/facilities/laboratory' },
        { name: 'Cafeteria', href: '/admin/facilities/cafeteria' },
      ],
    },
    {
      name: 'ADMISSION',
      icon: GraduationCap,
      href: '/admin/admission/procedure-fees',
      hasDropdown: true,
      dropdownItems: [
        {
          name: 'Admission Procedure & Fees',
          href: '#',
          hasDropdown: true,
          dropdownItems: [
            { name: 'Admission Procedure & Fees', href: '/admin/admission/admission-procedure/fees' },
            { name: 'Students', href: '/admin/admission/admission-procedure/students' },
          ],
        },
        { name: 'Admission Papers', href: '/admin/admission/pdf' },
      ],
    },
    {
      name: 'PORTALS MANAGEMENT',
      icon: Users,
      href: '#',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Student Portal', href: '/admin/portals/students' },
        { name: 'Events Manager', href: '/admin/uamc-events' },
      ],
    },
    { name: 'FOOTER', icon: BarChart3, href: '/admin/footer', hasDropdown: false },
  ];

  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [openSubAccordion, setOpenSubAccordion] = useState<string | null>(null);

  useEffect(() => {
    const activeIndex = menuItems.findIndex((item) =>
      item.dropdownItems?.some((sub) => {
        if (sub.href === pathname) return true;
        return sub.dropdownItems?.some((nested) => nested.href === pathname);
      })
    );

    if (activeIndex !== -1) {
      setOpenAccordion(activeIndex);
      const activeParent = menuItems[activeIndex]?.dropdownItems?.find((sub) =>
        sub.dropdownItems?.some((nested) => nested.href === pathname)
      );
      if (activeParent) {
        setOpenSubAccordion(activeParent.name);
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const toggleSubAccordion = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setOpenSubAccordion(openSubAccordion === name ? null : name);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 shrink-0">
              <img src="/Nav.png" alt="UAMC Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-base font-bold text-gray-900 leading-tight truncate">
                Uttara Adhunik
              </h1>
              <p className="text-[11px] text-[#008751] font-semibold tracking-wider">
                ADMIN PANEL
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isSubActive = item.dropdownItems?.some(
              (sub) =>
                sub.href === pathname ||
                sub.dropdownItems?.some((nested) => nested.href === pathname)
            );
            const isDirectActive = pathname === item.href;

            return (
              <div key={idx} className="space-y-1">
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-semibold transition-all ${
                        openAccordion === idx || isSubActive
                          ? 'bg-emerald-50 text-[#008751]'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#008751]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          openAccordion === idx ? 'rotate-180 text-[#008751]' : 'text-gray-400'
                        }`}
                      />
                    </button>

                    {openAccordion === idx && item.dropdownItems && (
                      <div className="mt-1 ml-4 pl-3 border-l-2 border-[#008751] space-y-1">
                        {item.dropdownItems.map((sub, sIdx) => {
                          const isCurrentSub = pathname === sub.href;
                          const hasNested = sub.hasDropdown && sub.dropdownItems;
                          const isSubAccordionOpen = openSubAccordion === sub.name;

                          if (hasNested) {
                            return (
                              <div key={sIdx} className="space-y-1">
                                <button
                                  onClick={(e) => toggleSubAccordion(e, sub.name)}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-all ${
                                    isSubAccordionOpen
                                      ? 'text-[#008751] bg-emerald-50/60'
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                                  }`}
                                >
                                  <span>{sub.name}</span>
                                  <ChevronRight
                                    size={14}
                                    className={`transition-transform duration-200 ${
                                      isSubAccordionOpen ? 'rotate-90 text-[#008751]' : 'text-gray-400'
                                    }`}
                                  />
                                </button>

                                {isSubAccordionOpen && (
                                  <div className="ml-3 pl-2 border-l border-emerald-300 space-y-1 py-1">
                                    {sub.dropdownItems?.map((nested, nIdx) => {
                                      const isCurrentNested = pathname === nested.href;
                                      return (
                                        <Link
                                          key={nIdx}
                                          href={nested.href}
                                          onClick={onClose}
                                          className={`group flex items-center justify-between px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                                            isCurrentNested
                                              ? 'bg-[#FFC107] text-black font-bold'
                                              : 'text-gray-500 hover:bg-[#FFC107] hover:text-black'
                                          }`}
                                        >
                                          <span>{nested.name}</span>
                                          <ArrowUpRight
                                            size={13}
                                            className={`transition-opacity stroke-[2.5] ${
                                              isCurrentNested
                                                ? 'opacity-100'
                                                : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                          />
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={onClose}
                              className={`group flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all ${
                                isCurrentSub
                                  ? 'bg-[#FFC107] text-black font-bold'
                                  : 'text-gray-600 hover:bg-[#FFC107] hover:text-black'
                              }`}
                            >
                              <span>{sub.name}</span>
                              <span className="relative flex items-center justify-center w-4 h-4 shrink-0">
                                <ArrowRight
                                  size={13}
                                  className={`absolute text-gray-400 group-hover:opacity-0 transition-opacity ${
                                    isCurrentSub ? 'opacity-0' : 'opacity-100'
                                  }`}
                                />
                                <ArrowUpRight
                                  size={15}
                                  className={`absolute text-black transition-opacity stroke-[2.5] ${
                                    isCurrentSub
                                      ? 'opacity-100'
                                      : 'opacity-0 group-hover:opacity-100'
                                  }`}
                                />
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href || '#'}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all ${
                      isDirectActive
                        ? 'bg-[#008751] text-white shadow-sm'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-[#008751]'
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-100 transition-all duration-200 shadow-sm active:scale-[0.98]"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}