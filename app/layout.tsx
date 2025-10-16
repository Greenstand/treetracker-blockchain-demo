import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TreeTracker - Document Your Reforestation Impact",
  description: "Empower tree growers to document and share their reforestation efforts with geotagged, time-stamped photos and earn Impact Tokens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">TreeTracker</h3>
                  <p className="text-sm text-gray-600">
                    Empowering tree growers to document and share their reforestation efforts.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h4>
                  <ul className="space-y-2">
                    <li><a href="/" className="text-sm text-gray-600 hover:text-primary-600">Dashboard</a></li>
                    <li><a href="/captures" className="text-sm text-gray-600 hover:text-primary-600">My Trees</a></li>
                    <li><a href="/tokens" className="text-sm text-gray-600 hover:text-primary-600">Impact Tokens</a></li>
                    <li><a href="/map" className="text-sm text-gray-600 hover:text-primary-600">Map View</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Resources</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Help Center</a></li>
                    <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Documentation</a></li>
                    <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">API Reference</a></li>
                    <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Community</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Legal</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Privacy Policy</a></li>
                    <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Terms of Service</a></li>
                    <li><a href="#" className="text-sm text-gray-600 hover:text-primary-600">Cookie Policy</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  © 2025 TreeTracker by Greenstand. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}