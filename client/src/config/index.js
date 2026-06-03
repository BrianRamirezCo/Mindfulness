export const addProductFormElements = [
  {
    label: "Título",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Ingresá el título del libro",
  },
  {
    label: "Autor",
    name: "author",
    componentType: "input",
    type: "text",
    placeholder: "Ingresá el autor del libro",
  },
  {
    label: "Descripción",
    name: "description",
    componentType: "textarea",
    placeholder: "Ingresá la descripción del libro",
  },
  {
    label: "Categoría",
    name: "category",
    componentType: "select",
    options: [
      { id: "meditacion", label: "Meditación" },
      { id: "ansiedad", label: "Ansiedad" },
      { id: "habitos", label: "Hábitos" },
      { id: "espiritualidad", label: "Espiritualidad" },
      { id: "bienestar", label: "Bienestar" },
    ],
  },
  {
    label: "Formato",
    name: "type",
    componentType: "select",
    options: [
      { id: "fisico", label: "Libro físico" },
      { id: "ebook", label: "Ebook" },
    ],
  },
  {
    label: "Precio",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Ingresá el precio",
  },
  {
    label: "Precio de oferta",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Ingresá el precio de oferta (opcional)",
  },
  {
    label: "Stock total",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Ingresá el stock total",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Inicio",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Todos los libros",
    path: "/shop/listing",
  },
  {
    id: "meditacion",
    label: "Meditación",
    path: "/shop/listing",
  },
  {
    id: "ansiedad",
    label: "Ansiedad",
    path: "/shop/listing",
  },
  {
    id: "habitos",
    label: "Hábitos",
    path: "/shop/listing",
  },
  {
    id: "espiritualidad",
    label: "Espiritualidad",
    path: "/shop/listing",
  },
  {
    id: "bienestar",
    label: "Bienestar",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Buscar",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  meditacion: "Meditación",
  ansiedad: "Ansiedad",
  habitos: "Hábitos",
  espiritualidad: "Espiritualidad",
  bienestar: "Bienestar",
};

export const brandOptionsMap = {
  fisico: "Libro físico",
  ebook: "Ebook",
};

export const filterOptions = {
  category: [
    { id: "meditacion", label: "Meditación" },
    { id: "ansiedad", label: "Ansiedad" },
    { id: "habitos", label: "Hábitos" },
    { id: "espiritualidad", label: "Espiritualidad" },
    { id: "bienestar", label: "Bienestar" },
  ],
  brand: [
    { id: "fisico", label: "Libro físico" },
    { id: "ebook", label: "Ebook" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Precio: menor a mayor" },
  { id: "price-hightolow", label: "Precio: mayor a menor" },
  { id: "title-atoz", label: "Título: A a Z" },
  { id: "title-ztoa", label: "Título: Z a A" },
];

export const addressFormControls = [
  {
    label: "Dirección",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Ingresá tu dirección",
  },
  {
    label: "Ciudad",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Ingresá tu ciudad",
  },
  {
    label: "Código postal",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Ingresá tu código postal",
  },
  {
    label: "Teléfono",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Ingresá tu número de teléfono",
  },
  {
    label: "Notas",
    name: "notes",
    componentType: "textarea",
    placeholder: "Ingresá notas adicionales (opcional)",
  },
];
