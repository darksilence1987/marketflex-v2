function App() {
    return (
        // Tailwind sınıfları: tam ekran yükseklik (min-h-screen),
        // koyu arka plan (bg-slate-900), beyaz yazı (text-white)
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4">

            <h1 className="text-6xl font-bold text-blue-500 animate-pulse">
                MarketFlex v2 🚀
            </h1>

            <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
                <p className="text-xl text-gray-300">
                    Tailwind v4 Motoru: <span className="text-green-400 font-mono">AKTİF</span>
                </p>
            </div>

            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold">
                Sisteme Giriş Yap
            </button>

        </div>
    )
}

export default App