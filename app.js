const properties = [
  {
    id: 1,
    title: "Casa en venta de 4 dormitorios en Villa Angela",
    location: "25 de Mayo 465",
    type: "casa",
    operation: "comprar",
    price: 250000,
    description: "",
    detailedDescription: "Esta propiedad es perfecta tanto para uso residencial como para fines comerciales gracias a su apto profesional y a su ubicación estratégica frente al Banco Nación y la Comisaría Primera. Con orientación este, disfrutarás de la luminosidad y calidez en cada rincón de la casa. Además, sus comodidades como salón de usos múltiples, escritorio, lavadero, conexión para lavarropas y seguridad brindan un estilo de vida exclusivo y conveniente. No pierdas la oportunidad de adquirir esta joya inmobiliaria que combina historia y modernidad en un solo lugar.",
    images: [
      "https://storage.googleapis.com/portales-prod-images/3672/property-images/2024/4/f31ba3cd-e101-44ce-a49d-0d261016dd79_wm.jpeg",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c714935?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600566753377-9c7b942e6d39?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ],
    squareMeters: 1000,
    bedrooms: 4,
    bathrooms: 2,
    owner: "Lionel Messi",
    phone: "1234567890",
    featured: true
  },
  {
    id: 2,
    title: "Departamento moderno",
    location: "Barrio Norte",
    type: "departamento",
    operation: "alquilar",
    price: 500,
    description: "1 dormitorio, balcón, cerca de comercios.",
    detailedDescription: "Departamento luminoso con balcón y vistas al parque. Incluye cocina equipada con electrodomésticos de alta gama, aire acondicionado y calefacción por losa radiante. Ubicado a pasos de tiendas, restaurantes y transporte público. Ideal para solteros o parejas jóvenes que buscan un estilo de vida urbano.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600566753086-1033a4e6b759?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ],
    squareMeters: 50,
    bedrooms: 1,
    bathrooms: 1,
    owner: "Lamine Yamal",
    phone: "0987654321",
    featured: true
  },
  {
    id: 3,
    title: "Terreno amplio",
    location: "Afueras",
    type: "terreno",
    operation: "comprar",
    price: 30000,
    description: "500 m², ideal para construir.",
    detailedDescription: "Terreno de 500 m² en una zona tranquila y de gran potencial, perfecto para construir la casa de tus sueños. Cuenta con acceso a servicios básicos (agua, electricidad) y está a solo 15 minutos del centro de la ciudad. Ideal para inversores o familias que buscan un proyecto personalizado.",
    images: [
      "https://static1.sosiva451.com/16936851/90f924a9-f454-4c37-a4a4-384465f1fff8_u_small.jpg"
    ],
    squareMeters: 500,
    bedrooms: 0,
    bathrooms: 0,
    owner: "Robert Lewandowski",
    phone: "1122334455",
    featured: false
  },
  {
    id: 4,
    title: "Casa de lujo",
    location: "Centro",
    type: "casa",
    operation: "comprar",
    price: 150000,
    description: "Hermosa casa familiar en el corazón de la ciudad.",
    detailedDescription: "Esta casa de 3 dormitorios y 2 baños es ideal para familias que buscan comodidad y ubicación céntrica. Cuenta con un amplio living, cocina moderna con electrodomésticos de acero inoxidable, patio trasero con quincho y garage. Construida en 2015, está en excelente estado con pisos de madera y detalles de diseño premium.",
    images: [
      "https://www.construyehogar.com/wp-content/uploads/2016/01/Casa-moderna-un-piso.jpg",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c714935?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600566753377-9c7b942e6d39?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ],
    squareMeters: 120,
    bedrooms: 3,
    bathrooms: 2,
    owner: "Neymar Jr",
    phone: "1234567890",
    featured: false
  },
  {
    id: 5,
    title: "Local comercial ",
    location: "Centro",
    type: "local",
    operation: "alquilar",
    price: 800,
    description: "Ideal para negocio, 70 m².",
    detailedDescription: "Local comercial de 70 m² ubicado en el centro de Villa Ángela, perfecto para emprendedores. Tiene una amplia vidriera, espacio para almacenamiento y baño privado. Alta visibilidad y tráfico peatonal, ideal para tiendas o servicios.",
    images: [
      "https://ivancotado.es/wp-content/uploads/2012/03/ivan_cotado_tu_vision_ii_optica_ponferrada_21.jpg"
    ],
    squareMeters: 70,
    bedrooms: 0,
    bathrooms: 1,
    owner: "Emiliano Martinez",
    phone: "9876543210",
    featured: true
  },
  {
    id: 6,
    title: "Oficina moderna en edificio nuevo",
    location: "Barrio Norte",
    type: "oficina",
    operation: "comprar",
    price: 90000,
    description: "Oficina de 60 m² con vistas.",
    detailedDescription: "Oficina de 60 m² en un edificio moderno con vistas panorámicas. Incluye aire acondicionado, iluminación LED, y acceso a sala de reuniones compartida. Perfecta para profesionales o pequeñas empresas que buscan un espacio funcional y bien ubicado.",
    images: [
      "https://sillaoficina365.es/img/cms/BLOG/JUNIO/03/imagen-2.jpg"
    ],
    squareMeters: 60,
    bedrooms: 0,
    bathrooms: 1,
    owner: "Lautaro Martinez",
    phone: "5555555555",
    featured: false
  },
  {
    id: 7,
    title: "Campo de 10 hectáreas",
    location: "Afueras",
    type: "campo",
    operation: "comprar",
    price: 120000,
    description: "Ideal para agricultura o descanso.",
    detailedDescription: "Campo de 10 hectáreas a 20 minutos de Villa Ángela, con acceso a agua y electricidad. Perfecto para proyectos agrícolas, ganaderos o como retiro de fin de semana. Incluye alambrado perimetral y un pequeño galpón.",
    images: [
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ],
    squareMeters: 100000,
    bedrooms: 0,
    bathrooms: 0,
    owner: "El burro de Cavani",
    phone: "6666666666",
    featured: false
  }
];

// Función para renderizar propiedades en la página principal
function renderProperties(filteredProperties, containerId, showFeaturedBadge = false) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (filteredProperties.length === 0) {
    container.innerHTML = '<p class="text-gray-600 col-span-3 text-center py-10">No se encontraron propiedades que coincidan con tu búsqueda.</p>';
    return;
  }

  filteredProperties.forEach(property => {
    const card = document.createElement('div');
    card.className = 'property-card p-4 rounded-lg overflow-hidden transition duration-300';
    card.innerHTML = `
      <div class="relative overflow-hidden">
        <img src="${property.images[0]}" alt="${property.title}" class="w-full h-48 sm:h-64 object-cover transition duration-500" loading="lazy">
        ${showFeaturedBadge && property.featured ? '<span class="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">Destacado</span>' : ''}
      </div>
      <div class="p-4 sm:p-6">
        <h4 class="text-xl sm:text-2xl font-montserrat font-semibold text-gray-800">${property.title}</h4>
        <p class="text-gray-600 mt-2 text-sm sm:text-base">${property.type.charAt(0).toUpperCase() + property.type.slice(1)} - ${property.operation === 'comprar' ? 'Venta' : 'Alquiler'} - $${property.price.toLocaleString()}</p>
        <p class="text-gray-500 text-xs sm:text-sm mt-2 line-clamp-2">${property.description}</p>
        <a href="property-details.html?id=${property.id}" class="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:from-indigo-700 hover:to-purple-800 transition duration-300 block text-center">Ver más detalles</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// Función para filtrar propiedades en la página principal
function filterProperties() {
  const searchInput = document.getElementById('searchInput');
  const operationFilter = document.getElementById('operationFilter');
  const typeFilter = document.getElementById('typeFilter');
  const sortPrice = document.getElementById('sortPrice');

  if (!searchInput || !operationFilter || !typeFilter || !sortPrice) return;

  const searchText = searchInput.value.toLowerCase();
  const operation = operationFilter.value;
  const type = typeFilter.value;
  const sortPriceValue = sortPrice.value;

  let filtered = properties.filter(property => {
    const matchesText = property.title.toLowerCase().includes(searchText) || 
                       property.location.toLowerCase().includes(searchText) ||
                       property.description.toLowerCase().includes(searchText);
    const matchesOperation = !operation || property.operation === operation;
    const matchesType = !type || property.type === type;
    return matchesText && matchesOperation && matchesType;
  });

  if (sortPriceValue) {
    filtered.sort((a, b) => sortPriceValue === 'asc' ? a.price - b.price : b.price - a.price);
  }

  const resultsHeader = document.getElementById('searchResultsHeader');
  const featuredSection = document.getElementById('featuredSection');
  const allPropertiesSection = document.getElementById('allPropertiesSection');
  const propertiesContainer = document.getElementById('propertiesContainer');

  if (!resultsHeader || !featuredSection || !allPropertiesSection || !propertiesContainer) return;

  const hasSearch = searchText || operation || type || sortPriceValue;

  if (hasSearch) {
    resultsHeader.classList.remove('hidden');
    featuredSection.classList.add('hidden');
    allPropertiesSection.classList.add('hidden');
    propertiesContainer.classList.remove('hidden');
    renderProperties(filtered, 'propertiesContainer', true);
  } else {
    resultsHeader.classList.add('hidden');
    featuredSection.classList.remove('hidden');
    allPropertiesSection.classList.remove('hidden');
    propertiesContainer.classList.add('hidden');

    renderProperties(
      properties.filter(p => p.featured),
      'featuredProperties',
      true
    );

    renderProperties(
      properties.filter(p => !p.featured),
      'allProperties',
      false
    );
  }
}

// Función para cargar detalles de la propiedad en property-details.html
function loadPropertyDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = parseInt(urlParams.get('id'));
  const property = properties.find(p => p.id === propertyId);

  if (!property) {
    document.querySelector('main').innerHTML = '<p class="text-gray-600 text-center py-10">Propiedad no encontrada.</p>';
    return;
  }

  document.title = `${property.title} | Ubify`;

  document.getElementById('modalTitle').textContent = property.title;
  document.getElementById('modalPrice').textContent = `$${property.price.toLocaleString()}`;
  document.getElementById('modalTypeBadge').textContent = property.type.charAt(0).toUpperCase() + property.type.slice(1);
  document.getElementById('modalOperationBadge').textContent = property.operation === 'comprar' ? 'Venta' : 'Alquiler';
  document.getElementById('modalLocationBadge').textContent = property.location;
  document.getElementById('modalLocation').textContent = property.location;
  document.getElementById('modalSquareMeters').textContent = `${property.squareMeters} m²`;
  document.getElementById('modalBedrooms').textContent = `${property.bedrooms} dormitorio${property.bedrooms !== 1 ? 's' : ''}`;
  document.getElementById('modalBathrooms').textContent = `${property.bathrooms} baño${property.bathrooms !== 1 ? 's' : ''}`;
  document.getElementById('modalDescription').textContent = property.detailedDescription;
  document.getElementById('modalOwner').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>${property.owner}`;
  document.getElementById('modalPhone').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>${property.phone}`;
  document.getElementById('modalWhatsApp').href = `https://wa.me/+54${property.phone}?text=Hola, estoy interesado en la propiedad "${property.title}" en ${property.location}`;

  let currentImageIndex = 0;
  const mainImage = document.getElementById('mainImage');
  const thumbnailContainer = document.getElementById('thumbnailContainer');

  mainImage.src = property.images[0];
  mainImage.alt = property.title;
  thumbnailContainer.innerHTML = property.images.map((img, index) => `
    <img src="${img}" alt="Miniatura ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})">
  `).join('');

  window.prevImage = function() {
    currentImageIndex = (currentImageIndex - 1 + property.images.length) % property.images.length;
    updateImage();
  };

  window.nextImage = function() {
    currentImageIndex = (currentImageIndex + 1) % property.images.length;
    updateImage();
  };

  window.changeImage = function(index) {
    currentImageIndex = index;
    updateImage();
  };

  function updateImage() {
    mainImage.src = property.images[currentImageIndex];
    mainImage.alt = `${property.title} - Imagen ${currentImageIndex + 1}`;
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
      thumb.classList.toggle('active', index === currentImageIndex);
    });
  }

  const copyLinkButton = document.getElementById('copyLinkButton');
  if (copyLinkButton) {
    copyLinkButton.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Enlace copiado al portapapeles'))
        .catch(() => alert('Error al copiar el enlace'));
    });
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('property-details.html')) {
    loadPropertyDetails();
  } else {
    filterProperties();
  }
});

// Event listeners para la página principal
if (document.getElementById('searchInput')) {
  document.getElementById('searchInput').addEventListener('input', filterProperties);
}
if (document.getElementById('operationFilter')) {
  document.getElementById('operationFilter').addEventListener('change', filterProperties);
}
if (document.getElementById('typeFilter')) {
  document.getElementById('typeFilter').addEventListener('change', filterProperties);
}
if (document.getElementById('sortPrice')) {
  document.getElementById('sortPrice').addEventListener('change', filterProperties);
}