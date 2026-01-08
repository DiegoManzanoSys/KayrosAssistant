'use client';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center py-20 animate-fadeIn">
        <div className="inline-block mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-5xl shadow-2xl mx-auto transform hover:scale-110 transition-transform duration-300">
            📄
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          ResumeAI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Transforma tus documentos en resúmenes inteligentes con IA
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="/summarize"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Comenzar →
          </a>
        </div>
      </div>
    </div>
  );
}
