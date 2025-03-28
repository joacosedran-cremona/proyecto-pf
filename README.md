## Tecnologias usadas

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## Dependencias

```bash
npm install @heroui/react

heroui add --all

npm install chart.js

npm install chartjs-adapter-date-fns

npm install chartjs-plugin-zoom

npm install date-fns

```

## Iconos
https://react-icons.github.io/react-icons/

```js
import { FiMapPin } from 'react-icons/fi';                                //Mapa
import { CiMail } from 'react-icons/ci';                                  //Mail
import { CiBellOn } from 'react-icons/ci';                                //Campana
import { FaFacebook } from 'react-icons/fa';                              //Facebook
import { FaLinkedin } from 'react-icons/fa';                              //Linkedin
import { FaSearch } from 'react-icons/fa';                                //Lupa
import { FaWeightHanging } from 'react-icons/fa';                         //Peso
import { FaRegClock } from 'react-icons/fa';                              //Reloj
import { MdPrecisionManufacturing } from 'react-icons/md';                //Kuka
import { BiReceipt } from 'react-icons/bi';                               //Receta
import { PiChefHat } from 'react-icons/pi';                               //Receta 2
import { VscAccount } from 'react-icons/vsc';                             //User
import { GoDotFill } from 'react-icons/go';                               //Punto
import { AiOutlineExclamationCircle } from 'react-icons/ai';              //Circulo Exclamacion con circulo
import { HiOutlineSwitchVertical } from 'react-icons/hi';                 //Flechas Verticales Arriba y Abajo
```

## Licencia

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).

---------
## Traducciones
```bash
npm install i18next react-i18next
```

Como usar?
import { useTranslation } from 'react-i18next';
Colocar dentro de la funcion "const { t } = useTranslation('NombreDelArchivo');" y en donde hay un texto colocaremos {t("objeto.atributo")}.


## WebSocket
```tsx
// Usando el endpoint por defecto
const { data } = useWebSocketContext();

// Usando un endpoint específico
const { data } = useWebSocketContext("mi-endpoint-especifico");

// Usando endpoints dinámicos
const endpoint = `${miVariable}-datos`;
const { data } = useWebSocketContext(endpoint);
```

---------
## Json Generator

# Alarmas
```json
[
  '{{repeat(200)}}',
  {
    key: '{{index(1)}}',
    description: '{{random("Fallo en conexión de red","Presión baja en tuberías","Fallo en el sistema de refrigeración","Ciclo Finalizado","Ciclo Iniciado")}}',
    type: '{{random("Seguridad","Sistema","Falla")}}',
    state: '{{random("Activo","Inactivo","Critico")}}',
    time: '{{date(new Date(2025, 1, 1, 0, 0, 0), new Date(2025, 1, 28, 23, 59, 59), "YYYY-MM-DD HH:mm:ss")}}'
  }
]
```

# Home
```json
{
  "lineas": [
    {
      "id": 1,
      "equipos": [
        {
          "nombre": "C1L1",
          "estado": "{{random('INACTIVO', 'COCINANDO', 'PAUSA')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "C2L1",
          "estado": "{{random('INACTIVO', 'COCINANDO', 'PAUSA')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "C3L1",
          "estado": "{{random('INACTIVO', 'COCINANDO', 'PAUSA')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "E1L1",
          "estado": "{{random('FALLA', 'ENFRIANDO', 'FINALIZADO')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "E2L1",
          "estado": "{{random('FALLA', 'ENFRIANDO', 'FINALIZADO')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "E3L1",
          "estado": "{{random('FALLA', 'ENFRIANDO', 'FINALIZADO')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0, 
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "E4L1",
          "estado": "{{random('FALLA', 'ENFRIANDO', 'FINALIZADO')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        }
      ]
    },
    {
      "id": 2,
      "equipos": [
        {
          "nombre": "C1L2",
          "estado": "{{random('INACTIVO', 'COCINANDO', 'PAUSA')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "C2L2",
          "estado": "{{random('INACTIVO', 'COCINANDO', 'PAUSA')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "C3L2",
          "estado": "{{random('INACTIVO', 'COCINANDO', 'PAUSA')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "E1L2",
          "estado": "{{random('FALLA', 'ENFRIANDO', 'FINALIZADO')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "E2L2",
          "estado": "{{random('FALLA', 'ENFRIANDO', 'FINALIZADO')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "E3L2",
          "estado": "{{random('FALLA', 'ENFRIANDO', 'FINALIZADO')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        },
        {
          "nombre": "E4L2",
          "estado": "{{random('FALLA', 'ENFRIANDO', 'FINALIZADO')}}",
          "tempAguaActual": 0,
          "tempProductoActual": 0,
          "receta": "{{random('Pate', 'STRING')}}",
          "tiempoTranscurrido": "{{integer(0,2)}}:{{integer(0,59)}}"
        }
      ]
    }
  ]
}
```

# Cocinas
```json
[
  '{{repeat(6)}}',
  {
    num_cocina: '{{index(1)}}',
    num_receta: '{{integer(1, 5)}}',
    nom_receta: '{{random("Pate", "Arroz con Pollo", "Pollo Asado")}}',
    estado: '{{random("INACTIVO", "COCINANDO", "PAUSA", "FINALIZADO", "FALLA")}}',
    cant_torres: '{{integer(1, 3)}}',
	tipo_Fin: '{{random("100°C", "90°C", "60 min", "120 min")}}',
    pasos: [
      '{{repeat(20, 50)}}',
      {
        id: '{{index() + 1}}',
        tiempo: '{{5 * index()}}',
        temp_Agua: '{{integer(90, 95)}}',
        temp_Prod: function() {
          var x = this.tiempo;
          var a = 20;
          var b = Math.log(5) / 180;
          return parseFloat((a * Math.exp(b * x)).toFixed(2));
        },
        temp_Ing: '{{integer(85, 90)}}',
        niv_Agua: '{{integer(1700, 1900)}}'
      }
    ],
    sector_io: [
      {
        filtro_succion_agua: '{{bool()}}',
        entrada_agua: '{{bool()}}',
        bomba_recirculacion: '{{bool()}}',
        vapor_serpentina: '{{bool()}}',
        vapor_vivo: '{{bool()}}'
      }
    ]
  }
]
```

# Enfriadores
```json
[
  '{{repeat(8)}}',
  {
    num_enfriador: '{{index(1)}}',
    num_receta: '{{integer(1, 5)}}',
    nom_receta: '{{random("Pate", "Arroz con Pollo", "Pollo Asado")}}',
    estado: '{{random("INACTIVO", "ENFRIANDO", "PAUSA", "FINALIZADO", "FALLA")}}',
    cant_torres: '{{integer(1, 3)}}',
    tipo_Fin: '0°C',
    pasos: [
      '{{repeat(20, 50)}}',
      {
        id: '{{index() + 1}}',
        tiempo: '{{5 * index()}}',
        temp_Agua: '{{integer(0, 5)}}',
        temp_Prod: function() {
          var x = this.tiempo;
          var a = 100;
          var b = Math.log(100) / 180;
          return parseFloat((a * Math.exp(-b * x)).toFixed(2));
        },
        temp_Ing: '{{integer(5, 10)}}',
        niv_Agua: '{{integer(1700, 1900)}}'
      }
    ],
    sector_io: [
      {
        filtro_succion_agua: '{{bool()}}',
        entrada_agua: '{{bool()}}',
        bomba_recirculacion: '{{bool()}}',
        valvula_amoniaco: '{{bool()}}'
      }
    ]
  }
]
```
[
  '{{repeat(8)}}',
  {
    num_enfriador: '{{index(1)}}',
    num_receta: '{{integer(1, 5)}}',
    nom_receta: '{{random("Pate", "Paleta", "Panceta")}}',
    estado: '{{random("INACTIVO", "ENFRIANDO", "PAUSA", "FINALIZADO", "FALLA")}}',
    cant_torres: '{{integer(1, 3)}}', tipo_Fin: '0°C',
    pasos: [
      '{{repeat(20, 50)}}',
      {
        id: '{{index() + 1}}',
        tiempo: '{{5 * index()}}',
        temp_Agua: '{{integer(0, 5)}}',
        temp_Prod: function() {
          var x = this.tiempo;
          var a = 100;
          var b = Math.log(100) / 180; return parseFloat((a * Math.exp(-b * x)).toFixed(2));
        },
        temp_Ing: '{{integer(5, 10)}}',
        niv_Agua: '{{integer(1700, 1900)}}'
      }
    ],
    sector_io: [
      { filtro_succion_agua: '{{bool()}}',
        entrada_agua: '{{bool()}}',
        bomba_recirculacion: '{{bool()}}',
        valvula_amoniaco: '{{bool()}}'
      }
    ]
  }
] 