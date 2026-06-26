export type Stat = {
  id: string;
  value: number;
  suffix: string;
  label: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
};

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
};

export type Milestone = {
  year: string;
  title: string;
  description: string;
};

export type PhilosophyPillar = {
  title: string;
  description: string;
};
