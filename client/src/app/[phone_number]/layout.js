import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Phone History | CallsHistory",
  description: "See the details of your phone call history",
};

export default function RootLayout({ children }) {
  return (
      <main className={inter.className}>{children}</main>
  );
}
