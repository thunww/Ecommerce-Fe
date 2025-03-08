import { 
    CreditCard, Building, DollarSign, Smartphone, Wallet, 
    Banknote, PiggyBank, Headphones, ShoppingBag, ShieldCheck, 
    RefreshCcw, Info, Briefcase, Lock, FileText, Users, 
    Facebook, Instagram, Twitter, Globe, Mail, Phone 
  } from "lucide-react";
  
  const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Care</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {[
                { icon: Headphones, text: "Help Center" },
                { icon: ShoppingBag, text: "Shopping Guide" },
                { icon: ShieldCheck, text: "Warranty Policy" },
                { icon: RefreshCcw, text: "Return & Refund" },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-center transition-transform duration-300 hover:text-white hover:translate-x-1 cursor-pointer">
                  <Icon size={16} className="mr-2" /> {text}
                </li>
              ))}
            </ul>
          </div>
  
          <div>
            <h3 className="text-lg font-semibold mb-3">About Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {[
                { icon: Info, text: "Company Info" },
                { icon: Briefcase, text: "Careers" },
                { icon: Lock, text: "Privacy Policy" },
                { icon: FileText, text: "Terms of Service" },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-center transition-transform duration-300 hover:text-white hover:translate-x-1 cursor-pointer">
                  <Icon size={16} className="mr-2" /> {text}
                </li>
              ))}
            </ul>
          </div>
  
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {[
                { icon: Facebook, text: "Facebook" },
                { icon: Instagram, text: "Instagram" },
                { icon: Globe, text: "TikTok" },
                { icon: Twitter, text: "Twitter" },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-center transition-transform duration-300 hover:text-white hover:translate-x-1 cursor-pointer">
                  <Icon size={16} className="mr-2" /> {text}
                </li>
              ))}
            </ul>
          </div>
  
        <div>
            <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
            <div className="flex flex-wrap gap-6 mt-2">
                    {[
                    CreditCard, Building, DollarSign, 
                    Smartphone, Wallet, Banknote, PiggyBank
                    ].map((Icon, i) => (
                    <div key={i} className="transition-all duration-300 hover:text-white hover:scale-110 cursor-pointer">
                        <Icon size={28} className="text-gray-300" />
                    </div>
                    ))}
            </div>
        </div>
  
        <div>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {[
                { icon: Mail, text: "Email: support@classyshop.com" },
                { icon: Phone, text: "Phone: +123 456 7890" },
                { icon: Headphones, text: "Live Chat" },
                { icon: Users, text: "FAQ" },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-center transition-transform duration-300 hover:text-white hover:translate-x-1 cursor-pointer">
                  <Icon size={16} className="mr-2" /> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
          <p>&copy; 2025 ClassyShop. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  