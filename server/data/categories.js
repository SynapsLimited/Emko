// server/data/categories.js

const categories = [
  {
    slug: 'chairs',
    name: {
      sq: 'Karrige',
      en: 'Chairs',
    },
    description: {
      sq: 'Rehati dhe efikasitet për zgjidhje të ndryshme të akomodimit.',
      en: 'Comfortable and ergonomic seating solutions for various settings.',
    },
    imageSrc: '/assets/2023/08/office-chairfddc.png',
    subcategories: [
      {
        slug: 'executive-chairs',
        name: {
          sq: 'Karrige Ekzekutive',
          en: 'Executive Chairs',
        },
        description: {
          sq: 'Rehati dhe dizajn elegant për drejtues dhe zyra të stilit modern.',
          en: 'Comfort and elegant design for executives and modern offices.',
        },
      },
      {
        slug: 'operative-chairs',
        name: {
          sq: 'Karrige Operative',
          en: 'Operative Chairs',
        },
        description: {
          sq: 'Funksionale dhe të qëndrueshme për përdorim të përditshëm.',
          en: 'Functional and durable for everyday use.',
        },
      },
      {
        slug: 'waiting-chairs',
        name: {
          sq: 'Karrige Pritëse',
          en: 'Waiting Chairs',
        },
        description: {
          sq: 'Komoditet dhe estetikë për zona pritjeje moderne.',
          en: 'Comfort and aesthetics for modern waiting areas.',
        },
      },
    ],
  },
  {
    slug: 'tables',
    name: {
      sq: 'Tavolina',
      en: 'Tables',
    },
    description: {
      sq: 'Funksionale dhe elegante për qëllime të ndryshme.',
      en: 'Functional and stylish tables for different purposes.',
    },
    imageSrc: '/assets/2023/08/tablefddc.png',
    subcategories: [
      {
        slug: 'executive-tables',
        name: {
          sq: 'Tavolina Ekzekutive',
          en: 'Executive Tables',
        },
        description: {
          sq: 'Tavolina elegante për zyra ekzekutive.',
          en: 'Elegant tables for executive offices.',
        },
      },
      {
        slug: 'operative-tables',
        name: {
          sq: 'Tavolina Operative',
          en: 'Operative Tables',
        },
        description: {
          sq: 'Tavolina praktike për punë të përditshme në zyrë.',
          en: 'Practical tables for everyday office work.',
        },
      },
      {
        slug: 'meeting-tables',
        name: {
          sq: 'Tavolina për Mbledhje',
          en: 'Meeting Tables',
        },
        description: {
          sq: 'Tavolina të dizajnuara për hapësira bashkëpunuese.',
          en: 'Tables designed for collaborative spaces.',
        },
      },
    ],
  },
  {
    slug: 'industrial-lines',
    name: {
      sq: 'Linja Industriale',
      en: 'Industrial Lines',
    },
    description: {
      sq: 'Zgjidhje të qëndrueshme për mjedise industriale.',
      en: 'Durable furniture solutions for industrial environments.',
    },
    imageSrc: '/assets/2023/08/table-1fddc.png',
    subcategories: [
      {
        slug: 'wooden-wardrobe',
        name: {
          sq: 'Dollapë Druri',
          en: 'Wooden Wardrobe',
        },
        description: {
          sq: 'Dollapë druri të qëndrueshme për organizim të hapësirës.',
          en: 'Durable wooden wardrobes for space organization.',
        },
      },
      {
        slug: 'metal-wardrobe',
        name: {
          sq: 'Dollapë Metalik',
          en: 'Metal Wardrobe',
        },
        description: {
          sq: 'Dollapë metalike të forta për ruajtje efikase.',
          en: 'Sturdy metal wardrobes for efficient storage.',
        },
      },
      {
        slug: 'metal-scaffolding',
        name: {
          sq: 'Skafale Metalike',
          en: 'Metal Scaffolding',
        },
        description: {
          sq: 'Skafale metalike të shumëanshme.',
          en: 'Versatile metal scaffolding systems.',
        },
      },
      {
        slug: 'metal-cabinets',
        name: {
          sq: 'Dollapë Metalik',
          en: 'Metal Cabinets',
        },
        description: {
          sq: 'Zgjidhje të qëndrueshme për ruajtje prej metali.',
          en: 'Durable metal storage options.',
        },
      },
    ],
  },
  {
    slug: 'school',
    name: {
      sq: 'Shkollë',
      en: 'School',
    },
    description: {
      sq: 'Mobilim i dizajnuar për institucione arsimore.',
      en: 'Furniture designed for educational institutions.',
    },
    imageSrc: '/assets/2023/08/classroomfddc.png',
    subcategories: [
      {
        slug: 'classrooms',
        name: {
          sq: 'Klasa Shkolle',
          en: 'Classrooms',
        },
        description: {
          sq: 'Mobilim për ambiente mësimore efektive.',
          en: 'Furniture for effective learning environments.',
        },
      },
      {
        slug: 'laboratories',
        name: {
          sq: 'Laboratorë',
          en: 'Laboratories',
        },
        description: {
          sq: 'Mobilim i specializuar për laboratorë shkollorë.',
          en: 'Specialized furniture for school labs.',
        },
      },
    ],
  },
  {
    slug: 'amphitheater',
    name: {
      sq: 'Amfiteatër',
      en: 'Amphitheater',
    },
    description: {
      sq: 'Zgjidhje akomoduese për grumbullime të mëdha dhe prezantime.',
      en: 'Seating solutions for large gatherings and presentations.',
    },
    imageSrc: '/assets/2023/08/theaterfddc.png',
    subcategories: [
      {
        slug: 'auditoriums',
        name: {
          sq: 'Auditore',
          en: 'Auditoriums',
        },
        description: {
          sq: 'Ulëse komode për publik të madhë.',
          en: 'Comfortable seating for large audiences.',
        },
      },
      {
        slug: 'seminar-halls',
        name: {
          sq: 'Salla Seminarësh',
          en: 'Seminar Halls',
        },
        description: {
          sq: 'Ulëse të shumëanshme për seminare arsimore.',
          en: 'Versatile seating for educational seminars.',
        },
      },
    ],
  },
  {
    slug: 'sofas',
    name: {
      sq: 'Kolltuqe',
      en: 'Sofas',
    },
    description: {
      sq: 'Kolltuqe komode dhe stile për ambiente të ndryshme.',
      en: 'Comfortable and stylish sofas for various settings.',
    },
    imageSrc: '/assets/2023/08/couchfddc.png',
    subcategories: [],
  },
  {
    slug: 'mixed',
    name: {
      sq: 'Miks',
      en: 'Mixed',
    },
    description: {
      sq: 'Mobilim dhe aksesorë të ndryshëm për nevoja të shumëanshme.',
      en: 'Assorted furniture and accessories for diverse needs.',
    },
    imageSrc: '/assets/2023/08/tribunefddc.png',
    subcategories: [
      {
        slug: 'coat-racks',
        name: {
          sq: 'Varëse Xhaketash',
          en: 'Coat Racks',
        },
        description: {
          sq: 'Zgjidhje praktike për të varur xhaketa dhe aksesorë.',
          en: 'Practical solutions for hanging coats and accessories.',
        },
      },
      {
        slug: 'interactive-whiteboards',
        name: {
          sq: 'Tabela Interaktive',
          en: 'Interactive Whiteboards',
        },
        description: {
          sq: 'Mjete moderne për prezantime interaktive.',
          en: 'Modern tools for interactive presentations.',
        },
      },
      {
        slug: 'reception-counters',
        name: {
          sq: 'Banak Recepsioni',
          en: 'Reception Counters',
        },
        description: {
          sq: 'Banak mikëpritës për zona recepsioni.',
          en: 'Welcoming counters for reception areas.',
        },
      },
    ],
  },
];

module.exports = categories;
