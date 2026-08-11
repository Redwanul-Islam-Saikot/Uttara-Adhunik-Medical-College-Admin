import NoticeBoard from '@/components/NoticeBoard';

export default function GeneralNoticeAdmin() {
  return (
    <NoticeBoard
      title="General Notice"
      apiEndpoint="/api/notice?category=General Notice"
    />
  );
}