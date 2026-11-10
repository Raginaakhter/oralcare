export type CustomerStatus = "active" | "new" | "vip" | "inactive";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: string;
  location: string;
  status: CustomerStatus;
  joined: string;
  color: string;
  address?: string;
};

export const customers: Customer[] = [
  { id: "afsana-rahman", name: "Afsana Rahman", email: "afsana@example.com", phone: "01712 345678", orders: 24, spent: "৳48,200", location: "Dhaka", status: "vip", joined: "Jan 2025", color: "from-rose-400 to-pink-500", address: "House 24, Road 7, Dhanmondi, Dhaka 1205" },
  { id: "tanvir-islam", name: "Tanvir Islam", email: "tanvir@example.com", phone: "01813 456789", orders: 19, spent: "৳36,900", location: "Chattogram", status: "vip", joined: "Feb 2025", color: "from-sky-400 to-brand-blue", address: "Flat 5B, Agrabad, Chattogram 4100" },
  { id: "nusrat-jahan", name: "Nusrat Jahan", email: "nusrat@example.com", phone: "01914 567890", orders: 17, spent: "৳32,100", location: "Sylhet", status: "active", joined: "Mar 2025", color: "from-emerald-400 to-brand", address: "Zindabazar, Sylhet 3100" },
  { id: "rafiq-ahmed", name: "Rafiq Ahmed", email: "rafiq@example.com", phone: "01515 678901", orders: 14, spent: "৳28,700", location: "Khulna", status: "active", joined: "May 2025", color: "from-amber-400 to-orange-500", address: "Boyra, Khulna 9000" },
  { id: "sabrina-akter", name: "Sabrina Akter", email: "sabrina@example.com", phone: "01616 789012", orders: 12, spent: "৳24,400", location: "Rajshahi", status: "active", joined: "Jun 2025", color: "from-violet-400 to-fuchsia-500", address: "Shaheb Bazar, Rajshahi 6100" },
  { id: "mehedi-hasan", name: "Mehedi Hasan", email: "mehedi@example.com", phone: "01717 890123", orders: 8, spent: "৳16,800", location: "Dhaka", status: "active", joined: "Aug 2025", color: "from-indigo-400 to-blue-500", address: "Sector 7, Uttara, Dhaka 1230" },
  { id: "priya-sultana", name: "Priya Sultana", email: "priya@example.com", phone: "01818 901234", orders: 6, spent: "৳12,400", location: "Barishal", status: "active", joined: "Sep 2025", color: "from-teal-400 to-cyan-500", address: "Band Road, Barishal 8200" },
  { id: "shahin-chowdhury", name: "Shahin Chowdhury", email: "shahin@example.com", phone: "01919 012345", orders: 3, spent: "৳4,200", location: "Dhaka", status: "new", joined: "Oct 2025", color: "from-slate-400 to-slate-600", address: "Mirpur 10, Dhaka 1216" },
  { id: "ruma-begum", name: "Ruma Begum", email: "ruma@example.com", phone: "01212 123456", orders: 1, spent: "৳1,149", location: "Rangpur", status: "new", joined: "Nov 2025", color: "from-pink-400 to-rose-500", address: "Jahaj Company Mor, Rangpur 5400" },
  { id: "imran-hossain", name: "Imran Hossain", email: "imran@example.com", phone: "01313 234567", orders: 0, spent: "৳0", location: "Mymensingh", status: "inactive", joined: "Jul 2024", color: "from-slate-300 to-slate-400", address: "Charpara, Mymensingh 2200" },
];

export const statusTone: Record<CustomerStatus, "accent" | "info" | "success" | "neutral"> = {
  vip: "accent",
  new: "info",
  active: "success",
  inactive: "neutral",
};

export function getCustomerById(id: string) {
  return customers.find((c) => c.id === id);
}
