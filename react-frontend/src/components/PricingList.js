import { PricingCard } from "./PricingCard";
import { useTranslation } from "react-i18next";
import thumbnail_bed from "../resources/thumbnail.jpg";
import thumbnail_cpm from "../resources/cpm_thumbnail.jpg"

export function PricingList() {
  const { t } = useTranslation();

  const pricingItems = [
  {
    id: "bed",
    title: t("pricingBedTitle"),
    priceItems: [
      {
        label: t("pricingBedPriceType"),
        value: "18 000 - 35 000 HUF",
        color: "bg-gray-500 text-white",
      },
    ],
    extra: t("pricingBedExtraText"),
    img: thumbnail_bed,
  },
  {
    id: "cpm",
    title: t("pricingCPMTitle"),
    priceItems: [
      {
        label: t("pricingCPMPriceType1"),
        value: "1 200 - 3 000 HUF",
        color: "bg-red-500 text-white",
      },
      {
        label: t("pricingCPMPriceType2"),
        value: "8 000 - 18 000 HUF",
        color: "bg-black text-white",
      },
    ],
    extra: "",
    img: thumbnail_cpm
  },
];

  return (
    <>
      {pricingItems.map((item, idx) => (
        <PricingCard key={idx} {...item} />
      ))}
    </>
  );
}
