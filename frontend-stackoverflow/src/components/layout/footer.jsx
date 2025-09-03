export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 py-4 text-center text-sm text-gray-600">
      <p>© {new Date().getFullYear()} MyCompany. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="/about" className="hover:underline">
          About
        </a>
        <a href="/contact" className="hover:underline">
          Contact
        </a>
        <a href="/privacy" className="hover:underline">
          Privacy
        </a>
      </div>
    </footer>
  );
}
