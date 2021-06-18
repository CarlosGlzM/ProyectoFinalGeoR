const listaloggedout = document.querySelectorAll('.logged-out');
const listaloggedin = document.querySelectorAll('.logged-in');
const datosdelacuenta = document.querySelector('.datosdelacuenta');

const configuraMenu = (user) => {
    if(user){
       

       db.collection('usuarios').doc(user.uid).get().then( doc =>{
           const html = `
               <p>Nombre: ${ doc.data().nombre }</p>
               <p>Correo: ${ user.email}</p>
               <p>Teléfono: ${ doc.data().telefono }</p>
               <p>Dirección: ${ doc.data().direccion }</p>
               <p>Actual</p>
               <p>Coordenadas: ${ doc.data().coordenadas.latitude } , ${ doc.data().coordenadas.longitude }</p>
           `;
           datosdelacuenta.innerHTML = html;
       });

       listaloggedin.forEach( item => item.style.display = 'block');
       listaloggedout.forEach( item => item.style.display = 'none');
    }
    else
    {
       datosdelacuenta.innerHTML = '';
       listaloggedin.forEach( item => item.style.display = 'none');
       listaloggedout.forEach( item => item.style.display = 'block');
    }
}

const obtieneAmigos = (data) =>{

   var propiedades = { 
       center: { 
                   lat: 21.152639, lng: -101.711598 
               }, 
       zoom: 6,
       disableDefaultUI: true
   }

   var mapa =  document.getElementById("map")
   var map = new google.maps.Map(mapa, propiedades);

   fetch("data.json").then(function (response) {
    response.json().then(function (municipios) {
      var datos = document.getElementById("datos");

      var tabla = `
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Sucursal</th>
            <th scope="col">Estado</th>
            <th scope="col">Hora</th>
            <th scope="col">Destino</th>
            <th scope="col">Numero de Piezas</th>
          </tr>
        </thead>
        <tbody>
      `;

      var coordenadasVuelos = [];

      municipios.forEach((municipio) => {
        coordenadasVuelos.push(municipio.coordenadas);

        var municipioCirculo = new google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: map,
          center: municipio.coordenadas,
          radius:20000,
        });

        tabla += `
          <tr>
            <th scope="row">${municipio.nombre}</th>
            <td>${municipio.estado}</td>
            <td>${municipio.hora}</td>
            <td>${municipio.destino}</td>
            <td>${municipio.piezas}</td>
          </tr>
        `;
      });

      var vuelosTrazo = new google.maps.Polyline({
        path: coordenadasVuelos,
        geodesic: true,
        strokeColor: "#CCCCCC",
        strokeOpacity: 0.5,
        strokeColor: 1,
      });

      vuelosTrazo.setMap(map);

      tabla += `  
          </tbody>
          </table>`;

      datos.innerHTML = tabla;
    });
  });

   
   data.forEach( doc => {
       
       informacion = new google.maps.InfoWindow;

       var pos = { 
           lat: doc.data().coordenadas.latitude,
           lng: doc.data().coordenadas.longitude
       };

       informacion.setPosition(pos);
       informacion.setContent(doc.data().direccion);
       informacion.open(map);

   });



};