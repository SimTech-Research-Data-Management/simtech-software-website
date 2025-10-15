import "./globals.css";
import Drawer from "@/app/drawer";

export const metadata = {
  title: "SimTech-Software",
  description: "Web-based tool to explore SimTech software",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="simtech">
      <body className="bg-[url('../public/bg.svg')] bg-cover overscroll-none min-h-screen">
        <main>
          <div className="flex flex-row md:pl-24">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
