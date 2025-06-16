import { SidebarProvider } from "@/context/SidebarContext";

export const metadata = {
  title: 'AetherNet – AQI Monitor',
  description: 'Live air quality dashboard for major Indian cities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SidebarProvider>
        <body style={{ margin: 0 }}>{children}</body>
      </SidebarProvider>
    </html>
  );
}
