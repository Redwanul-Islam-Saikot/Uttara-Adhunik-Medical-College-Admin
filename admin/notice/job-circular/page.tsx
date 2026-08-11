import NoticeBoard from '@/components/NoticeBoard';

export default function JobCircularAdmin() {
  return (
    <NoticeBoard
      title="Job Circular"
      apiEndpoint="/api/notice?category=Job Circular"
    />
  );
}