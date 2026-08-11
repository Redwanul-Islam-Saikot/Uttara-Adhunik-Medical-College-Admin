import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // আপনার ব্যাকএন্ড ডাটাবেস (MongoDB/Prisma) থেকে আসল count বসিয়ে দেবেন
    const stats = {
      totalApplicants: 1248,
      activeStudents: 3450,
      publishedNotices: 86,
      facultyMembers: 142,
      sections: [
        {
          id: 'home-section',
          title: 'HOME SECTION',
          subsections: [
            { name: 'HEADER', count: 1 },
            { name: 'HERO SECTION', count: 3 },
            { name: 'STATS BANNER', count: 4 },
            { name: 'DEPARTMENTS', count: 18 },
            { name: 'UAMC ADMISSIONS', count: 2 },
            { name: 'PRINCIPAL MASSAGE', count: 1 },
            { name: 'CAMPUS LIFE', count: 6 },
            { name: 'ALUMNI EVENTS', count: 5 },
            { name: 'NEWS', count: 12 },
            { name: 'Contact Us', count: 1 },
            { name: 'CAREER', count: 4 },
            { name: 'Notice & Media', count: 10 },
          ],
        },
        {
          id: 'notice-board',
          title: 'NOTICE BOARD',
          subsections: [
            { name: 'General Notice', count: 24 },
            { name: 'Admission Notice', count: 15 },
            { name: 'Reports', count: 8 },
            { name: 'Job Circular', count: 6 },
          ],
        },
        {
          id: 'publications',
          title: 'PUBLICATIONS',
          subsections: [
            { name: 'Journal', count: 14 },
            { name: 'Tenders', count: 3 },
          ],
        },
        {
          id: 'about-uamc',
          title: 'ABOUT UAMC',
          subsections: [
            { name: 'Overview', count: 4 },
            { name: 'History of UAMC', count: 2 },
            { name: 'Vision & Mission', count: 1 },
            { name: 'Aim & Objective', count: 1 },
            { name: 'Founder Members', count: 12 },
            { name: 'EC Members', count: 15 },
            { name: 'GB Members', count: 20 },
          ],
        },
        {
          id: 'our-facilities',
          title: 'OUR FACILITIES',
          subsections: [
            { name: 'Hostel', count: 2 },
            { name: 'Laboratory', count: 8 },
            { name: 'Hospital Service', count: 12 },
            { name: 'Cafeteria', count: 1 },
            { name: 'Training', count: 5 },
            { name: 'Medical Education Unit', count: 3 },
            { name: 'Departments', count: 18 },
            { name: 'Publications', count: 6 },
            { name: 'Seminar', count: 9 },
          ],
        },
        {
          id: 'facilities',
          title: 'FACILITIES',
          subsections: [
            { name: 'Hospital Service', count: 4 },
            { name: 'Departments', count: 18 },
            { name: 'Library', count: 1 },
            { name: 'Medical Education Unit', count: 2 },
            { name: 'Training', count: 4 },
            { name: 'Seminar', count: 7 },
            { name: 'Hostel', count: 3 },
            { name: 'Laboratory', count: 6 },
            { name: 'Cafeteria', count: 1 },
          ],
        },
        {
          id: 'admission',
          title: 'ADMISSION',
          subsections: [
            { name: 'Procedure & Fees', count: 2 },
            { name: 'Admission Papers', count: 5 },
          ],
        },
        {
          id: 'portals-management',
          title: 'PORTALS MANAGEMENT',
          subsections: [
            { name: 'Student Portal', count: 3450 },
            { name: 'Events Manager', count: 8 },
          ],
        },
        {
          id: 'footer',
          title: 'FOOTER',
          subsections: [
            { name: 'Footer Widgets', count: 4 },
          ],
        },
      ],
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}