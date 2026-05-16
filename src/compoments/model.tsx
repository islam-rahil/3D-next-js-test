"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import articles from "../lib/articles";

const Categories = ["Tous" ,"Technologie","Marketing","Offre d'emploi", "Analyse", "Interview", "Nouveau projet", "Point de vue", "Tutoriel"];

export default function Actu() {
  const [selectedCategorie, setSelectedCategorie] = useState("Tous");

  const filteredArticles =
    selectedCategorie === "Tous"
      ? articles
      : articles.filter((a) => a.categorie === selectedCategorie);

  return (
    <>
      {/* Filtres */}
      <section className="max-w-6xl mx-auto mt-10 px-4">
        <div className="flex flex-col gap-5">
          <h2 className="text-3xl font-semibold text-[#252525]">Catégories</h2>
          <ul className="flex flex-wrap justify-start items-center gap-3">
            {Categories.map((categorie) => (
              <li key={categorie}>
                <button
                  onClick={() => setSelectedCategorie(categorie)}
                  className={`p-3 border rounded-2xl text-sm font-medium transition-all duration-200 ${
                    selectedCategorie === categorie
                      ? "bg-[#E54259] text-white border-[#E54259]"
                      : "border-black text-[#252525] hover:border-[#E54259] hover:text-[#E54259]"
                  }`}
                >
                  {categorie}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Grille d'articles */}
      <section className="max-w-6xl mx-auto mt-10 px-4 pb-20">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/actu/${article.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden border border-black/10 hover:border-[#E54259] transition-all duration-300"
              >
              

                {/* Contenu */}
                <div className="flex flex-col gap-2 p-5 flex-1">
                  <span className="text-xs font-semibold text-[#E54259] uppercase tracking-wide">
                    {article.categorie}
                  </span>
                  <h3 className="text-base font-bold text-[#252525] group-hover:text-[#E54259] transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#252525]/60 line-clamp-2">
                    {article.description}
                  </p>
                  <span className="text-xs text-[#252525]/40 mt-auto pt-2">{article.date}</span>
                </div>

                <Image
                  src="/flechArticle.png"
                  alt=""
                  aria-hidden="true"
                  className="duration-300 group-hover:-translate-y-1 transition-transform p-5"
                  width={110}
                  height={55}
                />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-[#252525]/50 mt-10">Aucun article dans cette catégorie.</p>
        )}
      </section>
    </>
  );
}