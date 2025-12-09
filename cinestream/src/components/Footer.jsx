import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const links = [
    { title: 'Company', items: ['About', 'Careers', 'Press'] },
    { title: 'Support', items: ['Help Center', 'Contact', 'FAQ'] },
    { title: 'Legal', items: ['Terms', 'Privacy', 'Cookies'] },
  ];

  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-[#0a0a0f] to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="relative container-custom section-spacing">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <motion.div
            className="col-span-2 md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-bold mb-4 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">CINE</span>
              <span className="text-white">STREAM</span>
            </h2>
            <p className="text-sm text-zinc-400 mb-6 max-w-xs leading-relaxed">
              Stream movies and TV shows anytime, anywhere. Discover your next favorite story.
            </p>
            <div className="flex gap-3">
              {[FiTwitter, FiInstagram, FiGithub].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm border border-white/5 hover:border-white/10"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Follow us on ${Icon.name.replace('Fi', '')}`}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {links.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <motion.div
          className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-xs text-zinc-500 font-medium">
            © {new Date().getFullYear()} CineStream. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <motion.a
              href="#"
              className="hover:text-zinc-300 transition-colors duration-200 hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Privacy
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-zinc-300 transition-colors duration-200 hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              Terms
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
