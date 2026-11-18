/**
 * Datos públicos del sitio.
 *
 * Para publicar un proyecto, agrega un objeto al arreglo `projects`.
 * image o images muestran fotos. video muestra un timelapse en la ficha.
 * poster es la imagen de portada cuando hay video.
 */
window.ARTJOBS = {
  email: "",
  projects: [
    {
      title: "Mochila",
      category: "Prop",
      year: "2026",
      summary: "Prop en wireframe, con vista frontal y posterior.",
      detail:
        "Modelado de una mochila: asa superior, compartimento frontal, bolsillos laterales y correas.",
      services: ["Modelado"],
      images: [
        "assets/projects/mochila-frente.png",
        "assets/projects/mochila-espalda.png",
      ],
    },
    {
      title: "Buzo",
      category: "Personaje",
      year: "2026",
      summary: "Turnaround en wireframe de un personaje con escafandra.",
      detail:
        "Cuatro vistas del modelo: casco, snorkel, cuerpo estilizado y aletas.",
      services: ["Modelado"],
      images: ["assets/projects/buzo-turnaround.png"],
    },
    {
      title: "Valle",
      category: "Entorno",
      year: "2026",
      summary: "Terreno de cañón visto desde el viewport de Unreal Engine.",
      detail:
        "Captura de trabajo del entorno: formaciones rocosas, agua y vegetación baja.",
      services: ["Modelado"],
      engine: "Unreal Engine",
      images: ["assets/projects/valle-viewport.png"],
    },
    {
      title: "Rig de personaje",
      category: "Rigging",
      year: "2026",
      summary: "Timelapse del armado de un esqueleto en Blender.",
      detail:
        "Recorrido del rig sobre un personaje estilizado: columna, brazos, manos y pies.",
      services: ["Rigging"],
      engine: "Blender",
      video: "assets/projects/timelapse-rigging.mp4",
      poster: "assets/projects/rigging-poster.jpg",
    },
  ],
};
