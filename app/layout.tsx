import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/provider/queryClient-provider";




export const metadata: Metadata = {
  title: "CMS ADMIN ",
  description: "Content management system for manintain content",
};


const roboto = Roboto_Slab({
  weight:[
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ],
  subsets:["latin"]
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className}`}
      >
            <QueryClientProvider client={queryClient}>
           <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <main className="max-w-7xl mx-auto ">
           {children}
          </main>
          <Toaster />
        </ThemeProvider>
              </QueryClientProvider>
      </body>
  
    </html>
  );
}
