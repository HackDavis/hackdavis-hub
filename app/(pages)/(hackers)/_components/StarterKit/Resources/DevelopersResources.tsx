import ResourceCard from './resource_card';

const developerResources = [
  {
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/',
  },
  {
    name: 'Flexbox Guide',
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
  },
  {
    name: 'W3 Schools: React.js Tutorial',
    url: 'https://www.w3schools.com/REACT/default.asp',
  },
  {
    name: 'Vue.js Tutorial',
    url: 'https://vuejs.org/guide/introduction.html',
  },
  {
    name: '2023 HackDavis WebDev Series',
    url: 'https://github.com/HackDavis/2023-workshops',
  },
  {
    name: 'SASS',
    url: 'https://sass-lang.com/documentation/',
  },
  {
    name: "Josh Comeau's CSS Guide",
    url: 'https://www.joshwcomeau.com/tutorials/css/',
  },
  {
    name: 'YouTube: Jack Herrington',
    url: 'https://www.youtube.com/@jherr/videos',
  },
  {
    name: 'The Modern JavaScript Tutorial',
    url: 'https://javascript.info/',
  },
  {
    name: 'JavaScript ES6',
    url: 'http://es6-features.org/#Constants',
  },
  {
    name: 'Flexbox Froggy',
    url: 'https://flexboxfroggy.com/',
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com/guides/deploying-react-with-vercel',
  },
  {
    name: 'YouTube: How the Backend Works',
    url: 'https://youtu.be/4r6WdaY3SOA',
  },
  {
    name: 'YouTube: What is the Backend?',
    url: 'https://youtu.be/XBu54nfzxAQ',
  },
  {
    name: 'YouTube: Backend Development Explained in 2 Minutes',
    url: 'https://youtu.be/cbSrsYiRamo',
  },
  {
    name: 'YouTube: Learn Express.js in 35 Minutes',
    url: 'https://www.youtube.com/watch?v=SccSCuHhOw0',
  },
  {
    name: 'YouTube: Express.js Crash Course',
    url: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
  },
  {
    name: 'W3 Schools: Node.js Tutorial',
    url: 'https://www.w3schools.com/nodejs/default.asp',
  },
  {
    name: 'W3 Schools: MongoDB Tutorial',
    url: 'https://www.w3schools.com/mongodb/',
  },
  {
    name: 'Google Firebase',
    url: 'https://firebase.google.com/docs/guides',
  },
  {
    name: 'Google Cloud',
    url: 'https://cloud.google.com/docs',
  },
  {
    name: 'Teachable Machine',
    url: 'https://teachablemachine.withgoogle.com/',
  },
  {
    name: 'Top 20 Artificial Intelligence Projects With Source Code [2022]',
    url: 'https://www.interviewbit.com/blog/artificial-intelligence-projects/',
  },
  {
    name: 'TensorFlow',
    url: 'https://www.tensorflow.org/js/demos',
  },
  {
    name: 'PyTorch',
    url: 'https://pytorch.org/',
  },
  {
    name: 'Python scikit-learn',
    url: 'https://scikit-learn.org/stable/',
  },
];

export default function DevelopersResources() {
  return (
    <main className="relative h-[560px] flex flex-col items-center bg-[#123041] p-4 md:p-8 lg:p-12 rounded-xl overflow-hidden">
    <div className="w-full max-h-full overflow-y-auto pr-2 md:pr-3 lg:pr-4 pb-4 md:pb-5 lg:pb-6 custom-scrollbar">
      <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 items-center">
        {developerResources.map((resource) => (
          <ResourceCard key={resource.name} resource={resource} default_img_path='/starterKit/developer_default.svg' />
        ))}
      </div>
    </div>
  </main>
  );
}
