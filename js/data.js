/* ==========================================================================
   BNOT SÉMINAIRE - PRODUCTION INITIAL DATASET
   ========================================================================== */

export const INITIAL_KOUPAT_FUNDS = [
  {
    id: 'maccabi',
    name: 'Maccabi Health',
    logo: '🏥',
    badge: 'Populaire Séminaires',
    description: 'La caisse privilégiée par 70% des séminaires francophones à Jérusalem. Services de traduction en français et pédiatres/médecins généralistes bilingues.',
    accentColor: '#0284c7',
    features: [
      'Conseillers francophones dédiés aux étudiantes',
      'Application mobile intuitive disponible en anglais/français',
      'Remboursement rapide des consultations spécialisées',
      'Réseau de pharmacies affiliées à Jérusalem et Bnei Brak'
    ],
    requiredDocs: ['Copie du Passeport', 'Visa d\'étudiant A/2 ou récépissé', 'Attestation d\'inscription au séminaire', 'Formulaire de demande d\'affiliation']
  },
  {
    id: 'clalit',
    name: 'Clalit Health Services',
    logo: '⚕️',
    badge: 'Réseau National',
    description: 'La plus grande caisse de santé d\'Israël avec un réseau vaste de centres médicaux d\'urgence et de cliniques de garde.',
    accentColor: '#059669',
    features: [
      'Plus grand réseau d\'hôpitaux et centres médicaux en Israël',
      'Services de médecine en ligne 24h/7j',
      'Couverture dentaire pour les jeunes assurés',
      'Partenariat direct avec les principaux séminaires'
    ],
    requiredDocs: ['Copie du Passeport', 'Visa d\'étudiant A/2', 'Attestation du Séminaire', 'RIB ou carte bancaire pour prélèvement']
  },
  {
    id: 'meuhedet',
    name: 'Meuhedet',
    logo: '🏨',
    badge: 'Proximité Jérusalem',
    description: 'Excellente présence au cœur de Jérusalem (Geula, Ramot, Har Nof) avec de nombreux médecins spécialistes.',
    accentColor: '#d97706',
    features: [
      'Centres médicaux situés directement dans les quartiers des séminaires',
      'Prise de rendez-vous en ligne ultra simple',
      'Prise en charge des urgences de nuit',
      'Service client attentif et réactif'
    ],
    requiredDocs: ['Copie du Passeport', 'Visa A/2', 'Lettre d\'acceptation du Séminaire']
  },
  {
    id: 'leumit',
    name: 'Leumit',
    logo: '🩺',
    badge: 'Service Personnalisé',
    description: 'Caisse de santé à taille humaine offrant un suivi individualisé et des rendez-vous rapides.',
    accentColor: '#7c3aed',
    features: [
      'Délais d\'attente réduits pour les spécialistes',
      'Accompagnement personnalisé des formalités',
      'Couverture complémentaire attractive'
    ],
    requiredDocs: ['Passeport', 'Attestation Séminaire', 'Visa A/2']
  }
];

export const INITIAL_VISA_STEPS = [
  {
    id: 'passport',
    title: 'Passeport valide (minimum 6 mois)',
    description: 'Assurez-vous que votre passeport est valide au moins 6 mois après votre date prévue de retour en France.',
    category: 'Préparatifs'
  },
  {
    id: 'attestation',
    title: 'Attestation Officielle du Séminaire',
    description: 'Document tamponné par la direction de votre séminaire confirmant votre inscription pour l\'année académique.',
    category: 'Séminaire'
  },
  {
    id: 'parental',
    title: 'Autorisation Parentale de Sortie du Territoire',
    description: 'Formulaire signé par les parents pour les jeunes filles mineures au moment du départ.',
    category: 'Administratif'
  },
  {
    id: 'insurance',
    title: 'Attestation d\'Assurance Santé (Koupat Holim)',
    description: 'Preuve de couverture médicale souscrite auprès d\'une caisse israélienne ou assurance équivalente.',
    category: 'Santé'
  },
  {
    id: 'consulate_appointment',
    title: 'Rendez-vous Consulat / Misrad HaPnim',
    description: 'Prise de rendez-vous en ligne sur le consulat d\'Israël à Paris/Marseille ou directement au Ministère de l\'Intérieur à Jérusalem.',
    category: 'Rendez-vous'
  }
];

// Production starter catalog
export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Pack Lit Séminaire Luxe (100% Coton)',
    category: 'Literie',
    price: 180,
    currency: '₪',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
    description: 'Ensemble complet comprenant : 1 draps-housse (90x200cm), 1 housse de couette douce et 1 taie d\'oreiller. Spécialement adapté aux matelas de séminaire.',
    stock: 50,
    available: true,
    tag: 'Incontournable'
  },
  {
    id: 'prod-2',
    name: 'Koum-Koum Shabbat Inox 4.5L (Automatique)',
    category: 'Électroménager',
    price: 240,
    currency: '₪',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=600&q=80',
    description: 'Bouilloire de Shabbat en inox avec maintien au chaud certifié casher pour Shabbat et Yom Tov. Indispensable pour le thé/café du matin en chambre.',
    stock: 30,
    available: true,
    tag: 'Certifié Casher'
  },
  {
    id: 'prod-3',
    name: 'Plata de Shabbat Grand Format (4 casseroles)',
    category: 'Électroménager',
    price: 220,
    currency: '₪',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    description: 'Plaque chauffante de Shabbat de grande capacité. Chauffe rapidement et maintient vos plats au chaud en toute sécurité.',
    stock: 25,
    available: true,
    tag: 'Sécurité Réhaussée'
  },
  {
    id: 'prod-4',
    name: 'Multiprise & Adaptateurs Prises Israël (Pack 3)',
    category: 'Électronique',
    price: 65,
    currency: '₪',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'Kit de 3 adaptateurs conformes aux normes israéliennes (Prise Type H/C) + 1 rallonge multiprise 4 ports avec protection surtension.',
    stock: 100,
    available: true,
    tag: 'Essentiel'
  },
  {
    id: 'prod-5',
    name: 'Sèche-Cheveux Pro Ionic 2200W',
    category: 'Beauté',
    price: 150,
    currency: '₪',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    description: 'Sèche-cheveux ultra puissant et léger avec technologie ionique anti-frisottis. Prise européenne compatible direct.',
    stock: 20,
    available: true,
    tag: 'Compact & Puissant'
  },
  {
    id: 'prod-6',
    name: 'Couette Hiver Ultra Douce & Chaude (300g/m²)',
    category: 'Literie',
    price: 140,
    currency: '₪',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    description: 'Couette synthétique hypoallergénique, respirante et ultra-chaude pour affronter les nuits fraîches de Jérusalem.',
    stock: 40,
    available: true,
    tag: 'Confort Hiver'
  }
];

// Production accounts (Only official admin account, no fake students)
export const INITIAL_USERS = [
  {
    id: 'usr-admin-prod',
    name: 'Administrateur Bnot Séminaire',
    email: 'contact@bnotseminaire.com',
    password: 'Meirguetta06',
    role: 'admin',
    phone: '+972 54-123-4567',
    seminary: 'Direction Générale Bnot Séminaire',
    passport: 'ADMIN-PROD',
    arrivalDate: '2026-08-01',
    createdAt: '2026-08-01'
  }
];

// Production initial empty reservations
export const INITIAL_RESERVATIONS = [];
