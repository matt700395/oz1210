import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Trip - 한국 관광지 정보 서비스",
  description: "전국 관광지 정보를 검색하고 지도에서 확인하는 서비스",
  openGraph: {
    title: "My Trip - 한국 관광지 정보 서비스",
    description: "전국 관광지 정보를 검색하고 지도에서 확인하는 서비스",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Trip - 한국 관광지 정보 서비스",
    description: "전국 관광지 정보를 검색하고 지도에서 확인하는 서비스",
  },
};

/**
 * Clerk 한국어 로컬라이제이션 설정
 *
 * @clerk/localizations 패키지의 koKR을 사용하여 모든 Clerk 컴포넌트를 한국어로 표시합니다.
 * 필요시 커스텀 에러 메시지도 추가할 수 있습니다.
 *
 * @see https://clerk.com/docs/guides/customizing-clerk/localization
 */
const koreanLocalization = {
  ...koKR,
  // 커스텀 에러 메시지 (선택사항)
  unstable__errors: {
    ...koKR.unstable__errors,
    // 예시: 접근이 허용되지 않은 이메일 도메인에 대한 커스텀 메시지
    // not_allowed_access: "접근이 허용되지 않은 이메일 도메인입니다. 관리자에게 문의하세요.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={koreanLocalization}>
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <Navbar />
            {children}
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
