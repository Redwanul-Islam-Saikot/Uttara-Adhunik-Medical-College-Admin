import NoticeBoard from "@/components/NoticeBoard";

export default function JournalAdminPage() {
  return (
    <NoticeBoard
      title="Journal"
      apiEndpoint="/api/publication?category=Journal"
    />
  );
}