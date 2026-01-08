export interface FriendLink {
  name: string;
  url: string;
  avatar: string;
  desc: string;
  categories: string[];
  tags?: string[];
  status?: "alive" | "dead" | "unknown";
}
