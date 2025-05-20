document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = '9e4ef8af08a43f31634ad2df990f320f'; // Reemplaza con tu API KEY de ScraperAPI

  const botonesFiltro = document.querySelectorAll('.filtro-btn');
  const tbody = document.getElementById('propiedades');

  let propiedadesData = [];

  function renderTabla(datos) {
    tbody.innerHTML = '';
    datos.forEach(prop => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td><img src="${prop.imagen}" alt="foto" class="img-fluid" style="max-width: 150px;"></td>
        <td>${prop.titulo}</td>
        <td>${prop.precioTexto}</td>
        <td>${prop.caracteristicas}</td>
      `;
      tbody.appendChild(fila);
    });
  }

  function cargarDatos(url) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center">Cargando...</td></tr>';
    propiedadesData = [];

    const fullUrl = `https://api.scraperapi.com?api_key=${API_KEY}&url=${encodeURIComponent(url)}`;

    fetch(fullUrl)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const propiedades = doc.querySelectorAll('.item');

        propiedades.forEach(prop => {
          const titulo = prop.querySelector('.item-link')?.textContent.trim() || 'Sin título';
          const precioTexto = prop.querySelector('.item-price')?.textContent.trim() || '0';
          const imagen = prop.querySelector('img')?.getAttribute('src') || '';
          const caracteristicas = Array.from(prop.querySelectorAll('.item-detail')).map(el => el.textContent.trim()).join(', ') || 'Sin características';

          propiedadesData.push({ titulo, precioTexto, imagen, caracteristicas });
        });

        if (propiedadesData.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" class="text-center">No se encontraron propiedades.</td></tr>';
        } else {
          renderTabla(propiedadesData);
        }
      })
      .catch(error => {
        console.error('Error al hacer scraping:', error);
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar los datos.</td></tr>';
      });
  }

  // Evento para botones filtro
  botonesFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
      // Cambiar estilos para botón activo
      botonesFiltro.forEach(b => b.classList.remove('btn-primary'));
      botonesFiltro.forEach(b => b.classList.add('btn-outline-primary'));
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-primary');

      const url = btn.getAttribute('data-url');
      cargarDatos(url);
    });
  });

  // Cargar datos con filtro "Baratos" por defecto
  botonesFiltro[0].click();
});
