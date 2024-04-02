import axios from "axios"
import { ref, computed } from "vue"

export default function useClima() {
    const clima = ref({})
    const cargando = ref(false)
    const error = ref('')

    const ObtenerClima = async ({ ciudad, pais }) => {
        clima.value = {}
        cargando.value = true
        error.value = ''
        // Importar Api key
        const key = import.meta.env.VITE_API_KEY
        try {
            // Obtener la lat y lang
            
            const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=1&appid=${key}`
            const { data } = await axios(url)
            const { lat, lon } = data[0]

            // Obtener clima
            const urlClima = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
            const {data: resultado} = await axios(urlClima)
            clima.value = resultado
        } catch (e) {
            error.value = 'Ciudad no encontrada'
        } finally {
            cargando.value = false
        }
    }

    const mostrarClima = computed(() => {
        return Object.values(clima.value).length > 0
    })

    const formatearTemperatura = temperatura => parseInt(temperatura - 273.15)

    return {
        ObtenerClima,
        mostrarClima,
        formatearTemperatura,
        clima,
        cargando,
        error
    }
}