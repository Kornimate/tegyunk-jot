import { motion } from "framer-motion";

export function PricingCard({ id, title, priceItems, extra, img }) {
  return (
    <motion.div
      key={img}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="rounded-xl overflow-hidden shadow-md bg-white w-full h-full"
    >
      <img src={img} alt={id} className="w-full h-80 object-cover object-[100%_80%]" />
      <div className="p-4">
        <div className="font-medium mb-2">{title}</div>
        {priceItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded-full text-sm font-semibold ${item.color}`}
            >
              {item.label}
            </span>
            <span className="text-gray-700">{item.value}</span>
          </div>
        ))}
        <div className="text-sm text-gray-500">{extra}</div>
      </div>
    </motion.div>
  );
}