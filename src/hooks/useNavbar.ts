"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const useNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() !== "") {
      router.push(`/products?query=${encodeURIComponent(search)}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return { search, setSearch, isMenuOpen, toggleMenu, closeMenu, handleSearch };
};
