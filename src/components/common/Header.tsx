import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            DaNangTrip
          </Link>
          
          <nav className="flex gap-6">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              Giới thiệu
            </Link>
            <Link href="/tours" className="text-gray-600 hover:text-gray-900">
              Tours
            </Link>
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              Đăng nhập
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
