
export default function Home() {
    return (
    <section className="flex flex-col w-full justify-center gap-20">
        <h1
        className="flex justify-start w-full text-2xl"
        >
        ENFRIADORES
        </h1>

        <div
            className="w-100 flex flex-row gap-20"
            //Engloba Estado Equipo, Receta, Ciclo Activo, Temperaturas y Sector IO
        >
            <div
                className="w-1/2 flex flex-col gap-20"
                //Engloba Estado Equipo, Receta, Ciclo Activo y Sector IO
            >
                <div
                    className="w-100 flex flex-row gap-20"
                    //Engloba Estado Equipo, Receta y Ciclo Activo
                >
                    <div
                        className="bg-black p-20 w-1/2"
                        //Engloba Estado Equipo
                    >
                        Estado
                    </div>
                    <div
                        className="grid w-1/2 gap-20"
                        //Engloba Receta y Ciclo Activo
                    >
                        
                        <div
                            className="bg-bluet p-20"
                            //Receta
                        >
                            Receta
                        </div>

                        <div
                            className="bg-black p-20"
                            //Ciclo Activo
                        >
                            Ciclo Activo
                        </div>

                    </div>
                </div>

                <div
                    className="bg-black p-20"
                >
                    Sector IO
                </div>

            </div>

            <div
                className="bg-black p-20 w-1/2"
                //Temperaturas
            >
                Grafico
            </div>
        </div>
    </section>
    );
}
