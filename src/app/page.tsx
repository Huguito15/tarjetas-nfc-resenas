import { products } from "@/data/content";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/site-url";
import { OrderProvider } from "@/components/providers/order-provider";
import { LightboxProvider } from "@/components/providers/lightbox-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { Hero } from "@/components/sections/hero";
import { UseCases } from "@/components/sections/use-cases";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Benefits } from "@/components/sections/benefits";
import { Testimonials } from "@/components/sections/testimonials";
import { Calculator } from "@/components/sections/calculator";
import { Products } from "@/components/sections/products";
import { Packs } from "@/components/sections/packs";
import { Faq } from "@/components/sections/faq";
import { CtaBand } from "@/components/sections/cta-band";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  // El formulario envía al servidor solo si hay un webhook configurado (ver .env.example).
  const endpointEnabled = Boolean(process.env.ORDER_WEBHOOK_URL?.trim());
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteConfig.name,
        url: siteUrl,
        ...(siteConfig.email ? { email: siteConfig.email } : {}),
      },
      ...products.map((product) => ({
        "@type": "Product",
        name: product.name,
        description: product.tagline,
        brand: { "@id": `${siteUrl}/#organization` },
        ...(product.photo ? { image: `${siteUrl}${product.photo.image.src}` } : {}),
        offers: {
          "@type": "Offer",
          price: product.price.toFixed(2),
          priceCurrency: "EUR",
          url: `${siteUrl}/#productos`,
        },
      })),
    ],
  };

  return (
    <OrderProvider>
      <LightboxProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Navbar />
        <main id="contenido">
          <Hero />
          <UseCases />
          <HowItWorks />
          <Benefits />
          <Testimonials />
          <Products />
          <Calculator />
          <Packs />
          <Faq />
          <CtaBand />
          <Contact endpointEnabled={endpointEnabled} />
        </main>
        <Footer />
        <FloatingActions />
      </LightboxProvider>
    </OrderProvider>
  );
}
