import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, getDocs, addDoc,
  deleteDoc, doc, updateDoc, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const propiedadesRef = collection(db, "propiedades");

// Elementos del DOM
const form = document.getElementById('propForm');
const lista = document.getElementById('listaPropiedades');
const loadingSpinner = document.getElementById('loading-spinner');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const filterOperation = document.getElementById('filter-operation');
const filterType = document.getElementById('filter-type');
const filterFeatured = document.getElementById('filter-featured');
const clearFilters = document.getElementById('clear-filters');
const refreshBtn = document.getElementById('refresh-btn');
const totalProperties = document.getElementById('total-properties');
const featuredCount = document.getElementById('featured-count');
const descCounter = document.getElementById('desc-counter');
const descriptionField = document.getElementById('description');
const currencySelect = document.getElementById('currency');
const priceField = document.getElementById('price');
const modalTitle = document.getElementById('modal-title');
const submitBtnText = document.getElementById('submit-btn-text');
const submitLoading = document.getElementById('submit-loading');

let editandoId = null;
let currentProperties = [];
let featuredPropertiesCount = 0;

// Inicializar la aplicación
function init() {
  console.log("Initializing application...");
  if (!form || !lista || !loadingSpinner) {
    console.error("Required DOM elements are missing:", { form, lista, loadingSpinner });
    showError("Error: Elementos del DOM no encontrados.");
    return;
  }
  setupEventListeners();
  cargarPropiedades();
}

// Configurar event listeners
function setupEventListeners() {
  console.log("Setting up event listeners...");
  document.getElementById('add-property-btn')?.addEventListener('click', openModal);
  document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('cancel-btn')?.addEventListener('click', closeModal);
  document.getElementById('confirm-ok-btn')?.addEventListener('click', closeModal);
  
  form?.addEventListener('submit', handleFormSubmit);
  
  searchBtn?.addEventListener('click', applyFilters);
  searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyFilters();
  });
  
  filterOperation?.addEventListener('change', applyFilters);
  filterType?.addEventListener('change', applyFilters);
  filterFeatured?.addEventListener('click', toggleFeaturedFilter);
  clearFilters?.addEventListener('click', resetFilters);
  refreshBtn?.addEventListener('click', cargarPropiedades);
  
  descriptionField?.addEventListener('input', updateCharacterCount);
  currencySelect?.addEventListener('change', updateCurrencySymbol);
}

// Actualizar símbolo de moneda
function updateCurrencySymbol() {
  const symbol = currencySelect.value === 'USD' ? 'US$' : 
                 currencySelect.value === 'EUR' ? '€' : '$';
  document.getElementById('currency-symbol').textContent = symbol;
}

// Actualizar contador de caracteres
function updateCharacterCount() {
  const count = descriptionField.value.length;
  descCounter.textContent = count;
  
  if (count > 180) {
    descCounter.style.color = '#f59e0b';
  } else {
    descCounter.style.color = '#6b7280';
  }
  
  if (count >= 200) {
    descCounter.style.color = '#dc2626';
  }
}

// Abrir modal
function openModal() {
  console.log("Opening modal...");
  const modal = document.getElementById('add-property-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

// Cerrar modal
function closeModal() {
  console.log("Closing modal...");
  document.getElementById('add-property-modal').style.display = 'none';
  document.getElementById('confirmation-modal').style.display = 'none';
  document.getElementById('delete-modal').style.display = 'none';
  document.body.style.overflow = 'auto';
  limpiarFormulario();
}

// Limpiar formulario
function limpiarFormulario() {
  console.log("Clearing form...");
  form.reset();
  editandoId = null;
  modalTitle.textContent = 'Agregar propiedad';
  submitBtnText.textContent = 'Guardar Propiedad';
  updateCharacterCount();
  updateCurrencySymbol();
}

// Mostrar loading
function showLoading() {
  console.log("Showing loading spinner...");
  if (loadingSpinner) loadingSpinner.style.display = 'flex';
  if (lista) lista.style.display = 'none';
}

// Ocultar loading
function hideLoading() {
  console.log("Hiding loading spinner...");
  if (loadingSpinner) loadingSpinner.style.display = 'none';
  if (lista) lista.style.display = 'grid';
}

// Mostrar confirmación
function showConfirmation(message) {
  console.log("Showing confirmation:", message);
  document.getElementById('confirmation-message').textContent = message;
  document.getElementById('confirmation-modal').style.display = 'flex';
  document.getElementById('confirm-ok-btn').focus();
}

// Mostrar error
function showError(message) {
  console.error("Error:", message);
  const errorModal = document.createElement('div');
  errorModal.className = 'modal';
  errorModal.innerHTML = `
    <div class="modal-content small-modal">
      <div class="modal-body">
        <i class="fas fa-exclamation-circle error-icon"></i>
        <h3>Error</h3>
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" id="close-error-btn">Aceptar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(errorModal);
  errorModal.style.display = 'flex';
  
  document.getElementById('close-error-btn').addEventListener('click', () => {
    errorModal.remove();
  });
}

// Cargar propiedades
async function cargarPropiedades() {
  console.log("Loading properties...");
  try {
    showLoading();
    const q = query(propiedadesRef, orderBy('title'));
    const querySnapshot = await getDocs(q);
    console.log("Query snapshot received, size:", querySnapshot.size);
    
    currentProperties = [];
    featuredPropertiesCount = 0;
    
    if (querySnapshot.empty) {
      console.log("No properties found.");
      renderProperties([]);
      hideLoading();
      return;
    }
    
    querySnapshot.forEach(doc => {
      const p = doc.data();
      p.id = doc.id;
      currentProperties.push(p);
      if (p.featured) featuredPropertiesCount++;
    });
    
    console.log("Properties loaded:", currentProperties.length);
    renderProperties(currentProperties);
    updateStats();
    hideLoading();
  } catch (error) {
    console.error("Error loading properties:", error);
    showError("Error al cargar las propiedades: " + error.message);
    hideLoading();
  }
}

// Renderizar propiedades
function renderProperties(properties) {
  console.log("Rendering properties:", properties.length);
  lista.innerHTML = '';
  
  if (properties.length === 0) {
    lista.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-home empty-icon"></i>
        <h3>No se encontraron propiedades</h3>
        <p>${currentProperties.length === 0 ? 'No hay propiedades disponibles.' : 'No hay propiedades que coincidan con los filtros.'}</p>
      </div>
    `;
    return;
  }
  
  properties.forEach(p => {
    const propertyCard = document.createElement('div');
    propertyCard.className = 'property-card';
    
    const statusClass = p.operation === 'Venta' ? 'sold' : 'rented';
    const statusText = p.operation === 'Venta' ? 'VENTA' : 'ALQUILER';
    
    const mainImage = p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/400x300?text=Sin+imagen';
    
    const priceFormatted = `${p.currency || 'ARS'} ${p.price.toLocaleString()}`;
    
    propertyCard.innerHTML = `
      <div class="property-image-container">
        <img src="${mainImage}" alt="${p.title}" class="property-main-image">
        <span class="property-status ${statusClass}">${statusText}</span>
        ${p.featured ? '<span class="property-featured"><i class="fas fa-star"></i> Destacado</span>' : ''}
      </div>
      <div class="property-content">
        <h3 class="property-title">${p.title}</h3>
        <div class="property-price">${priceFormatted}</div>
        <div class="property-location">
          <i class="fas fa-map-marker-alt"></i> ${p.location}
        </div>
        <div class="property-details">
          <span class="property-detail-item">
            <i class="fas fa-ruler-combined"></i> ${p.squareMeters} m²
          </span>
          <span class="property-detail-item">
            <i class="fas fa-bed"></i> ${p.bedrooms} dorm.
          </span>
          <span class="property-detail-item">
            <i class="fas fa-bath"></i> ${p.bathrooms} baños
          </span>
          <span class="property-detail-item">
            <i class="fas fa-building"></i> ${p.type}
          </span>
        </div>
        <div class="property-actions">
          <button class="btn btn-primary btn-sm" data-id="${p.id}" data-property='${JSON.stringify(p)}'>
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn btn-danger btn-sm" data-id="${p.id}">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `;
    
    lista.appendChild(propertyCard);
  });
  
  document.querySelectorAll('.btn-primary[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const property = JSON.parse(btn.getAttribute('data-property'));
      console.log("Editing property:", id);
      editarPropiedad(id, property);
    });
  });
  
  document.querySelectorAll('.btn-danger[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      console.log("Showing delete confirmation for property:", id);
      mostrarConfirmacionEliminacion(id);
    });
  });
}

// Actualizar estadísticas
function updateStats() {
  console.log("Updating stats:", currentProperties.length, featuredPropertiesCount);
  totalProperties.textContent = `${currentProperties.length} ${currentProperties.length === 1 ? 'propiedad' : 'propiedades'}`;
  featuredCount.textContent = `${featuredPropertiesCount} destacada${featuredPropertiesCount !== 1 ? 's' : ''}`;
}

// Aplicar filtros
function applyFilters() {
  console.log("Applying filters...");
  let filtered = [...currentProperties];
  const searchTerm = searchInput.value.toLowerCase();
  
  if (searchTerm) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchTerm) || 
      p.location.toLowerCase().includes(searchTerm) ||
      (p.description && p.description.toLowerCase().includes(searchTerm)) ||
      (p.owner && p.owner.toLowerCase().includes(searchTerm))
    );
  }
  
  if (filterOperation.value) {
    filtered = filtered.filter(p => p.operation === filterOperation.value);
  }
  
  if (filterType.value) {
    filtered = filtered.filter(p => p.type === filterType.value);
  }
  
  if (filterFeatured.classList.contains('active')) {
    filtered = filtered.filter(p => p.featured);
  }
  
  renderProperties(filtered);
}

// Alternar filtro de destacados
function toggleFeaturedFilter() {
  console.log("Toggling featured filter...");
  filterFeatured.classList.toggle('active');
  applyFilters();
}

// Resetear filtros
function resetFilters() {
  console.log("Resetting filters...");
  searchInput.value = '';
  filterOperation.value = '';
  filterType.value = '';
  filterFeatured.classList.remove('active');
  applyFilters();
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
  e.preventDefault();
  console.log("Submitting form...");
  
  submitBtnText.style.display = 'none';
  submitLoading.style.display = 'inline-block';
  form.querySelector('button[type="submit"]').disabled = true;
  
  const data = {
    title: form.title.value,
    location: form.location.value,
    type: form.type.value,
    operation: form.operation.value,
    price: Number(form.price.value),
    currency: form.currency.value,
    description: form.description.value,
    detailedDescription: form.detailedDescription.value,
    squareMeters: Number(form.squareMeters.value),
    bedrooms: Number(form.bedrooms.value),
    bathrooms: Number(form.bathrooms.value),
    owner: form.owner.value,
    phone: form.phone.value,
    featured: form.featured.checked,
    slug: form.title.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    images: form.images.value 
      ? form.images.value.split(/[\n,]+/).map(url => url.trim()).filter(url => url)
      : [],
    amenities: form.amenities.value 
      ? form.amenities.value.split(',').map(item => item.trim()).filter(item => item)
      : [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  try {
    if (editandoId) {
      console.log("Updating property:", editandoId);
      await updateDoc(doc(db, "propiedades", editandoId), data);
      showConfirmation("Propiedad actualizada con éxito.");
    } else {
      console.log("Adding new property...");
      await addDoc(propiedadesRef, data);
      showConfirmation("Propiedad agregada con éxito.");
    }
    
    cargarPropiedades();
  } catch (error) {
    console.error("Error saving property:", error);
    showError("Error al guardar la propiedad: " + error.message);
  } finally {
    submitBtnText.style.display = 'inline-block';
    submitLoading.style.display = 'none';
    form.querySelector('button[type="submit"]').disabled = false;
  }
}

// Editar propiedad
function editarPropiedad(id, p) {
  console.log("Preparing to edit property:", id);
  try {
    editandoId = id;
    modalTitle.textContent = 'Editar propiedad';
    submitBtnText.textContent = 'Actualizar Propiedad';
    
    const fieldMap = {
      title: form.title,
      location: form.location,
      type: form.type,
      operation: form.operation,
      price: form.price,
      currency: form.currency,
      description: form.description,
      detailedDescription: form.detailedDescription,
      squareMeters: form.squareMeters,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      owner: form.owner,
      phone: form.phone,
      featured: form.featured,
      images: form.images,
      amenities: form.amenities
    };

    for (const [key, field] of Object.entries(fieldMap)) {
      if (p.hasOwnProperty(key)) {
        if (key === 'images' && Array.isArray(p[key])) {
          field.value = p[key].join('\n');
        } else if (key === 'amenities' && Array.isArray(p[key])) {
          field.value = p[key].join(', ');
        } else if (field.type === 'checkbox') {
          field.checked = p[key];
        } else {
          field.value = p[key];
        }
      }
    }
    
    updateCharacterCount();
    updateCurrencySymbol();
    openModal();
  } catch (error) {
    console.error("Error preparing edit:", error);
    showError("Error al preparar la edición: " + error.message);
  }
}

// Mostrar confirmación de eliminación
function mostrarConfirmacionEliminacion(id) {
  console.log("Showing delete confirmation for:", id);
  document.getElementById('delete-modal').style.display = 'flex';
  
  const cancelBtn = document.getElementById('delete-cancel-btn');
  const confirmBtn = document.getElementById('delete-confirm-btn');
  
  const closeDeleteModal = () => {
    document.getElementById('delete-modal').style.display = 'none';
  };
  
  cancelBtn.onclick = closeDeleteModal;
  
  confirmBtn.onclick = async () => {
    console.log("Deleting property:", id);
    try {
      await deleteDoc(doc(db, "propiedades", id));
      closeDeleteModal();
      showConfirmation("Propiedad eliminada con éxito.");
      cargarPropiedades();
    } catch (error) {
      console.error("Error deleting property:", error);
      showError("Error al eliminar la propiedad: " + error.message);
      closeDeleteModal();
    }
  };
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded, initializing...");
  init();
});