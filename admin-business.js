import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc, setDoc, arrayUnion, arrayRemove, query, where, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// API ImgBB
const API_KEY = "b2fea72412df6a82adf27032257cf86b";

// Elementos Globales
const businessForm = document.getElementById('businessForm');
const adminTableBody = document.getElementById('adminTableBody');
const loadingText = document.getElementById('loadingText');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Elementos Imagen
const imagenFileInput = document.getElementById('imagenFile');
const imagenUrlInput = document.getElementById('imagenUrl');
const uploadLoader = document.getElementById('uploadLoader');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const previewImg = document.getElementById('previewImg');
const btnUploadText = document.getElementById('btnUploadText');

// Elementos Configuración
const categoriaSelect = document.getElementById('categoria');
const tagsContainer = document.getElementById('tagsContainer');
const configModal = document.getElementById('configModal');
const openConfigBtn = document.getElementById('openConfigBtn');
const closeConfigBtn = document.getElementById('closeConfigBtn');

// Listas Configuración
const catList = document.getElementById('catList');
const tagList = document.getElementById('tagList');
const newCatInput = document.getElementById('newCatInput');
const newTagInput = document.getElementById('newTagInput');
const addCatBtn = document.getElementById('addCatBtn');
const addTagBtn = document.getElementById('addTagBtn');

let editId = null;

// --- 1. LÓGICA DE CONFIGURACIÓN (Categorías y Tags Dinámicos) ---

const DEFAULT_CATS = ['Gastronomía', 'Indumentaria', 'Accesorios', 'Belleza', 'Hogar', 'Servicios', 'Tecnología'];
const DEFAULT_TAGS = ['Delivery', 'Tarjetas', 'WiFi', 'Pet Friendly', 'Aire Acond.'];

async function loadConfiguration() {
    try {
        const configRef = doc(db, "configuracion", "general");
        const docSnap = await getDoc(configRef);

        let cats = [];
        let tags = [];

        if (docSnap.exists()) {
            const data = docSnap.data();
            cats = data.categorias || DEFAULT_CATS;
            tags = data.tags || DEFAULT_TAGS;
        } else {
            await setDoc(configRef, { categorias: DEFAULT_CATS, tags: DEFAULT_TAGS });
            cats = DEFAULT_CATS;
            tags = DEFAULT_TAGS;
        }

        renderFormOptions(cats, tags);
        renderConfigModalLists(cats, tags);

    } catch (error) {
        console.error("Error cargando configuración:", error);
    }
}

function renderFormOptions(cats, tags) {
    const currentVal = categoriaSelect.value;
    categoriaSelect.innerHTML = '<option value="">Seleccionar Categoría</option>';
    cats.sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoriaSelect.appendChild(option);
    });
    if(currentVal) categoriaSelect.value = currentVal;

    tagsContainer.innerHTML = '';
    tags.forEach(tag => {
        const label = document.createElement('label');
        label.className = "inline-flex items-center space-x-2 cursor-pointer bg-white px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 select-none";
        label.innerHTML = `
            <input type="checkbox" name="etiquetas" value="${tag}" class="form-checkbox text-blue-600 h-4 w-4 rounded">
            <span class="text-sm">${tag}</span>
        `;
        tagsContainer.appendChild(label);
    });
}

function renderConfigModalLists(cats, tags) {
    catList.innerHTML = '';
    cats.sort().forEach(cat => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm text-sm border border-gray-100";
        li.innerHTML = `
            <span class="font-medium text-gray-700">${cat}</span> 
            <div class="flex gap-2">
                <button onclick="window.editConfigItem('categorias', '${cat}')" class="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded" title="Editar">✏️</button>
                <button onclick="window.removeConfigItem('categorias', '${cat}')" class="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded font-bold" title="Eliminar">✕</button>
            </div>
        `;
        catList.appendChild(li);
    });

    tagList.innerHTML = '';
    tags.forEach(tag => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm text-sm border border-gray-100";
        li.innerHTML = `
            <span class="font-medium text-gray-700">${tag}</span> 
            <div class="flex gap-2">
                <button onclick="window.editConfigItem('tags', '${tag}')" class="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded" title="Editar">✏️</button>
                <button onclick="window.removeConfigItem('tags', '${tag}')" class="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded font-bold" title="Eliminar">✕</button>
            </div>
        `;
        tagList.appendChild(li);
    });
}

async function addConfigItem(field, value) {
    if(!value.trim()) return;
    try {
        const configRef = doc(db, "configuracion", "general");
        await updateDoc(configRef, { [field]: arrayUnion(value.trim()) });
        loadConfiguration(); 
    } catch(e) { console.error(e); alert("Error al agregar"); }
}

window.removeConfigItem = async function(field, value) {
    if(!confirm(`¿Eliminar "${value}"?`)) return;
    try {
        const configRef = doc(db, "configuracion", "general");
        await updateDoc(configRef, { [field]: arrayRemove(value) });
        loadConfiguration();
    } catch(e) { console.error(e); alert("Error al eliminar"); }
}

window.editConfigItem = async function(field, oldValue) {
    const newValue = prompt(`Editar nombre de ${field === 'categorias' ? 'categoría' : 'etiqueta'}:`, oldValue);
    
    if (!newValue || newValue.trim() === "" || newValue === oldValue) return;

    const trimmedNew = newValue.trim();

    try {
        const configRef = doc(db, "configuracion", "general");
        const docSnap = await getDoc(configRef);
        
        if (!docSnap.exists()) return;

        const data = docSnap.data();
        let list = data[field] || [];
        
        if (list.includes(trimmedNew)) {
            alert("¡Ese nombre ya existe!");
            return;
        }

        const index = list.indexOf(oldValue);
        if (index !== -1) {
            list[index] = trimmedNew;
            
            await updateDoc(configRef, { [field]: list });
            
            if (field === 'categorias') {
                const q = query(collection(db, "emprendimientos"), where("categoria", "==", oldValue));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const batch = writeBatch(db);
                    querySnapshot.forEach((doc) => {
                        batch.update(doc.ref, { categoria: trimmedNew });
                    });
                    await batch.commit();
                }
            }

            alert("✅ Editado correctamente");
            loadConfiguration();
            if (field === 'categorias') loadAdminTable(); 
        }

    } catch (e) {
        console.error(e);
        alert("Error al editar: " + e.message);
    }
}

openConfigBtn.addEventListener('click', () => configModal.classList.remove('hidden', 'flex'));
openConfigBtn.addEventListener('click', () => configModal.classList.add('flex'));
closeConfigBtn.addEventListener('click', () => configModal.classList.add('hidden'));

addCatBtn.addEventListener('click', () => { addConfigItem('categorias', newCatInput.value); newCatInput.value = ''; });
addTagBtn.addEventListener('click', () => { addConfigItem('tags', newTagInput.value); newTagInput.value = ''; });


// --- 2. LÓGICA DE IMAGEN (SUBIDA Y URL) ---

// a) Si el usuario escribe una URL manualmente
imagenUrlInput.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
        previewImg.src = url;
        imagePreviewContainer.classList.remove('hidden');
        btnUploadText.textContent = "Elegir otro archivo";
    } else {
        imagePreviewContainer.classList.add('hidden');
    }
});

// b) Función subir a ImgBB
async function subirImagen(archivo) {
    const formData = new FormData();
    formData.append("image", archivo);
    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, { method: "POST", body: formData });
        const data = await res.json();
        if (!data.success) throw new Error("Error al subir imagen a ImgBB");
        return data.data.url;
    } catch (error) {
        console.error("Error upload:", error);
        throw error;
    }
}

// c) Listener para input tipo File
imagenFileInput.addEventListener("change", async (e) => {
    const archivos = Array.from(e.target.files);
    if (!archivos.length) return;

    uploadLoader.classList.remove("hidden");
    imagePreviewContainer.classList.add("hidden");
    btnUploadText.textContent = "Subiendo...";
    submitBtn.disabled = true; 

    try {
        const url = await subirImagen(archivos[0]);
        // Ponemos la URL generada en el campo de texto visible
        imagenUrlInput.value = url; 
        previewImg.src = url;
        imagePreviewContainer.classList.remove("hidden");
        btnUploadText.textContent = "¡Subida! (Cambiar)";
    } catch (err) {
        alert("Error al subir la imagen. Intenta de nuevo.");
        btnUploadText.textContent = "Error. Reintentar";
    } finally {
        uploadLoader.classList.add("hidden");
        submitBtn.disabled = false;
    }
});


// --- 3. LÓGICA CRUD PRINCIPAL ---
async function loadAdminTable() {
    adminTableBody.innerHTML = '';
    loadingText.style.display = 'block';

    try {
        const querySnapshot = await getDocs(collection(db, "emprendimientos"));
        
        if (querySnapshot.empty) {
            loadingText.innerText = "No hay emprendimientos cargados.";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 border-b";
            
            row.innerHTML = `
                <td class="px-4 py-3">
                    <img src="${data.imagen || 'https://via.placeholder.com/50'}" class="w-12 h-12 rounded-lg object-cover border shadow-sm">
                </td>
                <td class="px-4 py-3">
                    <div class="font-medium text-gray-900">${data.nombre}</div>
                </td>
                <td class="px-4 py-3">
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200">${data.categoria}</span>
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                    <button class="edit-btn text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded text-xs font-bold transition border border-amber-200" data-id="${id}">
                        Editar
                    </button>
                    <button class="delete-btn text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-xs font-bold transition border border-red-200" data-id="${id}">
                        Eliminar
                    </button>
                </td>
            `;
            adminTableBody.appendChild(row);
        });

        loadingText.style.display = 'none';
        
        document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', handleDelete));
        document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', handleEdit));

    } catch (error) {
        console.error("Error cargando tabla:", error);
        loadingText.innerText = "Error de conexión.";
    }
}

businessForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const etiquetas = Array.from(document.querySelectorAll('input[name="etiquetas"]:checked')).map(cb => cb.value);
    const mostrarMapa = document.getElementById('mostrarMapa').checked;
    
    // Obtenemos la URL directamente del campo de texto
    const imagenUrl = imagenUrlInput.value.trim();

    if (!imagenUrl) {
        alert("Por favor sube una imagen o pega una URL válida.");
        return;
    }

    const businessData = {
        nombre: document.getElementById('nombre').value,
        categoria: document.getElementById('categoria').value,
        telefono: document.getElementById('telefono').value,
        ubicacion: document.getElementById('ubicacion').value,
        mapUrl: document.getElementById('mapUrl').value,
        mostrarMapa: mostrarMapa,
        instagram: document.getElementById('instagram').value,
        web: document.getElementById('web').value,
        imagen: imagenUrl,
        descripcion: document.getElementById('descripcion').value,
        tags: etiquetas,
        updatedAt: new Date()
    };

    if (!editId) {
        businessData.createdAt = new Date();
    }

    submitBtn.disabled = true;
    submitBtn.innerText = editId ? "Actualizando..." : "Guardando...";

    try {
        if (editId) {
            const docRef = doc(db, "emprendimientos", editId);
            await updateDoc(docRef, businessData);
            alert("✅ Emprendimiento actualizado correctamente");
            resetForm(); 
        } else {
            await addDoc(collection(db, "emprendimientos"), businessData);
            alert("✅ Emprendimiento creado con éxito");
            resetForm(); 
        }
        loadAdminTable();
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("❌ Error: " + error.message);
    } finally {
        submitBtn.disabled = false;
        if (!editId) submitBtn.innerText = "Guardar Emprendimiento";
    }
});

async function handleEdit(e) {
    const id = e.target.getAttribute('data-id');
    submitBtn.innerText = "Cargando datos...";
    submitBtn.disabled = true;

    try {
        const docRef = doc(db, "emprendimientos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            document.getElementById('nombre').value = data.nombre || '';
            
            const currentCat = data.categoria;
            let optionExists = false;
            for (let i = 0; i < categoriaSelect.options.length; i++) {
                if (categoriaSelect.options[i].value === currentCat) {
                    optionExists = true;
                    break;
                }
            }
            if (currentCat && !optionExists) {
                const opt = document.createElement('option');
                opt.value = currentCat;
                opt.text = currentCat + " (Archivado)";
                categoriaSelect.add(opt);
            }
            categoriaSelect.value = currentCat;

            document.getElementById('telefono').value = data.telefono || '';
            document.getElementById('ubicacion').value = data.ubicacion || '';
            document.getElementById('mapUrl').value = data.mapUrl || '';
            document.getElementById('instagram').value = data.instagram || '';
            document.getElementById('web').value = data.web || '';
            document.getElementById('descripcion').value = data.descripcion || '';
            document.getElementById('mostrarMapa').checked = (data.mostrarMapa !== false);

            if (data.imagen) {
                imagenUrlInput.value = data.imagen;
                previewImg.src = data.imagen;
                imagePreviewContainer.classList.remove('hidden');
                btnUploadText.textContent = "Cambiar logo";
            } else {
                imagenUrlInput.value = '';
                imagePreviewContainer.classList.add('hidden');
                btnUploadText.textContent = "Elegir archivo";
            }

            const checkboxes = document.querySelectorAll('input[name="etiquetas"]');
            checkboxes.forEach(cb => cb.checked = false);
            
            if (data.tags && Array.isArray(data.tags)) {
                data.tags.forEach(tag => {
                    const cb = document.querySelector(`input[name="etiquetas"][value="${tag}"]`);
                    if (cb) cb.checked = true;
                });
            }

            editId = id;
            submitBtn.innerText = "Actualizar Emprendimiento";
            submitBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            submitBtn.classList.add('bg-amber-600', 'hover:bg-amber-700'); 
            
            cancelEditBtn.classList.remove('hidden'); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert("El documento no existe.");
        }
    } catch (error) {
        console.error("Error obteniendo datos:", error);
        alert("Error al cargar los datos para editar.");
    } finally {
        submitBtn.disabled = false;
    }
}

cancelEditBtn.addEventListener('click', resetForm);

function resetForm() {
    editId = null;
    businessForm.reset();
    document.getElementById('mostrarMapa').checked = true;
    
    imagenUrlInput.value = '';
    imagePreviewContainer.classList.add('hidden');
    previewImg.src = '';
    btnUploadText.textContent = "Elegir archivo";
    imagenFileInput.value = ''; 

    submitBtn.innerText = "Guardar Emprendimiento";
    submitBtn.classList.remove('bg-amber-600', 'hover:bg-amber-700');
    submitBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
    cancelEditBtn.classList.add('hidden');
}

async function handleDelete(e) {
    const id = e.target.getAttribute('data-id');
    if (confirm("¿Estás seguro de eliminar este emprendimiento?")) {
        try {
            await deleteDoc(doc(db, "emprendimientos", id));
            e.target.closest('tr').remove();
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar.");
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadConfiguration(); 
    loadAdminTable();
});
