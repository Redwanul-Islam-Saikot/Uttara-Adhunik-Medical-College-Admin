import NoticeBoard from "@/components/NoticeBoard";

export default function TendersAdminPage() {
  return (
    <NoticeBoard
      title="Tenders"
      apiEndpoint="/api/publication?category=Tenders"
    />
  );
}