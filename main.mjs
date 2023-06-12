function calcularSubredes(event) {

    const elevaciones = [
        { "elevacion": 0, "resultado": 1 },
        { "elevacion": 1, "resultado": 2 },
        { "elevacion": 2, "resultado": 4 },
        { "elevacion": 3, "resultado": 8 },
        { "elevacion": 4, "resultado": 16 },
        { "elevacion": 5, "resultado": 32 },
        { "elevacion": 6, "resultado": 64 },
        { "elevacion": 7, "resultado": 128 },
        { "elevacion": 8, "resultado": 256 },
    ]

    const hosts = event.body
    const hostsOrdenados = hosts.slice();

    hostsOrdenados.sort((a, b) => {
        return b.hostNecesarios - a.hostNecesarios
    })


    let ultimaDisponible = 0
    let octeto1 = 255
    let octeto2 = 255
    let octeto3 = 255
    let octeto4 = 0

    for (let item = 0; item < hostsOrdenados.length; item++) {

        if (hostsOrdenados[item].hostNecesarios >= 1) {
               
                let elevacion = 0
                let resultado = 0
    
                for (let j = 0; j < elevaciones.length; j++) {

                    if (((2 ** elevaciones[j].elevacion) - 2) >= hostsOrdenados[item].hostNecesarios) {

                        elevacion = elevaciones[j].elevacion
                        resultado = elevaciones[j].resultado

                        let valorInicialBinario = ultimaDisponible === 0 ? ultimaDisponible.toString(2) : (ultimaDisponible + 1).toString(2)
                        let valorFinalBinario = (ultimaDisponible + resultado - 1).toString(2)

                        let valorInicialBinarioCompleto = valorInicialBinario.padStart(elevacion, "0")
                        let valorFinalBinarioCompleto = valorFinalBinario.padStart(elevacion, "0")

                        let valorInicialDecimal = parseInt(valorInicialBinarioCompleto, 2)
                        let valorFinalDecimal = parseInt(valorFinalBinarioCompleto, 2)
                        
                        octeto4 = 256 - resultado

                        hostsOrdenados[item].rango = `${valorInicialDecimal} - ${valorFinalDecimal}`
                        hostsOrdenados[item].mascara = `${octeto1}.${octeto2}.${octeto3}.${octeto4}`
                        hostsOrdenados[item].cidr = 32 - elevacion
                        hostsOrdenados[item].ultimaUtilizable = valorFinalDecimal - 1
                        hostsOrdenados[item].primeraDisponible = valorInicialDecimal + 1

                        ultimaDisponible = valorFinalDecimal
                        
                        break
                    }
                }    
        }


    }
    


    return hostsOrdenados
}



const eventTest = {
    "httpMethod": "POST",
    "body": [
        {"identificador": "A", "hostNecesarios": 12},
        {"identificador": "B", "hostNecesarios": 6},
        {"identificador": "C", "hostNecesarios": 63},
        {"identificador": "D", "hostNecesarios": 16},
        {"identificador": "E", "hostNecesarios": 8},
        {"identificador": "F", "hostNecesarios": 2},
    ]
}


console.log(calcularSubredes(eventTest))