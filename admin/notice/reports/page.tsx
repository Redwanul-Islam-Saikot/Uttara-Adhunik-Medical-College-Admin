import NoticeBoard from '@/components/NoticeBoard';

export default function ReportsAdmin() {
  return (
    <NoticeBoard
      title="Reports"
      apiEndpoint="/api/notice?category=Reports"
    />
  );
}