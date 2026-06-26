export type ServiceProcess = {
  step: number;
  title: string;
  description: string;
};

export type ServiceSeo = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  shortDescription: string;
  icon: string;
  heroImage: string;
  cardImage: string;
  features: string[];
  process: ServiceProcess[];
  seo: ServiceSeo;
};

export type ServiceId = Service["id"];
