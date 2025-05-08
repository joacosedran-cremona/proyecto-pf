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



##Tabla
    2 consultas
        1. Por defecto (Websocket): Todos los registros de la fecha actual (hoy)

        2. Filtrado (Websocket/HTTP): Datos filtrados por fechas
            Date Range Picker, boton de aplicar y boton de limpiar
        
        Al limpiar la seleccion de fechas vuelve a la consulta 1.
    
    Cada cambio de estado es un elemento nuevo en la lista.


##Alarmas Recientes
    Scrolleable
    
    [
        {
            "id_alarma": 1,
            "descripcion": "Finalizó ciclo de desmoldeo",
            "tipo": "Notificación",
            "fecha_registro": "2025-01-14T08:15:30",
            "valor": true
        }
    ]
