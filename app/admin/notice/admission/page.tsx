import NoticeBoard from '@/components/NoticeBoard';

export default function AdmissionNoticeAdmin() {
  return (
    <NoticeBoard
      title="Admission Notice"
      apiEndpoint="/api/notice?category=Admission Notice"
    />
  );
}