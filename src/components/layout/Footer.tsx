export default function Footer() {
    return (
        <footer className="border-t border-white/5 py-10">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-emerald-500/20 text-xs text-emerald-400 font-bold">
                            É
                        </span>
                        Éco-Score Web &copy; {new Date().getFullYear()}
                    </div>
                    <p className="text-xs text-gray-600">
                        Promoting a more sustainable web, one scan at a time.
                    </p>
                </div>
            </div>
        </footer>
    );
}
