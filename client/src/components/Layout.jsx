import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Content */}
      <main className="flex-1 md:ml-64 p-6">
        {children}
      </main>
    </div>
  );
}
