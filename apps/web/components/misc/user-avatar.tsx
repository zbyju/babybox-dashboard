import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "../contexts/auth-context";

interface Props {
  username?: string;
}

export default function UserAvatar({ username }: Props) {
  const { user } = useAuth();

  const name = username || user?.username || "?";
  const letters = name.slice(0, 2).toUpperCase();
  const color = name.toLowerCase() === "system" ? "pink" : "blue";

  return (
    <Avatar>
      <AvatarFallback
        className={`border border-${color}-900 bg-${color}-100 dark:border-${color}-400 dark:bg-${color}-${color === "blue" ? "950" : "900"}`}
      >
        {letters}
      </AvatarFallback>
    </Avatar>
  );
}
