import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  return (
    <div className="mb-10 mt-2 w-full px-4 lg:px-[16%]">
      <div className="mt-4 flex w-full flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">Notifikační šablony</h2>
        <Link href="/app/notifications/add">
          <Button className="flex flex-row items-center justify-between gap-1">
            <Plus />
            Přídat
          </Button>
        </Link>
      </div>
    </div>
  );
}
