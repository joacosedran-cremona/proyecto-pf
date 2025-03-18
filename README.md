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
## Json Generator

# Alarmas
```json
[
  '{{repeat(200)}}',
  {
    'key': '{{index(1)}}',
    'description': '{{random('Fallo en conexión de red','Presión baja en tuberías','Fallo en el sistema de refrigeración','Ciclo Finalizado','Ciclo Iniciado')}}',
    'type': '{{random('Seguridad','Sistema','Falla')}}',
    'state': '{{random('Activo','Inactivo','Critico')}}',
    'time': '{{date(new Date(2025, 1, 1, 0, 0, 0), new Date(2025, 1, 28, 23, 59, 59), 'YYYY-MM-DD HH:mm:ss')}}'
  }
]
```

# Cocinas
```json
[
  '{{repeat(8)}}',
  {
    num_cocina: '{{index(1)}}',
    num_receta: '{{integer(1, 5)}}',
    nom_receta: '{{random('Pate', 'Arroz con Pollo', 'Pollo Asado')}}',
    estado: '{{random('INACTIVO', 'COCINANDO', 'PAUSA', 'FINALIZADO', 'FALLA')}}',
    cant_torres: '{{integer(1, 3)}}',
    pasos: [
      '{{repeat(20, 50)}}',
      {
        id: '{{index() + 1}}',
        temp_Agua: '{{integer(25, 100)}}',
        temp_Prod: '{{integer(20, 90)}}',
        temp_Ing: '{{integer(20,30)}}',
        niv_Agua: '{{integer(1700,1900)}}',
        tiempo: '{{5 * index()}}',
        tipo_Fin: '50°C'
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
    nom_receta: '{{random('Pate', 'Arroz con Pollo', 'Pollo Asado')}}',
    estado: '{{random('INACTIVO', 'COCINANDO', 'PAUSA', 'FINALIZADO', 'FALLA')}}',
    cant_torres: '{{integer(1, 3)}}',
    pasos: [
      '{{repeat(20, 50)}}',
      {
        id: '{{index() + 1}}',
        temp_Agua: '{{integer(25, 100)}}',
        temp_Prod: '{{integer(20, 90)}}',
        temp_Ing: '{{integer(20,30)}}',
        niv_Agua: '{{integer(1700,1900)}}',
        tiempo: '{{5 * index()}}',
        tipo_Fin: '50°C'
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
