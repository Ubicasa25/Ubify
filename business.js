import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Tu config de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC0iRq9z-KJxjnX_4CpjEZrwvX0hjvPb1w",
  authDomain: "ubify-598fe.firebaseapp.com",
  projectId: "ubify-598fe",
  storageBucket: "ubify-598fe.appspot.com",
  messagingSenderId: "291570754705",
  appId: "1:291570754705:web:c458124db5954b58d34b30"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let allBusinesses = [];

// Elementos del Modal
const modal = document.getElementById('detailModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModalBtn = document.getElementById('closeModalBtn');

// Cargar datos
async function loadBusinesses() {
  const container = document.getElementById('businessContainer');
  const loader = document.getElementById('loadingIndicator');
  const footer = document.getElementById('mainFooter'); // Referencia al Footer
  
  try {
    const querySnapshot = await getDocs(collection(db, "emprendimientos"));
    allBusinesses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    loader.classList.add('hidden');
    container.classList.remove('hidden');
    
    renderBusinesses(allBusinesses);

  } catch (error) {
    console.error("Error:", error);
    loader.innerHTML = `<p class="text-red-500">Error al cargar datos. Intenta recargar.</p>`;
  } finally {
    // ESTO SE EJECUTA SIEMPRE, HAYA ERROR O NO
    if (footer) {
        footer.classList.remove('hidden');
    }
  }
}

// Renderizar Cards
function renderBusinesses(businesses) {
  const container = document.getElementById('businessContainer');
  const noResults = document.getElementById('noResults');
  
  container.innerHTML = '';

  if (businesses.length === 0) {
    container.classList.add('hidden');
    noResults.classList.remove('hidden');
    return;
  }
  
  noResults.classList.add('hidden');
  container.classList.remove('hidden');

  businesses.forEach(biz => {
    const imageSrc = biz.imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen';
    
    let whatsappLink = '#';
    if(biz.telefono) {
        const text = `Hola ${biz.nombre}, te vi en Ubify y quería consultar...`;
        whatsappLink = `https://wa.me/${biz.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    }

    const card = document.createElement('div');
    card.className = 'group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 cursor-pointer';
    
    card.onclick = () => openBusinessModal(biz);

    /* DISEÑO LOGO CENTRADO */
    card.innerHTML = `
      <div class="relative h-48 md:h-60 overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100">
        <img src="${imageSrc}" alt="${biz.nombre}" class="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500">
        <div class="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold text-blue-600 shadow-md border border-white/50">
          ${getCategoryIcon(biz.categoria)} ${biz.categoria || 'Varios'}
        </div>
      </div>
      
      <div class="p-4 md:p-7 flex flex-col flex-1 relative">
        <h3 class="text-lg sm:text-xl font-extrabold text-gray-800 mb-1 sm:mb-2 leading-tight group-hover:text-blue-600 transition-colors">
            ${biz.nombre}
        </h3>
        
        <div class="flex items-start text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
            <svg class="w-4 h-4 mr-1 mt-0.5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="line-clamp-1">${biz.ubicacion || 'Villa Ángela'}</span>
        </div>

        <p class="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed flex-1">
          ${biz.descripcion || 'Descubrí este increíble emprendimiento local en Ubify.'}
        </p>

        <div class="flex flex-wrap gap-2 mt-auto">
           ${biz.telefono ? `
           <a href="${whatsappLink}" target="_blank" onclick="event.stopPropagation()" class="flex-1 min-w-[50px] flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300">
             <i class="fab fa-whatsapp text-xl"></i> 
           </a>` : ''}
           
           ${biz.instagram ? `
           <a href="${biz.instagram}" target="_blank" onclick="event.stopPropagation()" class="flex-1 min-w-[50px] flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm bg-purple-50 text-purple-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300">
             <i class="fab fa-instagram text-xl"></i> 
           </a>` : ''}

           ${biz.web ? `
           <a href="${biz.web}" target="_blank" onclick="event.stopPropagation()" class="flex-1 min-w-[50px] flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
             <i class="fas fa-globe text-xl"></i> 
           </a>` : ''}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Función Modal
function openBusinessModal(biz) {
    const imageSrc = biz.imagen || 'https://via.placeholder.com/600x400';
    const address = biz.ubicacion || 'Villa Ángela, Chaco';
    
    document.getElementById('modalTitle').textContent = biz.nombre;
    document.getElementById('modalCategory').textContent = biz.categoria || 'Comercio';
    document.getElementById('modalDesc').textContent = biz.descripcion || 'Sin descripción detallada.';
    document.getElementById('modalLocation').textContent = address;
    
    const modalImg = document.getElementById('modalImg');
    modalImg.src = imageSrc;
    // Forzamos clases para el modal especifico
    modalImg.className = "w-full h-full object-contain p-4 bg-gray-100";

    // --- LÓGICA MAPA ---
    const iframeMap = document.getElementById('modalMap');
    const loadingOverlay = document.getElementById('mapLoadingOverlay');
    
    loadingOverlay.classList.remove('hidden');
    iframeMap.src = ''; 

    let mapUrlStr = '';
    if (biz.mapUrl && biz.mapUrl.length > 10) {
        mapUrlStr = biz.mapUrl;
    } else {
        const mapQuery = encodeURIComponent(address + ", Villa Angela, Chaco, Argentina");
        mapUrlStr = `http://googleusercontent.com/maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }

    iframeMap.onload = function() {
        loadingOverlay.classList.add('hidden');
    };

    iframeMap.src = mapUrlStr;

    // Botones del Modal
    const btnContainer = document.getElementById('modalButtons');
    let buttonsHtml = '';

    if(biz.telefono) {
        const text = `Hola ${biz.nombre}, vi su perfil en Ubify y quería consultar...`;
        const waLink = `https://wa.me/${biz.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
        buttonsHtml += `
        <a href="${waLink}" target="_blank" class="flex flex-col items-center justify-center p-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition">
            <i class="fab fa-whatsapp text-2xl mb-1"></i>
            <span class="text-xs font-bold">WhatsApp</span>
        </a>`;
    }

    if(biz.instagram) {
        buttonsHtml += `
        <a href="${biz.instagram}" target="_blank" class="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition">
            <i class="fab fa-instagram text-2xl mb-1"></i>
            <span class="text-xs font-bold">Instagram</span>
        </a>`;
    }

    if(biz.web) {
        buttonsHtml += `
        <a href="${biz.web}" target="_blank" class="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
            <i class="fas fa-globe text-2xl mb-1"></i>
            <span class="text-xs font-bold">Sitio Web</span>
        </a>`;
    }

    if(!buttonsHtml) buttonsHtml = `<p class="col-span-3 text-center text-sm text-gray-400">Sin métodos de contacto.</p>`;

    btnContainer.innerHTML = buttonsHtml;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; 
    document.getElementById('modalMap').src = ''; 
}

closeModalBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

// BUSCADOR INTELIGENTE CON SINÓNIMOS
function filterBusinesses() {
  const searchTerm = document.getElementById('searchBusiness').value.toLowerCase().trim();
  const categoryValue = document.getElementById('categoryFilter').value;

  // Diccionario de sinónimos
  const synonyms = {
      'comida': 'gastronomía', 'almuerzo': 'gastronomía', 'cena': 'gastronomía',
      'bebidas': 'gastronomía', 'tragos': 'gastronomía', 'hamburguesa': 'gastronomía',
      'pizza': 'gastronomía', 'helado': 'gastronomía', 'bar': 'gastronomía',
      'restaurante': 'gastronomía', 'delivery': 'gastronomía',
      'ropa': 'indumentaria', 'moda': 'indumentaria', 'zapatillas': 'indumentaria',
      'calzado': 'indumentaria', 'vestido': 'indumentaria', 'remera': 'indumentaria',
      'celular': 'tecnología', 'pc': 'tecnología', 'computadora': 'tecnología',
      'iphone': 'tecnología', 'funda': 'tecnología', 'cargador': 'tecnología',
      'regalo': 'accesorios', 'joya': 'accesorios', 'reloj': 'accesorios',
      'muebles': 'hogar', 'deco': 'hogar', 'sillón': 'hogar', 'mesa': 'hogar',
      'uñas': 'belleza', 'pelo': 'belleza', 'maquillaje': 'belleza', 
      'makeup': 'belleza', 'peluquería': 'belleza', 'estética': 'belleza'
  };

  let impliedCategory = '';
  for (const key in synonyms) {
      if (searchTerm.includes(key)) {
          impliedCategory = synonyms[key].toLowerCase();
          break; 
      }
  }

  const filtered = allBusinesses.filter(biz => {
    const matchesSearch = 
      biz.nombre.toLowerCase().includes(searchTerm) || 
      (biz.descripcion && biz.descripcion.toLowerCase().includes(searchTerm)) ||
      (biz.categoria && biz.categoria.toLowerCase().includes(searchTerm)) ||
      (impliedCategory && biz.categoria && biz.categoria.toLowerCase().includes(impliedCategory));
    
    const matchesCategory = categoryValue === "" || biz.categoria === categoryValue;

    return matchesSearch && matchesCategory;
  });

  renderBusinesses(filtered);
}

// Iconos
function getCategoryIcon(cat) {
    const icons = {
        'Gastronomía': '🍔',
        'Indumentaria': '👗',
        'Accesorios': '💍',
        'Tecnología': '💻',
        'Servicios': '🛠️',
        'Hogar': '🏠',
        'Belleza': '💅'
    };
    return icons[cat] || '✨';
}

document.addEventListener('DOMContentLoaded', () => {
  loadBusinesses();
  document.getElementById('searchBusiness').addEventListener('input', filterBusinesses);
  document.getElementById('categoryFilter').addEventListener('change', filterBusinesses);
  window.filterBusinesses = filterBusinesses;
});
