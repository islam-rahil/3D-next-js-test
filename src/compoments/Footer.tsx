export default function Footer()
{
    return(

      <footer className="px-4 sm:px-8 md:px-16 py-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 text-xs tracking-widest">
        <span>PIXEL_BACK © {new Date().getFullYear()}</span>
        <span className="text-[#ff7e5a]/50">v1.0</span>
      </footer>

    );
}