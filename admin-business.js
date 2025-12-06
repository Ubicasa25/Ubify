import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const businessForm = document.getElementById('businessForm');
const adminTableBody = document.getElementById('adminTableBody');
const loadingText = document.getElementById('loadingText');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

let editId = null;

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
    
    // Obtener etiquetas
    const etiquetas = Array.from(document.querySelectorAll('input[name="etiquetas"]:checked')).map(cb => cb.value);

    const businessData = {
        nombre: document.getElementById('nombre').value,
        categoria: document.getElementById('categoria').value,
        telefono: document.getElementById('telefono').value,
        ubicacion: document.getElementById('ubicacion').value,
        mapUrl: document.getElementById('mapUrl').value,
        instagram: document.getElementById('instagram').value,
        web: document.getElementById('web').value,
        imagen: document.getElementById('imagen').value,
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
            businessForm.reset();
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
            document.getElementById('categoria').value = data.categoria || 'Gastronomía';
            document.getElementById('telefono').value = data.telefono || '';
            document.getElementById('ubicacion').value = data.ubicacion || '';
            document.getElementById('mapUrl').value = data.mapUrl || '';
            document.getElementById('instagram').value = data.instagram || '';
            document.getElementById('web').value = data.web || '';
            document.getElementById('imagen').value = data.imagen || '';
            document.getElementById('descripcion').value = data.descripcion || '';

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

document.addEventListener('DOMContentLoaded', loadAdminTable);