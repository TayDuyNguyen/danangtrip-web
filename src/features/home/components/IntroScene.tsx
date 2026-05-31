"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";

interface IntroSceneProps {
  images?: string[];
  onSceneChange?: (scene: number) => void;
}

type IntroImage = {
  src: string;
  altVi: string;
  altEn: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
};

const INTRO_IMAGES: IntroImage[] = [
  {
    src: "/images/intro/my_khe_beach.png",
    altVi: "Biển Mỹ Khê Đà Nẵng",
    altEn: "My Khe Beach Da Nang",
    titleVi: "Biển Mỹ Khê",
    titleEn: "My Khe Beach",
    subtitleVi: "Bờ biển xanh mở đầu mọi hành trình Đà Nẵng",
    subtitleEn: "The blue coastline where every Da Nang journey begins",
  },
  {
    src: "/images/intro/dragon_bridge.png",
    altVi: "Cầu Rồng Đà Nẵng",
    altEn: "Dragon Bridge Da Nang",
    titleVi: "Cầu Rồng",
    titleEn: "Dragon Bridge",
    subtitleVi: "Biểu tượng rực sáng bên dòng sông Hàn",
    subtitleEn: "The glowing icon beside the Han River",
  },
  {
    src: "/images/intro/golden_bridge.png",
    altVi: "Cầu Vàng Bà Nà Hills",
    altEn: "Golden Bridge Ba Na Hills",
    titleVi: "Cầu Vàng",
    titleEn: "Golden Bridge",
    subtitleVi: "Lối đi giữa tầng mây Bà Nà",
    subtitleEn: "A walkway above the clouds of Ba Na",
  },
  {
    src: "/images/intro/lady_buddha.png",
    altVi: "Chùa Linh Ứng Sơn Trà",
    altEn: "Linh Ung Pagoda Son Tra",
    titleVi: "Chùa Linh Ứng",
    titleEn: "Linh Ung Pagoda",
    subtitleVi: "Khoảng lặng bình yên nhìn ra biển",
    subtitleEn: "A peaceful pause overlooking the sea",
  },
  {
    src: "/images/intro/son_tra.png",
    altVi: "Bán đảo Sơn Trà",
    altEn: "Son Tra Peninsula",
    titleVi: "Sơn Trà",
    titleEn: "Son Tra",
    subtitleVi: "Màu xanh hoang sơ của thành phố biển",
    subtitleEn: "The wild green escape of the coastal city",
  },
];

const SLIDE_INTERVAL_MS = 2800;

export default function IntroScene({ images, onSceneChange }: IntroSceneProps) {
  const locale = useLocale();
  const [index, setIndex] = useState(0);

  const slides = useMemo(() => {
    if (!images?.length) return INTRO_IMAGES;

    return images.map((src, imageIndex) => {
      const fallback = INTRO_IMAGES[imageIndex % INTRO_IMAGES.length];
      return { ...fallback, src };
    });
  }, [images]);

  const current = slides[index % slides.length];
  const isVi = locale === "vi";

  useEffect(() => {
    onSceneChange?.(index + 1);

    const timer = window.setTimeout(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [index, onSceneChange, slides.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <AnimatePresence mode="sync">
        <motion.div
          key={current.src}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.035 }}
          animate={{ opacity: 1, scale: 1.005 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={current.src}
            alt={isVi ? current.altVi : current.altEn}
            fill
            priority={index <= 1}
            quality={100}
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/48 via-black/12 to-black/64" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(255,56,92,0.12),transparent_22%),radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.36)_82%)]" />

      <motion.div
        key={`${current.src}-copy`}
        className="absolute bottom-8 left-6 z-20 max-w-sm rounded-full border border-white/16 bg-black/18 px-4 py-2 text-white/88 backdrop-blur-md md:left-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
          {isVi ? current.titleVi : current.titleEn}
        </p>
        <p className="mt-1 text-[12px] leading-5 text-white/74">
          {isVi ? current.subtitleVi : current.subtitleEn}
        </p>
      </motion.div>
    </div>
  );
}
