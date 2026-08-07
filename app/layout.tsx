import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});


const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
});



export const metadata: Metadata = {
  title: "Aurelia Business Manager",
  description: "Sistema de gestión para Aurelia Fragancias",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (

    <html
      lang="es"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >


      <body className="min-h-screen bg-[#F8F8F6] text-stone-900 font-sans">

        {children}

      </body>


    </html>

  );

}